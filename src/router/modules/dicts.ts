import Layout from '/@/layout/index.vue'

const dictsRouter = {
  path: '/dicts',
  component: Layout,
  redirect: '/dicts/categoryItem',
  meta: {
    title: '基础字典',
    icon: 'icon_dict',
    permissions: ['tims:dict']
  },
  children: [
    {
      path: 'testMethod',
      name: 'DictsTestMethod',
      component: () => import('/@/views/dicts/testMethod/index.vue'),
      meta: { title: '检验方法', permissions: ['tims:dict:test_method'] }
    },
    {
      path: 'sampleType',
      name: 'DictsSampleType',
      component: () => import('/@/views/dicts/sampleType/index.vue'),
      meta: { title: '样本类型', permissions: ['tims:dict:sample_type'] }
    },
    {
      path: 'resultPrecision',
      name: 'DictsResultPrecision',
      component: () => import('/@/views/dicts/resultPrecision/index.vue'),
      meta: { title: '结果精度', permissions: ['tims:dict:result_precision'] }
    }
  ]
}
export default dictsRouter
