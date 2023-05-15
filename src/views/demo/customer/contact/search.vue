<template>
  <PageWrapper title="客户合同管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="合同名称">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <FormItem label="客户姓名" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear />
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
                downloadContact(record);
              }
            "
            >下载</Button
          >
          <Button
            type="link"
            @click="
              () => {
                previewContact(record);
              }
            "
            >预览</Button
          >
        </template>
      </template>
    </Table>
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
          title: '合同名称',
          width: 150,
          dataIndex: 'endTime',
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

      const downloadContact = (item) => {};
      const previewContact = (item) => {};

      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        cInfo,
        downloadContact,
        previewContact,
      };
    },
  });
</script>
<style lang="less" scoped></style>
