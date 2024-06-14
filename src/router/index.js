import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  }, 
  {
    path: "/",
    component: Layout,
    redirect: "/mesIndex",
    children: [
      {
        path: "mesIndex",
        name: "MesIndex",
        component: () => import("@/views/mesIndex/index"),
        meta: { title: "MES团队", icon: "home" },
      },
    ],
  },

  {
    path: "/daily",
    component: Layout,
    children: [
      {
        path: "daily",
        name: "Daily",
        component: () => import("@/views/daily/index"),
        // meta: { title: "日报", icon: "daily" },
        meta: { title: "日报"  },
      },
    ],
  },
  {
    path: "/dailySummary",
    component: Layout,
    children: [
      {
        path: "dailySummary",
        name: "dailySummary",
        component: () => import("@/views/dailySummary/index"),
        // meta: { title: "日报汇总", icon: "daily" },
        meta: { title: "日报汇总" },
      },
    ],
  },
  {
    path: "/weekly",
    component: Layout,
    children: [
      {
        path: "weekly",
        name: "Weekly",
        component: () => import("@/views/weekly/index"),
        // meta: { title: "周报", icon: "weekly" },
        meta: { title: "周报" },
      },
    ],
  },
  {
    path: "/WeeklyReportSummary",
    component: Layout,
    children: [
      {
        path: "WeeklyReportSummary",
        name: "WeeklyReportSummary",
        component: () => import("@/views/WeeklyReportSummary/index"),
        // meta: { title: "周报汇总", icon: "weekly" },
        meta: { title: "周报汇总"  },
      },
    ],
  },
  {
    path: "/absence",
    component: Layout,
    children: [
      {
        path: "absence",
        name: "absence",
        component: () => import("@/views/absence/index"),
        // meta: { title: "请假", icon: "weekly" },
        meta: { title: "请假"},
      },
    ],
  },{
    path: "/approval",
    component: Layout,
    children: [
      {
        path: "approval",
        name: "approval",
        component: () => import("@/views/approval/index"),
        // meta: { title: "审批", icon: "absence" },
        meta: { title: "审批"},
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
