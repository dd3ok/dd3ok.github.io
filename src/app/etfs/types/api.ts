// /app/etfs/types/api.ts
export interface ApiResponse {
    response: {
        header: {
            resultCode: string;  // 00: 성공, 기타: 에러
            resultMsg: string;   // NORMAL SERVICE. 또는 에러 메시지
        };
        body: {
            numOfRows: number;      // 한 페이지 결과 수
            pageNo: number;         // 페이지 번호
            totalCount: number;     // 전체 결과 수
            items?: {
                item: ApiETFItem[] | ApiETFItem;
            };
        };
    };
}

export interface ApiETFItem {
    basDt: string;          // 기준일자 YYYYMMDD
    srtnCd: string;         // 단축코드 (6자리)
    isinCd: string;         // ISIN코드 (12자리)
    itmsNm: string;         // 종목명 (120자)
    clpr: string;           // 종가 (12자리)
    vs: string;             // 전일대비 (10자리)
    fltRt: string;          // 등락률 (11자리)
    nav: string;            // 순자산가치 NAV (21자리)
    mkp: string;            // 시가 (12자리)
    hipr: string;           // 고가 (12자리)
    lopr: string;           // 저가 (12자리)
    trqu: string;           // 거래량 (12자리)
    trPrc: string;          // 거래대금 (21자리)
    mrktTotAmt: string;     // 시가총액 (21자리)
    nPptTotAmt: string;     // 순자산총액 (21자리)
    stLstgCnt: string;      // 상장좌수 (15자리)
    bssIdxIdxNm: string;    // 기초지수명 (240자)
    bssIdxClpr: string;     // 기초지수종가 (12자리)
}

// API 에러 코드 열거형
export enum ApiErrorCode {
    SUCCESS = '00',
    APPLICATION_ERROR = '1',
    INVALID_REQUEST_PARAMETER = '10',
    NO_OPENAPI_SERVICE = '12',
    SERVICE_ACCESS_DENIED = '20',
    SERVICE_REQUEST_LIMIT_EXCEEDED = '22',
    UNREGISTERED_SERVICE_KEY = '30',
    EXPIRED_SERVICE_KEY = '31',
    UNREGISTERED_IP = '32',
    UNKNOWN_ERROR = '99'
}

export const ApiErrorMessages = {
    [ApiErrorCode.APPLICATION_ERROR]: '어플리케이션 에러',
    [ApiErrorCode.INVALID_REQUEST_PARAMETER]: '잘못된 요청 파라메터 에러',
    [ApiErrorCode.NO_OPENAPI_SERVICE]: '해당 오픈API서비스가 없거나 폐기됨',
    [ApiErrorCode.SERVICE_ACCESS_DENIED]: '서비스 접근거부',
    [ApiErrorCode.SERVICE_REQUEST_LIMIT_EXCEEDED]: '서비스 요청제한횟수 초과에러',
    [ApiErrorCode.UNREGISTERED_SERVICE_KEY]: '등록되지 않은 서비스키',
    [ApiErrorCode.EXPIRED_SERVICE_KEY]: '기한 만료된 서비스키',
    [ApiErrorCode.UNREGISTERED_IP]: '등록되지 않은 IP',
    [ApiErrorCode.UNKNOWN_ERROR]: '기타에러'
};
