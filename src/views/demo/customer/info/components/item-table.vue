<template>
  <Modal
    :title="modalConfig.title"
    :visible="modalConfig.visible"
    :maskClosable="false"
    @cancel="onModalCancel"
    :footer="null"
    width="50%"
  >
    <Table
      :columns="modalConfig.columns"
      :dataSource="modalConfig.dataSource"
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
          <Button
            type="link"
            style="color: #0960bd"
            @click="()=>{linkClick(record.diseaseId as number)}"
            >{{ text }}</Button
          >
        </template>
      </template>
    </Table>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Modal, Table, Button } from 'ant-design-vue';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      Modal,
      Table,
      Button,
    },
    props: {
      modalConfig: {
        required: true,
        type: Object as PropType<{
          dataSource: any[];
          columns: any[];
          visible: boolean;
          title: string;
        }>,
      },
      // dataSource: {
      //   type: Object as PropType<any[]>,
      // },
      // columns: {
      //   type: Object as PropType<any[]>,
      // },
    },
    setup(props, { emit }) {
      const router = useRouter();
      const linkClick = (id: number) => {
        router.push({ path: '/customer/mHistory/search', query: { id } });
      };
      const onModalCancel = () => {
        emit('close');
      };
      return {
        linkClick,
        modalConfig: props.modalConfig,
        onModalCancel,
      };
    },
  });
</script>
<style lang="less">
  // .aaaa {
  //   .ant-table-thead > tr > th {
  //     color: #fff;
  //     background: transparent;
  //     border-right: none;
  //   }
  //   .ant-table-cell-scrollbar {
  //     // box-shadow: none;
  //     opacity: 0;
  //   }
  //   .ant-table {
  //     background: transparent;
  //     color: #fff;
  //   }
  //   .ant-table-tbody > tr.ant-table-row:hover > td {
  //     background: transparent;
  //   }
  // }
</style>
