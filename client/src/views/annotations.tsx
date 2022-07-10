import React, { useEffect, useState } from 'react';
import { Select, Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import api from '../api';
import { emptyServiceMap } from '../map/types';

export default function Annotations() {
  const [serviceMap, setServiceMap] = useState(emptyServiceMap);
  const [selectedPath, setSelectedPath] = useState("");

  const handleChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPath(event.target.value)
  };

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
        <Select
          onChange={handleChange}
          value={selectedPath}>
        {Object.keys(serviceMap.Paths).concat([""]).map((option) => (
              <option value={option}>{option}</option>
            ))}
        </Select>
        <Text>{selectedPath}</Text>
        <Flex />
      </SimpleGrid>
    </Box>
  );
}
