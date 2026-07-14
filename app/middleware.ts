import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Placeholder para auth middleware
  // Se implementará cuando Supabase esté conectado
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
