import React from 'react';
//테스트 임

const WarningLight = ({ position, isActive = false, targetPosition = null }) => {
  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* 경고 아이콘 */}
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: isActive ? '#ff4444' : '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isActive ? '0 0 20px #ff4444' : 'none',
        animation: isActive ? 'pulse 1s infinite' : 'none'
      }}>
        <span style={{
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold'
        }}>
          !
        </span>
      </div>
      
      {/* 연결선 */}
      {isActive && targetPosition && (
        <svg
          style={{
            position: 'absolute',
            top: '24px',
            left: '12px',
            width: '1px',
            height: `${targetPosition.y - position.y - 24}px`,
            zIndex: 999
          }}
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={targetPosition.y - position.y - 24}
            stroke="#ff4444"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
        </svg>
      )}
      
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default WarningLight; 