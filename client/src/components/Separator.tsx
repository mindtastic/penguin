/* eslint-disable react/jsx-props-no-spreading */
import { Flex, FlexProps } from '@chakra-ui/react';
import React from 'react';

function HSeparator(props: FlexProps) {
  return <Flex h="1px" w="100%" bg="rgba(135, 140, 189, 0.3)" {...props} />;
}

function VSeparator(props: FlexProps) {
  return <Flex w="1px" bg="rgba(135, 140, 189, 0.3)" {...props} />;
}

export { HSeparator, VSeparator };
