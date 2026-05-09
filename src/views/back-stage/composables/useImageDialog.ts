import { ref } from "vue";
import type { Ref } from "vue";
import type { PlacedItem, ImageForm } from "../type/interface";

/**
 * 管理圖片新增 Dialog 的開關、表單狀態與儲存/取消行為。
 *
 * @param placedItems - 畫布上已放置的物件陣列（雙向綁定）
 * @param selectedId - 目前選取的物件 id（雙向綁定）
 * @returns Dialog 狀態與操作方法
 */
export const useImageDialog = (
  placedItems: Ref<PlacedItem[]>,
  selectedId: Ref<string | null>,
) => {
  /** Dialog 是否開啟 */
  const isOpenDialog = ref<boolean>(false);
  /** 正在填寫資料的目標物件，關閉後重設為 null */
  const dataForm = ref<PlacedItem | null>(null);
  /** Dialog 內的表單資料 */
  const imageForm = ref<ImageForm>({ name: "", description: "" });

  /**
   * 開啟 Dialog 並綁定目標物件。
   * @param item - 使用者點擊要填寫資料的畫布物件
   */
  const handleOpenDialog = (item: PlacedItem): void => {
    dataForm.value = item;
    imageForm.value.name = "";
    imageForm.value.description = "";
    isOpenDialog.value = true;
  };

  /**
   * 重設所有 Dialog 相關狀態並關閉 Dialog。
   */
  const resetForm = () => {
    dataForm.value = null;
    imageForm.value.name = "";
    imageForm.value.description = "";
    isOpenDialog.value = false;
  };

  /**
   * 將表單資料寫入目標物件並選取它，然後關閉 Dialog。
   */
  const handleSaveImage = (): void => {
    if (!dataForm.value) return;

    dataForm.value.name = imageForm.value.name;
    dataForm.value.description = imageForm.value.description;
    selectedId.value = dataForm.value.id;
    resetForm();
  };

  /**
   * 取消新增：從畫布移除目標物件，若它正被選取則清除選取狀態，最後關閉 Dialog。
   */
  const handleCancelImage = (): void => {
    if (dataForm.value) {
      placedItems.value = placedItems.value.filter(
        (item) => item.id !== dataForm.value!.id,
      );
      if (selectedId.value === dataForm.value.id) selectedId.value = null;
    }

    resetForm();
  };

  return {
    isOpenDialog,
    imageForm,
    handleOpenDialog,
    handleSaveImage,
    handleCancelImage,
  };
};
