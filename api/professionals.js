import {
  driveRequest,
  escapeDriveQuery,
  getAccessToken,
  listFiles,
  validateGoogleDriveConfig,
} from '../lib/googleDrive.js';

const FOLDER_MIME = 'application/vnd.google-apps.folder';

function todayInSaoPaulo() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.day}-${values.month}-${values.year}`;
}

function json(data, status = 200, headers = {}) {
  return Response.json(data, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

function stageLogger(startedAt) {
  return (stage) => console.log(`[professionals +${Date.now() - startedAt}ms] ${stage}`);
}

export async function GET() {
  const startedAt = Date.now();
  const log = stageLogger(startedAt);

  try {
    log('request started');

    const config = validateGoogleDriveConfig();
    const missing = Object.entries(config)
      .filter(([, configured]) => !configured)
      .map(([name]) => name);

    if (missing.length) {
      return json({
        error: 'Configuração do Google Drive incompleta no Vercel.',
        missing,
      }, 500);
    }

    const galleryFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID.trim();
    const dailyListFolderId = process.env.GOOGLE_DRIVE_DAILYLIST_FOLDER_ID.trim();

    log('requesting Google OAuth token');
    const accessToken = await getAccessToken();
    log('Google OAuth token received');

    const date = todayInSaoPaulo();
    const dailyFileName = `lista-${date}.txt`;

    log(`searching DailyList/${dailyFileName}`);
    const dailyResult = await listFiles(
      accessToken,
      `'${escapeDriveQuery(dailyListFolderId)}' in parents and name = '${escapeDriveQuery(dailyFileName)}' and trashed = false`,
      'files(id,name,mimeType)'
    );

    const dailyFile = dailyResult.files?.[0];
    if (!dailyFile) {
      log('daily file not found');
      return json({
        error: `Arquivo ${dailyFileName} não encontrado na pasta DailyList.`,
        date,
        professionals: [],
      }, 404);
    }

    log(`reading ${dailyFileName}`);
    const textResponse = await driveRequest(
      `/files/${encodeURIComponent(dailyFile.id)}?alt=media`,
      accessToken
    );
    const text = await textResponse.text();
    const names = text
      .replace(/^\uFEFF/, '')
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean);

    log(`daily list contains ${names.length} name(s)`);

    // Fetch Gallery's immediate subfolders once, then match the daily names locally.
    // This avoids one extra Drive search per professional.
    log('listing Gallery professional folders');
    const galleryFoldersResult = await listFiles(
      accessToken,
      `'${escapeDriveQuery(galleryFolderId)}' in parents and mimeType = '${FOLDER_MIME}' and trashed = false`,
      'files(id,name)'
    );

    const foldersByName = new Map(
      (galleryFoldersResult.files || []).map((folder) => [folder.name, folder])
    );

    const professionals = await Promise.all(
      names.map(async (name) => {
        const folder = foldersByName.get(name);
        if (!folder) {
          console.warn(`[professionals] Gallery folder not found for: ${name}`);
          return { name, photos: [], folderFound: false };
        }

        const photoResult = await listFiles(
          accessToken,
          `'${escapeDriveQuery(folder.id)}' in parents and mimeType contains 'image/' and trashed = false`,
          'files(id,name,mimeType)'
        );

        return {
          name,
          folderFound: true,
          photos: (photoResult.files || []).map((photo) => ({
            id: photo.id,
            name: photo.name,
            url: `/api/drive-image?id=${encodeURIComponent(photo.id)}`,
          })),
        };
      })
    );

    log(`completed with ${professionals.length} professional(s)`);
    return json(
      { date, dailyFileName, professionals },
      200,
      {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        'CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      }
    );
  } catch (error) {
    console.error(`[professionals +${Date.now() - startedAt}ms] ERROR`, error);
    return json({
      error: error?.message || 'Erro ao carregar profissionais.',
      elapsedMs: Date.now() - startedAt,
    }, 500);
  }
}
