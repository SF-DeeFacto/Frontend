import React from 'react';

const Sensor = () => {
  const sensors = [
    { id: 1, name: 'Temperature Sensor 1', value: '23.5°C', status: 'active' },
    { id: 2, name: 'Humidity Sensor 1', value: '45%', status: 'active' },
    { id: 3, name: 'Pressure Sensor 1', value: '1013 hPa', status: 'warning' },
    { id: 4, name: 'Temperature Sensor 2', value: '24.1°C', status: 'active' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sensor Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sensors.map((sensor) => (
          <div key={sensor.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">{sensor.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                sensor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {sensor.status}
              </span>
            </div>
            <p className="text-2xl font-bold text-blue-600 mt-2">{sensor.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sensor; 