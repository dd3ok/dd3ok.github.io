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

    // Next.js 15.5.2의 내장 lint 단계는 현재 flat config 조합과 충돌하므로
    // 저장소의 lint 게이트는 package.json의 build/validate 스크립트에서 강제합니다.
    eslint: {
        ignoreDuringBuilds: true,
    },

}

module.exports = nextConfig
