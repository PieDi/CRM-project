<template>
  <Table
    class="aaaa"
    :scroll="{ y: 180 }"
    :columns="columns"
    :dataSource="dataSource"
    :canResize="true"
    :bordered="false"
    :pagination="false"
  >
    <template #bodyCell="{ record, text, column }">
      <template
        v-if="
          column.dataIndex === 'medicineName' ||
          column.dataIndex === 'checkMechanism' ||
          column.dataIndex === 'consultationExpert'
        "
      >
        <Button type="link" style="color: rgb(0, 255, 250);" @click="()=>{linkClick(record.diseaseId as number)}">{{ text }}</Button>
      </template>
    </template>
  </Table>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Table, Button } from 'ant-design-vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      Table,
      Button,
    },
    props: {
      dataSource: {
        type: Object as PropType<any[]>,
      },
      columns: {
        type: Object as PropType<any[]>,
      },
    },
    setup(props, { emit }) {
      const router = useRouter();
      const linkClick = (id: number) => {
        router.push({ path: '/customer/mHistory/search', query: { id } });
      };
      return {
        linkClick,
        columns: props.columns,
        dataSource: props.dataSource,
      };
    },
  });
</script>
<style lang="less">
  .aaaa {
    .ant-table-thead > tr > th {
      color: #fff;
      background: transparent;
      border-right: none;
    }
    .ant-table-cell-scrollbar {
      // box-shadow: none;
      opacity: 0;
    }
    .ant-table {
      background: transparent;
      color: #fff;
    }
    .ant-table-tbody > tr.ant-table-row:hover > td  {
      background: transparent;
    }
  }
</style>
