import React, { JSXElementConstructor, ReactNode } from 'react';

import { AttachmentIcon, AtSignIcon } from '@chakra-ui/icons';
import Annotations from './views/annotations';
import ServiceMapPage from './views/servicemap';

export interface PenguinRoute {
  name: string;
  path: string;
  icon: ReactNode;
  component: JSXElementConstructor<any>;
}

const routes: Array<PenguinRoute> = [
  {
    name: 'SpanAnnotations',
    path: '/annotations',
    icon: <AttachmentIcon />,
    component: Annotations,
  },
  {
    name: 'Service Map',
    path: '/services',
    icon: <AtSignIcon />,
    component: ServiceMapPage,
  },
];

export default routes;
