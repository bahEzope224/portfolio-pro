import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock, Code2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui'
import { loginRequest, setToken } from '@/store/auth'

const schema = z.object({
  username: z.string().min(1, 'Requis'),
  password: z.string().min(1, 'Requis'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate  = useNavigate()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const token = await loginRequest(data.username, data.password)
      setToken(token.access_token)
      toast.success('Connexion réussie !')
      navigate('/admin')
    } catch {
      toast.error('Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full
                        bg-accent-500/8 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-500/20 border border-accent-500/30
                          flex items-center justify-center">
            <Code2 className="w-7 h-7 text-accent-400" />
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-white text-2xl mb-2">
              Administration
            </h1>
            <p className="text-ink-400 text-sm">Connectez-vous pour gérer votre portfolio</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
                Nom d'utilisateur
              </label>
              <input
                {...register('username')}
                placeholder="admin"
                autoComplete="username"
                className="input-field"
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
                Mot de passe
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="input-field"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center mt-2">
              <Lock className="w-4 h-4" />
              Se connecter
            </Button>
          </form>
        </div>

        <p className="text-center text-ink-500 text-xs mt-6">
          Première connexion ? Créez votre compte via{' '}
          <code className="font-mono text-ink-400">POST /api/auth/register</code>
        </p>
      </div>
    </div>
  )
}
