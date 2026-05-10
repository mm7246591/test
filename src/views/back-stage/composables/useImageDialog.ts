import { ref } from "vue";
import type { Ref } from "vue";
import type { PlacedItem, ImageForm } from "../type/interface";

export const useImageDialog = (
  placedItems: Ref<PlacedItem[]>,
  selectedId: Ref<string | null>,
) => {
  const isOpenDialog = ref<boolean>(false);
  const isEditing = ref<boolean>(false);
  const dataForm = ref<PlacedItem | null>(null);
  const imageForm = ref<ImageForm>({ name: "", description: "" });

  const handleOpenDialog = (item: PlacedItem): void => {
    dataForm.value = item;
    imageForm.value.name = "";
    imageForm.value.description = "";
    isEditing.value = false;
    isOpenDialog.value = true;
  };

  const handleEditDialog = (item: PlacedItem): void => {
    dataForm.value = item;
    imageForm.value.name = item.name;
    imageForm.value.description = item.description;
    isEditing.value = true;
    isOpenDialog.value = true;
  };

  const resetForm = () => {
    dataForm.value = null;
    imageForm.value.name = "";
    imageForm.value.description = "";
    isEditing.value = false;
    isOpenDialog.value = false;
  };

  const handleSaveImage = (): void => {
    if (!dataForm.value) return;

    dataForm.value.name = imageForm.value.name;
    dataForm.value.description = imageForm.value.description;
    selectedId.value = dataForm.value.id;
    resetForm();
  };

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
