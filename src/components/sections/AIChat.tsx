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

// [추가] 연결 상태 아이콘 컴포넌트
const ConnectionStatusIcon = ({ readyState }: { readyState: ReadyState }) => {
    const statusInfo = {
        [ReadyState.CONNECTING]: { color: 'bg-yellow-500', animate: 'animate-pulse', title: '연결 중' },
        [ReadyState.OPEN]: { color: 'bg-green-500', animate: '', title: '연결됨' },
        [ReadyState.CLOSING]: { color: 'bg-yellow-500', animate: '', title: '연결 종료 중' },
        [ReadyState.CLOSED]: { color: 'bg-red-500', animate: '', title: '연결 끊김' },
        [ReadyState.UNINSTANTIATED]: { color: 'bg-gray-400', animate: '', title: '초기화 안됨' },
    }[readyState];

    if (!statusInfo) return null;

    return (
        <span
            title={statusInfo.title}
            className={`h-3 w-3 rounded-full ${statusInfo.color} ${statusInfo.animate} transition-colors`}
        />
    );
};

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
    const [isTimeout, setIsTimeout] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const isFirstToken = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const socketUrl = process.env.NEXT_PUBLIC_WHO_AM_AI_API + '/ws/chat';
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
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

    const handleTimeout = () => {
        console.log('5초 타임아웃 발생');
        setIsResponding(false);
        setIsTimeout(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

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
        timeoutRef.current = setTimeout(handleTimeout, 5000);
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: '연결 중...',
        [ReadyState.OPEN]: 'dd3ok',
        [ReadyState.CLOSING]: '연결 종료 중...',
        [ReadyState.CLOSED]: '연결 끊김',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    }, [messages, isTimeout]);

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
        setLastUserMessage(inputValue);

        const messageToSend = {
            uuid: userId,
            type: "USER",
            content: inputValue
        };

        sendMessage(JSON.stringify(messageToSend));

        setIsResponding(true);
        setIsTimeout(false);
        isFirstToken.current = true;
        setInputValue('');
        timeoutRef.current = setTimeout(handleTimeout, 5000);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 flex flex-col h-[36rem]">
            {/* [수정] 헤더 부분 */}
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-center gap-2 bg-primary-500 rounded-t-2xl">
                <ConnectionStatusIcon readyState={readyState} />
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