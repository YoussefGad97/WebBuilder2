import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
  id: string;
  children: React.ReactNode;
  data?: Record<string, any>; // Add optional data prop
}

export function Droppable({ id, children, data }: DroppableProps) {
  const { setNodeRef } = useDroppable({ id, data }); // Pass data to useDroppable

  return (
    <div ref={setNodeRef}>
      {children}
    </div>
  );
}
