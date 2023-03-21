<template>
  <span class="flex-box icon-box">
    <Icon v-if="getIcon" :icon="getIcon" :size="18" style="margin-right: 4px" />
    {{ getI18nName }}
    <span class="title"></span>
  </span>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import Icon from "/@/components/Icon/index";
import { useI18n } from "/@/utils/useI18n";
import { AppRouteRecordRaw } from "/@/router/types";
const { t } = useI18n();

export default defineComponent({
  name: "MenuItemContent",
  components: {
    Icon,
  },
  props: {
    item: {
      type: Object as PropType<AppRouteRecordRaw>,
      default: () => [],
    },
  },
  setup(props) {
    const getI18nName = computed(() => t(props.item?.meta?.title as string));
    const getIcon = computed(() => props.item?.meta?.icon as string);
    return {
      getI18nName,
      getIcon,
    };
  },
});
</script>

<style lang="less" scoped>
.icon-box {
  z-index: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.3s;
  }
}
</style>
