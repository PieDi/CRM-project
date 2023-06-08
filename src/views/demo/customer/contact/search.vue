<template>
  <PageWrapper title="客户合同管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="合同名称">
          <Input 
          placeholder="请输入"
           allowClear 
           :style="{ width: '150px' }"
           v-model:value="searchInfo.contractNumber" 
           />
        </FormItem>
        <FormItem label="客户姓名" style="margin-left: 10px">
          <Input 
          placeholder="请输入"
           allowClear 
           :style="{ width: '150px' }" 
           v-model:value="searchInfo.customerName"
           />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction" >重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
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
      <template #bodyCell="{ column, record }">
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
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { defineComponent, ref ,onMounted, computed} from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { PageListInfo } from '/@/views/type';
  import { CustomerContractInfo } from '/@/api/demo/model/customer';
  import {
    getCustomerContractPage,
  } from '/@/api/demo/customer';
  import { useRoute } from 'vue-router';


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
      const searchInfo = ref({
        customerName: undefined,
        contractNumber: undefined,
      });
      const pageInfo = ref<PageListInfo<CustomerContractInfo>>({
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
          customerOrderListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const route = useRoute();
      const customerOrderListReq = async (pageNum: number) => {
        const res = await getCustomerContractPage({
          name:searchInfo.value.contractNumber,
          pageNum:pageNum,
          id: route?.query.id as string,
        });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;

          console.log(res.data);
        }
      };
      const resetAction = () => {
        searchInfo.value.customerName = undefined;
        searchInfo.value.contractNumber = undefined;
        customerOrderListReq(1);
      };
      const searchAction = () => {
        customerOrderListReq(1);
      };

      onMounted(() => {
        customerOrderListReq(1);
      });

      const columns: ColumnsType<CustomerContractInfo> = [
        // {
        //   title: '客户姓名',
        //   dataIndex: 'name',
        //   key: 'name',
        // },
        {
          title: '合同名称',
          width: 150,
          dataIndex: 'name',
        },
        {
          title: '下单时间',
          dataIndex: 'createTime',
        },
        {
          title: '订单编号',
          width: 150,
          dataIndex: 'no',
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
        // data: getBasicData(),
        loading,
        pagination,
        cInfo,
        downloadContact,
        previewContact,
        pageInfo,
        customerOrderListReq,
        resetAction,
        searchAction,
        onMounted,
        searchInfo,
      };
    },
  });
</script>
<style lang="less" scoped></style>
