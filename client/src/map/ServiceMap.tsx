/* eslint-disable react/require-default-props */
import React from 'react';
import { ControlsContainer, SigmaContainer } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
// eslint-disable-next-line import/no-named-as-default
import { LayoutNoverlapControl } from '@react-sigma/layout-noverlap';
// eslint-disable-next-line import/no-named-as-default
import ServiceMapGraph from './ServiceMapGraph';

export interface ServiceMapProps {
  width?: string;
  height?: string;
}
const defaultProps: ServiceMapProps = { width: '500px', height: '500px' };

export function ServiceMap(props: ServiceMapProps) {
  const { width, height } = { ...defaultProps, ...props };
  console.log(width, height);

  return (
    <SigmaContainer style={{ width, height }}>
      <ServiceMapGraph />
      <ControlsContainer position="bottom-right">
        <LayoutNoverlapControl />
      </ControlsContainer>
    </SigmaContainer>
  );
}

export default ServiceMap;
