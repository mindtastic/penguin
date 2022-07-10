import { useEffect } from 'react';
import { useSigma, useLoadGraph } from '@react-sigma/core';
import { animateNodes } from 'sigma/utils/animate';
import { useLayoutNoverlap } from '@react-sigma/layout-noverlap';
// eslint-disable-next-line import/no-named-as-default
import buildGraphFromTraces from './graphBuilder';
import { ServiceMap } from './types';

type ServiceMapGraphProps = {
  serviceMap: ServiceMap
};

export function ServiceMapGraph(props: ServiceMapGraphProps) {
  const { serviceMap } = props;
  const sigma = useSigma();
  const { positions } = useLayoutNoverlap();

  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = buildGraphFromTraces(serviceMap);
    loadGraph(graph);
  }, [loadGraph]);

  useEffect(() => {
    animateNodes(sigma.getGraph(), positions(), { duration: 1000 });
  }, [positions, sigma]);

  return null;
}

export default ServiceMapGraph;
