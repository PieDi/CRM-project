<template>
  <PageWrapper title="员工管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="员工姓名">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.userName"
          />
        </FormItem>

        <!-- <FormItem label="证件号码" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" />
        </FormItem> -->
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="true"
      :loading="loading"
      :striped="false"
      :bordered="true"
      :pagination="pagination"
    >
      <!-- @ts-ignore -->
      <template #bodyCell="{ column, _text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                scanStaff(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            danger
            @click="
              () => {
                deleteStaff(record);
              }
            "
            >删除</Button
          >
        </template>
      </template>
    </Table>

    <Drawer
      :destroy-on-close="true"
      :title="drawerInfo.title"
      placement="right"
      @close="drawerOnClose"
      :visible="drawerInfo.visible"
    >
      <template #extra>
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="drawerEdit">编辑</Button>
        <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="员工姓名">
          <Input
            disabled
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.userName"
          />
        </FormItem>
        <FormItem label="员工电话">
          <Input disabled placeholder="请输入" allowClear v-model:value="drawerInfo.item.mobile" />
        </FormItem>
        <FormItem label="员工邮箱">
          <Input disabled placeholder="请输入" allowClear v-model:value="drawerInfo.item.email" />
        </FormItem>
        <!-- <FormItem label="性别">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem> -->
        <FormItem label="授权管理">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.role"
          >
            <SelectOption key="super">超管</SelectOption>
            <SelectOption key="admin">管理员</SelectOption>
            <SelectOption key="staff">普通员工</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="状态管理">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.status"
          >
            <SelectOption :key="1">激活</SelectOption>
            <SelectOption :key="0">禁用</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, reactive, createVNode, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, Select, message } from 'ant-design-vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { getUserList, deleteUser } from '/@/api/sys/user';
  import { UserInfo } from '/#/store';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const roleMap: { [key: string]: string } = {
    super: '超管',
    admin: '管理员',
    staff: '员工',
  };
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      Select,
      SelectOption,
      message,
    },
    setup() {
      const searchInfo = reactive({ userName: undefined });
      const drawerInfo = ref<DrawerItemType<UserInfo>>({
        visible: false,
        title: '',
        item: {
          userId: undefined,
          userName: undefined,
          email: undefined,
          mobile: undefined,
          status: undefined,
          role: undefined,
        },
      });

      const pageInfo = ref<PageListInfo<UserInfo>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const loading = ref(false);
      const pagination = computed(() => ({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          userListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const userListReq = async (pageNum: number) => {
        loading.value = true;
        const res = await getUserList({ userName: searchInfo.userName, pageNum });
        loading.value = false;
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.dataSource = res.data;
        }
      };
      const searchAction = () => {
        userListReq(1);
      };
      onMounted(() => {
        userListReq(1);
      });

      const columns: ColumnsType<UserInfo> = [
        {
          title: '员工姓名',
          dataIndex: 'userName',
        },
        {
          title: '电话',
          dataIndex: 'address',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
        },
        // {
        //   title: '性别',
        //   dataIndex: 'no',
        // },
        {
          title: '状态',
          dataIndex: 'status',
          customRender: (state) => (state.record.status ? '激活' : '未激活'),
        },
        {
          title: '角色权限',
          dataIndex: 'role',
          customRender: (state) => roleMap[state.record?.role as string],
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const submit = () => {
        console.log('编辑提交');
      };
      const scanStaff = (item: UserInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看员工信息';
        drawerInfo.value.type = 'scan';

        drawerInfo.value.item.email = item.email;
        drawerInfo.value.item.userName = item.userName;
        drawerInfo.value.item.status = item.status;
        drawerInfo.value.item.role = item.role;
        drawerInfo.value.item.mobile = item.mobile;
        drawerInfo.value.item.userId = item.userId;
      };
      const deleteStaff = (item: UserInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该员工',
            async onOk() {
              const res = await deleteUser(item.userId as number);
              if (res) {
                message.success('删除员工成功');
                userListReq(pageInfo.value.current);
              }
            },
          }),
        );

    
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        // 重置 item 数据
        drawerInfo.value.item.email = undefined;
        drawerInfo.value.item.userName = undefined;
        drawerInfo.value.item.status = undefined;
        drawerInfo.value.item.role = undefined;
        drawerInfo.value.item.mobile = undefined;
        drawerInfo.value.item.userId = undefined;
      };
      const drawerEdit = () => {
        drawerInfo.value.title = '编辑员工信息';
        drawerInfo.value.type = 'edit';
      };
      // const activateStaff = (item: any) => {
      //   message.success('激活员工成功');
      // };
      // const unUseStaff = (item: any) => {
      //   message.success('禁用员工成功');
      // };

      return {
        columns,
        loading,
        pagination,
        searchInfo,
        pageInfo,
        drawerInfo,
        submit,
        scanStaff,
        deleteStaff,
        drawerOnClose,
        drawerEdit,
        searchAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
