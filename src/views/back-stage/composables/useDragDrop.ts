import { ref } from "vue";
import { hasOverlap } from "../utils/collision";
import type { Ref } from "vue";
import type {
  Position,
  Size,
  PlacedItem,
  SourceImage,
} from "../type/interface";

/**
 * `useDragDrop` composable 的注入選項。
 */
interface UseDragDropOptions {
  /** 將 PointerEvent 或 DragEvent 轉換為畫布座標的工具函式。 */
  handlePosition: (event: PointerEvent | DragEvent) => Position;
  /** 非同步載入圖片並回傳其原始尺寸。 */
  loadImageSize: (src: string) => Promise<Size>;
  /** 已放置於畫布上的物件清單（響應式）。 */
  placedItems: Ref<PlacedItem[]>;
  /** 目前選取物件的 ID（響應式），無選取時為 `null`。 */
  selectedId: Ref<string | null>;
  /** 在圖片放置後開啟編輯 Dialog 的回呼函式。 */
  handleOpenDialog: (item: PlacedItem) => void;
}

/**
 * 管理後台畫布的拖放邏輯。
 *
 * 負責：
 * - 維護可拖曳的來源圖片清單
 * - 記錄拖曳起始偏移量，以確保放置位置貼合滑鼠游標
 * - 將圖片放置至畫布，並做碰撞檢測以避免物件重疊
 *
 * @param options - 依賴注入選項，參見 {@link UseDragDropOptions}
 * @returns 響應式狀態與事件處理器
 */
export const useDragDrop = ({
  handlePosition,
  loadImageSize,
  placedItems,
  selectedId,
  handleOpenDialog,
}: UseDragDropOptions) => {
  /** 游標是否懸停在有效的放置區域上。 */
  const isDragOver = ref<boolean>(false);

  /**
   * 拖曳開始時，滑鼠在圖片元素內的相對偏移量（已依渲染比例縮放）。
   * 用於放置時補償偏移，使圖片貼合游標抓取點。
   */
  const dragOffset = ref<Position>({ x: 0, y: 0 });

  /** 可拖曳至畫布的來源圖片清單。 */
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

  /**
   * 處理圖片的 `dragstart` 事件。
   *
   * 計算拖曳偏移量（依顯示比例縮放至固定寬度 116px），
   * 並將圖片 URL 寫入 DataTransfer 以供放置時讀取。
   *
   * @param event - 原生 DragEvent
   * @param image - 被拖曳的來源圖片資料
   */
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

  /**
   * 處理畫布的 `drop` 事件。
   *
   * 流程：
   * 1. 從 DataTransfer 取得圖片 URL
   * 2. 計算放置座標（補償拖曳偏移量）
   * 3. 非同步載入圖片尺寸並換算高度（固定寬度 116px）
   * 4. 碰撞檢測——若與現有物件重疊則放棄放置
   * 5. 將新物件加入 `placedItems`，選取它並開啟編輯 Dialog
   *
   * @param event - 原生 DragEvent
   */
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
      name: "",
      description: "",
    };
    if (hasOverlap(item, placedItems.value)) return;

    placedItems.value.push(item);
    selectedId.value = item.id;

    handleOpenDialog(item);
  };

  return { isDragOver, sourceImages, handleDragImage, handleDropImage };
};
