/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking
          { key: "X-Frame-Options", value: "DENY" },

          // Prevent MIME sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },

          // Strict referrer policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Disable DNS prefetching
          { key: "X-DNS-Prefetch-Control", value: "off" },

          // Basic XSS protection (legacy browsers)
          { key: "X-XSS-Protection", value: "1; mode=block" },

          // Content Security Policy (VERY IMPORTANT)
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self';
              style-src 'self' 'unsafe-inline';
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
