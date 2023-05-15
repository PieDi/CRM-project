<template>
  <PageWrapper title="客户发票管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户名称">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <FormItem label="订单名称" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <Button type="primary" style="margin-left: 10px">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addInvoice">发票关联</Button>
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
                downloadInvoice(record);
              }
            "
            >下载</Button
          >
          <!-- <Button
            type="link"
            @click="
              () => {
                deleteOrder(record);
              }
            "
            >删除</Button
          > -->
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
        <!-- <Button v-if="drawerInfo.type === 'scan'" type="link" @click="drawerEdit">编辑</Button> -->
        <Button v-if="drawerInfo.type !== 'scan'" type="primary">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="合同">
          <Select placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem>
        <FormItem label="订单">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>

        <FormItem label="其他">
          <TextArea placeholder="请输入" allowClear :value="cInfo.des" />
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
    Select,
    InputNumber,
    DatePicker,
  } from 'ant-design-vue';
  import { getBasicData } from '../../table/tableData';
  import { DrawerItemType } from '../type';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
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
      Select,
      SelectOption,
      InputNumber,
      DatePicker,
      TextArea,
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
          title: '客户姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '订单名称',
          dataIndex: 'address',
        },
        {
          title: '下单时间',
          dataIndex: 'no',
        },
        {
          title: '订单编号',
          width: 150,
          dataIndex: 'beginTime',
        },
        {
          title: '订单类型',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '订单金额',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '负责人',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addInvoice = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '发票关联';
        drawerInfo.value.type = 'add';
      };
      const downloadInvoice = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.item = undefined;
        drawerInfo.value.type = undefined;
      };

      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        drawerInfo,
        cInfo,
        addInvoice,
        downloadInvoice,
        drawerOnClose,
      };
    },
  });
</script>
<style lang="less" scoped></style>
