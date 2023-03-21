import Layout from "/@/layout/index.vue";
import { shallowRef } from "vue";
import { useI18n } from "/@/utils/useI18n";
const { t } = useI18n();
const dictsRouter = {
  path: "/dicts",
  name: "dicts",
  component: shallowRef(Layout),
  redirect: "/dicts/testMethod",
  meta: {
    title: t("routes.dicts.basicDictionary"),
    icon: "fluent-emoji:green-book",
    permissions: ["tims:dict"],
  },
  children: [
    {
      path: "testMethod",
      name: "DictsTestMethod",
      component: () => import("/@/views/dicts/testMethod/index.vue"),
      meta: {
        title: t("routes.dicts.testMethod"),
        permissions: ["tims:dict:test_method"],
      },
    },
    {
      path: "sampleType",
      name: "DictsSampleType",
      component: () => import("/@/views/dicts/sampleType/index.vue"),
      meta: {
        title: t("routes.dicts.sampleType"),
        permissions: ["tims:dict:sample_type"],
      },
    },
    {
      path: "resultPrecision",
      name: "DictsResultPrecision",
      component: () => import("/@/views/dicts/resultPrecision/index.vue"),
      meta: {
        title: t("routes.dicts.resultPrecision"),
        permissions: ["tims:dict:result_precision"],
      },
    },
  ],
};
export default dictsRouter;
