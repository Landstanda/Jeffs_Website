// Lightweight WordPress client supporting WPGraphQL (preferred) and REST fallback
// Configuration via environment variables:
// - WORDPRESS_GRAPHQL_ENDPOINT=https://your-wp-site.com/graphql
// - WORDPRESS_SITE_URL=https://your-wp-site.com

export interface WordpressPostSummary {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string
  tags?: string
  createdAt: string
  updatedAt?: string
}

export interface WordpressPostDetail extends WordpressPostSummary {
  contentHtml: string
}

function getGraphqlEndpoint(): string | null {
  const url = process.env.WORDPRESS_GRAPHQL_ENDPOINT
  return url && url.trim().length > 0 ? url : null
}

function getSiteUrl(): string | null {
  const url = process.env.WORDPRESS_SITE_URL
  return url && url.trim().length > 0 ? url.replace(/\/$/, '') : null
}

export function isWordpressConfigured(): boolean {
  return !!(getGraphqlEndpoint() || getSiteUrl())
}

export async function fetchWordpressPosts(limit: number = 20): Promise<WordpressPostSummary[]> {
  const gql = getGraphqlEndpoint()
  if (gql) {
    try {
      const query = `
        query LatestPosts($first: Int!) {
          posts(first: $first, where: {orderby: {field: DATE, order: DESC}, status: PUBLISH}) {
            nodes {
              databaseId
              slug
              date
              modified
              title
              excerpt
              featuredImage { node { sourceUrl } }
              tags(first: 10) { nodes { name } }
            }
          }
        }
      `
      const res = await fetch(gql, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { first: Math.max(1, Math.min(50, limit)) } })
      })
      if (!res.ok) throw new Error(`WPGraphQL HTTP ${res.status}`)
      const json = await res.json()
      const nodes = json?.data?.posts?.nodes || []
      return nodes.map((n: any) => ({
        id: String(n.databaseId),
        title: stripHtml(n.title || ''),
        slug: n.slug,
        excerpt: sanitizeExcerpt(n.excerpt || ''),
        featuredImage: n?.featuredImage?.node?.sourceUrl || undefined,
        tags: (n?.tags?.nodes || []).map((t: any) => t?.name).filter(Boolean).join(', '),
        createdAt: n.date,
        updatedAt: n.modified,
      }))
    } catch (err) {
      // fall through to REST
      // eslint-disable-next-line no-console
      console.warn('[wordpress] GraphQL fetch failed, falling back to REST:', err)
    }
  }

  const site = getSiteUrl()
  if (!site) return []
  const url = `${site}/wp-json/wp/v2/posts?_embed&per_page=${Math.max(1, Math.min(50, limit))}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`WP REST HTTP ${res.status}`)
  const posts = await res.json()
  return posts.map((p: any) => ({
    id: String(p.id),
    title: decodeEntities(p.title?.rendered || ''),
    slug: p.slug,
    excerpt: sanitizeExcerpt(p.excerpt?.rendered || ''),
    featuredImage: p?._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? '' : undefined,
    createdAt: p.date,
    updatedAt: p.modified,
  }))
}

export async function fetchWordpressPostBySlug(slug: string): Promise<WordpressPostDetail | null> {
  const gql = getGraphqlEndpoint()
  if (gql) {
    try {
      const query = `
        query PostBySlug($slug: ID!) {
          post(id: $slug, idType: SLUG) {
            databaseId
            slug
            title
            content
            excerpt
            date
            modified
            featuredImage { node { sourceUrl } }
            tags(first: 10) { nodes { name } }
          }
        }
      `
      const res = await fetch(gql, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { slug } })
      })
      if (!res.ok) throw new Error(`WPGraphQL HTTP ${res.status}`)
      const json = await res.json()
      const n = json?.data?.post
      if (!n) return null
      return {
        id: String(n.databaseId),
        title: stripHtml(n.title || ''),
        slug: n.slug,
        excerpt: sanitizeExcerpt(n.excerpt || ''),
        featuredImage: n?.featuredImage?.node?.sourceUrl || undefined,
        tags: (n?.tags?.nodes || []).map((t: any) => t?.name).filter(Boolean).join(', '),
        createdAt: n.date,
        updatedAt: n.modified,
        contentHtml: n.content || ''
      }
    } catch (err) {
      // fall through to REST
      // eslint-disable-next-line no-console
      console.warn('[wordpress] GraphQL fetch failed, falling back to REST:', err)
    }
  }

  const site = getSiteUrl()
  if (!site) return null
  const url = `${site}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`WP REST HTTP ${res.status}`)
  const arr = await res.json()
  const p = Array.isArray(arr) ? arr[0] : null
  if (!p) return null
  return {
    id: String(p.id),
    title: decodeEntities(p.title?.rendered || ''),
    slug: p.slug,
    excerpt: sanitizeExcerpt(p.excerpt?.rendered || ''),
    featuredImage: p?._embedded?.['wp:featuredmedia']?.[0]?.source_url,
    tags: Array.isArray(p.tags) && p.tags.length > 0 ? '' : undefined,
    createdAt: p.date,
    updatedAt: p.modified,
    contentHtml: p.content?.rendered || ''
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

function sanitizeExcerpt(html: string): string {
  const text = stripHtml(html)
  return text.length > 260 ? text.slice(0, 257) + '…' : text
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
}


