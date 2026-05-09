import { ref } from "vue";
import type { Ref } from "vue";
import type { PlacedItem, ImageForm } from "../type/interface";

/**
 * 管理後台圖片編輯 Dialog 的開關與表單狀態。
 *
 * 支援兩種操作模式：
 * - **新增模式**：從拖放放置後觸發，取消時會將剛放置的物件從畫布移除。
 * - **編輯模式**：點擊已放置物件後觸發，取消時僅關閉 Dialog，不刪除物件。
 *
 * @param placedItems - 已放置於畫布上的物件清單（響應式）
 * @param selectedId - 目前選取物件的 ID（響應式），無選取時為 `null`
 * @returns Dialog 狀態、表單資料及各操作處理器
 */
export const useImageDialog = (
  placedItems: Ref<PlacedItem[]>,
  selectedId: Ref<string | null>,
) => {
  /** Dialog 是否開啟。 */
  const isOpenDialog = ref<boolean>(false);

  /** 是否為編輯模式（`true`）或新增模式（`false`）。 */
  const isEditing = ref<boolean>(false);

  /** 目前正在編輯的物件，Dialog 關閉後重設為 `null`。 */
  const dataForm = ref<PlacedItem | null>(null);

  /** Dialog 表單的輸入值（名稱與描述）。 */
  const imageForm = ref<ImageForm>({ name: "", description: "" });

  /**
   * 以**新增模式**開啟 Dialog。
   *
   * 表單欄位清空，`isEditing` 設為 `false`。
   * 若使用者取消，該物件將從畫布移除。
   *
   * @param item - 剛放置至畫布的新物件
   */
  const handleOpenDialog = (item: PlacedItem): void => {
    dataForm.value = item;
    imageForm.value.name = "";
    imageForm.value.description = "";
    isEditing.value = false;
    isOpenDialog.value = true;
  };

  /**
   * 以**編輯模式**開啟 Dialog。
   *
   * 表單預填入物件現有的名稱與描述，`isEditing` 設為 `true`。
   *
   * @param item - 要編輯的既有物件
   */
  const handleEditDialog = (item: PlacedItem): void => {
    dataForm.value = item;
    imageForm.value.name = item.name;
    imageForm.value.description = item.description;
    isEditing.value = true;
    isOpenDialog.value = true;
  };

  /**
   * 重設所有 Dialog 內部狀態並關閉 Dialog。
   * 供 `handleSaveImage` 與 `handleCancelImage` 共用。
   */
  const resetForm = () => {
    dataForm.value = null;
    imageForm.value.name = "";
    imageForm.value.description = "";
    isEditing.value = false;
    isOpenDialog.value = false;
  };

  /**
   * 儲存表單並關閉 Dialog。
   *
   * 將 `imageForm` 的名稱與描述寫回 `dataForm`（直接修改 `placedItems` 內的物件參照），
   * 並將選取 ID 更新為該物件的 ID。
   */
  const handleSaveImage = (): void => {
    if (!dataForm.value) return;

    dataForm.value.name = imageForm.value.name;
    dataForm.value.description = imageForm.value.description;
    selectedId.value = dataForm.value.id;
    resetForm();
  };

  /**
   * 取消並關閉 Dialog。
   *
   * - **新增模式**：從 `placedItems` 移除該物件，並清除選取狀態。
   * - **編輯模式**：不修改物件，僅關閉 Dialog。
   */
  const handleCancelImage = (): void => {
    if (!isEditing.value && dataForm.value) {
      placedItems.value = placedItems.value.filter(
        (item) => item.id !== dataForm.value!.id,
      );
      if (selectedId.value === dataForm.value.id) selectedId.value = null;
    }

    resetForm();
  };

  return {
    isOpenDialog,
    isEditing,
    imageForm,
    handleOpenDialog,
    handleEditDialog,
    handleSaveImage,
    handleCancelImage,
  };
};
