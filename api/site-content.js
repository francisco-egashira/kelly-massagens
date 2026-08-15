const API_VERSION = '2026-03-01';

function saoPauloDate() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=30',
      'CDN-Cache-Control': 'public, s-maxage=120, stale-while-revalidate=600',
    },
  });
}

export async function GET() {
  const projectId = process.env.SANITY_PROJECT_ID;
  const dataset = process.env.SANITY_DATASET || 'production';

  if (!projectId) {
    return json({ error: 'SANITY_PROJECT_ID is not configured.' }, 503);
  }

  const query = `{
    "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{
      priceOneHour,
      priceThirtyMinutes,
      whatsapp,
      telephone,
      weekdayHours,
      saturdayHours,
      sundayHours,
      addressLine1,
      addressLine2,
      opportunitiesWhatsapp
    },
    "promotions": *[_type == "promotion" && active == true] | order(startDate asc){
      _id,
      title,
      description,
      price,
      startDate,
      endDate
    }
  }`;

  const endpoint = new URL(`https://${projectId}.api.sanity.io/v${API_VERSION}/data/query/${dataset}`);
  endpoint.searchParams.set('query', query);
  endpoint.searchParams.set('perspective', 'published');

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timer);

    if (!response.ok) {
      const detail = await response.text();
      return json({ error: `Sanity query failed (${response.status}).`, detail }, 502);
    }

    const payload = await response.json();
    const result = payload.result || {};
    const today = saoPauloDate();

    const promotions = (result.promotions || [])
      .filter((promotion) => {
        if (!promotion.startDate || !promotion.endDate) return false;
        return promotion.startDate <= today && promotion.endDate >= today;
      })
      .map(({ startDate, endDate, ...promotion }) => promotion);

    return json({
      settings: result.settings || null,
      promotions,
      date: today,
    });
  } catch (error) {
    const message = error?.name === 'AbortError' ? 'Sanity request timed out.' : error?.message;
    return json({ error: message || 'Could not load Sanity content.' }, 502);
  }
}
