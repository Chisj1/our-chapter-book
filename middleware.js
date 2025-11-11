export const config = {
  matcher: '/api/:path*',
};

export function middleware(request) {
  const backendUrl = process.env.VITE_BACKEND_URL;

  if (!backendUrl) {
    return new Response('Backend URL is not configured.', { status: 500 });
  }

  // 1. Get the requested path from the Vercel app
  const url = new URL(request.url);

  // 2. Remove the Vercel domain and ONLY keep the path (e.g., /api/events)
  const pathname = url.pathname;
  
  // 3. Construct the destination URL
  //    Example: backendUrl + pathname + url.search
  //    https://api.chapterdb.dpdns.org + /api/events + ?q=...
  const destination = `${backendUrl}${pathname}${url.search}`;

  // 4. Return a Response that triggers the rewrite using the custom header.
  const headers = new Headers(request.headers);
  headers.set('x-middleware-rewrite', destination);

  return new Response(null, {
      status: 200,
      headers: headers,
  });
}