import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Box,
  useDimensions,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  MenuItemOption,
} from '@chakra-ui/react';
import { startCase } from 'lodash';
// eslint-disable-next-line import/no-named-as-default
import ServiceMap from '../map/ServiceMap';
import { emptyServiceMap } from '../map/types';
import tilt from '../api/tilt';
import api from '../api';

export default function ServiceMapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useDimensions(containerRef);

  const [serviceMap, setServiceMap] = useState(emptyServiceMap);
  const [tiltProperties, setTiltProperties] = useState(['']);

  useEffect(() => {
    const map = api.fetchServiceMap();
    setServiceMap(map);
  });

  const mapProps = {
    ...(dimensions && dimensions.contentBox.height > 0 && { height: dimensions.contentBox.height }),
    ...(dimensions && dimensions.contentBox.width > 0 && { width: dimensions.contentBox.width }),
  };

  const buildOptionClickHandler = (p: string) => () => {
    setTiltProperties(
      tiltProperties.includes(p) ? tiltProperties.filter((e) => p !== e) : [p, ...tiltProperties],
    );
  };

  const transparencyOptions = tilt.properties.map((p) => ({ p, name: startCase(p) }))
    .map(({ p, name }) => (
      <MenuItemOption
        key={p}
        value={p}
        isChecked={tiltProperties.includes(p)}
        onClick={buildOptionClickHandler(p)}
      >
        {name}
      </MenuItemOption>
    ));

  return (
    <Box height="100vh" width="100%">
      <Box ref={containerRef} height="90%" width="100%" p={50}>
        <ServiceMap
          serviceMap={serviceMap}
          attributesToShow={tiltProperties}
          width={mapProps.width}
          height={mapProps.height}
        />
      </Box>
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} colorSchema="blue">
          Transparancy properties
        </MenuButton>
        <MenuList>
          <MenuGroup title="Transparency properties">
            {transparencyOptions}
          </MenuGroup>
        </MenuList>
      </Menu>
    </Box>
  );
}
