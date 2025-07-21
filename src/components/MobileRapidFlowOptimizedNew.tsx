import React from 'react';
import MobileRapidFlowUnified from './MobileRapidFlowUnified';

/**
 * Optimized variant of MobileRapidFlow
 * Maintains backward compatibility with MobileRapidFlowOptimized.tsx
 */
const MobileRapidFlowOptimizedNew: React.FC = () => {
  return <MobileRapidFlowUnified variant="optimized" />;
};

export default MobileRapidFlowOptimizedNew;