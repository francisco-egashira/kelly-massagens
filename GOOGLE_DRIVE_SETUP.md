# Google Drive setup for Professionals

The site does not use the Google account password. It uses a read-only Google Cloud service account from Vercel Functions.

## 1. Create a Google Cloud project and enable Drive API

Create/select a project in Google Cloud Console and enable **Google Drive API**.

## 2. Create a service account

Create a service account and download its JSON key once. You will use only:

- `client_email`
- `private_key`

Do not commit the JSON key to GitHub.

## 3. Share the two Drive folders

In the Google Drive account that owns the files, share these folders with the service account's `client_email` as **Viewer**:

- `Gallery`
- `DailyList`

The expected structure is:

```text
Gallery/
  Jake/
    photo-1.jpg
    photo-2.jpg
  Jeniffer/
    photo-1.jpg
  Julia/
    ...

DailyList/
  lista-14-08-2026.txt
```

Each line of the daily text file must exactly match a folder name inside `Gallery`.

## 4. Copy folder IDs

Open each folder in Drive. In a URL like:

`https://drive.google.com/drive/folders/1ABCxyz...`

copy the part after `/folders/`.

## 5. Add Vercel environment variables

Project -> Settings -> Environment Variables:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_DRIVE_GALLERY_FOLDER_ID`
- `GOOGLE_DRIVE_DAILYLIST_FOLDER_ID`

For `GOOGLE_PRIVATE_KEY`, paste the full private key. Vercel can store it as a sensitive environment variable.

Redeploy after adding or changing environment variables.

## 6. Daily behavior

The function determines today's date using timezone `America/Sao_Paulo` and looks for:

`lista-dd-mm-yyyy.txt`

It reads names in file order, finds the folder with the exact same name under `Gallery`, and returns all images in that professional's folder. The browser shows one card per professional with previous/next arrows.

## Teste da API no Vercel

Depois do deploy, abra primeiro:

`https://SEU-DOMINIO.vercel.app/api/health`

A resposta deve ser JSON:

`{"ok":true,"runtime":"vercel-function"}`

Depois abra:

`https://SEU-DOMINIO.vercel.app/api/professionals`

Essa URL também deve responder JSON. Se `/api/health` mostrar código JavaScript em vez de JSON, confira no Vercel se o **Root Directory** do projeto aponta para a raiz que contém `package.json`, `api/` e `src/`.
