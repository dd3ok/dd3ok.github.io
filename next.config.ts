import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
    // GitHub Pages 정적 배포 설정
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,

    // 이미지 최적화 비활성화 (GitHub Pages 제약)
    images: {
        unoptimized: true,
    },

    // 개발/프로덕션 환경 분리
    basePath: '',
    assetPrefix: '',

    // 성능 최적화
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    // ESLint 비활성화
    eslint: {
        ignoreDuringBuilds: true,
    },

    // TypeScript 오류 무시
    typescript: {
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
