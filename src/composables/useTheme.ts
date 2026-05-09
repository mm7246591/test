import { ref } from "vue";

export const useTheme = () => {
  const isDark = ref<boolean>(false);

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return { isDark, toggleTheme };
};
