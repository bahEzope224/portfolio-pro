import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Project, Experience, Skill, CV, ContactFormData, Review, ReviewInvitation, 
  InvitationCheckResult ,BlogPost, BlogPostSummary } from '@/types'
const BASE = import.meta.env.VITE_API_URL ?? '/api'

// ─── Projects ────────────────────────────────────────────────────────────

export const useProjects = () =>
  useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => (await api.get('/projects/')).data,
  })

export const useCreateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: FormData) => api.post('/projects/', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export const useUpdateProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) =>
      api.put(`/projects/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export const useDeleteProject = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/projects/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })
}

// ─── Experiences ─────────────────────────────────────────────────────────

export const useExperiences = () =>
  useQuery<Experience[]>({
    queryKey: ['experiences'],
    queryFn: async () => (await api.get('/experiences/')).data,
  })

export const useCreateExperience = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: FormData) => api.post('/experiences/', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  })
}

export const useUpdateExperience = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) =>
      api.put(`/experiences/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  })
}

export const useDeleteExperience = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/experiences/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['experiences'] }),
  })
}

// ─── Skills ──────────────────────────────────────────────────────────────

export const useSkills = () =>
  useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => (await api.get('/skills/')).data,
  })

export const useCreateSkill = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Skill, 'id' | 'created_at'>) => api.post('/skills/', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  })
}

export const useUpdateSkill = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Skill> }) =>
      api.put(`/skills/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  })
}

export const useDeleteSkill = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/skills/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['skills'] }),
  })
}

// ─── CV ──────────────────────────────────────────────────────────────────

export const useCV = () =>
  useQuery<CV | null>({
    queryKey: ['cv'],
    queryFn: async () => {
      const res = await api.get('/cv/')
      return res.data ?? null
    },
  })

export const useUploadCV = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: FormData) =>
      api.post('/cv/', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cv'] }),
  })
}

export const useDeleteCV = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete('/cv/'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cv'] }),
  })
}

// ─── Contact ─────────────────────────────────────────────────────────────

export const useSendContact = () =>
  useMutation({
    mutationFn: (data: ContactFormData) => api.post('/contact/', data),
  })

// ─── Reviews ─────────────────────────────────────────────────────────────

export const useReviews = () =>
  useQuery<Review[]>({
    queryKey: ['reviews'],
    queryFn: async () => (await api.get('/reviews/')).data,
  })

export const useAllReviews = () =>
  useQuery<Review[]>({
    queryKey: ['reviews', 'all'],
    queryFn: async () => (await api.get('/reviews/admin/all')).data,
  })

export const useCreateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: FormData) =>
      api.post('/reviews/', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export const useUpdateReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) =>
      api.put(`/reviews/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export const useToggleReviewVisibility = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.patch(`/reviews/${id}/toggle`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

export const useDeleteReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
    },
  })
}

// ─── Invitations ──────────────────────────────────────────────────────────

export const useInvitations = () =>
  useQuery<ReviewInvitation[]>({
    queryKey: ['invitations'],
    queryFn: async () => (await api.get('/invitations/')).data,
  })

export const useCreateInvitation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { client_name: string; client_role: string; client_company?: string; client_email?: string }) =>
      api.post('/invitations/', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  })
}

export const useDeleteInvitation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/invitations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  })
}

export const useApproveReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: number) => api.post(`/invitations/approve/${reviewId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
      qc.invalidateQueries({ queryKey: ['invitations'] })
    },
  })
}

export const useRejectReview = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: number) => api.delete(`/invitations/reject/${reviewId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews'] })
      qc.invalidateQueries({ queryKey: ['invitations'] })
    },
  })
}

export const useCheckInvitation = (token: string) =>
  useQuery<InvitationCheckResult>({
    queryKey: ['invitation-check', token],
    queryFn: async () => (await api.get(`/invitations/${token}/check`)).data,
    enabled: !!token,
    retry: false,
  })

export const useSubmitReview = () =>
  useMutation({
    mutationFn: ({ token, content, rating }: { token: string; content: string; rating: number }) =>
      api.post(`/invitations/${token}/submit`, { content, rating }),
  })



// ─── Blog ─────────────────────────────────────────────────────────────────

export const useBlogPosts = (params?: { category?: string; tag?: string; search?: string }) =>
  useQuery<BlogPostSummary[]>({
    queryKey: ['blog', params],
    queryFn: async () => {
      const p = new URLSearchParams()
      if (params?.category) p.append('category', params.category)
      if (params?.tag)      p.append('tag', params.tag)
      if (params?.search)   p.append('search', params.search)
      return (await api.get(`/blog/?${p.toString()}`)).data
    },
  })

export const useFeaturedPosts = () =>
  useQuery<BlogPostSummary[]>({
    queryKey: ['blog', 'featured'],
    queryFn: async () => (await api.get('/blog/featured')).data,
  })

export const useBlogPost = (slug: string) =>
  useQuery<BlogPost>({
    queryKey: ['blog', slug],
    queryFn: async () => (await api.get(`/blog/${slug}`)).data,
    enabled: !!slug,
  })

export const useBlogCategories = () =>
  useQuery<string[]>({
    queryKey: ['blog-categories'],
    queryFn: async () => (await api.get('/blog/categories')).data,
  })

export const useBlogTags = () =>
  useQuery<string[]>({
    queryKey: ['blog-tags'],
    queryFn: async () => (await api.get('/blog/tags')).data,
  })

export const useAllBlogPosts = () =>
  useQuery<BlogPostSummary[]>({
    queryKey: ['blog', 'admin', 'all'],
    queryFn: async () => (await api.get('/blog/admin/all')).data,
  })

export const useCreateBlogPost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: FormData) =>
      api.post('/blog/', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  })
}

export const useUpdateBlogPost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) =>
      api.put(`/blog/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  })
}

export const useDeleteBlogPost = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/blog/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['blog'] }),
  })
}