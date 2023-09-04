<template>
  <PageWrapper title="用户权限管理">
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
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="true"
      :striped="false"
      :bordered="true"
      :pagination="pagination"
    >
      <!-- @ts-ignore -->
      <template #bodyCell="{ column, _text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            v-if="record.status"
            type="link"
            @click="
              () => {
                unUseStaff(record);
              }
            "
            >禁用</Button
          ><Button
            v-else
            type="link"
            @click="
              () => {
                activateStaff(record);
              }
            "
            >激活</Button
          >
          <Button
            v-if="record.role === 'staff'"
            type="link"
            @click="
              () => {
                promotionStaff(record);
              }
            "
            >授权</Button
          >
          <Button
            v-else
            type="link"
            @click="
              () => {
                demotionStaff(record);
              }
            "
            >降权</Button
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
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, Select, message } from 'ant-design-vue';
  import { type PageListInfo } from '/@/views/type';
  import { getUserPage, deleteUser, authUser, promotionUser,demotionUser } from '/@/api/sys/user';
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
      const searchInfo = ref({ userName: undefined });

      const pageInfo = ref<PageListInfo<UserInfo>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const pagination = computed(() => ({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          userPageReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const userPageReq = async (pageNum: number) => {
        const res = await getUserPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => { 
        searchInfo.value.userName = undefined
        userPageReq(1);
      }
      const searchAction = () => {
        userPageReq(1);
      };
      onMounted(() => {
        userPageReq(1);
      });

      const columns: ColumnsType<UserInfo> = [
        {
          title: '员工姓名',
          dataIndex: 'realName',
        },
        {
          title: '电话',
          dataIndex: 'mobile',
        },
        {
          title: '邮箱',
          dataIndex: 'email',
        },
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

      const deleteStaff = (item: UserInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该员工',
            async onOk() {
              const res = await deleteUser(item.userId as number);
              if (res) {
                message.success('删除员工成功');
                userPageReq(pageInfo.value.current);
              }
            },
          }),
        );
      };

      const activateStaff = (item: UserInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定激活该员工',
            async onOk() {
              const res = await authUser({ status: 1, userId: item.userId });
              if (res) {
                message.success('激活员工成功');
                userPageReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      const unUseStaff = (item: UserInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定禁用该员工',
            async onOk() {
              const res = await authUser({ status: 0, userId: item.userId });
              if (res) {
                message.success('禁用员工成功');
                userPageReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      const promotionStaff = (item: UserInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定授权该员工',
            async onOk() {
              const res = await promotionUser(item.userId as number);
              if (res) {
                message.success('授权员工成功');
                userPageReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      const demotionStaff = (item: UserInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定降权该员工',
            async onOk() {
              const res = await demotionUser(item.userId as number);
              if (res) {
                message.success('降权员工成功');
                userPageReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      

      return {
        columns,
        pagination,
        searchInfo,
        pageInfo,
        deleteStaff,
        resetAction,
        searchAction,
        activateStaff,
        unUseStaff,
        promotionStaff,
        demotionStaff
      };
    },
  });
</script>
<style lang="less" scoped></style>
