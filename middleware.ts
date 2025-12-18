export { auth as middleware } from '@/lib/auth'

export const config = {
  // O matcher define quais rotas serão protegidas pelo middleware
  matcher: ['/dashboard/:path*'],
}