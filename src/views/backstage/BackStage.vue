<script setup lang="ts">
import { ref } from 'vue'
import CreateDialog from '../../components/backstage/CreateDialog.vue'

const sourceImages = ref([
  { id: '1', src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: '2', src: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: '3', src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&h=500&q=80' },
  { id: '4', src: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&h=500&q=80' },
])

const isOpenDialog = ref(false)
const imageForm = ref({ name: '', description: '' })

const handleSave = (): void => { }
</script>

<template>
  <div class="w-full h-screen flex justify-center items-center">
    <div class="max-w-[1280px] max-h-[720px] flex justify-center mx-auto p-[20px] gap-[16px]">
      <main class="flex flex-col flex-1 rounded-[8px] p-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.1)] bg-white">
        <div class="flex-1 min-h-0 grid place-items-center overflow-hidden">
          <div
            class="relative w-[900px] h-[550px] max-w-full max-h-full bg-white rounded-[8px] overflow-hidden [background-image:linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] [background-size:25px_25px] shadow-[inset_0_0_0_1px_#cbd5e1]">
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
                class="transition-[transform,box-shadow] duration-200 ease-out hover:translate-y-[-2px] rounded-[8px]" />
            </div>
          </div>
        </div>
        <button class="w-full bg-[#265ec7] text-white py-2.5 rounded-[4px] cursor-pointer"
          @click="handleSave">儲存</button>
      </aside>
    </div>

    <CreateDialog :is-open-dialog="isOpenDialog" :imageForm="imageForm" @save="handleSave"
      @cancel="() => isOpenDialog = false" />
  </div>
</template>
