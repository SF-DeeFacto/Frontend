// A01존 센서 더미데이터 (실제 백엔드 형식에 맞춤)
export const a01ZoneData = [
  {
    "timestamp": new Date().toISOString(),
    "sensors": [
      // 온도센서 2개
      {
        "sensorId": "A01_TEMP_01",
        "sensorType": "temperature",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (23 + Math.random() * 5).toFixed(2) // 23-28°C
        }
      },
      {
        "sensorId": "A01_TEMP_02",
        "sensorType": "temperature",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (23 + Math.random() * 5).toFixed(2) // 23-28°C
        }
      },
      
      // 습도센서 2개
      {
        "sensorId": "A01_HUMI_01",
        "sensorType": "humidity",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (40 + Math.random() * 20).toFixed(1) // 40-60%
        }
      },
      {
        "sensorId": "A01_HUMI_02",
        "sensorType": "humidity",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (40 + Math.random() * 20).toFixed(1) // 40-60%
        }
      },
      
      // 정전기센서 4개
      {
        "sensorId": "A01_ESD_01",
        "sensorType": "esd",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (10 + Math.random() * 20).toFixed(1) // 10-30V
        }
      },
      {
        "sensorId": "A01_ESD_02",
        "sensorType": "esd",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (10 + Math.random() * 20).toFixed(1) // 10-30V
        }
      },
      {
        "sensorId": "A01_ESD_03",
        "sensorType": "esd",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (10 + Math.random() * 20).toFixed(1) // 10-30V
        }
      },
      {
        "sensorId": "A01_ESD_04",
        "sensorType": "esd",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (10 + Math.random() * 20).toFixed(1) // 10-30V
        }
      },
      
      // 먼지센서 2개
      {
        "sensorId": "A01_LPM_01",
        "sensorType": "particle",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "0.1": (10 + Math.random() * 10).toFixed(1), // 10-20 μg/m³
          "0.3": (5 + Math.random() * 8).toFixed(1),   // 5-13 μg/m³
          "0.5": (3 + Math.random() * 5).toFixed(1)    // 3-8 μg/m³
        }
      },
      {
        "sensorId": "A01_LPM_02",
        "sensorType": "particle",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "0.1": (10 + Math.random() * 10).toFixed(1), // 10-20 μg/m³
          "0.3": (5 + Math.random() * 8).toFixed(1),   // 5-13 μg/m³
          "0.5": (3 + Math.random() * 5).toFixed(1)    // 3-8 μg/m³
        }
      },
      
      // 풍향센서 2개
      {
        "sensorId": "A01_WD_01",
        "sensorType": "windDir",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (Math.random() * 360).toFixed(1) // 0-360°
        }
      },
      {
        "sensorId": "A01_WD_02",
        "sensorType": "windDir",
        "sensorStatus": "GREEN",
        "timestamp": new Date().toISOString(),
        "values": {
          "value": (Math.random() * 360).toFixed(1) // 0-360°
        }
      }
    ]
  }
];

// 실시간 데이터 업데이트를 위한 함수
export const getUpdatedA01Data = () => {
  return [
    {
      "timestamp": new Date().toISOString(),
      "sensors": a01ZoneData[0].sensors.map(sensor => ({
        ...sensor,
        timestamp: new Date().toISOString(),
        values: sensor.sensorType === 'particle' ? {
          "0.1": (10 + Math.random() * 10).toFixed(1),
          "0.3": (5 + Math.random() * 8).toFixed(1),
          "0.5": (3 + Math.random() * 5).toFixed(1)
        } : {
          "value": sensor.sensorType === 'temperature' ? 
            (23 + Math.random() * 5).toFixed(2) :
            sensor.sensorType === 'humidity' ? 
            (40 + Math.random() * 20).toFixed(1) :
            sensor.sensorType === 'esd' ? 
            (10 + Math.random() * 20).toFixed(1) :
            (Math.random() * 360).toFixed(1)
        }
      }))
    }
  ];
};
