/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/login",
        destination: "https://app.doubtster.com",
        permanent: false,
      },
      {
        source: "/signup",
        destination: "https://app.doubtster.com",
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
