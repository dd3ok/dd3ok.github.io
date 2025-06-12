'use client'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2 text-center md:text-left">
                        <h3 className="text-xl font-bold mb-4">dd3ok</h3>
                        <p className="text-gray-400 leading-relaxed max-w-md mx-auto md:mx-0">
                            확장 가능한 시스템과 효율적인 서비스를 구축하는 개발자입니다.
                        </p>
                    </div>

                    <div className="text-center md:text-left">
                        {/* 주석 처리된 부분 - 문제 없음 */}
                    </div>

                    <div className="text-center md:text-left">
                        <h4 className="font-semibold mb-4">연결</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a
                                    href="https://github.com/dd3ok"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors inline-flex items-center"
                                >
                                    <span className="mr-2">📧</span>
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:hwick@kakao.com"
                                    className="hover:text-white transition-colors inline-flex items-center"
                                >
                                    <span className="mr-2">✉️</span>
                                    Email
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://linkedin.com/in/dd3ok"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors inline-flex items-center"
                                >
                                    <span className="mr-2">💼</span>
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; {currentYear} dd3ok. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
