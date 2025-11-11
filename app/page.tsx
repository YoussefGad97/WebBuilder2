'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable, Active } from '@dnd-kit/core'; // Keep DndContext for on-canvas drag, remove DragOverlay for now
import { useBuilderStore } from './builder/store';
import { Draggable } from './builder/Draggable'; // Will be repurposed or removed for sidebar
import { Droppable } from './builder/Droppable'; // Will be used for canvas
import styles from './builder/Builder.module.scss';
import classNames from 'classnames';
import { muiComponents, AvailableComponent } from './builder/components'; // Import components
import { DraggableData } from './builder/Draggable'; // Import DraggableData
import { Component } from './builder/store'; // Import Component interface
import { generateUniqueId } from './utils/idGenerator'; // Import ID generator

export default function Home() {
  const layoutTree = useBuilderStore((state) => state.layoutTree);
  const setLayoutTree = useBuilderStore((state) => state.setLayoutTree);
  const [viewMode, setViewMode] = useState<'page' | 'code'>('page');
  // Removed activeId state and handleDragStart/handleDragEnd for click-to-add

  const addComponentToCanvas = (componentData: DraggableData) => {
    const componentDefinition = muiComponents.find(
      (comp) => comp.type === componentData.type
    );

    if (componentDefinition) {
      const newComponentId = generateUniqueId(componentData.type); // Use utility function
      setLayoutTree({
        ...layoutTree,
        [newComponentId]: {
          id: newComponentId, // Set the ID here
          type: componentData.type,
          content: componentDefinition.name,
          initialProps: componentData.initialProps,
          layout: 'content', // Default to content layout for MUI components
        },
      });
    }
  };

  const handleCanvasDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;

    setLayoutTree((prevLayoutTree: Record<string, Component>) => { // Explicitly type prevLayoutTree
      const draggedComponent = prevLayoutTree[active.id];
      if (draggedComponent) {
        const newX = (draggedComponent.x || 0) + delta.x;
        const newY = (draggedComponent.y || 0) + delta.y;

        return {
          ...prevLayoutTree,
          [active.id]: {
            ...draggedComponent,
            x: newX,
            y: newY,
          },
        };
      }
      return prevLayoutTree;
    });
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.viewToggleContainer}>
        <button
          onClick={() => setViewMode('page')}
          className={classNames(styles.viewToggleButton, { [styles.active]: viewMode === 'page' })}
        >
          Page View
        </button>
        <button
          onClick={() => setViewMode('code')}
          className={classNames(styles.viewToggleButton, { [styles.active]: viewMode === 'code' })}
        >
          Code View
        </button>
      </div>

      {viewMode === 'page' ? (
        <div className={styles.builderLayout}>
          <div className={styles.componentsSidebar}>
            <h2>Components</h2>
            {Object.entries(
              muiComponents.reduce((acc, component) => {
                (acc[component.category] = acc[component.category] || []).push(component);
                return acc;
              }, {} as Record<string, AvailableComponent[]>)
            ).map(([category, components]) => (
              <details key={category} open className={styles.componentCategory}>
                <summary className={styles.componentCategorySummary}>{category}</summary>
                <div className={styles.componentList}>
                  {components.map((component) => (
                    <div
                      key={component.id}
                      className={styles.clickableComponent} // New class for clickable components
                      onClick={() => addComponentToCanvas({ type: component.type, initialProps: component.initialProps })}
                    >
                      {component.name}
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <DndContext onDragEnd={handleCanvasDragEnd}> {/* DndContext now only for on-canvas drag */}
            <div className={styles.canvasContainer}>
              <h1 className={styles.builderTitle}>Builder Page</h1>
              <Droppable id="canvas">
                <div className={styles.canvas}>
                  <div>Click a component to add it here</div>
                  {Object.entries(layoutTree).map(([id, component]) => {
                    const componentDefinition = muiComponents.find(
                      (comp) => comp.type === component.type
                    );

                    if (componentDefinition) {
                      return (
                        <Draggable key={id} id={id} data={{ type: component.type, initialProps: component.initialProps || {}, x: component.x, y: component.y }}>
                          <div
                            style={{
                              position: 'absolute', // Position absolutely for drag and drop
                              left: component.x || 0,
                              top: component.y || 0,
                              margin: '10px',
                              padding: '10px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              backgroundColor: 'white', // Ensure background for visibility
                              zIndex: 10, // Ensure it's above other elements
                            }}
                          >
                            {componentDefinition.render({ ...(component.initialProps || {}), children: component.content })}
                          </div>
                        </Draggable>
                      );
                    }
                    return <div key={id}>{component.content}</div>;
                  })}
                </div>
              </Droppable>
            </div>
            {/* DragOverlay removed for now, will be re-evaluated for on-canvas drag */}
          </DndContext>

          <div className={styles.propertiesPanel}>
            <h2>Properties</h2>
          </div>
        </div>
      ) : (
        <pre className={styles.codeViewPre}>
          {JSON.stringify(layoutTree, null, 2)}
        </pre>
      )}
    </div>
  );
}
