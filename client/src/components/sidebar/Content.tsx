import { Box, Flex, Stack } from '@chakra-ui/react';
import React from 'react';

import { PenguinRoute } from '../../routes';
// eslint-disable-next-line import/no-named-as-default
import SidebarBrand from './Brand';
// eslint-disable-next-line import/no-named-as-default
import SidebarLinks from './Links';

export interface SidebarContentProps {
  routes: Array<PenguinRoute>;
}

function SidebarContent(props: SidebarContentProps) {
  const { routes } = props;
  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <SidebarBrand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: '16px', '2xl': '1px' }}>
          <SidebarLinks routes={routes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
