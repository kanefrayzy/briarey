const API_BASE =
  typeof window === 'undefined'
    ? (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost/api')
    : (process.env.NEXT_PUBLIC_API_URL || '/api');

export function storageUrl(path: string | null | undefined): string {
  if (!path) return '/images/placeholder.png';
  if (path.startsWith('http') || path.startsWith('/images/') || path.startsWith('/storage/')) return path;
  return `/storage/${path}`;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Types
export interface SiteSettings {
  id: number;
  phone_1: string;
  phone_2: string;
  email: string;
  work_hours: string;
  address: string;
  company_name: string;
  inn: string;
  ogrn: string;
  okpo: string;
  facebook_url: string;
  youtube_url: string;
  instagram_url: string;
  twitter_url: string;
  logo: string | null;
}

export interface HeroSection {
  id: number;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  card_title: string;
  card_description: string;
  card_button_text: string;
  card_button_link: string;
  background_image: string | null;
  product_image: string | null;
}

export interface SectionSetting {
  section_key: string;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
}

export interface Advantage {
  id: number;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
}

export interface WorkStep {
  id: number;
  sort_order: number;
  title: string;
  description: string;
}

export interface Partner {
  id: number;
  sort_order: number;
  name: string;
  logo: string | null;
  url: string | null;
}

export interface ProductionSection {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
  button_link: string;
}

export interface ProductionFeature {
  id: number;
  sort_order: number;
  title: string;
  description: string;
  image: string | null;
}

export interface Faq {
  id: number;
  sort_order: number;
  question: string;
  answer: string;
}

export interface CalculatorCta {
  id: number;
  title: string;
  title_highlight: string;
  description: string;
  button_text: string;
  button_link: string;
  image: string | null;
}

export interface SmartPickSection {
  id: number;
  title: string;
  description: string;
  button_text: string;
  button_link: string;
  image: string | null;
}

export interface Slide {
  id: number;
  sort_order: number;
  image: string | null;
  title: string;
  subtitle: string;
  icon: string | null;
  stat_title: string;
  stat_description: string;
  next_feature: string;
  button_text: string;
  button_link: string;
}

export interface HomeData {
  site_settings: SiteSettings;
  hero: HeroSection;
  slides: Slide[];
  smart_pick: SmartPickSection;
  section_settings: Record<string, SectionSetting>;
  advantages: Advantage[];
  work_steps: WorkStep[];
  partners: Partner[];
  production_section: ProductionSection;
  production_features: ProductionFeature[];
  faqs: Faq[];
  calculator_cta: CalculatorCta;
}

export interface NewsItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string | null;
  is_featured: boolean;
}

export interface NewsContentBlock {
  id: number;
  sort_order: number;
  title: string | null;
  text: string | null;
  image: string | null;
  has_play_icon: boolean;
  is_reversed: boolean;
}

export interface NewsDetail extends NewsItem {
  content_blocks: NewsContentBlock[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Category {
  id: number;
  sort_order: number;
  name: string;
  slug: string;
  icon: string | null;
  products_count: number;
}

export interface ProductImage {
  id: number;
  image: string;
  sort_order: number;
}

export interface CompositionItem {
  id: number;
  text: string;
  sort_order: number;
}

export interface StarterKitItem {
  id: number;
  name: string;
  description: string;
  image: string | null;
  qty: string;
  sort_order: number;
}

export interface MainSpecColumn {
  id: number;
  heading: string;
  content: string[];
  sort_order: number;
}

export interface MainSpec {
  id: number;
  title: string;
  sort_order: number;
  columns: MainSpecColumn[];
}

export interface ProductExtra {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
  sort_order: number;
}

export interface CategoryAttributeInfo {
  id: number;
  name: string;
  key: string;
  type: string;
  unit: string | null;
  sort_order: number;
}

export interface ProductAttributeValue {
  id: number;
  category_attribute_id: number;
  value: string;
  category_attribute: CategoryAttributeInfo;
}

export interface Product {
  id: number;
  category_id: number;
  slug: string;
  name: string;
  badge: string | null;
  price: number;
  image: string | null;
  calculator_hint: string | null;
  technical_doc_url: string | null;
  category?: Category;
  images?: ProductImage[];
  composition_items?: CompositionItem[];
  starter_kit_items?: StarterKitItem[];
  main_specs?: MainSpec[];
  extras?: ProductExtra[];
  attribute_values?: ProductAttributeValue[];
}

export interface Certificate {
  id: number;
  sort_order: number;
  title: string;
  image: string | null;
  file: string | null;
}

export interface Vacancy {
  id: number;
  sort_order: number;
  title: string;
  salary: string;
  duties: string;
  image: string | null;
  link: string | null;
}

export interface AboutPage {
  id: number;
  video_url: string | null;
  poster_image: string | null;
  column_1_title: string;
  column_1_text: string;
  column_2_title: string;
  column_2_text: string;
}

export interface AboutPhoto {
  id: number;
  image: string;
  alt: string | null;
  sort_order: number;
}

export interface DealersPage {
  id: number;
  hero_title: string;
  hero_description: string;
  hero_button_text: string;
  hero_image: string | null;
}

export interface DealerStep {
  id: number;
  sort_order: number;
  title: string;
  description: string;
}

// API functions
export const api = {
  // Home page - all sections in one request
  getHome: () => fetchApi<HomeData>('/home'),

  // Site settings (for header/footer)
  getSiteSettings: () => fetchApi<SiteSettings>('/site-settings'),

  // News
  getNews: (page = 1, perPage = 12) =>
    fetchApi<PaginatedResponse<NewsItem>>(`/news?page=${page}&per_page=${perPage}`),
  getNewsDetail: (slug: string) => fetchApi<NewsDetail>(`/news/${encodeURIComponent(slug)}`),

  // Catalog
  getCategories: () => fetchApi<Category[]>('/categories'),
  getCategoryProducts: (slug: string) =>
    fetchApi<{ category: Category; products: Product[] }>(`/categories/${encodeURIComponent(slug)}`),
  getProducts: (category?: string) =>
    fetchApi<Product[]>(category ? `/products?category=${encodeURIComponent(category)}` : '/products'),
  searchProducts: (q: string) => {
    const url = `${API_BASE}/products/search?q=${encodeURIComponent(q)}`;
    return fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    }).then(r => r.json()) as Promise<Product[]>;
  },
  getProduct: (slug: string) => fetchApi<Product>(`/products/${encodeURIComponent(slug)}`),

  // Certificates
  getCertificates: () =>
    fetchApi<{ page: { hero_title: string; hero_description: string }; certificates: Certificate[] }>('/certificates'),

  // Vacancies
  getVacancies: () =>
    fetchApi<{ page: { hero_title: string; hero_description: string }; vacancies: Vacancy[] }>('/vacancies'),

  // About
  getAbout: () => fetchApi<{ page: AboutPage; photos: AboutPhoto[] }>('/about'),

  // Dealers
  getDealers: () => fetchApi<{ page: DealersPage; steps: DealerStep[] }>('/dealers'),

  // Contact
  getContactTopics: () => fetchApi<{ id: number; label: string }[]>('/contact-topics'),
  submitContact: (data: {
    name: string;
    phone: string;
    email?: string;
    message?: string;
    topic?: string;
    is_subscribed?: boolean;
  }) =>
    fetchApi<{ success: boolean }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  subscribe: (email: string) =>
    fetchApi<{ success: boolean }>('/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Orders
  submitOrder: (data: OrderPayload) =>
    fetchApi<{ success: boolean; order_number: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Order types
export interface OrderItemPayload {
  product_id: number
  qty: number
  extras?: { id: number; qty: number }[]
  configuration?: { suction_length: number; exhaust_length: number }
}

export interface OrderPayload {
  delivery_method: 'delivery' | 'pickup'
  recipient_type: 'legal' | 'individual'
  name: string
  phone: string
  email?: string
  requisites?: string
  address?: string
  entrance?: string
  floor?: string
  apartment?: string
  comment?: string
  items: OrderItemPayload[]
}
