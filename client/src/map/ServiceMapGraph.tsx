import { useEffect } from 'react';
import Graph from 'graphology';
import { useLoadGraph } from '@react-sigma/core';

export function ServiceMapGraph() {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.addNode('first', {
      x: 0,
      y: 0,
      size: 15,
      label: 'My first node',
      color: '#FA4F40',
    });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
}

export default ServiceMapGraph;
