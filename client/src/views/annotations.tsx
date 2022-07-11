import React, { useEffect, useState } from 'react';
import {
  Select, Box, Flex, SimpleGrid, Text, Th, TableContainer, Table, Thead, Tr, Td, Tbody,
} from '@chakra-ui/react';
import api from '../api';
import tilt from '../api/tilt';
import { emptyServiceMap, SpanAttributes } from '../map/types';
import { cloneDeep, snakeCase, startCase } from 'lodash';

export default function Annotations() {
  const [serviceMap, setServiceMap] = useState(emptyServiceMap);
  const [selectedPath, setSelectedPath] = useState('');

  const handleChange = (event:React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPath(event.target.value);
  };

  useEffect(() => {
    const map = api.fetchServiceMap();
    setServiceMap(map);
  }, []);

  const tableHeaders = tilt.properties.map((tiltPropName) => (
    <Th key={`annotations-th-${tiltPropName}`}>{startCase(tiltPropName)}</Th>
  ));

  const renderPath = serviceMap.Paths[selectedPath];
  const tableContentList = tilt.properties.map((tiltPropName) => {
    if (!renderPath) {
      return null;
    }
    const key = `tilt.${snakeCase(tiltPropName)}`;
    return Object.prototype.hasOwnProperty.call(renderPath.Attributes, key)
      ? renderPath.Attributes[key]
      : null;
  });
  console.log(tableContentList);

  const arrayListEmpty = (list: Array<any>) => list.filter((e) => e !== null).length === 0;

  const rows = [];
  const contentList = cloneDeep(tableContentList);
  while (!arrayListEmpty(contentList)) {
    const cells = tilt.properties.map((propName, idx) => {
      let text = '';
      if (contentList[idx] !== null) {
        text = contentList[idx]?.shift() || '';
        if (contentList[idx]?.length === 0) {
          contentList[idx] = null;
        }
      }
      return (<Td key={`tracells-${rows.length}-${propName}`}>{text}</Td>);
    });

    rows.push(<Tr key={`trarows-${rows.length}`}>{cells}</Tr>);
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* <SimpleGrid
        mb="20px"
        columns={{ sm: 1, md: 2 }}
        spacing={{ base: '20px', xl: '20px' }}
      > */}
      <Flex alignItems="center" justifyContent="center" direction="column">
        <Select
          onChange={handleChange}
          value={selectedPath}
          mb="50"
        >
          {Object.keys(serviceMap.Paths).concat(['']).map((option) => (
            <option value={option}>{option}</option>
          ))}
        </Select>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>{tableHeaders}</Tr>
            </Thead>
            <Tbody>
              {rows}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
      {/* </SimpleGrid> */}
    </Box>
  );
}
