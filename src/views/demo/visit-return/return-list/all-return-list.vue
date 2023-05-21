<template>
  <div>
    <!-- 筛选框 -->
    <return-list-filter @search="search" />
    <!-- 表格列表 -->
    <return-list-table @pageChange="pageChange" />
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
    const search = () => {
      console.log('搜索')
    }
    const pageChange = (page) => {
      console.log(`当前页码为${page}`)
    }
    return {
      search,
      pageChange
    }
  }
})
</script>

<style lang="less" scoped>
</style>