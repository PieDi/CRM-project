<template>
  <PageWrapper title="合同模板">
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }">
      <div :style="{ display: 'flex' }"></div>
      <Button v-if="authShow" type="primary" style="margin-left: 10px" @click="addFile"
        >新建文件夹</Button
      >
    </div>
    <div class="file-content">
      <div
        v-for="(item, i) in fileList"
        :key="i"
        class="file-item"
        @click="
          () => {
            fileClick(item);
          }
        "
      >
        <FolderTwoTone style="font-size: 80px" />
        <div>{{ item }}</div>
        <div class="btn"
          ><Button
            v-if="authShow"
            type="link"
            @click="(e:MouseEvent)=>{
              deleteFile(item)
              e.stopPropagation()
            }"
            >删除</Button
          ></div
        >
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
        <Button type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="文件夹名称">
          <Input placeholder="请输入" allowClear v-model:value="drawerInfo.item.name" />
        </FormItem>
        <!-- <FormItem label="描述">
          <TextArea placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem> -->
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, toRaw, computed, createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, message } from 'ant-design-vue';
  import { createTemplate, getTemplateList, deleteTemplate } from '/@/api/demo/contact';
  import { type DrawerItemType } from '/@/views/type';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined, FolderTwoTone } from '@ant-design/icons-vue';

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
      FolderTwoTone,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });

      const router = useRouter();
      const drawerInfo = ref<DrawerItemType<{ name: string | undefined }>>({
        visible: false,
        title: '',
        item: { name: undefined },
      });
      const fileList = ref<Array<string>>([]);
      const tListReq = async (path?: string) => {
        const res = await getTemplateList(path);
        if (res) fileList.value = res;
      };
      onMounted(() => {
        tListReq('');
      });
      const addFile = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新建文件夹';
      };
      const editFile = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '编辑文件夹';
      };

      const deleteFile = (item) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该文件夹',
            async onOk() {
              const res = await deleteTemplate({ path: `/${item}` });
              if (res) {
                message.success('删除文件夹');
                tListReq('');
              }
            },
          }),
        );
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
      };
      const submit = async () => {
        const res = await createTemplate({ ...drawerInfo.value.item });
        if (res) {
          message.success('新建文件夹成功');
          tListReq('');
        }
      };
      const fileClick = (name: string) => {
        router.push({ path: '/customer/contact/t-group', query: { name } });
      };
      return {
        drawerInfo,
        fileList,
        addFile,
        editFile,
        fileClick,
        deleteFile,
        drawerOnClose,
        submit,
        authShow,
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
      padding: 10px;
      height: 120px;
      div {
        margin-top: -10px;
        width: 100%;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .btn {
        display: none;
        text-align: center;
      }
    }
    .file-item:hover {
      .btn {
        display: block;
      }
    }
  }
</style>
