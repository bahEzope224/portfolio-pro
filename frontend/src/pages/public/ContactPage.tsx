import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Mail, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { Section, SectionHeading, Button } from '@/components/ui'
import { useSendContact } from '@/hooks/useApi'
import type { ContactFormData } from '@/types'

const schema = z.object({
  name:    z.string().min(2, 'Nom trop court'),
  email:   z.string().email('Email invalide'),
  subject: z.string().min(3, 'Sujet trop court'),
  message: z.string().min(20, 'Message trop court (min. 20 caractères)'),
})

export default function ContactPage() {
  const { mutateAsync, isPending } = useSendContact()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await mutateAsync(data)
      toast.success('Message envoyé ! Je vous réponds rapidement.')
      reset()
    } catch {
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.')
    }
  }

  return (
    <Section className="pt-32">
      <SectionHeading
        tag="Contact"
        title="Travaillons ensemble"
        subtitle="Vous avez un projet ? N'hésitez pas à me contacter."
      />

      <div className="grid lg:grid-cols-5 gap-12">
        {/* Info cards */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {[
            { icon: Mail,    label: 'Email',        value: 'bahibrahimatalibe@gmail.com' },
            { icon: MapPin,  label: 'Localisation', value: 'Paris, France' },
            { icon: Clock,   label: 'Disponibilité', value: 'Lun – Ven, 9h – 18h' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass glass-hover rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20
                              flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-xs text-ink-400 font-mono uppercase tracking-wide mb-0.5">
                  {label}
                </p>
                <p className="text-white font-body font-medium text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-3 glass rounded-2xl p-8 flex flex-col gap-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
                Nom
              </label>
              <input
                {...register('name')}
                placeholder="Jean Dupont"
                className="input-field"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="jean@exemple.com"
                className="input-field"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
              Sujet
            </label>
            <input
              {...register('subject')}
              placeholder="Proposition de projet…"
              className="input-field"
            />
            {errors.subject && (
              <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-ink-400 uppercase tracking-wide mb-2">
              Message
            </label>
            <textarea
              {...register('message')}
              rows={6}
              placeholder="Décrivez votre projet ou votre question…"
              className="input-field resize-none"
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
            )}
          </div>

          <Button type="submit" loading={isPending} className="self-end">
            <Send className="w-4 h-4" />
            Envoyer le message
          </Button>
        </form>
      </div>
    </Section>
  )
}
