import React from 'react';
import { SigmaContainer } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
import ServiceMapGraph from './ServiceMapGraph';

export function ServiceMap() {
  return (
    <SigmaContainer style={{ height: '500px', width: '500px' }}>
      <ServiceMapGraph />
    </SigmaContainer>
  );
}

export default ServiceMap;
