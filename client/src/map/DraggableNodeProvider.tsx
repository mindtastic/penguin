import React from 'react';
import { useSigma } from '@react-sigma/core';

export default function DraggableNodeProvider() {
  const sigma = useSigma();
  const graph = sigma.getGraph();

  let draggedNode: string | null = null;
  let isDragging = false;
  // On mouse down on a node
  //  - we enable the drag mode
  //  - save in the dragged node in the state
  //  - highlight the node
  //  - disable the camera so its state is not updated
  sigma.on('downNode', (e) => {
    isDragging = true;
    draggedNode = e.node;
    graph.setNodeAttribute(draggedNode, 'highlighted', true);
  });

  sigma.getMouseCaptor().on('mousemovebody', (e) => {
    if (!isDragging || !draggedNode) return;

    // Get new position of node
    const pos = sigma.viewportToGraph(e);

    graph.setNodeAttribute(draggedNode, 'x', pos.x);
    graph.setNodeAttribute(draggedNode, 'y', pos.y);

    // Prevent sigma to move camera:
    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
  });

  sigma.getMouseCaptor().on('mouseup', () => {
    if (draggedNode) {
      graph.removeNodeAttribute(draggedNode, 'highlighted');
    }
    isDragging = false;
    draggedNode = null;
  });

  // Disable the autoscale at the first down interaction
  sigma.getMouseCaptor().on('mousedown', () => {
    if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
  });

  return null;
}
