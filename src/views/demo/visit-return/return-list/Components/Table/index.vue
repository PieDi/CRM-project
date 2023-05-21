<template>
  <Table 
    :columns="columns"
    :dataSource="data"
    :canResize="false"
    :loading="loading"
    :striped="false"
    :bordered="true"
    :pagination="pagination"
    >
    </Table>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Table } from 'ant-design-vue';
import { getReturnListData } from '../../../../table/tableData';

export default defineComponent({
  components: {
    Table
  },
  setup(props, { emit }) {
    const loading = ref<boolean>(false)
    const current = ref<number>(1)
    const pagination = ref({
      total: 100,
      current,
      pageSize: 10,
      showTotal: (total: number) => `共${total}条`,
      onChange: (page: number) => {
        console.log(`当前page: ${page}`)
        current.value = page
        emit('pageChange', page)
      },
      showQuickJumper: false,
      showSizeChanger: false
    })
    const columns: any = [
      {
        title: '患者姓名',
        dataIndex: 'name',
        width: 100
      },
      {
        title: '患者来源',
        dataIndex: 'source'
      },
      {
        title: '标签',
        dataIndex: 'tag'
      },
      {
        title: '疾病种类',
        dataIndex: 'kind'
      },
      {
        title: '患者等级',
        dataIndex: 'level'
      },
      {
        title: '计划回访时间',
        dataIndex: 'time'
      },
      {
        title: '联系电话',
        dataIndex: 'mobile'
      },
      {
        title: '回访类型',
        dataIndex: 'type'
      },
      {
        title: '执行人员',
        dataIndex: 'staff'
      },
      {
        title: '回访状态',
        dataIndex: 'status'
      },
      {
        title: '操作',
        dataIndex: 'operator'
      }
    ]

    return {
      loading,
      pagination,
      columns,
      data: getReturnListData()
    }
  }
})
</script>

<style lang="less" scoped>
.recent-return-list__wrapper {
}
</style>