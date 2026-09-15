/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning irunthalum build fail aagathu
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Typescript error irunthalum bypass pannidum
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; // (.mjs file ah iruntha 'export default nextConfig;' nu podunga)