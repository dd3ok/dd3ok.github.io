import { useEffect } from 'react';

const CACHE_KEY = 'healthCheckLastCalled';
const CACHE_DURATION_MS = 120000; // 2분

const useHealthCheck = (): void => {
    useEffect(() => {
        const performHealthCheck = async (): Promise<void> => {
            console.log('Attempting health check...');

            try {
                const apiUrl = process.env.NEXT_PUBLIC_PAGES_KOYEB_API + '/api/healthcheck';
                const response = await fetch(apiUrl, {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error(`Health check failed with status: ${response.status}`);
                }

                localStorage.setItem(CACHE_KEY, Date.now().toString());
            } catch (error) {
                if (error instanceof Error) {
                    console.error('❌ Error during health check:', error.message);
                } else {
                    console.error('❌ An unknown error occurred during health check:', error);
                }
            }
        };

        try {
            // 1. 로컬 스토리지에서 마지막 호출 시간 가져오기
            const lastCalled = localStorage.getItem(CACHE_KEY);
            // 값이 없으면 0으로 처리하여 항상 API를 호출하도록 함
            const lastCalledTime = lastCalled ? parseInt(lastCalled, 10) : 0;
            const currentTime = Date.now();

            // 2. 현재 시간과 마지막 호출 시간의 차이가 3분을 초과하는지 확인
            if (currentTime - lastCalledTime > CACHE_DURATION_MS) {
                performHealthCheck();
            }
        } catch (e) {
            // 로컬 스토리지를 사용할 수 없는 환경(예: 시크릿 모드 일부 설정)을 위한 예외 처리
            performHealthCheck();
        }
    }, []);
};

export default useHealthCheck;
