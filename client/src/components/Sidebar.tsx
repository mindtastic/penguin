import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import React, { useRef } from 'react';
import { PenguinRoute } from '../routes';
import SidebarContent from './sidebar/Content';

type SidebarProps = {
  routes: Array<PenguinRoute>;
};

export default function Sidebar(props: SidebarProps) {
  const { routes } = props;

  const variantChange = '0.2s linear';
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );

  // Chakra background colors
  const sidebarBg = useColorModeValue('white', 'navy.800');

  return (
    <Box display={{ sm: 'none', xl: 'block' }} position="fixed" minH="100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        m="0px"
        minH="100%"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <SidebarContent routes={routes} />
      </Box>
    </Box>
  );
}

export function SidebarResponse(props: SidebarProps) {
  const sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  const menuColor = useColorModeValue('gray.400', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLInputElement>(null);

  const { routes } = props;

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <HamburgerIcon
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            onClick={onClose}
            _focus={{ boxShadow: 'none' }}
            _hover={{ boxShadow: 'none' }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <SidebarContent routes={routes} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
