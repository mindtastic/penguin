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
import Graph from 'graphology';

type ServiceMapGraphProps = {
  serviceMap: ServiceMap;
  attributesToShow: string[];
  highlightPath: string;
};

export function ServiceMapGraph(props: ServiceMapGraphProps) {
  const { serviceMap, attributesToShow, highlightPath } = props;
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
  }, [attributesToShow]);

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  useEffect(() => {
    console.log(highlightPath);
    if (highlightPath === '') {
      
      return;
    }

    const path = serviceMap.Paths[highlightPath];
    const graph = sigma.getGraph();
    const edgesInPath = graph.edges()
      .map((e) => parseInt(e, 10))
      .map((edgeId) => {
        const edge = serviceMap.Edges[edgeId];
        const edgeInPath = path.Edges.filter((ex) => ex.To === edge.To && ex.From === edge.From);
        if (edgeInPath.length > 0) {
          return edgeId.toString();
        }

        return null;
      })
      .filter((e) => e);
    graph.updateEachEdgeAttributes((edgeToUpdate, { color, ...attr }) => {
      console.log(edgesInPath);
      let obj = { ...attr };
      if (edgesInPath.includes(edgeToUpdate)) {
        obj.color = { color: 'black' };
      } 
      return obj;
    });

  }, [highlightPath]);

  return null;
}

export default ServiceMapGraph;
