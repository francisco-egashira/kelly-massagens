import crypto from 'node:crypto';

const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const DEFAULT_TIMEOUT_MS = 12000;

let cachedAccessToken = null;
let cachedAccessTokenExpiresAt = 0;

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

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(`Timeout após ${Math.round(timeoutMs / 1000)}s ao acessar ${new URL(url).host}`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function validateGoogleDriveConfig() {
  return {
    serviceAccountEmailConfigured: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
    privateKeyConfigured: Boolean(process.env.GOOGLE_PRIVATE_KEY),
    galleryFolderConfigured: Boolean(process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID),
    dailyListFolderConfigured: Boolean(process.env.GOOGLE_DRIVE_DAILYLIST_FOLDER_ID),
  };
}

export async function getAccessToken() {
  if (cachedAccessToken && Date.now() < cachedAccessTokenExpiresAt) {
    return cachedAccessToken;
  }

  const clientEmail = requireEnv('GOOGLE_SERVICE_ACCOUNT_EMAIL').trim();
  const privateKey = requireEnv('GOOGLE_PRIVATE_KEY')
    .replace(/^['"]|['"]$/g, '')
    .replace(/\\n/g, '\n')
    .trim();

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
  let signature;
  try {
    signature = crypto.sign('RSA-SHA256', Buffer.from(unsignedToken), privateKey);
  } catch (error) {
    throw new Error(`GOOGLE_PRIVATE_KEY inválida: ${error.message}`);
  }

  const assertion = `${unsignedToken}.${base64url(signature)}`;

  const response = await fetchWithTimeout(TOKEN_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Resposta inválida do Google OAuth (${response.status}).`);
  }

  if (!response.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || 'Falha ao autenticar no Google Drive.');
  }
  cachedAccessToken = data.access_token;
  cachedAccessTokenExpiresAt = Date.now() + Math.max(60, (data.expires_in || 3600) - 300) * 1000;
  return cachedAccessToken;
}

export async function driveRequest(path, accessToken, options = {}) {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  const response = await fetchWithTimeout(`${DRIVE_API}${path}`, {
    ...fetchOptions,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(fetchOptions.headers || {}),
    },
  }, timeoutMs);

  if (!response.ok) {
    const raw = await response.text();
    let details = raw;
    try {
      const body = JSON.parse(raw);
      details = body?.error?.message || raw;
    } catch {
      // Keep raw response as the error detail.
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
