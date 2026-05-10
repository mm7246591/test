<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useStageItems } from './composables/useStageItems'
import { useImageDialog } from './composables/useImageDialog'
import { useDragDrop } from './composables/useDragDrop'
import { useMoveItem } from './composables/useMoveItem'
import { useResize } from './composables/useResize'
import CreateDialog from '../../components/backstage/CreateDialog.vue'

const {
  canvasRef,
  placedItems,
  selectedId,
  handlePosition,
  loadImageSize,
} = useStageItems()

const { isOpenDialog, isEditing, imageForm, handleOpenDialog, handleEditDialog, handleSaveImage, handleCancelImage } =
  useImageDialog(placedItems, selectedId)

const { isDragOver, sourceImages, handleDragImage, handleDropImage } = useDragDrop({
  handlePosition,
  loadImageSize,
  placedItems,
  selectedId,
  handleOpenDialog,
})

const { isOutsideStage, isOverlapping, handleMoveImage, handleStartMove, handleStopMove } = useMoveItem({
  canvasRef,
  handlePosition,
  placedItems,
  selectedId,
})

const { handleStartResize, isNotAllowed } = useResize({
  canvasRef,
  handlePosition,
  placedItems,
  selectedId,
})

const handleSaveImageInfo = () => {
  alert('儲存成功！')
  localStorage.setItem('image-items', JSON.stringify(placedItems.value))
}

onMounted(() => {
  const saved = localStorage.getItem("image-items");
  if (saved) placedItems.value = JSON.parse(saved);
});

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handleMoveImage)
  window.removeEventListener('pointerup', handleStopMove)
})
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="max-w-[1280px] max-h-[720px] flex justify-center mx-auto p-[20px] gap-[16px]">
      <main class="flex flex-col flex-1 rounded-[8px] p-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.1)] bg-white">
        <div class="flex-1 min-h-0 grid place-items-center overflow-hidden">
          <div ref="canvasRef"
            :class="isDragOver ? 'outline outline-[2px] outline-[#9ecaff] -outline-offset-[2px]' : (isOutsideStage || isOverlapping || isNotAllowed) ? 'outline outline-[2px] outline-[#fc8d8d] -outline-offset-[2px]' : ''"
            class="relative w-[900px] h-[550px] max-w-full max-h-full bg-white rounded-[8px] overflow-hidden [background-image:linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] [background-size:25px_25px] shadow-[inset_0_0_0_1px_#cbd5e1]"
            @dragover.prevent="isDragOver = true" @dragleave="isDragOver = false"
            @drop.prevent="handleDropImage($event)" @pointerdown.self="selectedId = null">
            <transition name="fade">
              <div v-if="isOutsideStage || (isOverlapping || isNotAllowed)"
                class="absolute inset-0 z-[99999] bg-red-500/10 flex items-center justify-center pointer-events-none">
                <span class="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                  {{ isOutsideStage ? '移除物件' : isOverlapping ? '物件重疊' : '尺寸限制' }}
                </span>
              </div>
            </transition>
            <div v-for="item of placedItems" :key="item.id" class="absolute"
              :style="{ left: item.x + 'px', top: item.y + 'px', width: item.width + 'px', height: item.height + 'px' }">
              <div class="w-full h-full overflow-hidden rounded-[8px]">
                <img :src="item.src"
                  class="w-full h-full object-cover select-none cursor-grab active:cursor-grabbing shadow-[0_8px_18px_rgba(15,23,42,0.2)]"
                  draggable="false" @pointerdown.stop.prevent="handleStartMove($event, item)"
                  @dragstart.prevent @dblclick.stop="handleEditDialog(item)" />
              </div>
              <div v-if="selectedId === item.id">
                <div @pointerdown.stop="handleStartResize(item, 'lt')"
                  class="absolute w-[10px] h-[10px] bg-white border-2 border-[#2563eb] cursor-nwse-resize -top-2 -left-2" />
                <div @pointerdown.stop="handleStartResize(item, 'rt')"
                  class="absolute w-[10px] h-[10px] bg-white border-2 border-[#2563eb] cursor-nesw-resize -top-2 -right-2" />
                <div @pointerdown.stop="handleStartResize(item, 'lb')"
                  class="absolute w-[10px] h-[10px] bg-white border-2 border-[#2563eb] cursor-nesw-resize -bottom-2 -left-2" />
                <div @pointerdown.stop="handleStartResize(item, 'rb')"
                  class="absolute w-[10px] h-[10px] bg-white border-2 border-[#2563eb] cursor-nwse-resize -bottom-2 -right-2" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <aside
        class="w-[350px] flex flex-col justify-between gap-[14px] rounded-[8px] p-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.1)] bg-white">
        <div class="flex flex-col">
          <h2 class="m-0 text-lg font-semibold">物件列表</h2>
          <div class="grid grid-cols-2 gap-3 overflow-y-auto">
            <div v-for="image of sourceImages" :key="image.id">
              <img :src="image.src"
                class="transition-[transform,box-shadow] duration-200 ease-out hover:translate-y-[-2px] cursor-grab rounded-[8px]"
                draggable="true" @dragstart="handleDragImage($event, image)" />
            </div>
          </div>
        </div>
        <button class="w-full bg-[#265ec7] text-white py-2.5 rounded-[4px] cursor-pointer"
          @click="handleSaveImageInfo">儲存</button>
      </aside>
    </div>

    <CreateDialog :is-open-dialog="isOpenDialog" :is-editing="isEditing" :imageForm="imageForm" @save="handleSaveImage"
      @cancel="handleCancelImage" />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
