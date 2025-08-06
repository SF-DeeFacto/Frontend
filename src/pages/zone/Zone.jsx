import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import A01ModelViewer from '../../components/3d/A01ModelViewer';

const Zone = ({ zoneId }) => {
  const navigate = useNavigate();
  const params = useParams();
  const currentZoneId = zoneId || params.zoneId;

  const zoneName = `Zone ${currentZoneId?.toUpperCase() || 'Unknown'}`;
  const isA01 = currentZoneId?.toUpperCase() === 'A01';

  return (
    <div style={{ 
      display: 'flex',
      width: '870px',
      height: '496px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#f0f8ff',
      border: '2px solid #4a90e2',
      borderRadius: '8px',
      padding: '16px',
      position: 'relative'
    }}>
      {isA01 ? (
        <A01ModelViewer />
      ) : (
        <div className="w-full text-center">
          <h2 className="text-2xl font-bold text-blue-800">
            {zoneName} 도면을 넣거에용용
          </h2>
        </div>
      )} 

    </div>
  );
};

export default Zone; 