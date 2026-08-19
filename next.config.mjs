/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — GitHub Pages serves the `out/` directory as-is.
  output: 'export',
  // The export target has no image optimisation server.
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
