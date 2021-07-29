import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/host",
    name: "Host",
    component: () => import("../views/Host.vue"),
  },
  {
    path: "/join",
    name: "Client",
    component: () => import("../views/Client.vue"),
  },
  {
    path: "/legal",
    name: "Legal",
    component: () => import("../views/Legal.vue"),
  },
  {
    path: "*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
