import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const zones = [
    { 
      id: 'a', 
      name: 'Zone A',
    },
  ];

  return (
    <div>
      {/* 전체도면 섹션 */}
      <div style={{ 
        display: 'flex',
        width: 'full',
        height: '500px',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: '#f0f8ff',
        border: '2px solid #4a90e2',
        borderRadius: '8px',
        padding: '16px',
        position: 'relative',
        marginBottom: '32px'
      }}>
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold text-blue-800">전체도면을 넣어주세용</h2>
        </div>
      </div>

      {/* Zone 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {zones.map((zone) => (
          <div 
            key={zone.id}
            onClick={() => navigate(`/zone/${zone.id}`)}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{zone.name}</h3>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                {zone.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 