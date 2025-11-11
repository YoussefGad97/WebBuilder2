import { useDraggable } from '@dnd-kit/core';
import { CSSProperties, ReactNode } from 'react';

export interface DraggableData { // Export DraggableData
  type: string;
  initialProps: Record<string, any>;
  x?: number; // X coordinate for positioning
  y?: number; // Y coordinate for positioning
}

interface DraggableProps {
  id: string;
  children: ReactNode;
  data?: DraggableData; // Use more specific type
}
export function Draggable({ id, children, data }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, data }); // Pass data to useDraggable
  const style: CSSProperties = {
    backgroundColor: '#fff',
    padding: '0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    cursor: 'grab',
    marginBottom: '0.5rem',
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
