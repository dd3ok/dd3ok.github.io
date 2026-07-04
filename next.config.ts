import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Static export for GitHub Pages.
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,

    // GitHub Pages cannot run the default Next image optimizer.
    images: {
        unoptimized: true,
    },

    // Keep local and production paths identical for the user site.
    basePath: '',
    assetPrefix: '',

    // Trim accidental logs from the exported production bundle.
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
}

export default nextConfig
