/* eslint-disable react/require-default-props */
import React, { useState } from 'react';
import { ControlsContainer, SigmaContainer } from '@react-sigma/core';
import '@react-sigma/core/lib/react-sigma.min.css';
// eslint-disable-next-line import/no-named-as-default
import { LayoutNoverlapControl } from '@react-sigma/layout-noverlap';
// eslint-disable-next-line import/no-named-as-default
import ServiceMapGraph from './ServiceMapGraph';
import { ServiceMap as ServiceMapType } from './types';
import { MultiDirectedGraph } from 'graphology';

export interface ServiceMapProps {
  serviceMap: ServiceMapType;
  attributesToShow?: string[];
  width?: number;
  height?: number;
}

const defaultProps = { width: 500, height: 500, attributesToShow: [] };

export function ServiceMap(props: ServiceMapProps) {
  const {
    serviceMap,
    width,
    height,
    attributesToShow,
  } = { ...defaultProps, ...props };
  const cssHeight = (height && height > 0) ? `${height}px` : `${defaultProps.height}px`;
  const cssWidth = (width && width > 0) ? `${width}px` : `${defaultProps.width}px`;

  return (
    <SigmaContainer
      style={{ height: cssHeight, width: cssWidth }}
      graph={MultiDirectedGraph}
      initialSettings={{
        allowInvalidContainer: true,
        enableEdgeHoverEvents: true,
        renderEdgeLabels: true,
      }}
    >
      <ServiceMapGraph
        serviceMap={serviceMap}
        attributesToShow={attributesToShow}
      />
      <ControlsContainer position="bottom-right">
        <LayoutNoverlapControl />
      </ControlsContainer>
    </SigmaContainer>
  );
}

export default ServiceMap;
