import React, { JSXElementConstructor, ReactNode } from 'react';

import { AttachmentIcon, AtSignIcon } from '@chakra-ui/icons';
import Annotations from './views/annotations';
// eslint-disable-next-line import/no-named-as-default
import ServiceMap from './map/servicemap';

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
    component: ServiceMap,
  },
];

export default routes;
