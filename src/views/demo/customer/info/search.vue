<template>
  <PageWrapper title="客户信息管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户姓名">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.userName"
          />
        </FormItem>
        <FormItem label="负责人" style="margin-left: 10px">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            :style="{ width: '150px' }"
          >
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="证件号码" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" />
        </FormItem>

        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addCustomer">新增客户</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="false"
      :loading="loading"
      :striped="false"
      :bordered="true"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, _text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                scanCustomer(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteCustomer(record);
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

        <Button v-if="drawerInfo.type !== 'scan'" type="primary">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="客户姓名">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>

        <FormItem label="客户电话">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>
        <FormItem label="性别">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件类型">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">身份证</SelectOption>
            <SelectOption key="2">护照</SelectOption>
            <SelectOption key="3">军官证</SelectOption>
            <SelectOption key="4">港澳通行证</SelectOption>
            <SelectOption key="5">台湾通行证</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件号码">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>

        <FormItem label="出生日期">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>
        <FormItem label="年龄">
          <InputNumber
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            min="1"
            :precision="1"
          />
        </FormItem>
        <FormItem label="客户等级">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>
        <FormItem label="客户来源">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>
        <FormItem label="联系地址">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>
        <FormItem label="所属分组">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, Select, InputNumber } from 'ant-design-vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { getCustomerList } from '/@/api/demo/customer';
  import { UserInfo } from '/#/store';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
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
      InputNumber,
      ExclamationCircleOutlined,
    },
    setup() {
      const searchInfo = ref({
        userName: undefined,
        // title: '',
      });
      const drawerInfo = ref<DrawerItemType<UserInfo>>({
        visible: false,
        title: '',
      });
      const cInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const pageInfo = ref<PageListInfo<UserInfo>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const loading = ref(false);
      const pagination = ref({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 20,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          customerListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      });
      const customerListReq = async (pageNum: number) => {
        loading.value = true;
        const res = await getCustomerList({ userName: searchInfo.value.userName, pageNum });
        loading.value = false;
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.dataSource = res.data;
        }
      };
      const searchAction = () => {
        customerListReq(1);
      };
      onMounted(() => {
        customerListReq(1);
      });

      const columns: ColumnsType<UserInfo> = [
        {
          title: '姓名',
          dataIndex: 'userName',
        },
        {
          title: '电话',
          dataIndex: 'mobile',
        },
        {
          title: '性别',
          dataIndex: 'no',
        },
        {
          title: '证件类型',
          width: 150,
          dataIndex: 'beginTime',
        },
        {
          title: '证件号码',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '年龄',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '联系地址',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '负责人',
          width: 100,
          dataIndex: 'endTime',
        },
        {
          title: '所属分组',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addCustomer = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增客户';
        drawerInfo.value.type = 'add';
      };
      const scanCustomer = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看客户信息';
        drawerInfo.value.item = item;
        drawerInfo.value.type = 'scan';
      };
      const deleteCustomer = (item: UserInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该客户',
            async onOk() {
              console.log('OK');
            },
          }),
        );
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.item = undefined;
        drawerInfo.value.type = undefined;
      };
      const drawerEdit = () => {
        drawerInfo.value.title = '编辑客户信息';
        drawerInfo.value.type = 'edit';
      };
      return {
        columns,
        loading,
        pagination,
        pageInfo,
        drawerInfo,
        cInfo,
        searchInfo,
        addCustomer,
        scanCustomer,
        deleteCustomer,
        drawerOnClose,
        drawerEdit,
        searchAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
