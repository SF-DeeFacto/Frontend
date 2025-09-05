import React from 'react';
import { getStatusHexColor } from '../../utils/sensorUtils';
import { CONNECTION_STATE } from '../../config/sensorConfig';

const ConnectionIndicator = ({ connectionState }) => {
  const getConnectionColor = (state) => {
    switch (state) {
      case CONNECTION_STATE.CONNECTED:
        return getStatusHexColor('GREEN');
      case CONNECTION_STATE.CONNECTING:
        return getStatusHexColor('CONNECTING');
      case CONNECTION_STATE.ERROR:
        return getStatusHexColor('RED');
      default:
        return getStatusHexColor('DISCONNECTED');
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
