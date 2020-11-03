import { DragElementWrapper, useDrag, useDrop } from 'react-dnd';

export const usePhotoDrag = ({
  id,
  url,
  disable,
}: {
  id: string;
  url: string;
  disable: boolean;
}): [{ isDragging: boolean }, DragElementWrapper<any>] => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'photo', id, url },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !disable,
  });

  return [{ isDragging }, drag];
};

export const usePhotoDrop = ({
  id,
  onDrop,
}: {
  id: string;
  onDrop: (id: string) => void;
}): [
  { isOver: boolean; dropActive: boolean; url?: string },
  DragElementWrapper<any>
] => {
  const [{ isOver, dropActive, url }, drop] = useDrop<
    { id: string; type: string },
    any,
    { isOver: boolean; dropActive: boolean; url: string }
  >({
    accept: 'photo',
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      dropActive: !!monitor.getItem() && monitor.getItem().id !== id,
      url: monitor.getItem()?.url || '',
    }),
  });

  return [
    {
      isOver,
      dropActive,
      url,
    },
    drop,
  ];
};
