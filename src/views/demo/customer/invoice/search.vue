<template>
  <PageWrapper title="客户发票管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="发票名称">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.name"
          />
        </FormItem>

        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="false"
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
          <Button
            type="link"
            @click="
              () => {
                previewInvoice(record);
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
  import { defineComponent, computed, onMounted, ref } from 'vue';
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
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { PageListInfo } from '/@/views/type';
  import { CustomerInvoiceInfo } from '/@/api/demo/model/customer';
  import { getCustomerInvoicePage } from '/@/api/demo/customer';
  import { useRoute } from 'vue-router';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
const TextArea = Input.TextArea;

const productTypeMap: Record<number, string> = {
  1: '标准订单',
  2: '非标订单'
}
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
      const route = useRoute();
      const invoiceOrderListReq = async (pageNum: number) => {
        const res = await getCustomerInvoicePage({
          ...searchInfo.value,
          pageNum,
          id: route?.query.id as string,
        });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const searchInfo = ref({
        name: undefined,
      });
      const pageInfo = ref<PageListInfo<CustomerInvoiceInfo>>({
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
          invoiceOrderListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));

      const resetAction = () => {
        searchInfo.value.name = undefined;
        invoiceOrderListReq(1);
      };
      const searchAction = () => {
        invoiceOrderListReq(1);
      };
      onMounted(() => {
        invoiceOrderListReq(1);
      });
      const columns: ColumnsType<CustomerInvoiceInfo> = [
        {
          title: '发票名称',
          dataIndex: 'name',
        },
        {
          title: '订单名称',
          dataIndex: 'orderName',
        },
        {
          title: '客户姓名',
          dataIndex: 'customerName'
        },
        
        {
          title: '订单数量',
          dataIndex: 'orderQuantity',
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount',
        },
        {
          title: '订单类型',
          dataIndex: 'productType',
          customRender:(state) => productTypeMap[state.record.productType as number]
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      const downloadInvoice = (item) => {};
      const previewInvoice = (item) => {};

      return {
        columns,
        pagination,
        searchInfo,
        resetAction,
        searchAction,
        pageInfo,
        // drawerInfo,

        downloadInvoice,
        previewInvoice,
      };
    },
  });
</script>
<style lang="less" scoped></style>
