/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'replicate.delivery',
            port: '',
            pathname: '/pbxt/**',
          },
        ],
        domains: [
          `${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com`,
          `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
        ],
      },
}

module.exports = nextConfig
