<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="更多"
    @cancel="drawerOnClose"
    @ok="drawerOnClose"
    :visible="drawerInfo.visible"
    :width="600"
  >
    <template v-if="fjList.length">
      <div v-for="item of fjList" class="fj-list">
        <div class="aaa">{{ item.fileName }}</div>
        <Button
          type="link"
          @click="
            () => {
              handlePreView(item.id);
            }
          "
          >查看</Button
        >
        <Button
          type="link"
          @click="
            () => {
              handleDownload(item.id);
            }
          "
          >下载</Button
        >
        <Button
          type="link"
          danger
          @click="
            () => {
              deleteFile(item.id);
            }
          "
          >删除</Button
        >
      </div>
    </template>
    <template v-else>
      <div>暂无数据</div>
    </template>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, onBeforeMount, createVNode } from 'vue';
  import { Button, Modal, message } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { getFJList } from '/@/api/demo/customer';
  import { getCustomerFileView, getCustomerFileRemove } from '/@/api/demo/customer';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';

  export interface UploadAA {
    id: any;
    type: any;
    visible: any;
  }
  export default defineComponent({
    components: {
      Button,
      Modal,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<UploadAA>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const fjList = ref<
        Array<{
          id: number;
          fileName: string;
          filePath: string;
        }>
      >([]);
      const request = async () => {
        const res = await getFJList({ id: props.drawerInfo.id, type: props.drawerInfo.type });
        if (res) {
          fjList.value = res;
        } else {
          fjList.value = [];
        }
      };
      onBeforeMount(async () => {
        request();
      });
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };

      const handlePreView = async (id: number) => {
        const res = await getCustomerFileView(id);
        if (res) {
          window.open(res);
        }
      };
      const handleDownload = async (id: number) => {
        if (id)
          window.open(`http://129.204.202.223:8001/basic-api/customer/file/download?fileId=${id}`);
      };
      const deleteFile = (id: number) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该文件',
            async onOk() {
              const res = await getCustomerFileRemove(id);
              if (res) {
                message.success('删除文件');
                request();
                emit('submit');
              }
            },
          }),
        );
      };
      return {
        drawerInfo: props.drawerInfo,
        drawerOnClose,
        fjList,
        handlePreView,
        handleDownload,
        deleteFile,
      };
    },
  });
</script>
<style lang="less" scoped>
  .fj-list {
    display: flex;
    align-items: center;

    .aaa {
      width: 240px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      margin-right: 20px;
    }
  }
</style>
