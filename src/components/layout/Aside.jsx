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
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved ? JSON.parse(saved) : true;
  });
  const [zoneOpen, setZoneOpen] = useState(false);

  // 사이드바 토글 함수
  const toggleSidebar = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    localStorage.setItem('sidebar_collapsed', JSON.stringify(newCollapsed));
    if (!isCollapsed) setZoneOpen(false);
  };

  // 서브메뉴 아이템 렌더링 함수 - 모던 디자인 적용
  const renderSubMenuItem = (label, path, key) => (
    <div
      key={key}
      onClick={() => navigate(path)}
      className="text-secondary-600 dark:text-neutral-300 cursor-pointer hover:bg-primary-50 dark:hover:bg-neutral-700/50 hover:text-primary-600 px-4 py-2.5 rounded-xl ml-6 transition-all duration-200 group hover:scale-105"
    >
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-secondary-400 dark:bg-neutral-500 group-hover:bg-primary-500 transition-colors duration-200"></div>
        <Text variant="menu" size="sm" weight="medium">
          {label}
        </Text>
      </div>
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
          // auth.js의 logout 함수 사용 (일관성 확보)
          await logout();
          alert("로그아웃되었습니다.");
          navigate("/login");
        } catch (error) {
          console.error('로그아웃 중 오류 발생:', error);
          // 에러가 발생해도 로컬 스토리지는 이미 정리됨 (logout 함수에서 처리)
          alert("로그아웃되었습니다.");
          navigate("/login");
        }
      },
    },
  ];

  // 사이드바 스타일 - 브랜드 색상 더 강하게 적용
  const sidebarStyle = {
    background: 'linear-gradient(180deg, rgba(240, 240, 249, 0.95) 0%, rgba(229, 229, 242, 0.95) 100%)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(229, 229, 242, 0.8)',
    boxShadow: '2px 0 10px rgba(73, 79, 162, 0.15)',
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
        isCollapsed ? "w-[80px]" : "w-[290px]"
      } min-h-[calc(100vh-60px)] flex flex-col px-3.5 pt-5 transition-all duration-300 ease-in-out relative z-40 bg-gradient-to-b from-brand-light/95 to-brand-medium/95 dark:from-neutral-800/95 dark:to-neutral-700/95 backdrop-blur-lg border-r border-white/20 dark:border-neutral-700/30 shadow-soft`}
    >
      {/* 메뉴 네비게이션 */}
      <nav className="flex flex-col space-y-2 w-full items-center">
        {/* 토글 버튼을 메뉴와 함께 */}
        <div className="w-full">
          <div
            onClick={toggleSidebar}
            className="nav-item group relative overflow-hidden w-12 h-12 justify-center cursor-pointer"
            title={isCollapsed ? "사이드바 확장" : "사이드바 축소"}
          >
            {/* 호버 배경 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            
            <div className="relative z-10 flex items-center justify-center w-full">
              <div className="flex items-center justify-center transition-all duration-200 text-secondary-600 dark:text-neutral-300 group-hover:text-primary-600 w-6 h-6">
                {isCollapsed ? (
                  <Icon><FiChevronsRight size={20} /></Icon>
                ) : (
                  <Icon><FiChevronsLeft size={20} /></Icon>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 메인 메뉴 아이템들 */}
        {menuItems.map((item, index) => (
          <div key={index} className="w-full">
            <MenuItem
              icon={<Icon>{item.icon}</Icon>}
              label={item.label}
              onClick={item.onClick}
              collapsed={isCollapsed}
            />
            
            {/* Zone 서브메뉴 - 모든 Zone 표시 */}
            {item.label === "Zone" && !isCollapsed && (
              <div 
                className={`space-y-1 mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                  zoneOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                {getAllZoneItems().map(zone => 
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