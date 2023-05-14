<template>
  <PageWrapper title="资料分类">
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }">
      <div :style="{ display: 'flex' }"></div>
      <Button type="primary" style="margin-left: 10px" @click="addFile">新建文件夹</Button>
    </div>
    <div class="file-content">
      <div v-for="(item, i) in fileList" :key="i" class="file-item">
        <div class="file-item-border" @click="fileClick">
          <p>{{ item.title }}</p>
          <div class="btn"
            ><Button type="link" @click="editFile">编辑</Button>
            <Button type="link" @click="deleteFile">删除</Button></div
          >
        </div>
      </div>
    </div>
    <Drawer
      :destroy-on-close="true"
      :title="drawerInfo.title"
      placement="right"
      @close="drawerOnClose"
      :visible="drawerInfo.visible"
    >
      <template #extra>
        <Button type="primary">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="文件夹名称">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="描述">
          <TextArea placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      TextArea,
    },
    setup() {
      const router = useRouter();
      const drawerInfo = ref({ visible: false, title: '' });
      const cInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const loading = ref(false);
      const fileList = ref([
        { id: 1, title: '1', des: '1', files: [] },
        { id: 2, title: '2', des: '2', files: [] },
        { id: 3, title: '3', des: '3', files: [] },
      ]);
      const addFile = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新建文件夹';
      };
      const editFile = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '编辑文件夹';
      };
      const deleteFile = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
      };
      const fileClick = () => {
        router.push({ name: 'DatumShareFileGroup' });
      };
      return {
        loading,
        drawerInfo,
        cInfo,
        fileList,
        addFile,
        editFile,
        fileClick,
        deleteFile,
        drawerOnClose,
      };
    },
  });
</script>
<style lang="less" scoped>
  .file-content {
    display: flex;
    width: auto;
    min-height: calc(100vh - 226px);
    background: #fff;
    .file-item {
      width: 200px;
      height: 200px;
      padding: 10px;
      .file-item-border {
        width: auto;
        height: 100%;
        border: 1px solid #eee;
        p {
          width: 100%;
          margin-top: 20px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .btn {
          display: none;
          padding: 0 29px;
        }
      }
      .file-item-border:hover {
        .btn {
          display: block;
        }
      }
    }
  }
</style>
