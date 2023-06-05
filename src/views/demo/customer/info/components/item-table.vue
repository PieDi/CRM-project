<template>
  <Table
    :scroll="{ y: 180 }"
    :columns="columns"
    :dataSource="dataSource"
    :canResize="true"
    :bordered="true"
    :pagination="false"
  >
  </Table>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Table } from 'ant-design-vue';

  export default defineComponent({
    components: {
      Table,
    },
    props: {
      dataSource: {
        type: Object as PropType<any[]>,
      },
      columns: {
        type: Object as PropType<any[]>,
      },
    },
    setup(props) {
      return {
        columns: props.columns,
        dataSource: props.dataSource,
      };
    },
  });
</script>
<style lang="less" scoped>

</style>
