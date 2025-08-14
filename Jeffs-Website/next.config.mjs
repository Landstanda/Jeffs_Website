/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: true,
    typedRoutes: true,
  },
  pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'md', 'mdx'],
};

const withMDX = import('@next/mdx')({
  options: {
    remarkPlugins: [import('remark-gfm').then(m => m.default)],
    rehypePlugins: [import('rehype-slug').then(m => m.default)],
  },
});

export default (await withMDX)(nextConfig);


