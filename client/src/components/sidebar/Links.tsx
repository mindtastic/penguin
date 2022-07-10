import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import { PenguinRoute } from '../../routes';

export interface SidebarLinksProps {
  routes: Array<PenguinRoute>;
}

export function SidebarLinks(props: SidebarLinksProps) {
  const location = useLocation();

  const activeColor = useColorModeValue('gray.700', 'white');
  const activeIcon = useColorModeValue('brand.500', 'white');
  const textColor = useColorModeValue('secondaryGray.500', 'white');
  const brandColor = useColorModeValue('brand.500', 'brand.400');

  const { routes } = props;
  const isActiveRoute = (routeName: string) => location.pathname.includes(routeName);

  const links = routes.map((route) => {
    const isActive = isActiveRoute(route.path.toLowerCase());
    return (
      <NavLink key={route.name} to={route.path}>
        <Box>
          <HStack
            spacing={isActive ? '22px' : '26px'}
            py="5x"
            ps="10px"
          >
            <Flex w="100%" alignItems="center" justifyContent="center">
              <Box
                color={isActive ? activeIcon : textColor}
                me="18px"
              >
                {route.icon}
              </Box>
              <Text
                me="auto"
                color={isActive ? activeColor : textColor}
                fontWeight={isActive ? 'bold' : 'normal'}
              >
                {route.name}
              </Text>
            </Flex>
            <Box h="36px" w="4px" bg={isActive ? brandColor : 'transparent'} borderRadius="5px" />
          </HStack>
        </Box>
      </NavLink>
    );
  });

  return (
    <>
      <Text>Navigation</Text>
      { links }
    </>
  );
}

export default SidebarLinks;
