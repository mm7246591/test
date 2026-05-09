<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
	isOpenDialog: boolean
	isEditing: boolean
	imageForm: {
		name: string
		description: string
	}
}>(), {
	isOpenDialog: false,
	isEditing: false,
	imageForm: () => ({ name: '', description: '' }),
})

const emit = defineEmits<{
	save: []
	cancel: []
}>()

const nameError = ref<string>('')
const descriptionError = ref<string>('')

const handleSaveImage = (): void => {
	nameError.value = props.imageForm.name ? '' : '請輸入名稱'
	descriptionError.value = props.imageForm.description ? '' : '請輸入描述'
	if (nameError.value || descriptionError.value) return
	emit('save')
}

const handleCancelImage = (): void => {
	emit('cancel')
}

watch(() => props.isOpenDialog, (val) => {
	if (val) {
		nameError.value = ''
		descriptionError.value = ''
	}
})
</script>

<template>
	<div v-if="isOpenDialog" class="fixed inset-0 z-[10000] grid place-items-center bg-[rgba(0,0,0,0.3)]"
		@pointerdown.self="handleCancelImage">
		<section class="w-[400px] p-[20px] bg-white rounded-[8px] ">

			<h2 class="mb-[12px] text-center text-xl font-semibold">{{ isEditing ? '編輯物件資訊' : '新增物件資訊' }}</h2>
			<div class="flex flex-col mb-[12px]">
				<div class="flex items-center gap-[12px]">
					<label for="imageName" class="text-sm font-semibold shrink-0">名稱</label>
					<input id="imageName" v-model.trim="imageForm.name" type="text" placeholder="請輸入名稱"
						:class="nameError ? 'border-red-400 focus:border-red-400' : 'border-[#cbd5e1] '"
						class="flex-1 border rounded-[4px] p-[10px] outline-none" @keydown.enter.prevent="handleSaveImage" />
				</div>
				<p v-if="nameError" class="text-xs text-red-400 ml-[calc(2rem+12px)]">{{ nameError }}</p>
			</div>

			<div class="flex flex-col mb-[12px]">
				<div class="flex items-center gap-[12px]">
					<label for="imageDescription" class="text-sm font-semibold shrink-0 pt-2.5">描述</label>
					<input id="imageDescription" v-model.trim="imageForm.description" placeholder="請輸入描述"
						:class="descriptionError ? 'border-red-400 focus:border-red-400' : 'border-[#cbd5e1] '"
						class="flex-1 border rounded-[4px] p-[10px] outline-none" @keydown.enter.prevent="handleSaveImage" />
				</div>
				<p v-if="descriptionError" class="text-xs text-red-400 ml-[calc(2rem+12px)]">{{ descriptionError }}</p>
			</div>

			<div class="flex justify-center gap-[16px] mt-[18px]">
				<button class="w-[120px] border-0 rounded-[4px] bg-[#265ec7] text-white px-4 py-2.5 text-sm"
					@click="handleSaveImage">儲存</button>
				<button class="w-[120px] border-0 rounded-[4px] bg-[#e5e7eb] text-[#111827] px-4 py-2.5 text-sm"
					@click="handleCancelImage">取消</button>
			</div>
		</section>
	</div>
</template>
