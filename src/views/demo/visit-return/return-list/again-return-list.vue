<template>
  <div>
    <!-- 筛选框 -->
    <return-list-filter />
    <!-- 表格列表 -->
    <return-list-table />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ReturnListFilter from './Components/Filter/index.vue'
import ReturnListTable from './Components/Table/index.vue'

export default defineComponent({
  components: {
    ReturnListFilter,
    ReturnListTable
  },
  setup() {
    return {

    }
  }
})
</script>

<style lang="less" scoped>
</style>