'use client'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-bold mb-4">dd3ok</h3>
                        <p className="text-gray-400 leading-relaxed max-w-md">
                            확장 가능한 시스템과 효율적인 서비스를 구축하는 개발자입니다.
                        </p>
                    </div>

                    <div>
                        {/*<h4 className="font-semibold mb-4">빠른 링크</h4>*/}
                        {/*<ul className="space-y-2 text-gray-400">*/}
                        {/*    <li><a href="#about" className="hover:text-white transition-colors">About</a></li>*/}
                        {/*    <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>*/}
                        {/*    <li><a href="#experience" className="hover:text-white transition-colors">Experience</a></li>*/}
                        {/*    <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>*/}
                        {/*</ul>*/}
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">연결</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="https://github.com/dd3ok" className="hover:text-white transition-colors">GitHub</a></li>
                            <li><a href="mailto:hwick@kakao.com" className="hover:text-white transition-colors">Email</a></li>
                            <li><a href="https://linkedin.com/in/dd3ok" className="hover:text-white transition-colors">LinkedIn</a></li>
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
