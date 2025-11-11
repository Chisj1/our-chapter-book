import { NextResponse } from 'next/server';

export const config = {
  // Only match requests starting with /api
  matcher: '/api/:path*',
};

export function middleware(request) {
  // 1. Get the path after /api/
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '');

  // 2. Get the backend URL from the environment variable
  const backendUrl = process.env.VITE_BACKEND_URL;

  if (!backendUrl) {
    // Handle error if variable is missing (e.g., return a 500 error)
    return new Response('Backend URL is not configured.', { status: 500 });
  }

  // 3. Create the full new destination URL
  const destination = `${backendUrl}${path}${url.search}`;

  // 4. Return a Rewrite response to proxy the request
  return NextResponse.rewrite(destination);
}
