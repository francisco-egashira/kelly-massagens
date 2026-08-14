import { driveRequest, escapeDriveQuery, getAccessToken, listFiles } from './googleDrive.js';

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

export default async function handler(request) {
  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
  }

  try {
    const galleryFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;
    const dailyListFolderId = process.env.GOOGLE_DRIVE_DAILYLIST_FOLDER_ID;

    if (!galleryFolderId || !dailyListFolderId) {
      throw new Error('Os IDs das pastas Gallery e DailyList ainda não foram configurados no Vercel.');
    }

    const accessToken = await getAccessToken();
    const date = todayInSaoPaulo();
    const dailyFileName = `lista-${date}.txt`;

    const dailyResult = await listFiles(
      accessToken,
      `'${escapeDriveQuery(dailyListFolderId)}' in parents and name = '${escapeDriveQuery(dailyFileName)}' and trashed = false`,
      'files(id,name,mimeType)'
    );

    const dailyFile = dailyResult.files?.[0];
    if (!dailyFile) {
      return json({
        error: `Arquivo ${dailyFileName} não encontrado na pasta DailyList.`,
        date,
        professionals: [],
      }, 404);
    }

    const textResponse = await driveRequest(
      `/files/${encodeURIComponent(dailyFile.id)}?alt=media`,
      accessToken
    );
    const text = await textResponse.text();
    const names = text
      .split(/\r?\n/)
      .map((name) => name.trim())
      .filter(Boolean);

    const professionals = await Promise.all(
      names.map(async (name) => {
        const folderResult = await listFiles(
          accessToken,
          `'${escapeDriveQuery(galleryFolderId)}' in parents and name = '${escapeDriveQuery(name)}' and mimeType = '${FOLDER_MIME}' and trashed = false`,
          'files(id,name)'
        );

        const folder = folderResult.files?.[0];
        if (!folder) return { name, photos: [], folderFound: false };

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

    return json(
      { date, dailyFileName, professionals },
      200,
      { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' }
    );
  } catch (error) {
    console.error('professionals API error:', error);
    return json({ error: error?.message || 'Erro ao carregar profissionais.' }, 500);
  }
}
