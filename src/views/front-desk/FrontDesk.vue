<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { PlacedItem } from '../back-stage/type/interface'

const placedItems = ref<PlacedItem[]>([])
const selectedItem = ref<PlacedItem | null>(null)

const selectItem = (item: PlacedItem) => {
	selectedItem.value = item
}

onMounted(() => {
	const saved = localStorage.getItem('image-items')
	if (saved) placedItems.value = JSON.parse(saved)
})
</script>

<template>
	<div class="h-screen flex flex-col">
		<header class="w-full flex items-center p-[12px]">
			<div class="flex-1 flex items-center justify-end gap-[12px]">
				<div class="flex rounded overflow-hidden border border-gray-300 text-sm">
					<button class="px-[20px] py-[6px] bg-black text-white font-medium">中文</button>
					<button class="px-[20px] py-[6px] bg-white">英文</button>
				</div>
				<div class="flex items-center gap-[12px]">
					<span class="text-sm">深色模式</span>
					<div
						class="flex items-center justify-between w-[72px] h-8 bg-gray-900 rounded-full px-1.5 cursor-pointer select-none">
						<span class="text-white text-xs font-bold ml-1">OFF</span>
						<div class="w-5 h-5 bg-white rounded-full shadow-md" />
					</div>
				</div>
			</div>
		</header>

		<div class="flex-1 flex justify-center items-center">
			<div class="max-w-[1280px] max-h-[720px] flex gap-[16px]">

				<main class="flex flex-col flex-1 rounded-[8px] p-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.1)] bg-white">
					<div class="flex-1 min-h-0 grid place-items-center overflow-hidden">
						<div
							class="relative w-[900px] h-[550px] bg-white rounded-[8px] overflow-hidden [background-image:linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] [background-size:25px_25px] shadow-[inset_0_0_0_1px_#cbd5e1]"
							@click.self="selectedItem = null">
							<div v-for="item of placedItems" :key="item.id" class="absolute overflow-hidden rounded-lg cursor-pointer"
								:style="{ left: item.x + 'px', top: item.y + 'px', width: item.width + 'px', height: item.height + 'px', zIndex: item.zIndex }"
								@click="selectItem(item)">
								<img :src="item.src" class="w-full h-full object-cover" />
							</div>
						</div>
					</div>
				</main>

				<aside class="w-[350px] flex flex-col rounded-[8px] p-[20px] shadow-[0_10px_30px_rgba(15,23,42,0.1)] bg-white">
					<div v-if="selectedItem">
						<img :src="selectedItem.src"
							class="w-full rounded-[8px] object-cover shadow-[0_4px_12px_rgba(15,23,42,0.15)]" />
						<div class="mt-[20px] flex flex-col gap-[12px]">
							<p class="text-base">名稱：{{ selectedItem.name }}</p>
							<p class="text-base">描述：{{ selectedItem.description }}</p>
						</div>
					</div>
				</aside>

			</div>
		</div>
	</div>
</template>

<style lang="css" scoped></style>
