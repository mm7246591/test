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

/**
 * 管理畫布內物件的拖移行為。
 *
 * @param canvasRef - 畫布 DOM 元素（用於偵測物件是否超出邊界）
 * @param handlePosition - 將 PointerEvent 轉換為畫布相對座標的函式
 * @param placedItems - 畫布上已放置的物件陣列（雙向綁定）
 * @param selectedId - 目前選取的物件 id（雙向綁定）
 * @returns 拖移狀態與操作方法
 */
export const useMoveItem = ({
  canvasRef,
  handlePosition,
  placedItems,
  selectedId,
}: UseMoveItemOptions) => {
  /** 是否正在拖移物件 */
  const isDraggingItem = ref<boolean>(false);
  /** 物件是否已拖移超出畫布邊界 */
  const isOutsideStage = ref<boolean>(false);
  /** 物件是否與其他物件重疊 */
  const isOverlapping = ref<boolean>(false);
  /** 指標按下點與物件左上角的偏移量，用於保持拖移時的相對位置 */
  const dragOffset = ref<Position>({ x: 0, y: 0 });
  /** 拖移開始前的物件座標，用於重疊時彈回原位 */
  const dragStartPos = ref<Position>({ x: 0, y: 0 });

  /**
   * 跟隨指標移動更新物件座標，並偵測是否超出畫布邊界或與其他物件重疊。
   * 綁定至 `window` 的 `pointermove` 事件。
   */
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

  /**
   * 開始拖移：選取目標物件、記錄起始座標、計算偏移量，並註冊 pointermove / pointerup 監聽。
   * @param event - 觸發拖移的 PointerEvent
   * @param item - 被拖移的畫布物件
   */
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

  /**
   * 結束拖移：
   * - 超出畫布 → 刪除物件
   * - 與其他物件重疊 → 彈回拖移前座標
   * - 否則保留在放開位置
   * 移除 pointermove / pointerup 監聽並重設拖移狀態。
   */
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
    isDraggingItem,
    isOutsideStage,
    isOverlapping,
    handleMoveImage,
    handleStartMove,
    handleStopMove,
  };
};
