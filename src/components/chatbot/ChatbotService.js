/**
 * 챗봇 서비스 유틸리티
 * 팝업 창으로 챗봇을 띄우는 기능을 담당
 */

/**
 * 챗봇 응답 생성 함수
 * @param {string} userMessage - 사용자 메시지
 * @returns {string} 챗봇 응답
 */
const getBotResponse = (userMessage) => {
  const lowerMessage = userMessage.toLowerCase();
  
  const responses = {
    greeting: ['안녕', 'hello', 'hi'],
    help: ['도움', 'help'],
    sensor: ['센서', 'sensor'],
    alarm: ['알람', 'alarm', '알림'],
    graph: ['그래프', 'graph', '차트', 'chart'],
  };

  if (responses.greeting.some(word => lowerMessage.includes(word))) {
    return '안녕하세요! 오늘도 좋은 하루 되세요! 😊';
  } 
  
  if (responses.help.some(word => lowerMessage.includes(word))) {
    return 'DeeFacto 시스템에 대해 궁금한 점이 있으시면 언제든 물어보세요. 센서 데이터, 알람, 그래프 등에 대해 도움을 드릴 수 있습니다.';
  } 
  
  if (responses.sensor.some(word => lowerMessage.includes(word))) {
    return '센서 페이지에서는 실시간 센서 데이터를 확인할 수 있습니다. 온도, 습도, 압력 등의 정보를 모니터링할 수 있어요.';
  } 
  
  if (responses.alarm.some(word => lowerMessage.includes(word))) {
    return '알람 페이지에서는 시스템 알림을 관리할 수 있습니다. 중요한 이벤트나 경고를 설정하고 확인할 수 있어요.';
  } 
  
  if (responses.graph.some(word => lowerMessage.includes(word))) {
    return '그래프 페이지에서는 데이터를 시각적으로 확인할 수 있습니다. 트렌드 분석과 패턴을 쉽게 파악할 수 있어요.';
  }
  
  return '죄송합니다. 질문을 이해하지 못했습니다. 다른 방식으로 질문해 주시거나 "도움"이라고 말씀해 주세요.';
};

/**
 * 챗봇 HTML 템플릿 생성
 * @returns {string} 챗봇 HTML 문자열
 */
const createChatbotHTML = () => {
  const currentTime = new Date().toLocaleTimeString();
  
  return `<!DOCTYPE html>
<html>
<head>
  <title>DeeFacto 챗봇</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .chat-message {
      animation: slideInUp 0.3s ease-out;
    }
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
</head>
<body>
  <div class="h-screen flex flex-col bg-gray-50">
    <div class="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
            <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 class="text-sm font-semibold text-gray-900">DeeFacto 챗봇</h1>
            <p class="text-xs text-gray-500">실시간 도움말</p>
          </div>
        </div>
        <button onclick="window.close()" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <div id="messages" class="flex-1 overflow-y-auto p-3 space-y-3">
      <div class="flex justify-start">
        <div class="bg-white text-gray-900 border border-gray-200 px-3 py-2 rounded-lg max-w-[280px] shadow-sm chat-message">
          <p class="text-xs">안녕하세요! DeeFacto 챗봇입니다. 무엇을 도와드릴까요?</p>
          <p class="text-xs mt-1 text-gray-400">${currentTime}</p>
        </div>
      </div>
    </div>

    <div class="bg-white border-t border-gray-200 p-3 shadow-lg">
      <div class="flex space-x-2">
        <input
          type="text"
          id="messageInput"
          placeholder="메시지를 입력하세요..."
          class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          onkeypress="if(event.key === 'Enter') sendMessage()"
          maxlength="500"
        />
        <button
          onclick="sendMessage()"
          id="sendButton"
          disabled
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
        >
          전송
        </button>
      </div>
    </div>
  </div>

  <script>
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    messageInput.addEventListener('input', function() {
      sendButton.disabled = !this.value.trim();
    });

    function sendMessage() {
      const message = messageInput.value.trim();
      if (!message) return;

      addMessage(message, 'user');
      messageInput.value = '';
      sendButton.disabled = true;

      showTypingIndicator();

      setTimeout(() => {
        hideTypingIndicator();
        const response = getBotResponse(message);
        addMessage(response, 'bot');
      }, 1000 + Math.random() * 500);
    }

    function showTypingIndicator() {
      const typingDiv = document.createElement('div');
      typingDiv.id = 'typing-indicator';
      typingDiv.className = 'flex justify-start';
      
      typingDiv.innerHTML = \`
        <div class="bg-gray-100 text-gray-500 px-3 py-2 rounded-lg max-w-[280px] chat-message">
          <div class="flex items-center space-x-1">
            <div class="flex space-x-1">
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
            <span class="text-xs ml-2">입력 중...</span>
          </div>
        </div>
      \`;
      
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function hideTypingIndicator() {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) {
        indicator.remove();
      }
    }

    function addMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = \`flex \${sender === 'user' ? 'justify-end' : 'justify-start'}\`;
      
      const messageBox = document.createElement('div');
      messageBox.className = \`max-w-[280px] px-3 py-2 rounded-lg chat-message \${
        sender === 'user' 
          ? 'bg-blue-600 text-white' 
          : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
      }\`;
      
      const messageText = document.createElement('p');
      messageText.className = 'text-xs whitespace-pre-line';
      messageText.textContent = text;
      
      const timeText = document.createElement('p');
      timeText.className = \`text-xs mt-1 \${sender === 'user' ? 'text-blue-100' : 'text-gray-400'}\`;
      timeText.textContent = new Date().toLocaleTimeString();
      
      messageBox.appendChild(messageText);
      messageBox.appendChild(timeText);
      messageDiv.appendChild(messageBox);
      messagesContainer.appendChild(messageDiv);
      
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getBotResponse(userMessage) {
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
        return '안녕하세요! 오늘도 좋은 하루 되세요! 😊';
      } else if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
        return 'DeeFacto 시스템에 대해 궁금한 점이 있으시면 언제든 물어보세요.\\n\\n• 센서 데이터 모니터링\\n• 알람 관리\\n• 그래프 분석\\n• 시스템 설정';
      } else if (lowerMessage.includes('센서') || lowerMessage.includes('sensor')) {
        return '센서 페이지에서는 실시간 센서 데이터를 확인할 수 있습니다.\\n\\n📊 온도, 습도, 압력 등의 정보를 모니터링할 수 있어요.';
      } else if (lowerMessage.includes('알람') || lowerMessage.includes('alarm') || lowerMessage.includes('알림')) {
        return '알람 페이지에서는 시스템 알림을 관리할 수 있습니다.\\n\\n🔔 중요한 이벤트나 경고를 설정하고 확인할 수 있어요.';
      } else if (lowerMessage.includes('그래프') || lowerMessage.includes('graph')) {
        return '그래프 페이지에서는 데이터를 시각적으로 확인할 수 있습니다.\\n\\n📈 트렌드 분석과 패턴을 쉽게 파악할 수 있어요.';
      } else {
        return '죄송합니다. 질문을 이해하지 못했습니다.\\n\\n다른 방식으로 질문해 주시거나 "도움"이라고 말씀해 주세요.';
      }
    }

    messageInput.focus();
  </script>
</body>
</html>`;
};

/**
 * 챗봇 팝업 창 열기
 * @param {Object} options - 팝업 옵션
 * @param {string} options.width - 창 너비 (기본값: '400')
 * @param {string} options.height - 창 높이 (기본값: '600')
 * @returns {boolean} 성공 여부
 */
export const openChatbot = (options = {}) => {
  const { width = '400', height = '600' } = options;
  
  console.log('챗봇 버튼 클릭됨');
  
  try {
    const chatBotHTML = createChatbotHTML();
    const chatBotWindow = window.open(
      '', 
      'DeeFactoChatBot', 
      `width=${width},height=${height},scrollbars=yes,resizable=yes,status=yes,location=no,toolbar=no,menubar=no`
    );
    
    if (chatBotWindow) {
      chatBotWindow.document.write(chatBotHTML);
      chatBotWindow.document.close();
      chatBotWindow.focus();
      console.log('챗봇 창이 성공적으로 열렸습니다');
      return true;
    } else {
      console.log('챗봇 창 열기 실패');
      alert('챗봇 창을 열 수 없습니다. 브라우저 설정에서 팝업 차단을 해제해주세요.');
      return false;
    }
  } catch (error) {
    console.error('챗봇 실행 중 오류:', error);
    alert('챗봇을 실행할 수 없습니다. 잠시 후 다시 시도해주세요.');
    return false;
  }
};

export default { openChatbot };