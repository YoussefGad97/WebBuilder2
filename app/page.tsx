'use client';

import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable, Active } from '@dnd-kit/core'; // Keep DndContext for on-canvas drag, remove DragOverlay for now
import { useBuilderStore } from './builder/store';
import { Draggable } from './builder/Draggable'; // Will be repurposed or removed for sidebar
import { Droppable } from './builder/Droppable'; // Will be used for canvas
import styles from './builder/Builder.module.scss';
import classNames from 'classnames';
import { AvailableComponent } from './builder/components'; // Import types
import { componentRegistry } from './builder/componentRegistry'; // Import registry
import { DraggableData } from './builder/Draggable'; // Import DraggableData
import { Component } from './builder/store'; // Import Component interface
import { generateUniqueId } from './utils/idGenerator'; // Import ID generator
import CanvasComponent from './builder/CanvasComponent'; // Import CanvasComponent

export default function Home() {
  const layoutTree = useBuilderStore((state) => state.layoutTree);
  const setLayoutTree = useBuilderStore((state) => state.setLayoutTree);
  const [viewMode, setViewMode] = useState<'page' | 'code'>('page');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null); // State for selected component

  const addComponentToCanvas = (componentData: DraggableData) => {
    const componentDefinition = componentRegistry.findComponentByType(componentData.type);

    if (componentDefinition) {
      const newComponentId = generateUniqueId(componentData.type); // Use utility function
      setLayoutTree({
        ...layoutTree,
        [newComponentId]: {
          id: newComponentId, // Set the ID here
          type: componentData.type,
          content: componentDefinition.name,
          initialProps: componentData.initialProps,
          layout: componentDefinition.layout || 'content', // Use component's layout or default to content
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

  const onDropInto = (parentId: string, droppedComponentData: DraggableData) => {
    const componentDefinition = componentRegistry.findComponentByType(droppedComponentData.type);

    if (componentDefinition) {
      const newComponentId = generateUniqueId(droppedComponentData.type);
      const newComponent: Component = {
        id: newComponentId,
        type: droppedComponentData.type,
        content: componentDefinition.name,
        initialProps: droppedComponentData.initialProps,
        layout: componentDefinition.layout,
        parentId: parentId,
      };

      setLayoutTree((prevLayoutTree) => ({
        ...prevLayoutTree,
        [newComponentId]: newComponent,
        // Also update the parent's children array
        [parentId]: {
          ...prevLayoutTree[parentId],
          children: [...(prevLayoutTree[parentId].children || []), newComponent],
        },
      }));
    }
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
        <>
          <div className={styles.topBar}>
            <h1 className={styles.pageTitle}>Page Builder</h1>
            <div className={styles.topBarActions}>
              <button className={styles.saveButton}>Save</button>
              <button className={styles.previewButton}>Preview</button>
            </div>
          </div>
          <div className={styles.builderLayout}>
          <div className={styles.componentsSidebar}>
            <h2>Components</h2>
            {(() => {
              // Group components by library/library-category structure
              const groupedComponents: Record<string, Record<string, AvailableComponent[]>> = {};

              componentRegistry.getAllCategories().forEach((category) => {
                const [library, subCategory] = category.split('/');
                if (!groupedComponents[library]) {
                  groupedComponents[library] = {};
                }
                if (!groupedComponents[library][subCategory]) {
                  groupedComponents[library][subCategory] = [];
                }
                groupedComponents[library][subCategory].push(...componentRegistry.getComponentsByCategory(category));
              });

              return Object.entries(groupedComponents).map(([library, subCategories]) => (
                <details key={library} open className={styles.librarySection}>
                  <summary className={styles.librarySummary}>{library}</summary>
                  {Object.entries(subCategories).map(([subCategory, components]) => (
                    <details key={`${library}-${subCategory}`} open className={styles.componentCategory}>
                      <summary className={styles.componentCategorySummary}>{subCategory}</summary>
                      <div className={styles.componentList}>
                        {components.map((component) => (
                          <div
                            key={component.id}
                            className={styles.clickableComponent}
                            onClick={() => addComponentToCanvas({ type: component.type, initialProps: component.initialProps })}
                            title={component.description}
                          >
                            {component.name}
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
                </details>
              ));
            })()}
          </div>

          <DndContext onDragEnd={handleCanvasDragEnd}> {/* DndContext now only for on-canvas drag */}
            <div className={styles.canvasContainer}>
              <div className={styles.canvasHeader}>
                <span className={styles.canvasTitle}>Live Preview</span>
                <span className={styles.canvasSubtitle}>Desktop View</span>
              </div>
              <Droppable id="canvas" data={{ parentId: null, layoutType: 'root' }}> {/* Root droppable */}
                <div className={styles.canvas}>
                  {Object.entries(layoutTree)
                    .filter(([, component]) => component.parentId === undefined || component.parentId === null) // Render top-level components
                    .map(([id, component]) => (
                      <CanvasComponent key={id} component={component} onDropInto={onDropInto} onSelect={setSelectedComponentId} isSelected={selectedComponentId === id} />
                    ))}
                  {Object.keys(layoutTree).length === 0 && (
                    <div className={styles.emptyCanvas}>
                      <div className={styles.emptyCanvasIcon}>📄</div>
                      <h3>Start Building Your Page</h3>
                      <p>Click on components from the sidebar or drag layout elements here to begin creating your website.</p>
                    </div>
                  )}
                </div>
              </Droppable>
            </div>
            {/* DragOverlay removed for now, will be re-evaluated for on-canvas drag */}
          </DndContext>

          <div className={styles.propertiesPanel}>
            <h2>Properties</h2>
            {selectedComponentId ? (
              <div className={styles.propertiesContent}>
                <div className={styles.propertySection}>
                  <h3>Component Info</h3>
                  <div className={styles.propertyItem}>
                    <label>Type:</label>
                    <span>{layoutTree[selectedComponentId]?.type}</span>
                  </div>
                  <div className={styles.propertyItem}>
                    <label>ID:</label>
                    <span>{selectedComponentId}</span>
                  </div>
                </div>

                <div className={styles.propertySection}>
                  <h3>Content</h3>
                  <div className={styles.propertyItem}>
                    <label htmlFor="content-input">Text Content:</label>
                    <input
                      id="content-input"
                      type="text"
                      value={layoutTree[selectedComponentId]?.content || ''}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            content: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                    />
                  </div>
                </div>

                <div className={styles.propertySection}>
                  <h3>Styling</h3>
                  <div className={styles.propertyItem}>
                    <label htmlFor="width-input">Width:</label>
                    <input
                      id="width-input"
                      type="text"
                      value={layoutTree[selectedComponentId]?.width || ''}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            width: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                      placeholder="auto"
                    />
                  </div>
                  <div className={styles.propertyItem}>
                    <label htmlFor="height-input">Height:</label>
                    <input
                      id="height-input"
                      type="text"
                      value={layoutTree[selectedComponentId]?.height || ''}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            height: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                      placeholder="auto"
                    />
                  </div>
                  <div className={styles.propertyItem}>
                    <label htmlFor="margin-input">Margin:</label>
                    <input
                      id="margin-input"
                      type="text"
                      value={layoutTree[selectedComponentId]?.margin || ''}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            margin: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                      placeholder="0"
                    />
                  </div>
                  <div className={styles.propertyItem}>
                    <label htmlFor="padding-input">Padding:</label>
                    <input
                      id="padding-input"
                      type="text"
                      value={layoutTree[selectedComponentId]?.padding || ''}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            padding: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                      placeholder="0"
                    />
                  </div>
                  <div className={styles.propertyItem}>
                    <label htmlFor="bg-color-input">Background Color:</label>
                    <input
                      id="bg-color-input"
                      type="color"
                      value={layoutTree[selectedComponentId]?.backgroundColor || '#ffffff'}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            backgroundColor: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                    />
                  </div>
                  <div className={styles.propertyItem}>
                    <label htmlFor="text-color-input">Text Color:</label>
                    <input
                      id="text-color-input"
                      type="color"
                      value={layoutTree[selectedComponentId]?.color || '#000000'}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            color: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                    />
                  </div>
                  <div className={styles.propertyItem}>
                    <label htmlFor="font-size-input">Font Size:</label>
                    <input
                      id="font-size-input"
                      type="text"
                      value={layoutTree[selectedComponentId]?.fontSize || ''}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            fontSize: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                      placeholder="16px"
                    />
                  </div>
                  <div className={styles.propertyItem}>
                    <label htmlFor="border-radius-input">Border Radius:</label>
                    <input
                      id="border-radius-input"
                      type="text"
                      value={layoutTree[selectedComponentId]?.borderRadius || ''}
                      onChange={(e) => {
                        setLayoutTree((prev) => ({
                          ...prev,
                          [selectedComponentId]: {
                            ...prev[selectedComponentId],
                            borderRadius: e.target.value,
                          },
                        }));
                      }}
                      className={styles.propertyInput}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className={styles.propertySection}>
                  <h3>Advanced</h3>
                  <details>
                    <summary>Initial Props (JSON)</summary>
                    <pre className={styles.jsonDisplay}>{JSON.stringify(layoutTree[selectedComponentId]?.initialProps, null, 2)}</pre>
                  </details>
                </div>
              </div>
            ) : (
              <div className={styles.noSelection}>
                <p>Select a component to edit its properties.</p>
              </div>
            )}
          </div>
          </div>
        </>
      ) : (
        <pre className={styles.codeViewPre}>
          {JSON.stringify(layoutTree, null, 2)}
        </pre>
      )}
    </div>
  );
}
