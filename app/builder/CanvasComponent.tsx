'use client';

import React from 'react';
import { Component } from './store';
import { muiComponents } from './components';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { DraggableData } from './Draggable'; // Import DraggableData

interface CanvasComponentProps {
  component: Component;
  onDropInto?: (parentId: string, droppedComponentData: DraggableData) => void;
  onSelect?: (componentId: string) => void;
  isSelected?: boolean; // For highlighting selected components
}

const CanvasComponent: React.FC<CanvasComponentProps> = ({ component, onDropInto, onSelect, isSelected }) => {
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

  // Visual styling based on layout type
  const getLayoutStyles = () => {
    if (!isLayoutComponent) return {};

    switch (component.layout) {
      case 'section':
        return { backgroundColor: 'rgba(0, 123, 255, 0.05)', border: '2px dashed #007bff' };
      case 'row':
        return { backgroundColor: 'rgba(40, 167, 69, 0.05)', border: '2px dashed #28a745' };
      case 'column':
        return { backgroundColor: 'rgba(255, 193, 7, 0.05)', border: '2px dashed #ffc107' };
      default:
        return {};
    }
  };

  // Combine component styles with layout styles
  const componentStyles = {
    width: component.width,
    height: component.height,
    margin: component.margin,
    padding: component.padding,
    backgroundColor: component.backgroundColor,
    color: component.color,
    fontSize: component.fontSize,
    fontWeight: component.fontWeight,
    borderRadius: component.borderRadius,
    border: component.border,
    boxShadow: component.boxShadow,
  };

  return (
    <Draggable id={component.id} data={{ type: component.type, initialProps: component.initialProps || {}, x: component.x, y: component.y }}> {/* Fix initialProps here */}
      <div
        onClick={() => onSelect && onSelect(component.id)} // Add click handler for selection
        style={{
          position: 'relative', // Always relative for proper layout flow
          margin: component.parentId ? '0' : '10px', // No margin for nested components
          padding: isLayoutComponent ? '20px' : '10px', // More padding for layout components
          borderRadius: '4px',
          boxShadow: isSelected ? '0 0 10px rgba(0, 123, 255, 0.3)' : 'none', // Add shadow for selected
          zIndex: isSelected ? 20 : 10, // Higher z-index for selected
          minHeight: isLayoutComponent ? '100px' : 'auto', // Ensure layout components have a minimum size
          width: '100%', // Full width for proper layout
          display: isLayoutComponent ? 'flex' : 'block', // Layout components use flex for children
          flexDirection: component.layout === 'column' ? 'column' : 'row', // Default to row for layout
          gap: isLayoutComponent ? '20px' : '10px', // Larger gap for layout components
          cursor: 'pointer', // Indicate clickable
          ...componentStyles, // Apply component-specific styles
          ...getLayoutStyles(), // Apply layout-specific styles (this will override component styles if needed)
        }}
      >
        {isLayoutComponent ? (
          <Droppable id={component.id} data={{ parentId: component.id, layoutType: component.layout }}> {/* Add data prop to Droppable */}
            <div style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: component.layout === 'column' ? 'column' : 'row',
              gap: '20px',
              minHeight: '80px',
              alignItems: 'stretch' // Ensure children stretch to fill
            }}>
              {renderChildren()}
              {component.children?.length === 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6c757d',
                  fontSize: '14px',
                  border: '2px dashed #dee2e6',
                  borderRadius: '4px',
                  flexGrow: 1,
                  minHeight: '60px'
                }}>
                  Drop components here
                </div>
              )}
            </div>
          </Droppable>
        ) : (
          <div style={{ width: '100%' }}>
            {renderedComponent}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default CanvasComponent;
