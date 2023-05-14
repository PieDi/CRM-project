<template>
  <PageWrapper title="回访信息查询">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户名称">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <FormItem label="客户标签" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <Button type="primary" style="margin-left: 10px">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addCustomer">新增回访</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="data"
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
                editCustomer(record);
              }
            "
            >编辑</Button
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
        <Button type="primary">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="客户姓名">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="客户电话">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="性别">
          <Select placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件类型">
          <Select placeholder="请选择">
            <SelectOption key="1">身份证</SelectOption>
            <SelectOption key="2">护照</SelectOption>
            <SelectOption key="3">军官证</SelectOption>
            <SelectOption key="4">港澳通行证</SelectOption>
            <SelectOption key="5">台湾通行证</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件号码">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>

        <FormItem label="出生日期">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="年龄">
          <InputNumber placeholder="请输入" allowClear min="1" :precision="0" />
        </FormItem>
        <FormItem label="客户等级">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="客户来源">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="联系地址">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="标签">
          <Select placeholder="请输入" mode="tags">
            <!-- <SelectOption key="1">身份证</SelectOption>
            <SelectOption key="2">护照</SelectOption>
            <SelectOption key="3">军官证</SelectOption>
            <SelectOption key="4">港澳通行证</SelectOption>
            <SelectOption key="5">台湾通行证</SelectOption> -->
          </Select>
        </FormItem>
        <FormItem label="所属分组">
          <Select placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem>
      </Form>
      <!-- <FormItem label="客户电话">
        <TextArea placeholder="请输入" allowClear :value="cInfo.des" />
      </FormItem> -->
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, Select, InputNumber } from 'ant-design-vue';
  import { getBasicData } from '../table/tableData';

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
    },
    setup() {
      const drawerInfo = ref({ visible: false, title: '' });
      const cInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const loading = ref(false);
      const pagination = ref({
        total: 50,
        current: 1,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          console.log(2132323, page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      });

      const columns: any = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '电话',
          dataIndex: 'address',
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
          title: '标签',
          width: 150,
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
      };
      const editCustomer = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '编辑客户';
      };
      const deleteCustomer = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
      };
      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        drawerInfo,
        cInfo,
        addCustomer,
        editCustomer,
        deleteCustomer,
        drawerOnClose,
      };
    },
  });
</script>
<style lang="less" scoped></style>