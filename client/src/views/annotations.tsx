import React, { useEffect, useState } from 'react';
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import api from '../api';

export default function Annotations() {
  const [serviceMap, setServiceMap] = useState({ Edges: [], Nodes: [], Paths: {} });

  useEffect(() => {
    const map = api.fetchServiceMap();
    setServiceMap(map);
  });

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: '20px', xl: '20px' }}
      >
        <Flex />
      </SimpleGrid>
    </Box>
  );
}
