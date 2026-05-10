import { ref } from "vue";
import { hasOverlap } from "../utils/collision";
import type { Ref } from "vue";
import type { Position, PlacedItem } from "../type/interface";

interface UseMoveItemOptions {
  canvasRef: Ref<HTMLDivElement | null>;
  handlePosition: (event: PointerEvent) => Position;
  placedItems: Ref<PlacedItem[]>;
  selectedId: Ref<string | null>;
}

export const useMoveItem = ({
  canvasRef,
  handlePosition,
  placedItems,
  selectedId,
}: UseMoveItemOptions) => {
  const isDraggingItem = ref<boolean>(false);
  const isOutsideStage = ref<boolean>(false);
  const isOverlapping = ref<boolean>(false);
  const dragOffset = ref<Position>({ x: 0, y: 0 });
  const dragStartPos = ref<Position>({ x: 0, y: 0 });

  const handleMoveImage = (event: PointerEvent): void => {
    if (!isDraggingItem.value) return;
    const point = handlePosition(event);
    const item = placedItems.value.find((item) => item.id === selectedId.value);
    if (!item) return;

    item.x = point.x - dragOffset.value.x;
    item.y = point.y - dragOffset.value.y;

    const canvas = canvasRef.value;
    if (canvas) {
      isOutsideStage.value =
        item.x < 0 ||
        item.y < 0 ||
        item.x + item.width > canvas.offsetWidth ||
        item.y + item.height > canvas.offsetHeight;
    }

    isOverlapping.value =
      !isOutsideStage.value && hasOverlap(item, placedItems.value);
  };

  const handleStartMove = (event: PointerEvent, item: PlacedItem): void => {
    selectedId.value = item.id;
    isDraggingItem.value = true;
    dragStartPos.value = { x: item.x, y: item.y };

    const position = handlePosition(event);
    dragOffset.value = {
      x: position.x - item.x,
      y: position.y - item.y,
    };

    window.addEventListener("pointermove", handleMoveImage);
    window.addEventListener("pointerup", handleStopMove);
  };

  const handleStopMove = (): void => {
    if (isOutsideStage.value && selectedId.value) {
      placedItems.value = placedItems.value.filter(
        (item) => item.id !== selectedId.value,
      );
      selectedId.value = null;
    } else if (isOverlapping.value && selectedId.value) {
      const item = placedItems.value.find((i) => i.id === selectedId.value);
      if (item) {
        item.x = dragStartPos.value.x;
        item.y = dragStartPos.value.y;
      }
    }

    isDraggingItem.value = false;
    isOutsideStage.value = false;
    isOverlapping.value = false;

    window.removeEventListener("pointermove", handleMoveImage);
    window.removeEventListener("pointerup", handleStopMove);
  };

  return {
    isOutsideStage,
    isOverlapping,
    handleMoveImage,
    handleStartMove,
    handleStopMove,
  };
};
