import React from 'react';
import MobileRapidFlowUnified from './MobileRapidFlowUnified';

/**
 * Basic variant of MobileRapidFlow
 * Maintains backward compatibility with the original MobileRapidFlow.tsx
 */
const MobileRapidFlowBasic: React.FC = () => {
  return <MobileRapidFlowUnified variant="basic" />;
};

export default MobileRapidFlowBasic;