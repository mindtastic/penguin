import React, { useEffect, useState, useRef } from 'react';
import { Box, useDimensions } from '@chakra-ui/react';
import api from '../api';
// eslint-disable-next-line import/no-named-as-default
import ServiceMap from '../map/ServiceMap';
import { emptyServiceMap } from '../map/types';

export default function ServiceMapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  const [serviceMap, setServiceMap] = useState(emptyServiceMap);

  useEffect(() => {
    const map = api.fetchServiceMap();
    setServiceMap(map);
  });

  const mapProps = {
    ...(dimensions && dimensions.contentBox.height > 0 && { height: dimensions.contentBox.height }),
    ...(dimensions && dimensions.contentBox.width > 0 && { width: dimensions.contentBox.width }),
  };

  return (
    <Box ref={containerRef} minH="100vh" width="100%" p={50}>
      <ServiceMap serviceMap={serviceMap} width={mapProps.width} height={mapProps.height} />
    </Box>
  );
}
