export function GET() {
  return Response.json({
    ok: true,
    runtime: 'vercel-function',
    timestamp: new Date().toISOString(),
  }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
