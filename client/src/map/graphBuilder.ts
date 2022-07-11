/* eslint-disable no-useless-return */
import { MultiDirectedGraph } from 'graphology';
import { snakeCase } from 'lodash';
import { ServiceMap } from './types';

export const buildGraphFromTraces = (serviceMap: ServiceMap) => {
  const graph = new MultiDirectedGraph();

  serviceMap.Nodes.forEach((n) => {
    graph.addNode(n.Name, {
      x: 0,
      y: 0,
      label: n.Name,
      size: 15,
    });
  });

  serviceMap.Edges.forEach((e, idx) => {
    graph.addEdgeWithKey(idx.toString(), e.To, e.From, { size: 3, label: idx.toString() });
  });

  return graph;
};

export default buildGraphFromTraces;
