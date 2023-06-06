<template>
  <Table
    :scroll="{ y: 180 }"
    :columns="columns"
    :dataSource="dataSource"
    :canResize="true"
    :bordered="true"
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
        <Button type="link" @click="()=>{linkClick(record.diseaseId as number)}">{{ text }}</Button>
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
<style lang="less" scoped></style>
