import { useRef, useCallback } from 'react';

interface SwipeHandlers {
  onPointerDown: React.PointerEventHandler;
  onPointerUp: React.PointerEventHandler;
}

const useSwipe = ({
  onLeft,
  onRight,
}: {
  onLeft: () => void;
  onRight: () => void;
}): SwipeHandlers => {
  const pointerStartRef = useRef(0);

  const handlePointerDown = useCallback(
    ({ isPrimary, clientX }: React.PointerEvent) => {
      if (isPrimary) pointerStartRef.current = clientX;
    },
    []
  );

  const handlePointerUp = useCallback(
    ({ isPrimary, clientX }: React.PointerEvent) => {
      if (isPrimary) {
        const delta = clientX - pointerStartRef.current;
        const deltaAbs = Math.abs(delta);

        if (delta < 0 && deltaAbs > 40) {
          onLeft();
        } else if (deltaAbs > 40) {
          onRight();
        }
      }
    },
    [onLeft, onRight]
  );

  return {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
  };
};

export default useSwipe;
