import { useEffect, useRef } from 'react';

const useTableArrowNavigation = () => {
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const arrowKeyCommands: Record<string, [number, number]> = {
      ArrowLeft: [0, -1],
      ArrowUp: [-1, 0],
      ArrowRight: [0, 1],
      ArrowDown: [1, 0],
    };

    const listener = (event: KeyboardEvent) => {
      const tbodyRef = tableRef.current?.children[1];
      const toMoveFocus = arrowKeyCommands[event.code] ?? 0;
      const trCollection = tbodyRef?.children;
      Object.values(trCollection ?? {}).forEach((row, idxRow) => {
        const rowChildren = row.children;
        Object.values(rowChildren).forEach((td, idxCol) => {
          if (document.activeElement !== td.firstChild) return;

          const newCoordinates: [number, number] = [
            idxRow + toMoveFocus[0],
            idxCol + toMoveFocus[1],
          ];

          if (
            newCoordinates[0] < 0 ||
            newCoordinates[0] >= (trCollection?.length ?? 0) ||
            newCoordinates[1] < 1 ||
            newCoordinates[1] >= rowChildren.length
          )
            return;

          (
            trCollection?.[newCoordinates[0]]?.children[newCoordinates[1]]
              .firstChild as HTMLInputElement
          ).focus();
        });
      });
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return { tableRef };
};

export default useTableArrowNavigation;
