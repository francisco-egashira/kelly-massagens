import { driveRequest, getAccessToken } from './googleDrive.js';

function text(message, status = 200, headers = {}) {
  return new Response(message, {
    status,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      ...headers,
    },
  });
}

export default async function handler(request) {
  if (request.method !== 'GET') {
    return text('Method not allowed', 405, { Allow: 'GET' });
  }

  const url = new URL(request.url);
  const fileId = url.searchParams.get('id') || '';
  if (!fileId) return text('Missing image id', 400);

  try {
    const accessToken = await getAccessToken();
    const galleryFolderId = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID;

    if (!galleryFolderId) {
      return text('Gallery folder is not configured', 500);
    }

    const metaResponse = await driveRequest(
      `/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType,parents&supportsAllDrives=true`,
      accessToken
    );
    const metadata = await metaResponse.json();

    if (!metadata.mimeType?.startsWith('image/')) {
      return text('Image not found', 404);
    }

    const parentId = metadata.parents?.[0];
    if (!parentId) return text('Image not found', 404);

    const parentResponse = await driveRequest(
      `/files/${encodeURIComponent(parentId)}?fields=id,parents&supportsAllDrives=true`,
      accessToken
    );
    const parent = await parentResponse.json();

    if (!parent.parents?.includes(galleryFolderId)) {
      return text('Image is outside Gallery', 403);
    }

    const imageResponse = await driveRequest(
      `/files/${encodeURIComponent(fileId)}?alt=media`,
      accessToken
    );
    const image = await imageResponse.arrayBuffer();

    return new Response(image, {
      status: 200,
      headers: {
        'Content-Type': metadata.mimeType,
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('drive-image API error:', error);
    return text('Unable to load image', 500);
  }
}
