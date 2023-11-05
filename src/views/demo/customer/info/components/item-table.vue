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
    </Table>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { Modal, Table, Button } from 'ant-design-vue';

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
    },
    setup(props, { emit }) {
 
      const onModalCancel = () => {
        emit('close');
      };
      return {
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
