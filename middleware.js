export const config = {
  // Only match requests starting with /api
  matcher: '/api/:path*',
};

export function middleware(request) {
  // Read the environment variable
  const backendUrl = process.env.VITE_BACKEND_URL;

  if (!backendUrl) {
    // Return a standard Response object for errors
    return new Response('Backend URL is not configured.', { status: 500 });
  }

  // 1. Create a new URL object from the request URL
  const url = new URL(request.url);

  // 2. Modify the URL's hostname and path to point to the external backend
  const destination = `${backendUrl}${url.pathname}${url.search}`;

  // 3. To perform a rewrite (proxy), you need to return a Response 
  //    object with the 'x-middleware-rewrite' header.
  //    Vercel recommends using the Next.js utility for this, but since you cannot, 
  //    we'll use the Web Standard equivalent:

  // Create a new request object to send to the destination.
  const headers = new Headers(request.headers);
  headers.set('x-middleware-rewrite', destination);

  // Return a response that triggers the rewrite using the custom header.
  return new Response(null, {
      status: 200,
      headers: headers,
  });
}