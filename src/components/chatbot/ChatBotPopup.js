// src/components/chatbot/ChatBotPopup.js

export const createChatBotPopup = () => {
  const chatBotHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>DeeFacto 챗봇</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div class="h-screen flex flex-col bg-gray-50">
        <!-- 헤더 -->
        <div class="bg-white border-b border-gray-200 px-4 py-3">
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
            <button onclick="window.close()" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- 메시지 영역 -->
        <div id="messages" class="flex-1 overflow-y-auto p-3 space-y-3">
          <div class="flex justify-start">
            <div class="bg-white text-gray-900 border border-gray-200 px-3 py-2 rounded-lg max-w-[280px]">
              <p class="text-xs">안녕하세요! DeeFacto 챗봇입니다. 무엇을 도와드릴까요?</p>
              <p class="text-xs mt-1 text-gray-400">${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>

        <!-- 입력 영역 -->
        <div class="bg-white border-t border-gray-200 p-3">
          <div class="flex space-x-2">
            <input
              type="text"
              id="messageInput"
              placeholder="메시지를 입력하세요..."
              class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onkeypress="if(event.key === 'Enter') sendMessage()"
            />
            <button
              onclick="sendMessage()"
              id="sendButton"
              disabled
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
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

          // 사용자 메시지 추가
          addMessage(message, 'user');
          messageInput.value = '';
          sendButton.disabled = true;

          // 챗봇 응답 시뮬레이션
          setTimeout(() => {
            const response = getBotResponse(message);
            addMessage(response, 'bot');
          }, 1000);
        }

        function addMessage(text, sender) {
          const messageDiv = document.createElement('div');
          messageDiv.className = \`flex \${sender === 'user' ? 'justify-end' : 'justify-start'}\`;
          
          const messageBox = document.createElement('div');
          messageBox.className = \`max-w-[280px] px-3 py-2 rounded-lg \${sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}\`;
          
          const messageText = document.createElement('p');
          messageText.className = 'text-xs';
          messageText.textContent = text;
          
          const timeText = document.createElement('p');
          timeText.className = \`text-xs mt-1 \${sender === 'user' ? 'text-blue-100' : 'text-gray-400'}\`;
          timeText.textContent = new Date().toLocaleTimeString();
          
          messageBox.appendChild(messageText);
          messageBox.appendChild(timeText);
          messageDiv.appendChild(messageBox);
          messagesContainer.appendChild(messageDiv);
          
          // 스크롤을 맨 아래로
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function getBotResponse(userMessage) {
          const lowerMessage = userMessage.toLowerCase();
          
          if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
            return '안녕하세요! 오늘도 좋은 하루 되세요!';
          } else if (lowerMessage.includes('도움') || lowerMessage.includes('help')) {
            return 'DeeFacto 시스템에 대해 궁금한 점이 있으시면 언제든 물어보세요. 센서 데이터, 알람, 그래프 등에 대해 도움을 드릴 수 있습니다.';
          } else if (lowerMessage.includes('센서') || lowerMessage.includes('sensor')) {
            return '센서 페이지에서는 실시간 센서 데이터를 확인할 수 있습니다. 온도, 습도, 압력 등의 정보를 모니터링할 수 있어요.';
          } else if (lowerMessage.includes('알람') || lowerMessage.includes('alarm')) {
            return '알람 페이지에서는 시스템 알림을 관리할 수 있습니다. 중요한 이벤트나 경고를 설정하고 확인할 수 있어요.';
          } else if (lowerMessage.includes('그래프') || lowerMessage.includes('graph')) {
            return '그래프 페이지에서는 데이터를 시각적으로 확인할 수 있습니다. 트렌드 분석과 패턴을 쉽게 파악할 수 있어요.';
          } else {
            return '죄송합니다. 질문을 이해하지 못했습니다. 다른 방식으로 질문해 주시거나 "도움"이라고 말씀해 주세요.';
          }
        }
      </script>
    </body>
    </html>
  `;

  return chatBotHTML;
};

export const openChatBotPopup = () => {
  const chatBotHTML = createChatBotPopup();
  const chatBotWindow = window.open('', 'ChatBot', 'width=400,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no');
  
  if (chatBotWindow) {
    chatBotWindow.document.write(chatBotHTML);
    chatBotWindow.document.close();
    chatBotWindow.focus();
  } else {
    alert('챗봇 창을 열 수 없습니다. 브라우저 설정에서 팝업 차단을 해제해주세요.');
  }
};
