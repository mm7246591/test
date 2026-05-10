import { ref, computed } from "vue";
import type { PlacedItem } from "../type/interface";

export const useStageItems = () => {
  const canvasRef = ref<HTMLDivElement | null>(null);
  const placedItems = ref<PlacedItem[]>([]);
  const selectedId = ref<string | null>(null);

  const selectedItem = computed(
    () =>
      placedItems.value.find((item) => item.id === selectedId.value) ?? null,
  );

  const handlePosition = (event: MouseEvent): { x: number; y: number } => {
    const rect = canvasRef.value!.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const loadImageSize = (
    src: string,
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  return {
    canvasRef,
    placedItems,
    selectedId,
    selectedItem,
    handlePosition,
    loadImageSize,
  };
};
