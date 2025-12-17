import { LoginForm } from '@/components/features/auth/login-form'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-white">Entrar no Lápida</h1>
        <LoginForm />
        <p className="text-center text-sm text-gray-400">
          Não tem uma conta? <Link href="/register" className="text-blue-400 hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}