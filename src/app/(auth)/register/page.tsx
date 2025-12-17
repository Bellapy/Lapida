import { RegisterForm } from '@/components/features/auth/register-form'

export default function RegisterPage() {
  return (
    // A estrutura do JSX deve ser exatamente esta, sem caracteres adicionais.
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-gray-800 p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-white">
          Criar conta
        </h1>
        <RegisterForm />
      </div>
    </div>
  )
}