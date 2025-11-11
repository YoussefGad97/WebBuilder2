'use client';

import React from 'react';
import { Component } from './store';
import { muiComponents } from './components';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { DraggableData } from './Draggable'; // Import DraggableData

interface CanvasComponentProps {
  component: Component;
  onDropInto?: (parentId: string, droppedComponentData: DraggableData) => void; // Use DraggableData
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ component, onDropInto }) => {
  const componentDefinition = muiComponents.find(
    (comp) => comp.type === component.type
  );

  if (!componentDefinition) {
    return <div key={component.id}>Unknown Component: {component.content}</div>;
  }

  const renderChildren = () => {
    if (component.children && component.children.length > 0) {
      return component.children.map((child) => (
        <CanvasComponent key={child.id} component={child} onDropInto={onDropInto} />
      ));
    }
    return null;
  };

  const renderedComponent = componentDefinition.render({
    ...(component.initialProps || {}), // Fix initialProps type error
    children: renderChildren() || component.content,
  });

  // If it's a layout component, it should also be a Droppable area for new components
  const isLayoutComponent = component.layout && component.layout !== 'content';

  return (
    <Draggable id={component.id} data={{ type: component.type, initialProps: component.initialProps || {}, x: component.x, y: component.y }}> {/* Fix initialProps here */}
      <div
        style={{
          position: component.parentId ? 'relative' : 'absolute', // Relative if nested, absolute if root
          left: component.x || 0,
          top: component.y || 0,
          margin: '10px',
          padding: '10px',
          border: isLayoutComponent ? '2px dashed blue' : '1px solid #ddd', // Visual cue for layout components
          borderRadius: '4px',
          backgroundColor: 'white',
          zIndex: 10,
          minHeight: isLayoutComponent ? '100px' : 'auto', // Ensure layout components have a minimum size
          minWidth: isLayoutComponent ? '100px' : 'auto',
          display: isLayoutComponent ? 'flex' : 'block', // Layout components use flex for children
          flexDirection: component.layout === 'column' ? 'column' : 'row', // Default to row for layout
          gap: '10px',
        }}
      >
        {isLayoutComponent ? (
          <Droppable id={component.id} data={{ parentId: component.id, layoutType: component.layout }}> {/* Add data prop to Droppable */}
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: component.layout === 'column' ? 'column' : 'row', gap: '10px' }}>
              {renderChildren()}
              {component.children?.length === 0 && <div>Drop components here</div>}
            </div>
          </Droppable>
        ) : (
          renderedComponent
        )}
      </div>
    </Draggable>
  );
};

export default CanvasComponent;
