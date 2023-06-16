<template>
  <PageWrapper title="客户合同管理" :back-show="showGoBack">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="合同名称">
          <Input 
          placeholder="请输入"
           allowClear 
           :style="{ width: '150px' }"
           v-model:value="searchInfo.name" 
           />
        </FormItem>
        <!-- <FormItem label="客户姓名" style="margin-left: 10px">
          <Input 
          placeholder="请输入"
           allowClear 
           :style="{ width: '150px' }" 
           v-model:value="searchInfo.customerName"
           />
        </FormItem> -->
          <Button type="primary" style="margin-left: 10px" @click="resetAction" >重置</Button>
          <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
        </div>
        <Button type="primary" style="margin-left: 10px" @click="addMHistory">新增合同</Button>

    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="false"
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
          <Button
            type="link"
            @click="
              () => {
                mRecordEdit(record);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            @click="
              () => {
                scanRecord(record);
              }
            "
            >查看</Button
            >
        </template>
      </template>
    </Table>
    <template v-if="mRecordDrawerInfo.visible">
      <m-record
        :drawer-info="mRecordDrawerInfo"
        @drawerOnClose="mRecordClose"
        @edit="mRecordEdit"
        @submit="mRecordSubmit"
      >
      </m-record>
    </template>
  </PageWrapper>
</template>

<script lang="ts">
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { defineComponent, ref ,onMounted, computed} from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { CustomerContractInfo } from '/@/api/demo/model/customer';
  import {getCustomerContractPage} from '/@/api/demo/customer';
  import { useRoute } from 'vue-router';
  
  import dayjs from 'dayjs';

  import mRecord from './components/addContract.vue';


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
      mRecord,
    },
    setup() {
      const searchInfo = ref({
        name: undefined,
      });
      const pageInfo = ref<PageListInfo<CustomerContractInfo>>({
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
          customerOrderListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const route = useRoute();
      const customerOrderListReq = async (pageNum: number) => {
        const res = await getCustomerContractPage({
          ...searchInfo.value,
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
        searchInfo.value.name = undefined;
        customerOrderListReq(1);
      };
      const searchAction = () => {
        customerOrderListReq(1);
      };

      const addCustomer = ()  => {

      };

      onMounted(() => {
        customerOrderListReq(1);
      });

      const columns: ColumnsType<CustomerContractInfo> = [
        {
          title: '合同名称',
          width: 150,
          dataIndex: 'name',
        },
        {
          title: '订单ID',
          dataIndex: 'orderId',
        },
        {
          title: '甲方',
          dataIndex: 'firstParty'
        },
        {
          title: '乙方',
          dataIndex: 'secondParty'
        },
        {
          title: '生效时间',
          dataIndex: 'effectiveStart',
          customRender: (state) => dayjs(state.record.effectiveStart).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '截止时间',
          dataIndex: 'effectiveEnd',
          customRender: (state) => dayjs(state.record.effectiveEnd).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      // 新增记录
      const addMHistory = () => {
        mRecordDrawerInfo.value.title = '新增客户病史';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.type = 'add';
      };

      // 弹框关闭
      const mRecordClose = () => {
        mRecordDrawerInfo.value.title = '';
        mRecordDrawerInfo.value.visible = false;
        mRecordDrawerInfo.value.type = undefined;
        Object.keys(mRecordDrawerInfo.value.item).forEach(key => { 
          mRecordDrawerInfo.value.item[key] = undefined
        })
      };

       // 提交
      const mRecordSubmit = (reload: boolean) => {
        // customerMHListReq(reload ? 1 : pageInfo.value.current);
        mRecordClose();
      };
      // 编辑
      const mRecordEdit = (item: CustomerContractInfo) => {
        mRecordDrawerInfo.value.title = '编辑合同';
        mRecordDrawerInfo.value.type = 'edit';
        mRecordDrawerInfo.value.visible = true;
        Object.keys(mRecordDrawerInfo.value.item).forEach(key => { 
          mRecordDrawerInfo.value.item[key] = item[key]
        })
      };
       
      const scanRecord = (item: CustomerContractInfo) => {
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.title = '合同信息';
        mRecordDrawerInfo.value.type = 'scan';
        Object.keys(mRecordDrawerInfo.value.item).forEach(key => { 
          mRecordDrawerInfo.value.item[key] = item[key]  
        })
      };


      // 记录
      const mRecordDrawerInfo = ref<DrawerItemType<any>>({
        visible: false,
        title: '',
        item: {
          name:  undefined,
          firstParty:  undefined,
          secondParty:  undefined,
          effectiveStart:  undefined,
          effectiveEnd:  undefined,
          orderId: undefined,
        },
      });

      



      const downloadContact = (item) => {};
      const previewContact = (item) => {};

      return {
        columns,
        pagination,
        showGoBack: !!route?.query.id,
        downloadContact,
        previewContact,
        pageInfo,
        customerOrderListReq,
        resetAction,
        searchAction,
        onMounted,
        searchInfo,
        addMHistory,
        addCustomer,

        mRecordClose,
        mRecordSubmit,
        mRecordEdit,
        scanRecord,
        mRecordDrawerInfo,
      };
    },
  });
</script>
<style lang="less" scoped></style>
