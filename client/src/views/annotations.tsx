import React from 'react';
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';

export default function Annotations() {
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
