import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiLayers,
  FiBarChart2,
  FiFileText,
  FiMessageCircle,
  FiLogOut,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import MenuItem from "./MenuItem";
import Icon from '../common/Icon';
import Text from '../common/Text';
import { logout } from '../../services/api/auth';

const Aside = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) setZoneOpen(false);
  };

  // 서브메뉴 아이템 렌더링 함수
  const renderSubMenuItem = (label, path, key) => (
    <div
      key={key}
      onClick={() => navigate(path)}
      className="text-gray-600 cursor-pointer hover:bg-[#E9EDFB] px-6 py-2 rounded-md ml-8 transition-colors duration-200 pr-[75px]"
    >
      <Text variant="menu" size="sm" weight="medium" color="gray-600">
        {label}
      </Text>
    </div>
  );

  // 모든 Zone 서브메뉴 아이템들
  const getAllZoneItems = () => {
    return [
      { label: 'A01', path: '/home/zone/a01', zoneId: 'a01' },
      { label: 'A02', path: '/home/zone/a02', zoneId: 'a02' },
      { label: 'B01', path: '/home/zone/b01', zoneId: 'b01' },
      { label: 'B02', path: '/home/zone/b02', zoneId: 'b02' },
      { label: 'B03', path: '/home/zone/b03', zoneId: 'b03' },
      { label: 'B04', path: '/home/zone/b04', zoneId: 'b04' },
      { label: 'C01', path: '/home/zone/c01', zoneId: 'c01' },
      { label: 'C02', path: '/home/zone/c02', zoneId: 'c02' }
    ];
  };

  // 메뉴 아이템 데이터
  const menuItems = [
    {
      icon: <FiHome />,
      label: "Home",
      onClick: () => navigate("/home"),
    },
    {
      icon: <FiLayers />,
      label: "Zone",
      onClick: () => setZoneOpen(!zoneOpen),
      hasSubMenu: true,
    },
    {
      icon: <FiBarChart2 />,
      label: "Graph",
      onClick: () => navigate("/home/graph"),
    },
    {
      icon: <FiFileText />,
      label: "Report",
      onClick: () => navigate("/home/report"),
    },
    {
      icon: <FiMessageCircle />,
      label: "Chatbot",
      onClick: () => {
        console.log('챗봇 버튼 클릭됨');
        
        // 직접 HTML로 챗봇 창 만들기
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
                  return '안녕하세요! 오늘도 좋은 하루 되세요! ';
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

        const chatBotWindow = window.open('', 'ChatBot', 'width=400,height=600,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no');
        
        if (chatBotWindow) {
          chatBotWindow.document.write(chatBotHTML);
          chatBotWindow.document.close();
          chatBotWindow.focus();
          console.log('챗봇 창이 성공적으로 열렸습니다');
        } else {
          console.log('챗봇 창 열기 실패');
          alert('챗봇 창을 열 수 없습니다. 브라우저 설정에서 팝업 차단을 해제해주세요.');
        }
      },
    },

    {
      icon: <FiLogOut />,
      label: "Logout",
      onClick: async () => {
        try {
          const token = localStorage.getItem('token');
          
          // 실제 백엔드 API 호출 시도
          const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            // 실제 백엔드 응답 처리
            alert("로그아웃되었습니다.");
          } else {
            // 백엔드 API가 실패하면 로컬 로그아웃으로 처리
            console.log('백엔드 API 호출 실패, 로컬 로그아웃으로 처리');
            await logout();
            alert("로그아웃되었습니다.");
          }
          
          navigate("/login");
        } catch (error) {
          // 네트워크 오류 등으로 API 호출이 실패하면 로컬 로그아웃으로 처리
          console.log('API 호출 중 오류 발생, 로컬 로그아웃으로 처리:', error);
          await logout();
          alert("로그아웃되었습니다.");
          navigate("/login");
        }
      },
    },
  ];

  // 사이드바 스타일
  const sidebarStyle = {
    backgroundColor: '#F0F0F980',
    borderColor: '#F0F0F9',
    paddingTop: '20px'
  };

  // 토글 버튼 스타일
  const toggleButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    marginRight: '15px'
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-[70px]" : "w-[240px]"
      } h-[calc(100vh-64px)] shadow-sm flex flex-col items-center px-3 pt-5 transition-all duration-300 ease-in-out border-r`}
      style={sidebarStyle}
    >
      {/* 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        className="text-gray-500 hover:text-gray-700 transition-colors p-1 self-end mb-2"
        style={toggleButtonStyle}
      >
        {isCollapsed ? (
          <Icon><FiChevronsRight /></Icon>
        ) : (
          <Icon><FiChevronsLeft /></Icon>
        )}
      </button>
      
      {/* 메뉴 네비게이션 */}
      <nav className="flex flex-col space-y-[10px]">
        {/* 메인 메뉴 아이템들 */}
        {menuItems.map((item, index) => (
          <div key={index}>
            <MenuItem
              icon={<Icon>{item.icon}</Icon>}
              label={item.label}
              onClick={item.onClick}
              collapsed={isCollapsed}
            />
            
            {/* Zone 서브메뉴 - 모든 Zone 표시 */}
            {item.label === "Zone" && (
              <div className="space-y-1 mt-2" style={{ minHeight: zoneOpen ? '120px' : '0px', overflow: 'hidden', transition: 'min-height 0.3s ease-in-out' }}>
                {zoneOpen && getAllZoneItems().map(zone => 
                  renderSubMenuItem(zone.label, zone.path, zone.zoneId)
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Aside; 