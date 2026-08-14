import crypto from 'node:crypto';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';

function base64url(value) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value;
}

export async function getAccessToken() {
  const clientEmail = requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = requireEnv('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n');
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    scope: DRIVE_SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }));

  const unsignedToken = `${header}.${payload}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsignedToken), privateKey);
  const assertion = `${unsignedToken}.${base64url(signature)}`;

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || 'Falha ao autenticar no Google Drive.');
  }
  return data.access_token;
}

export async function driveRequest(path, accessToken, options = {}) {
  const response = await fetch(`${DRIVE_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let details = '';
    try {
      const body = await response.json();
      details = body?.error?.message || '';
    } catch {
      details = await response.text();
    }
    throw new Error(`Google Drive API ${response.status}: ${details || response.statusText}`);
  }

  return response;
}

export function escapeDriveQuery(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

export async function listFiles(accessToken, q, fields = 'files(id,name,mimeType,parents)') {
  const params = new URLSearchParams({
    q,
    fields,
    pageSize: '1000',
    orderBy: 'name',
    supportsAllDrives: 'true',
    includeItemsFromAllDrives: 'true',
  });

  const response = await driveRequest(`/files?${params.toString()}`, accessToken);
  return response.json();
}
