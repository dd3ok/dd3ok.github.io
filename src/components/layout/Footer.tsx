'use client'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* 메인 소개 섹션 */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">dd3ok</h3>
                        <p className="text-gray-400 leading-relaxed max-w-md">
                            확장 가능한 시스템과 효율적인 서비스를 구축하는 개발자입니다.
                        </p>
                    </div>

                    {/* 빈 공간 (반응형을 위해) */}
                    <div className="hidden md:block">
                        {/* 필요시 추가 컨텐츠 */}
                    </div>

                    {/* 연결 섹션 */}
                    <div>
                        <h4 className="font-semibold mb-4">연결</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li>
                                <a
                                    href="https://github.com/dd3ok"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors inline-flex items-center group"
                                >
                                    <span className="mr-3 text-lg group-hover:scale-110 transition-transform">📧</span>
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:hwick@kakao.com"
                                    className="hover:text-white transition-colors inline-flex items-center group"
                                >
                                    <span className="mr-3 text-lg group-hover:scale-110 transition-transform">✉️</span>
                                    Email
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com/in/dd3ok"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors inline-flex items-center group"
                                >
                                    <span className="mr-3 text-lg group-hover:scale-110 transition-transform">💼</span>
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 하단 저작권 */}
                <div className="border-t border-gray-800 pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            &copy; {currentYear} dd3ok. All rights reserved.
                        </p>
                        <div className="flex space-x-4 text-sm text-gray-500">
                            <span>Made with ❤️ in Korea</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
