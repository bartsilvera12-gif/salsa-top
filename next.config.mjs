/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Export estático (genera la carpeta `out/` para hosting compartido de Hostinger).
  output: "export",
  // Con export no hay optimización de imágenes en servidor: se sirven tal cual.
  images: {
    unoptimized: true,
  },
  // Genera /ruta/index.html → Apache/Hostinger sirve /ruta/ sin configuración extra.
  trailingSlash: true,
};

export default nextConfig;
