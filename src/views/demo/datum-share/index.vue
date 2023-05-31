<template>
  <PageWrapper title="资料分类">
    <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }">
      <div :style="{ display: 'flex' }"></div>
      <Button v-if="authShow" type="primary" style="margin-left: 10px" @click="addFile">新建文件夹</Button>
    </div>
    <div class="file-content">
      <div v-for="(item, i) in fileList" :key="i" class="file-item">
        <div
          class="file-item-border"
          @click="
            () => {
              fileClick(item);
            }
          "
        >
          <p>{{ item }}</p>
          <div class="btn">
           <!--  <Button type="link" @click="(e:MouseEvent)=>{
              editFile(item)
              e.stopPropagation()
            }">编辑</Button>-->
            <Button type="link" @click="(e:MouseEvent)=>{
              deleteFile(item)
              e.stopPropagation()
            }">删除</Button></div> 
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
  import { defineComponent, ref, onMounted, toRaw, computed,createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, message } from 'ant-design-vue';
  import { createShare, getShareList,deleteShare } from '/@/api/demo/datum-share';
  import { type DrawerItemType } from '/@/views/type';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

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
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER, RoleEnum.ADMIN].includes(role));
      });

      const router = useRouter();
      const drawerInfo = ref<DrawerItemType<{ name: string | undefined }>>({
        visible: false,
        title: '',
        item: { name: undefined },
      });
      const fileList = ref<Array<string>>([]);
      const datumListReq = async (path?: string) => {
        const res = await getShareList(path);
        if (res) fileList.value = res;
      };
      onMounted(() => {
        datumListReq('');
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
              const res = await deleteShare({ path: `/${item}` });
              if (res) {
                message.success('删除文件夹');
                datumListReq('')
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
        const res = await createShare({ ...drawerInfo.value.item });
        if (res) {
          message.success('新建文件夹成功');
          datumListReq('');
        }
      };
      const fileClick = (name: string) => {
        router.push({ path: '/datum-share/file-group', query: { name } });
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
        authShow
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
          padding: 0 64px;
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
