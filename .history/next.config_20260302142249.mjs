/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "off" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Content-Security-Policy",
            value: isDev
              ? `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              connect-src 'self' ws: http:;
              font-src 'self';
            `.replace(/\n/g, "")
              : `
              default-src 'self';
              script-src 'self';
              style-src 'self';
              img-src 'self' data:;
              connect-src 'self';
              font-src 'self';
              object-src 'none';
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\n/g, ""),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
