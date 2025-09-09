import React from 'react';
import { getStatusHexColor, CONNECTION_STATE, SENSOR_STATUS } from '../../config/sensorConfig';

const ConnectionIndicator = ({ connectionState }) => {
  const getConnectionColor = (state) => {
    switch (state) {
      case CONNECTION_STATE.CONNECTED:
        return getStatusHexColor(SENSOR_STATUS.GREEN);
      case CONNECTION_STATE.CONNECTING:
        return getStatusHexColor(SENSOR_STATUS.CONNECTING);
      case CONNECTION_STATE.ERROR:
        return getStatusHexColor(SENSOR_STATUS.RED);
      default:
        return getStatusHexColor(SENSOR_STATUS.DISCONNECTED);
    }
  };

  // return (
  //   <div 
  //     className="w-2 h-2 rounded-full"
  //     style={{ backgroundColor: getConnectionColor(connectionState) }}
  //     title={`연결 상태: ${connectionState}`}
  //   />
  // );
};

export default ConnectionIndicator;
