<template>
  <div>
    <p>近期回访</p>
    <Table :columns="columns" :data-source="visitList" :bordered="true" :pagination="false"> </Table>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Table } from 'ant-design-vue';
  import { getVisitList } from '/@/api/demo/visit-return';
  import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import dayjs from 'dayjs';

  const visitTypeMap: Record<number, string> = {
    1: '电话回访',
    2: '线下回访',
    3: '其他',
  };
  export default defineComponent({
    components: {
      Table,
    },
    props: {
      customerId: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const visitList= ref<Array<VisitReturnInfo>>([])
      const visitRListReq = async () => {
        const res = await getVisitList({status: 2, customerId: props.customerId });
        if (res) visitList.value = res
      };
      onMounted(() => {
        visitRListReq();
      });
      const columns: ColumnsType<VisitReturnInfo> = [
        {
          title: '客户姓名',
          dataIndex: 'customerName',
        },
        {
          title: '回访项目',
          dataIndex: 'item',
        },
        {
          title: '回访类型',
          dataIndex: 'type',
          customRender: (state) => visitTypeMap[state.record.type as number],
        },
        {
          title: '回访时间',
          dataIndex: 'time',
          customRender: (state) => dayjs(state.record.visitTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '回访内容',
          dataIndex: 'visitContent',
        },
      ];
      return {
        columns,
        visitList
      };
    },
  });
</script>

<style lang="less" scoped></style>
