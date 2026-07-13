/** @type {import('next').NextConfig} */
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig = {
  reactStrictMode: true,
  // Coolify usa un servidor Node (output standalone reduce el tamaño de la imagen)
  output: "standalone",
  images: {
    remotePatterns: [
      // Supabase Storage (host derivado de la env en build)
      ...(supabaseHost
        ? [{ protocol: "https", hostname: supabaseHost }]
        : []),
      // Permitir cualquier host https para Storage self-hosted detrás de dominios propios.
      { protocol: "https", hostname: "**" },
    ],
  },
  eslint: {
    // El build no debe romperse por lint; se valida aparte con `npm run lint`.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
