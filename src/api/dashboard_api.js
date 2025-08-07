// 대시보드는 SSE 통신으로 한번 통신을 연결하면 연결 상태를 계속 유지하고 Back에서 데이터를 전송하는 방식으로 동작합니다.
// 따라서 기존의 axios 방식으로 통신할 수 없어 우선 만들어둔 dashboard_api 파일에 SSE 연결 방법을 작성합니다.

// url 변수가 동일하므로 둘 중 하나는 주석처리하여 사용
// 사용시 url = SSE_URLS.zone('zone_A01') 이런 식으로 사용

// (개발용) gateway 미사용시 연결 url
export const SSE_URLS = {
  main: "http://localhost:8083/home/status",
  zone: (zoneId) => `http://localhost:8083/home/zone?zoneId=${zoneId}`,
};

// (운영용) gateway 사용시 연결 url
// export const SSE_URLS = {
//   main: "http://localhost:8080/home/status",
//   zone: (zoneId) => `http://localhost:8080/home/zone?zoneId=${zoneId}`,
// };

// SSE 연결 방식을 main, zone 두 곳에서 사용하여 함수화
export const connectSSE = (url, { onMessage, onError }) => {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage && onMessage(data);
    } catch (error) {
      console.error("SSE 데이터 파싱 오류:", error);
    }
  };

  eventSource.onerror = (error) => {
    console.error("SSE 오류:", error);
    onError && onError(error);
  };

  return eventSource;
};
