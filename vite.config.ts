import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: "vue-spec-plugin",
      enforce: "pre", // 在其他外掛程式之前執行
      transform(_code, id) {
        // 更精確的正則表達式匹配 .vue 檔案中的 spec 區塊
        if (/\.vue\?vue&type=spec(?:&|$)/.test(id)) {
          return {
            code: "export default {};",
            map: null,
          };
        }
        // 明確回傳 null 表示不處理此檔案
        return null;
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
