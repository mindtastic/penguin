import React, { useRef } from 'react';
import { Box, useDimensions } from '@chakra-ui/react';
// eslint-disable-next-line import/no-named-as-default
import ServiceMap from '../map/servicemap';

export default function ServiceMapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  // const mapProps = {
  //   ...(dimensions && dimensions.paddingBox.height > 0 && { height: `${dimensions.paddingBox.height}px` }),
  //   ...(dimensions && { width: `${dimensions.paddingBox.width}px` }),
  // };

  return (
    <Box ref={containerRef} minH="100v" width="100%">
      <ServiceMap />
    </Box>
  );
}
