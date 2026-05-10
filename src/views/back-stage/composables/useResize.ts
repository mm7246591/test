import { ref } from "vue";
import { hasOverlap } from "../utils/collision";
import type { Ref } from "vue";
import type { PlacedItem, Position } from "../type/interface";

interface useResizeOptions {
  canvasRef: Ref<HTMLDivElement | null>;
  handlePosition: (event: PointerEvent) => Position;
  placedItems: Ref<PlacedItem[]>;
  selectedId: Ref<string | null>;
}

export const useResize = ({
  canvasRef,
  handlePosition,
  placedItems,
  selectedId,
}: useResizeOptions) => {
  const isResizing = ref<boolean>(false);
  const isNotAllowed = ref<boolean>(false);
  const resizeDirection = ref<string>("");
  const originItem = ref({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    aspectRatio: 1,
  });

  const checkOverlap = (item: PlacedItem) => {
    const canvas = canvasRef.value!.getBoundingClientRect();
    const isOutOfBounds =
      item.x < 0 ||
      item.y < 0 ||
      item.x + item.width > canvas.width ||
      item.y + item.height > canvas.height;
    if (
      hasOverlap(
        item,
        placedItems.value.filter((i) => i.id !== item.id),
      ) ||
      isOutOfBounds
    ) {
      isResizing.value = false;
      isNotAllowed.value = true;
      item.x = originItem.value.x;
      item.y = originItem.value.y;
      item.width = originItem.value.width;
      item.height = originItem.value.height;
    }
  };

  const handleResizing = (event: PointerEvent): void => {
    if (!isResizing.value) return;

    const position = handlePosition(event);
    const item = placedItems.value.find((item) => item.id === selectedId.value);
    if (!item) return;

    const dir = resizeDirection.value;

    if (dir === "rb") {
      item.width = Math.max(50, position.x - originItem.value.x);
      item.height = Math.max(50, position.y - originItem.value.y);
    } else if (dir === "lb") {
      const newWidth = Math.max(
        50,
        originItem.value.x + originItem.value.width - position.x,
      );
      item.width = newWidth;
      item.height = Math.max(50, position.y - originItem.value.y);
      item.x = originItem.value.x + originItem.value.width - newWidth;
    } else if (dir === "rt") {
      const newHeight = Math.max(
        50,
        originItem.value.y + originItem.value.height - position.y,
      );
      item.width = Math.max(50, position.x - originItem.value.x);
      item.height = newHeight;
      item.y = originItem.value.y + originItem.value.height - newHeight;
    } else if (dir === "lt") {
      const newWidth = Math.max(
        50,
        originItem.value.x + originItem.value.width - position.x,
      );
      const newHeight = Math.max(
        50,
        originItem.value.y + originItem.value.height - position.y,
      );
      item.width = newWidth;
      item.height = newHeight;
      item.x = originItem.value.x + originItem.value.width - newWidth;
      item.y = originItem.value.y + originItem.value.height - newHeight;
    }

    checkOverlap(item);
  };

  const handleStartResize = (item: PlacedItem, direction: string) => {
    isResizing.value = true;
    isNotAllowed.value = false;
    resizeDirection.value = direction;
    originItem.value = {
      x: item.x,
      y: item.y,
      width: item.width,
      height: item.height,
      aspectRatio: item.width / item.height,
    };

    window.addEventListener("pointermove", handleResizing);
    window.addEventListener("pointerup", handleStopResize);
  };

  const handleStopResize = () => {
    isResizing.value = false;
    isNotAllowed.value = false;
    resizeDirection.value = "";
    window.removeEventListener("pointermove", handleResizing);
    window.removeEventListener("pointerup", handleStopResize);
  };

  return {
    handleStartResize,
    isNotAllowed,
  };
};
