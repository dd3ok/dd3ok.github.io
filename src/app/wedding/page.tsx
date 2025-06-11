'use client'

import { useRef } from 'react';
import Image from 'next/image';

export default function Invitation() {
    // 각 섹션으로 스크롤하기 위한 ref
    const galleryRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLDivElement>(null);

    // 공유하기 기능
    const shareKakao = () => {
        // 카카오 공유하기 구현
    };

    return (
        <main className="max-w-[500px] mx-auto bg-white min-h-screen">
            {/* 메인 이미지 섹션 */}
            <section className="h-screen relative">
                <Image
                    src="/images/main.jpg"
                    alt="메인 웨딩 이미지"
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <div className="absolute bottom-10 w-full text-center text-white">
                    <h1 className="text-2xl mb-4">신랑 홍길동 · 신부 김미인</h1>
                    <p>2024년 3월 1일 토요일 오후 2시</p>
                    <p>어딘가 웨딩홀</p>
                </div>
            </section>

            {/* 인사말 섹션 */}
            <section className="py-20 px-6 text-center bg-[#f8f8f8]">
                <h2 className="text-2xl mb-8">초대합니다</h2>
                <p className="leading-relaxed text-gray-700">
                    서로 다른 길을 걸어온 두 사람이<br/>
                    하나의 길을 걸어가고자 합니다.<br/>
                    소중한 분들을 모시고<br/>
                    저희의 첫 시작을 함께하고 싶습니다.<br/><br/>
                    바쁘시더라도 와주셔서<br/>
                    축복해 주시면 감사하겠습니다.
                </p>
                <div className="mt-10">
                    <p className="mb-4">신랑측 혼주</p>
                    <p>아버지 홍판서 · 어머니 김씨</p>
                    <p className="mt-8 mb-4">신부측 혼주</p>
                    <p>아버지 김판서 · 어머니 이씨</p>
                </div>
            </section>

            {/* 달력 섹션 */}
            <section className="py-16 px-6">
                <div className="bg-white rounded-lg p-4 shadow-lg">
                    <h2 className="text-xl mb-4 text-center">3월</h2>
                    {/* 달력 컴포넌트 구현 */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* 달력 날짜들 */}
                    </div>
                    <p className="text-center mt-6">
                        2024년 3월 1일 토요일 오후 2시
                    </p>
                </div>
            </section>

            {/* 갤러리 섹션 */}
            <section ref={galleryRef} className="py-16 px-6">
                <h2 className="text-2xl mb-8 text-center">갤러리</h2>
                <div className="grid grid-cols-2 gap-4">
                    {/* 사진들 매핑 */}
                    {[1,2,3,4].map((i) => (
                        <div key={i} className="aspect-square relative">
                            <Image
                                src={`/images/gallery/${i}.jpg`}
                                alt={`웨딩 사진 ${i}`}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* 오시는 길 섹션 */}
            <section ref={locationRef} className="py-16 px-6">
                <h2 className="text-2xl mb-8 text-center">오시는 길</h2>
                {/* 카카오맵 컴포넌트 */}
                <div className="h-[300px] bg-gray-200 mb-6">
                    {/* 카카오맵 구현 */}
                </div>
                <div className="space-y-4">
                    <p>📍 주소: 서울시 어딘가구 어딘가로 123</p>
                    <p>🚗 주차: 건물 내 2시간 무료</p>
                    <p>🚇 지하철: 1호선 어딘가역 3번출구</p>
                </div>
            </section>

            {/* 연락처 섹션 */}
            <section className="py-16 px-6 bg-[#f8f8f8]">
                <h2 className="text-2xl mb-8 text-center">연락하기</h2>
                <div className="space-y-6">
                    <div className="flex justify-around">
                        <div className="text-center">
                            <p className="font-bold mb-2">신랑에게 연락하기</p>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded">
                                전화하기
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="font-bold mb-2">신부에게 연락하기</p>
                            <button className="bg-pink-500 text-white px-4 py-2 rounded">
                                전화하기
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 공유하기 버튼 */}
            <div className="fixed bottom-4 right-4">
                <button
                    onClick={shareKakao}
                    className="bg-yellow-400 p-4 rounded-full shadow-lg"
                >
                    공유하기
                </button>
            </div>
        </main>
    );
}
