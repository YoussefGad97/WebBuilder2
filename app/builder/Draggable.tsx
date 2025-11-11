import { useDraggable } from '@dnd-kit/core';
import { CSSProperties, ReactNode } from 'react';

interface DraggableProps {
  id: string;
  children: ReactNode;
}
export function Draggable({ id, children }: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
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

