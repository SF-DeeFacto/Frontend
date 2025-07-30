import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const zones = [
    { id: 'a', name: 'Zone A'},
  ];

  return (
    <>
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
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Temperature</span>
                <span className="text-sm font-medium text-blue-600">{zone.temp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Humidity</span>
                <span className="text-sm font-medium text-green-600">{zone.humidity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home; 