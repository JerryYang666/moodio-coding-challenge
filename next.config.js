/** @type {import('next').NextConfig} */

// The browse grid talks to a Flask "retrieval" API. To avoid CORS from the
// candidate's localhost, the browser calls a same-origin path (/retrieval-api/*)
// and Next.js proxies it server-side to the real backend. Set the target in
// .env.local via NEXT_PUBLIC_FLASK_URL.
const FLASK_URL = (process.env.NEXT_PUBLIC_FLASK_URL || "").replace(/\/$/, "");

const path = require("path");
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig = {
  // This project lives inside a larger repo. Pin the root to THIS directory so
  // Next doesn't walk up and try to compile the parent app's middleware/routes.
  turbopack: { root: __dirname },
  outputFileTracingRoot: path.join(__dirname),

  async rewrites() {
    if (!FLASK_URL) return [];
    return [
      {
        source: "/retrieval-api/:path*",
        destination: `${FLASK_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
