<template>
  <PageWrapper title="员工管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="员工姓名">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" />
        </FormItem>

        <FormItem label="证件号码" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" />
        </FormItem>
        <Button type="primary" style="margin-left: 10px">搜索</Button></div
      >
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
                scanStaff(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                activateStaff(record);
              }
            "
            >激活</Button
          >
          <Button
            type="link"
            danger
            @click="
              () => {
                unUseStaff(record);
              }
            "
            >禁用</Button
          >
          <Button
            type="link"
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
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>
        <FormItem label="员工电话">
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
        <FormItem label="授权管理">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">管理员</SelectOption>
            <SelectOption key="2">普通员工</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, Select, message } from 'ant-design-vue';
  import { getBasicData } from '../../demo/table/tableData';
  import { DrawerItemType } from '/@/views/type';
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
      message,
    },
    setup() {
      const drawerInfo = ref<DrawerItemType>({
        visible: false,
        title: '',
      });
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
          title: '员工姓名',
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
          title: '状态',
          dataIndex: 'endTime',
        },
        {
          title: '角色权限',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const submit = () => {
        console.log('编辑提交');
      };
      const scanStaff = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看员工信息';
        drawerInfo.value.item = item;
        drawerInfo.value.type = 'scan';
      };
      const deleteStaff = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.item = undefined;
        drawerInfo.value.type = undefined;
      };
      const drawerEdit = () => {
        drawerInfo.value.title = '编辑员工信息';
        drawerInfo.value.type = 'edit';
      };
      const activateStaff = (item: any) => {
        message.success('激活员工成功');
      };
      const unUseStaff = (item: any) => {
        message.success('禁用员工成功');
      };

      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        drawerInfo,
        cInfo,
        submit,
        scanStaff,
        deleteStaff,
        activateStaff,
        unUseStaff,
        drawerOnClose,
        drawerEdit,
      };
    },
  });
</script>
<style lang="less" scoped></style>
