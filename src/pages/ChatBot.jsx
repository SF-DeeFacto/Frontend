import React, { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요! DeeFacto 챗봇입니다. 무엇을 도와드릴까요?', sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 챗봇 응답 시뮬레이션 넣어보자...
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('안녕') || lowerMessage.includes('hello')) {
      return '안녕하세요! 오늘도 좋은 하루 되세요! 😊';
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
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  // URL 파라미터로 새창 여부 확인
  const isNewWindow = new URLSearchParams(window.location.search).get('new') === 'true';

  // 새창에서 열린 경우 실제 챗봇 인터페이스 표시
  if (isNewWindow) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900">DeeFacto 챗봇</h1>
                <p className="text-xs text-gray-500">실시간 도움말</p>
              </div>
            </div>
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[280px] px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-xs">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 border border-gray-200 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 영역 */}
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 메인 페이지에서는 간단한 안내 메시지 표시
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            챗봇
          </h2>
          <p className="text-gray-600">
            사이드바의 챗봇 메뉴를 클릭하여 대화를 시작하세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot; 