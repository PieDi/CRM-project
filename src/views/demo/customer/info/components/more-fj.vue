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
    <div v-for="item of  fjList" class="fj-list">
      <div class="aaa">{{ item.fileName }}</div>
      <Button type="link">查看</Button>
      <Button type="link">下载</Button>
      <Button type="link" danger>删除</Button>
    </div>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, onBeforeMount } from 'vue';
  import { Button, Modal  } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
import { getFJList } from '/@/api/demo/customer';
  export interface UploadAA {
    id: any;
    type: any;
    visible: any;
  }
  export default defineComponent({
    components: {
      Button,
      Modal,
      DeleteOutlined,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<UploadAA>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const fjList = ref<Array<{
            id: number
            fileName: string
            filePath: string
        }>>([])
      onBeforeMount(async () => {
        const res = await getFJList({ id: props.drawerInfo.id, type: props.drawerInfo.type })
        console.log(2343, res)
        if(res) fjList.value = res
      });
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };

      return {
        drawerInfo: props.drawerInfo,
        drawerOnClose,
        fjList
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
