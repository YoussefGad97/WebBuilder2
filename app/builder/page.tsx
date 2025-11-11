'use client';

import { useBuilderStore } from './store';
import { Draggable } from './Draggable';
import { Droppable } from './Droppable';
import { DndContext, useDndContext, DragEndEvent } from '@dnd-kit/core';

export default function BuilderPage() {
  const layoutTree = useBuilderStore((state) => state.layoutTree);
  const setLayoutTree = useBuilderStore((state) => state.setLayoutTree);

  const handleDrop = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over) {
      setLayoutTree({ ...layoutTree, [active.id]: { type: 'text', content: 'New Component' } });
    }
  };

  return (
    <DndContext onDragEnd={handleDrop}>
      <div>
        <h1>Builder Page</h1>
        <Draggable id="component-1">
          <div>Drag Me</div>
        </Draggable>
        <Droppable id="canvas">
          <div>Drop Here</div>
          {Object.entries(layoutTree).map(([id, component]) => (
            <div key={id}>{component.content}</div>
          ))}
        </Droppable>
      </div>
    </DndContext>
  );
}
