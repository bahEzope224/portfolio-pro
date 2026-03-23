import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Mail, MapPin, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { Section, SectionHeading, Button } from '@/components/ui'
import { useSendContact } from '@/hooks/useApi'
import type { ContactFormData } from '@/types'

export default function ContactPage() {
  const { t } = useTranslation()
  const { mutateAsync, isPending } = useSendContact()

  const schema = z.object({
    name:    z.string().min(2, t('contact.validation.nameTooShort')),
    email:   z.string().email(t('contact.validation.emailInvalid')),
    subject: z.string().min(3, t('contact.validation.subjectTooShort')),
    message: z.string().min(20, t('contact.validation.messageTooShort')),
  })

  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<ContactFormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await mutateAsync(data)
      toast.success(t('contact.successMsg'))
      reset()
    } catch {
      toast.error(t('contact.errorMsg'))
    }
  }

  const infoCards = [
    { icon: Mail,   label: t('contact.email'),        value: <a href="mailto:bahibrahimatalibe@gmail.com">bahibrahimatalibe@gmail.com</a> },
    { icon: MapPin, label: t('contact.location'),     value: t('contact.locationValue') },
    { icon: Clock,  label: t('contact.availability'), value: t('contact.availabilityValue') },
  ]

  return (
    <Section className="pt-32">
      <SectionHeading
        tag={t('contact.tag')}
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />
      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {infoCards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass glass-hover rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/20
                              flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent-400" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-white font-body font-medium text-sm">{value}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onSubmit)}
              className="lg:col-span-3 glass rounded-2xl p-8 flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2">
                {t('contact.labelName')}
              </label>
              <input {...register('name')} placeholder={t('contact.placeholderName')} className="input-field" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wide mb-2">
                {t('contact.labelEmail')}
              </label>
              <input {...register('email')} type="email" placeholder={t('contact.placeholderEmail')} className="input-field" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-2">
              {t('contact.labelSubject')}
            </label>
            <input {...register('subject')} placeholder={t('contact.placeholderSubject')} className="input-field" />
            {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wide mb-2">
              {t('contact.labelMessage')}
            </label>
            <textarea {...register('message')} rows={6} placeholder={t('contact.placeholderMessage')} className="input-field resize-none" />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
          </div>
          <Button type="submit" loading={isPending} className="self-end">
            <Send className="w-4 h-4" />
            {t('contact.send')}
          </Button>
        </form>
      </div>
    </Section>
  )
}
