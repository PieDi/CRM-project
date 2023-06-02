<template>
  <Table :columns="columns" :data-source="dataSource" :bordered="true" :pagination="false"> </Table>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Table } from 'ant-design-vue';

  export default defineComponent({
    components: {
      Table,
    },
    props: {
      columns: {
        type: Object as PropType<any[]>,
        required: true,
      },
      dataSource: {
        type: Object as PropType<any[]>,
        required: true,
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

<style lang="less" scoped></style>
