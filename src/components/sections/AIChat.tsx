'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useUserIdentifier } from '@/hooks/useUserIdentifier';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
            <p>서버 Sleep시 초기 로딩이 있습니다.</p>
            <p>잠시후 다시 시도해주세요.</p>
        </div>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
        >
            다시 요청하기
        </button>
    </div>
);

// 연결 상태 아이콘 컴포넌트
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
        { text: "안녕하세요! 인재 AI입니다.", isUser: false }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isResponding, setIsResponding] = useState(false);
    const [isTimeout, setIsTimeout] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const isFirstToken = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const socketUrl = process.env.NEXT_PUBLIC_WHO_AM_AI_WS + '/ws/chat';
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
        console.log('10초 타임아웃 발생');
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
        timeoutRef.current = setTimeout(handleTimeout, 10000);
    };

    const connectionStatus = {
        [ReadyState.CONNECTING]: '연결 중.. (Sleep 시 60초)',
        [ReadyState.OPEN]: '연결됨',
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
        timeoutRef.current = setTimeout(handleTimeout, 10000);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 flex flex-col h-[36rem]">
            {/* 헤더 부분 */}
            <div className="p-4 border-b border-gray-200/50 flex items-center justify-center gap-2 bg-primary-500 rounded-t-2xl">
                <ConnectionStatusIcon readyState={readyState} />
                <h3 className="text-md font-semibold text-gray-800">{connectionStatus}</h3>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-5 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        {!msg.isUser && (
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ring-1 ring-slate-200 shrink-0 text-xl">
                                <span role="img" aria-label="robot">
                                    <Image src="/image/coffeecat.png" alt="AI-Profile" width={20} height={20} />
                                </span>
                            </div>
                        )}
                        <div className={`px-4 py-2.5 rounded-xl max-w-xs md:max-w-sm break-words shadow-md transition-all duration-300 hover:shadow-lg ${msg.isUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                            {msg.isUser ? (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            ) : (
                                <div className="prose prose-sm prose-slate max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            // 코드 블록을 더 작은 크기로 조정
                                            pre: ({ children }) => (
                                                <pre className="!text-xs !p-2 !my-2 !bg-slate-800 !text-slate-100 !rounded-md overflow-x-auto">
                                                    {children}
                                                </pre>
                                            ),
                                            // 인라인 코드 스타일 조정 - 타입 오류 수정
                                            code: ({ node, className, children, ...props }: any) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                const isInline = !match;

                                                return isInline ? (
                                                    <code className="!text-xs !px-1 !py-0.5 !bg-slate-200 !text-slate-800 !rounded" {...props}>
                                                        {children}
                                                    </code>
                                                ) : (
                                                    <code className="!text-xs" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            // 제목 크기 조정
                                            h1: ({ children }) => <h1 className="!text-sm !font-bold !my-2">{children}</h1>,
                                            h2: ({ children }) => <h2 className="!text-sm !font-semibold !my-1">{children}</h2>,
                                            h3: ({ children }) => <h3 className="!text-xs !font-medium !my-1">{children}</h3>,
                                            // 단락 간격 조정
                                            p: ({ children }) => <p className="!text-sm !my-1 !leading-relaxed">{children}</p>,
                                            // 리스트 간격 조정
                                            ul: ({ children }) => <ul className="!text-sm !my-1 !pl-4">{children}</ul>,
                                            ol: ({ children }) => <ol className="!text-sm !my-1 !pl-4">{children}</ol>,
                                            li: ({ children }) => <li className="!my-0.5">{children}</li>,
                                            // 인용구 스타일 조정
                                            blockquote: ({ children }) => (
                                                <blockquote className="!text-sm !my-2 !pl-3 !border-l-2 !border-slate-300 !italic">
                                                    {children}
                                                </blockquote>
                                            ),
                                            // 테이블 스타일 조정
                                            table: ({ children }) => (
                                                <div className="!my-2 overflow-x-auto">
                                                    <table className="!text-xs !min-w-full">{children}</table>
                                                </div>
                                            ),
                                            // 링크 색상 조정
                                            a: ({ children, href }) => (
                                                <a href={href} className="!text-blue-600 hover:!text-blue-800 !underline" target="_blank" rel="noopener noreferrer">
                                                    {children}
                                                </a>
                                            ),
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isResponding && !isTimeout && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ring-1 ring-slate-200 shrink-0 text-xl">
                            <span role="img" aria-label="robot">
                                <Image src="/image/coffeecat.png" alt="AI-Profile" width={20} height={20} />
                            </span>
                        </div>
                        <div className="px-4 py-3 rounded-xl shadow-md bg-slate-100">
                            <LoadingDots />
                        </div>
                    </div>
                )}

                {isTimeout && (
                    <div className="flex items-end gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center ring-1 ring-slate-200 shrink-0 text-xl">
                            <span role="img" aria-label="robot">
                                <Image src="/image/coffeecat.png" alt="AI-Profile" width={20} height={20} />
                            </span>
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
