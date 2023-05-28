<template>
  <div>
    <p>近期回访</p>
    <Table
      :columns="columns"
      :data-source="datas"
      :bordered="true"
      :pagination="false"
    >

    </Table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Table } from 'ant-design-vue'

export default defineComponent({
  components: {
    Table
  },
  setup() {
    const columns: any = ref([
      {
        title: '回访时间',
        dataIndex: 'time'
      },
      {
        title: '回访方式',
        dataIndex: 'mode'
      },
      {
        title: '回访结果',
        dataIndex: 'result'
      },
      {
        title: '回访类型',
        dataIndex: 'type'
      },
      {
        title: '结果补充',
        dataIndex: 'operation'
      }
    ])
    
    const getDatas = () => {
      const datas: any = []
      for (let index = 0; index < 3; index++) {
        datas.push({
          time: '2023-5-22',
          mode: '回访方式',
          result: '回访结果',
          type: '回访类型'
        })
      }
      return datas
    }
    return {
      columns,
      datas: getDatas()
    }
  }
})
</script>

<style lang="less" scoped>

</style>