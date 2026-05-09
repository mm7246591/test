import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/backstage",
      name: "backstage",
      component: () => import("@/views/backstage/BackStage.vue"),
    },
  ],
});

export default router;
