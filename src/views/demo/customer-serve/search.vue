<template>
  <PageWrapper title="客服查询">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客服名称">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <FormItem label="创建时间" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <Button type="primary" style="margin-left: 10px">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addCustomerServe">新增客服</Button>
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
                editCustomerServe(record);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteCustomerServe(record);
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
        <FormItem label="客服名称">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="手机号码">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="传真">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>

        <FormItem label="email">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>

        <FormItem label="联系地址">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="其他">
          <TextArea placeholder="请输入" allowClear :value="cInfo.name" />
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
  import { Table, Form, Input, Button, Drawer } from 'ant-design-vue';
  import { getBasicData } from '../table/tableData';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  type DrawerItemType = {
    visible: boolean;
    title: string;
    item?: any;
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
      TextArea,
    },
    setup() {
      const drawerInfo = ref<DrawerItemType>({ visible: false, title: '', item: undefined });
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
          title: '客服名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '手机号码',
          dataIndex: 'address',
        },
        {
          title: '传真',
          dataIndex: 'no',
        },
        {
          title: 'email',
          dataIndex: 'beginTime',
        },
        {
          title: '联系地址',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '其他',
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addCustomerServe = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增客服';
      };
      const editCustomerServe = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '编辑客服';
      };
      const deleteCustomerServe = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.item = undefined;
      };
      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        drawerInfo,
        cInfo,
        addCustomerServe,
        editCustomerServe,
        deleteCustomerServe,
        drawerOnClose,
      };
    },
  });
</script>
<style lang="less" scoped></style>
