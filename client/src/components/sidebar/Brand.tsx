import React from 'react';

import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { HSeparator } from '../Separator';

export function SidebarBrand() {
  const color = useColorModeValue('navy.700', 'white');

  return (
    <Flex align="center" direction="column">
      <Text h="26px" w="175px" my="32px" fontSize="3xl" color={color}>🐧 Penguin</Text>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
