import { useEffect } from 'react';
import { useSigma, useLoadGraph } from '@react-sigma/core';
import { animateNodes } from 'sigma/utils/animate';
import { useLayoutNoverlap } from '@react-sigma/layout-noverlap';
// eslint-disable-next-line import/no-named-as-default
import buildGraphFromTraces from './graphBuilder';
import API from '../api';

export function ServiceMapGraph() {
  const sigma = useSigma();
  const { positions, assign } = useLayoutNoverlap();

  const loadGraph = useLoadGraph();

  useEffect(() => {
    const map = API.fetchServiceMap();

    const graph = buildGraphFromTraces(map);

    loadGraph(graph);
  }, [loadGraph]);

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  return null;
}

export default ServiceMapGraph;
