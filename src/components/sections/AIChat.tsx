'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useUserIdentifier } from '@/hooks/useUserIdentifier';
import Image from 'next/image';

// 아이콘 컴포넌트들
const SendIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="h-5 w-5">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const LoadingDots = () => (
    <div className="flex space-x-1 items-center">
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
    </div>
);

// [추가] 타임아웃 메시지 컴포넌트
const TimeoutMessage = ({ onRetry }: { onRetry: () => void }) => (
    <div className="flex flex-col items-center space-y-3 text-center">
        <div className="text-slate-500 text-sm">
            <p>응답이 지연되고 있습니다.</p>
            <p>다시 시도해주세요.</p>
        </div>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
            다시 요청하기
        </button>
    </div>
);

interface Message {
    text: string;
    isUser: boolean;
}

export default function AIChat() {
    const userId = useUserIdentifier();
    const [messages, setMessages] = useState<Message[]>([
        { text: "안녕하세요! 무엇이든 물어보세요.", isUser: false }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isResponding, setIsResponding] = useState(false);
    const [isTimeout, setIsTimeout] = useState(false); // [추가] 타임아웃 상태
    const [lastUserMessage, setLastUserMessage] = useState(''); // [추가] 마지막 사용자 메시지 저장
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const isFirstToken = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null); // [추가] 타임아웃 레퍼런스

    const socketUrl = 'wss://who-am-ai-57dj.onrender.com/ws/chat';
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    // [수정] 타임아웃 처리 추가
    useEffect(() => {
        if (lastMessage !== null) {
            // [추가] 응답이 왔으므로 타임아웃 클리어
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setIsTimeout(false);

            const token = lastMessage.data;

            if (isFirstToken.current) {
                isFirstToken.current = false;
                setIsResponding(false);
                setMessages(prev => [...prev, { text: token, isUser: false }]);
            } else {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;

                    if (lastIndex >= 0 && !newMessages[lastIndex].isUser) {
                        newMessages[lastIndex] = {
                            ...newMessages[lastIndex],
                            text: newMessages[lastIndex].text + token
                        };
                    } else {
                        newMessages.push({ text: token, isUser: false });
                    }

                    return newMessages;
                });
            }
        }
    }, [lastMessage]);

    // [추가] 타임아웃 처리 함수
    const handleTimeout = () => {
        console.log('5초 타임아웃 발생');
        setIsResponding(false);
        setIsTimeout(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    // [추가] 재시도 함수
    const handleRetry = () => {
        if (!userId || readyState !== ReadyState.OPEN) return;

        setIsTimeout(false);
        setIsResponding(true);
        isFirstToken.current = true;

        const messageToSend = {
            uuid: userId,
            type: "USER",
            content: lastUserMessage
        };

        sendMessage(JSON.stringify(messageToSend));

        // 새로운 타임아웃 설정
        timeoutRef.current = setTimeout(handleTimeout, 5000);
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: '연결 중...',
        [ReadyState.OPEN]: '유인재 AI',
        [ReadyState.CLOSING]: '연결 종료 중...',
        [ReadyState.CLOSED]: '연결 끊김',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isTimeout]); // [수정] isTimeout도 의존성에 추가

    // [추가] 컴포넌트 언마운트 시 타임아웃 클리어
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isResponding || readyState !== ReadyState.OPEN || !userId) return;

        const userMessage: Message = { text: inputValue, isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setLastUserMessage(inputValue); // [추가] 마지막 사용자 메시지 저장

        const messageToSend = {
            uuid: userId,
            type: "USER",
            content: inputValue
        };

        sendMessage(JSON.stringify(messageToSend));

        setIsResponding(true);
        setIsTimeout(false); // [추가] 타임아웃 상태 초기화
        isFirstToken.current = true;
        setInputValue('');

        // [추가] 5초 타임아웃 설정
        timeoutRef.current = setTimeout(handleTimeout, 5000);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 flex flex-col h-[36rem]">
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-center gap-2 bg-slate-100/60 rounded-t-2xl">
                <span role="img" aria-label="robot" className="text-xl"><Image src="/image/coffeecat.png" alt="AI-Profile" width={25} height={25} /></span>
                <h3 className="text-md font-semibold text-gray-800">{connectionStatus}</h3>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        {!msg.isUser && (
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ring-1 ring-slate-200 shrink-0 text-xl">
                                <span role="img" aria-label="robot"><Image src="/image/coffeecat.png" alt="AI-Profile" width={20} height={20} /></span>
                            </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-xl max-w-xs md:max-w-sm break-words shadow-md transition-all duration-300 hover:shadow-lg ${msg.isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}

                {/* [수정] 로딩 상태와 타임아웃 상태 분리 */}
                {isResponding && !isTimeout && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ring-1 ring-slate-200 shrink-0 text-xl">
                            <span role="img" aria-label="robot"><Image src="/image/coffeecat.png" alt="AI-Profile" width={20} height={20} /></span>
                        </div>
                        <div className="px-4 py-3 rounded-xl shadow-md bg-slate-100">
                            <LoadingDots />
                        </div>
                    </div>
                )}

                {/* [추가] 타임아웃 메시지 */}
                {isTimeout && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ring-1 ring-slate-200 shrink-0 text-xl">
                            <span role="img" aria-label="robot"><Image src="/image/coffeecat.png" alt="AI-Profile" width={20} height={20} /></span>
                        </div>
                        <div className="px-4 py-3 rounded-xl shadow-md bg-slate-100">
                            <TimeoutMessage onRetry={handleRetry} />
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 border-t border-gray-200/50 bg-white/50 rounded-b-2xl">
                <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="무엇이든 물어보세요."
                        className="flex-1 px-4 py-2.5 bg-slate-100/80 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    />
                    <button
                        type="submit"
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-400 shrink-0"
                        disabled={!inputValue.trim() || (isResponding && !isTimeout) || readyState !== ReadyState.OPEN}
                    >
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    )
}
