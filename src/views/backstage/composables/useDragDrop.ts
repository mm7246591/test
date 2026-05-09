import { ref } from "vue";
import type { Ref } from "vue";
import type { Position, Size, PlacedItem, SourceImage } from "../type/interface";

interface UseDragDropOptions {
  handlePosition: (event: PointerEvent | DragEvent) => Position;
  loadImageSize: (src: string) => Promise<Size>;
  placedItems: Ref<PlacedItem[]>;
  selectedId: Ref<string | null>;
  handleOpenDialog: (item: PlacedItem) => void;
}

export const useDragDrop = ({
  handlePosition,
  loadImageSize,
  placedItems,
  selectedId,
  handleOpenDialog,
}: UseDragDropOptions) => {
  const isDragOver = ref<boolean>(false);
  const dragOffset = ref<Position>({ x: 0, y: 0 });

  const sourceImages = ref<SourceImage[]>([
    {
      id: "1",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&h=500&q=80",
    },
    {
      id: "2",
      src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=500&h=500&q=80",
    },
    {
      id: "3",
      src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&h=500&q=80",
    },
    {
      id: "4",
      src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&h=500&q=80",
    },
  ]);

  const handleDragImage = (event: DragEvent, image: SourceImage): void => {
    const target = event.target as HTMLElement;
    const renderedWidth = target.getBoundingClientRect().width;

    const scale = 116 / renderedWidth;
    dragOffset.value = {
      x: event.offsetX * scale,
      y: event.offsetY * scale,
    };

    event.dataTransfer!.setData("text/plain", image.src);
    event.dataTransfer!.effectAllowed = "copy";
  };

  const handleDropImage = async (event: DragEvent): Promise<void> => {
    isDragOver.value = false;
    const src = event.dataTransfer!.getData("text/plain");
    if (!src) return;

    const position = handlePosition(event);
    const imageSize = await loadImageSize(src);
    const width = 116;
    const height = Math.round(width * (imageSize.height / imageSize.width));

    const item: PlacedItem = {
      id: Date.now().toString(),
      src,
      x: position.x - dragOffset.value.x,
      y: position.y - dragOffset.value.y,
      width,
      height,
      zIndex: 1,
      name: "",
      description: "",
    };
    placedItems.value.push(item);
    selectedId.value = item.id;

    handleOpenDialog(item);
  };

  return { isDragOver, sourceImages, handleDragImage, handleDropImage };
};
