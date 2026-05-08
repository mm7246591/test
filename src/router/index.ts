import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/backstage",
      name: "backstage",
      component: () => import("@/views/BackStage.vue"),
    },
  ],
});

export default router;
