import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from '../hooks/usePermissions';
import Text from '../components/common/Text';

const Home = () => {
  const navigate = useNavigate();
  const { getAccessibleZones, getZoneDisplayName } = usePermissions();

  const accessibleZones = getAccessibleZones();

  return (
    <div>
      {/* 전체도면 섹션 */}
      <div className="flex w-full h-[500px] justify-center items-center gap-2 bg-blue-50 border-2 border-blue-400 rounded-lg p-4 relative mb-8">
        <div className="w-full text-center">
          <Text variant="title" size="2xl" weight="bold" color="blue-800">
            전체도면을 넣어주세용
          </Text>
        </div>
      </div>

      {/* Zone 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {accessibleZones.map((zoneId) => (
          <div 
            key={zoneId}
            onClick={() => navigate(`/zone/${zoneId}`)}
            className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <Text variant="title" size="lg" weight="semibold" color="gray-900">
                {getZoneDisplayName(zoneId)}
              </Text>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                활성
              </span>
            </div>
            <Text variant="body" size="sm" color="gray-600">
              온도: 23°C | 습도: 45%
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home; 