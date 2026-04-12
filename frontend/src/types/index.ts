// ─── Shared API types matching backend schemas ───────────────────────────

export interface Project {
  id: number
  title: string
  title_en?: string
  description: string
  description_en?: string
  tech_stack: string[]
  github_url?: string
  live_url?: string
  image_path?: string
  is_featured: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: number
  company: string
  position: string
  position_en?: string
  start_date: string   // "YYYY-MM"
  end_date?: string    // null = Present
  description: string
  description_en?: string
  logo_path?: string
  location?: string
  location_en?: string
  order: number
  created_at: string
  updated_at: string
}

export interface Skill {
  id: number
  name: string
  name_en?: string
  category: string
  category_en?: string
  level: number       // 0–100
  icon?: string
  order: number
  created_at: string
}

export interface CV {
  id: number
  filename: string
  file_path: string
  upload_date: string
}

export interface AdminUser {
  id: number
  username: string
  email: string
  is_active: boolean
}

export interface Token {
  access_token: string
  token_type: string
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface Review {
  id: number
  author_name: string
  author_role: string
  author_role_en?: string
  company?: string
  avatar_path?: string
  content: string
  content_en?: string
  rating: number        // 1–5
  is_featured: boolean
  is_visible: boolean
  order: number
  created_at: string
  updated_at: string
}

export interface ReviewInvitation {
  id: number
  token: string
  client_name: string
  client_role: string
  client_company?: string
  client_email?: string
  is_used: boolean
  expires_at: string
  created_at: string
  review_id?: number
  invite_url: string
}

export interface InvitationCheckResult {
  valid: boolean
  client_name: string
  client_role: string
  client_company?: string
  expires_at: string
}


export interface BlogPost {
  id: number
  title: string
  title_en?: string
  slug: string
  excerpt?: string
  excerpt_en?: string
  content: string
  content_en?: string
  cover_path?: string
  category: string
  tags: string[]
  reading_time: number
  is_published: boolean
  is_featured: boolean
  views: number
  meta_title?: string
  meta_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface BlogPostSummary {
  id: number
  title: string
  title_en?: string
  slug: string
  excerpt?: string
  excerpt_en?: string
  cover_path?: string
  category: string
  tags: string[]
  reading_time: number
  is_published: boolean   
  is_featured: boolean
  views: number
  published_at?: string
  created_at: string
}