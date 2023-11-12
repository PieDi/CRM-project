<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="更多"
    @cancel="drawerOnClose"
    @ok="drawerOnClose"
    :visible="drawerInfo.visible"
    :width="800"
  >
    <template v-if="drList.length">
      <div v-for="item of drList" class="dr-list">
        <Tooltip :title="item.itemDate">
          <div class="aaa">{{ item.itemDate }}</div></Tooltip
        >
        <Tooltip :title="item.name">
          <div class="aaa">{{ item.name }}</div></Tooltip
        >
        <div
          ><Button
            type="link"
            @click="
              () => {
                DREdit(item.id);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            @click="
              () => {
                DRScan(item.id);
              }
            "
            >查看</Button
          ><Button
            type="link"
            @click="
              () => {
                dataReportDownload(item.id);
              }
            "
            >下载</Button
          ><Button
            type="link"
            danger
            @click="
              () => {
                DRDelete(item.id);
              }
            "
            >删除</Button
          ></div
        >
      </div>
    </template>
    <template v-else>
      <div>暂无数据</div>
    </template>
  </Modal>
  <!-- MSC -->
  <MscModal
    v-if="MSCDrawerInfo.visible"
    :customer-id="MSCDrawerInfo.customerId"
    :drawer-info="MSCDrawerInfo"
    @drawerOnClose="MSCClose"
    @submit="MSCSubmit"
  ></MscModal>
  <!-- NK -->
  <NkModal
    v-if="NKDrawerInfo.visible"
    :customer-id="MSCDrawerInfo.customerId"
    :drawer-info="NKDrawerInfo"
    @drawerOnClose="NKClose"
    @submit="NKSubmit"
  ></NkModal>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, PropType, onBeforeMount, createVNode } from 'vue';
  import { Button, Modal, Tooltip, message } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { getDataReportList, deleteDataReport, getDataReport } from '/@/api/demo/customer';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import MscModal from './msc-modal.vue';
  import NkModal from './nk-modal.vue';
  export default defineComponent({
    components: {
      Button,
      Modal,
      Tooltip,
      MscModal,
      NkModal,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<any>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const drList = ref<
        Array<{
          id: number;
          itemDate: string;
          name: string;
        }>
      >([]);
      const request = async () => {
        const res = await getDataReportList({ customerId: props.drawerInfo.id });
        if (res) {
          drList.value = res;
        } else {
          drList.value = [];
        }
      };
      onBeforeMount(async () => {
        request();
      });
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };

      // MSC
      const MSCDrawerInfo = reactive({
        visible: false,
        type: undefined,
        itemDate: undefined,
        item: undefined,
        customerId: props.drawerInfo.id,
      });

      const MSCClose = () => {
        MSCDrawerInfo.visible = false;
        MSCDrawerInfo.item = undefined;
        MSCDrawerInfo.itemDate = undefined;
      };
      const MSCSubmit = () => {
        MSCClose();
        emit('submit');
      };
      // NK
      const NKDrawerInfo = reactive({
        visible: false,
        type: undefined,
        itemDate: undefined,
        item: undefined,
        customerId: props.drawerInfo.id,
      });
      const NKClose = () => {
        NKDrawerInfo.visible = false;
        NKDrawerInfo.item = undefined;
        NKDrawerInfo.itemDate = undefined;
      };
      const NKSubmit = () => {
        NKClose();
        emit('submit');
      };
      const DRDelete = (id: number) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除msc项',
            async onOk() {
              const res = await deleteDataReport({ id });
              if (res) {
                message.success('删除msc项成功');
                emit('submit');
              }
            },
          }),
        );
      };
      const dataReportDownload = (id: number) => {
        window.open(`http://129.204.202.223:8001/basic-api/customer/dataReport/export?id=${id}`);
      };
      const DRScan = async (id: number) => {
        const res = await getDataReport({ id });
        if (res) {
          if (res.name === 'msc') {
            MSCDrawerInfo.visible = true;
            //@ts-ignore
            MSCDrawerInfo.type = 'scan';
            MSCDrawerInfo.item = res?.item;
            MSCDrawerInfo.itemDate = res?.itemDate;
          }
        } else {
          NKDrawerInfo.visible = true;
          //@ts-ignore
          NKDrawerInfo.type = 'scan';
          NKDrawerInfo.item = res?.item;
          NKDrawerInfo.itemDate = res?.itemDate;
        }
      };
      const DREdit = async (id: number) => {
        const res = await getDataReport({ id });
        if (res) {
          if (res.name === 'msc') {
            MSCDrawerInfo.visible = true;
            //@ts-ignore
            MSCDrawerInfo.type = 'edit';
            MSCDrawerInfo.item = res?.item;
            MSCDrawerInfo.itemDate = res?.itemDate;
          }
        } else {
          NKDrawerInfo.visible = true;
          //@ts-ignore
          NKDrawerInfo.type = 'edit';
          NKDrawerInfo.item = res?.item;
          NKDrawerInfo.itemDate = res?.itemDate;
        }
      };
      return {
        drawerInfo: props.drawerInfo,
        drawerOnClose,
        drList,
        //数据分析
        DRScan,
        DREdit,
        DRDelete,
        dataReportDownload,
        //msc
        MSCDrawerInfo,
        MSCClose,
        MSCSubmit,
        //nk
        NKDrawerInfo,
        NKClose,
        NKSubmit,
      };
    },
  });
</script>
<style lang="less" scoped>
  .dr-list {
    display: flex;
    align-items: center;

    .aaa {
      width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-right: 10px;
    }
  }
</style>
