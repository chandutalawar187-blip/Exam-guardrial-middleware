import { useState, useEffect } from 'react';

export default function useDeviceType() {
  const [deviceType, setDeviceType] = useState('laptop');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setDeviceType('phone');
      else if (window.innerWidth < 1024) setDeviceType('tablet');
      else setDeviceType('laptop');
    };
    
    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}