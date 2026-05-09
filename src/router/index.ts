import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/back-stage",
      name: "BackStage",
      component: () => import("@/views/back-stage/BackStage.vue"),
    },
  ],
});

export default router;
