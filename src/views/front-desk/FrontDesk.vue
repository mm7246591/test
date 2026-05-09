<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue'
import { useTheme } from '../../composables/useTheme'
import { useI18n } from 'vue-i18n';
import type { PlacedItem } from '../back-stage/type/interface'

const { isDark, toggleTheme } = useTheme()
const { t, locale } = useI18n();

const placedItems = ref<PlacedItem[]>([])
const selectedItem = ref<PlacedItem | null>(null)

const selectItem = (item: PlacedItem) => {
	selectedItem.value = item
}

const handleSwitchLanguage = (lang: string) => {
	locale.value = lang;
	localStorage.setItem('locale', lang);
}

onMounted(() => {
	const savedTheme = localStorage.getItem('theme')
	if (savedTheme) isDark.value = savedTheme === 'dark'

	const saved = localStorage.getItem('image-items')
	if (saved) placedItems.value = JSON.parse(saved)
})

watchEffect(() => {
	if (isDark.value) {
		document.documentElement.setAttribute('data-theme', 'dark');
		localStorage.setItem('theme', 'dark');
	} else {
		document.documentElement.setAttribute('data-theme', 'light');
		localStorage.setItem('theme', 'light');
	}
});
</script>

<template>
	<div
		class="h-screen flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text-primary)] transition-colors duration-300">
		<header
			class="w-full flex items-center p-[12px] bg-[var(--color-bg-header)] border-b border-[var(--color-border)] transition-colors duration-300">
			<div class="flex-1 flex items-center justify-end gap-[12px]">
				<div class="flex rounded overflow-hidden border border-[var(--color-border)] text-sm">
					<button class="w-[120px] py-[6px] font-medium" :class="locale === 'ch'
						? 'bg-[var(--color-lang-active-bg)] text-[var(--color-lang-active-text)]'
						: 'bg-[var(--color-lang-inactive-bg)] text-[var(--color-lang-inactive-text)]'"
						@click="handleSwitchLanguage('ch')">{{ t("toggle.cn") }}</button>
					<button class="w-[120px] py-[6px]" :class="locale === 'en'
						? 'bg-[var(--color-lang-active-bg)] text-[var(--color-lang-active-text)]'
						: 'bg-[var(--color-lang-inactive-bg)] text-[var(--color-lang-inactive-text)]'"
						@click="handleSwitchLanguage('en')">{{ t("toggle.en") }}</button>
				</div>
				<div class="flex items-center gap-[12px]">
					<span class="text-sm">{{ t(`mode.${isDark ? 'dark' : 'light'}`) }}</span>
					<div
						class="relative flex items-center w-[72px] h-8 rounded-full px-1.5 cursor-pointer select-none transition-colors duration-300"
						:class="isDark ? 'bg-gray-900' : 'bg-gray-300'" @click="toggleTheme">
						<span class="text-xs font-bold transition-all duration-300 absolute"
							:class="isDark ? 'text-white left-2.5' : 'text-gray-600 right-2.5'">
						</span>
						<div class="w-5 h-5 bg-white rounded-full shadow-md absolute transition-all duration-300"
							:class="isDark ? 'left-[46px]' : 'left-1.5'" />
					</div>
				</div>
			</div>
		</header>

		<div class="flex-1 flex justify-center items-center">
			<div class="max-w-[1280px] max-h-[720px] flex gap-[16px]">

				<main
					class="flex flex-col flex-1 rounded-[8px] p-[20px] bg-[var(--color-bg-panel)] shadow-[0_10px_30px_var(--color-shadow)] transition-colors duration-300">
					<div class="flex-1 min-h-0 grid place-items-center overflow-hidden">
						<div
							class="relative w-[900px] h-[550px] rounded-[8px] overflow-hidden bg-[var(--color-canvas-bg)] [background-image:linear-gradient(var(--color-canvas-grid)_1px,transparent_1px),linear-gradient(90deg,var(--color-canvas-grid)_1px,transparent_1px)] [background-size:25px_25px] shadow-[inset_0_0_0_1px_var(--color-border)] transition-colors duration-300"
							@click.self="selectedItem = null">
							<div v-for="item of placedItems" :key="item.id" class="absolute overflow-hidden rounded-lg cursor-pointer"
								:style="{ left: item.x + 'px', top: item.y + 'px', width: item.width + 'px', height: item.height + 'px' }"
								@click="selectItem(item)">
								<img :src="item.src" class="w-full h-full object-cover" />
							</div>
						</div>
					</div>
				</main>

				<aside
					class="w-[350px] flex flex-col rounded-[8px] p-[20px] bg-[var(--color-bg-panel)] shadow-[0_10px_30px_var(--color-shadow)] transition-colors duration-300">
					<div v-if="selectedItem">
						<img :src="selectedItem.src"
							class="w-full rounded-[8px] object-cover shadow-[0_4px_12px_var(--color-img-shadow)]" />
						<div class="mt-[20px] flex flex-col gap-[12px]">
							<p class="text-base text-[var(--color-text-primary)]">{{ t("info.name") }}: {{ selectedItem.name }}</p>
							<p class="text-base text-[var(--color-text-primary)]">{{ t("info.description") }}: {{
								selectedItem.description }}</p>
						</div>
					</div>
				</aside>

			</div>
		</div>
	</div>
</template>
