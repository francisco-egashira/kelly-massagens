export default function handler(request) {
  return Response.json({ ok: true, runtime: 'vercel-function' });
}
