import { useEffect } from 'react';
import { useSigma, useLoadGraph } from '@react-sigma/core';
import { animateNodes } from 'sigma/utils/animate';
import { useLayoutNoverlap } from '@react-sigma/layout-noverlap';
// eslint-disable-next-line import/no-named-as-default
import { has, snakeCase, startCase } from 'lodash';
// eslint-disable-next-line import/no-named-as-default
import buildGraphFromTraces from './graphBuilder';
import { ServiceMap } from './types';
import tilt from '../api/tilt';

type ServiceMapGraphProps = {
  serviceMap: ServiceMap;
  attributesToShow: string[];
};

export function ServiceMapGraph(props: ServiceMapGraphProps) {
  const { serviceMap, attributesToShow } = props;
  const sigma = useSigma();
  const { positions } = useLayoutNoverlap();

  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = buildGraphFromTraces(serviceMap);

    loadGraph(graph);
  }, [loadGraph]);

  // const label = edgeAttributes.map((attribute) => e.Attributes[`tilt.${snakeCase(attribute)}`])
  //   .filter((attr) => attr !== undefined)
  //   .join('\n');
  useEffect(() => {
    const graph = sigma.getGraph();

    const attributeKeys = attributesToShow.reduce((obj, attr) => ({
      [`tilt.${snakeCase(attr)}`]: attr,
      ...obj,
    }), {});
    const attributesList = Object.keys(attributeKeys);
    const updateDict = sigma.getGraph().edges()
      .map((id) => parseInt(id, 10))
      .map(((edgeId) => serviceMap.Edges[edgeId].Attributes))
      .map((attributes, idx) => ({
        id: idx,
        arr: Object.entries(attributes).filter(([key]) => attributesList.includes(key)),
      }))
      .filter((o) => o.arr.length > 0)
      .reduce((obj, res) => {
        const edge = res.id.toString();
        const label = res.arr.map((a) => `${startCase(attributeKeys[a[0]])}: ${a[1].join(',\n')}`).join('\n');
        return {
          ...obj,
          [edge]: label,
        };
      }, {});

    console.log(updateDict);
    graph.updateEachEdgeAttributes((edgeToUpdate, attr) => ({
      ...attr,
      label: (has(updateDict, edgeToUpdate)) ? updateDict[edgeToUpdate] : '',
    }));
    // .forEach((res) => {
    //   const edge = res.id.toString();
    //   const label = res.arr.map((a) => `${startCase(attributeKeys[a[0]])}:
    //                  ${a[1].join(',\n')}`).join('\n');
    //   console.log(edge, label);
    //   graph.updateEachEdgeAttributes((edgeToUpdate, attr) => ({
    //     ...attr,
    //     label,
    //   }));
    // });
  }, [attributesToShow]);

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  return null;
}

export default ServiceMapGraph;
