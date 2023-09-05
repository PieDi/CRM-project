<template>
  <PageWrapper title="客户发票管理" :back-show="showGoBack">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="发票名称">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" v-model:value="searchInfo.name" />
        </FormItem>

        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>

      <Button type="primary" style="margin-left: 10px" @click="addMHistory">新增发票</Button>
    </div>

    <Table :columns="columns" :dataSource="pageInfo.dataSource" :scroll="{ x: '100%' }" :bordered="true"
      :pagination="pagination">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button v-if="authShow" type="link" @click="() => {
            mRecordEdit(record);
          }
            ">编辑</Button>
          <Button type="link" @click="() => {
            scanRecord(record);
          }
            ">查看</Button>
          <Button v-if="authShow" type="link" @click="() => {
            deleteInvoice(record);
          }
            ">删除</Button>
        </template>
      </template>
    </Table>
    <template v-if="mRecordDrawerInfo.visible">
      <m-record :drawer-info="mRecordDrawerInfo" @drawerOnClose="mRecordClose" @edit="mRecordEdit"
        @submit="mRecordSubmit">
      </m-record>
    </template>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, ref, toRaw, createVNode } from 'vue';
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
  message
} from 'ant-design-vue';
import { type ColumnsType } from 'ant-design-vue/lib/table';
import { DrawerItemType, PageListInfo } from '/@/views/type';
import { CustomerInvoiceInfo } from '/@/api/demo/model/customer';
import { getCustomerInvoicePage, deleteCustomerInvoice } from '/@/api/demo/customer';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import mRecord from './components/addInvoice.vue';
import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '/@/store/modules/user';
import { RoleEnum } from '/@/enums/roleEnum';
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
    mRecord
  },
  setup() {
    const userStore = useUserStore();
    const roleList = toRaw(userStore.getRoleList) || [];
    const authShow = computed(() => {
      return roleList.some((role) => [RoleEnum.SUPER].includes(role));
    });
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
        title: '客户名称',
        dataIndex: 'customerName',
        width: 200,
        ellipsis: true
      },
      {
        title: '订单名称',
        dataIndex: 'orderName',
        width: 200,
        ellipsis: true
      },
      {
        title: '发票名称',
        dataIndex: 'name',
        width: 200
      },
      {
        title: '发票编号',
        dataIndex: 'number',
        width: 200
      },
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width: 200,
        ellipsis: true
      },
      {
        title: '经手人',
        dataIndex: 'agent',
        width: 200,
      },
      {
        title: '发票金额',
        dataIndex: 'amount',
        width: 200,
      },
      {
        title: '发票号',
        dataIndex: 'serial',
        width: 200,
      },
      {
        title: '开票日期',
        dataIndex: 'invoiceTime',
        width: 180,
        customRender: (state) => state.record.invoiceTime ? dayjs(state.record.invoiceTime).format('YYYY-MM-DD HH:mm:ss') : '',
      },
      {
        title: '发票状态',
        dataIndex: 'status',
        width: 120,
        customRender: (state) => (state.record.status === 1 ? '待确认' : '已确认'),
      },
      {
        title: '操作',
        width: 160,
        dataIndex: 'operation',
      },
    ];

    // 新增记录
    const addMHistory = () => {
      mRecordDrawerInfo.value.title = '新增合同';
      mRecordDrawerInfo.value.visible = true;
      mRecordDrawerInfo.value.type = 'add';
    };

    // 弹框关闭
    const mRecordClose = () => {
      mRecordDrawerInfo.value.title = '';
      mRecordDrawerInfo.value.visible = false;
      mRecordDrawerInfo.value.type = undefined;
      Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
        mRecordDrawerInfo.value.item[key] = undefined;
      });
    };

    // 提交
    const mRecordSubmit = (reload: boolean) => {
      invoiceOrderListReq(reload ? 1 : pageInfo.value.current);
      mRecordClose();
    };
    // 编辑
    const mRecordEdit = (item: CustomerInvoiceInfo) => {
      mRecordDrawerInfo.value.title = '编辑发票';
      mRecordDrawerInfo.value.type = 'edit';
      mRecordDrawerInfo.value.visible = true;
      Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
        mRecordDrawerInfo.value.item[key] = item[key];
      });
    };

    const scanRecord = (item: CustomerInvoiceInfo) => {
      mRecordDrawerInfo.value.visible = true;
      mRecordDrawerInfo.value.title = '查看发票';
      mRecordDrawerInfo.value.type = 'scan';
      Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
        mRecordDrawerInfo.value.item[key] = item[key];
      });
    };

    // 记录
    const mRecordDrawerInfo = ref<DrawerItemType<CustomerInvoiceInfo>>({
      visible: false,
      title: '',
      item: {
        id: undefined,
        customerId: undefined,
        orderId: undefined,
        orderName: undefined,
        name: undefined,
        number: undefined,
        serial: undefined,
        amount: undefined,
        agent: undefined,
        description: undefined,
        invoiceTime: undefined,
        status: undefined,
        files: undefined,
      },
    });
    const deleteInvoice = (item: CustomerInvoiceInfo) => {
      confirm(
        withConfirm({
          icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
          content: '确定删除该合同',
          async onOk() {
            const res = await deleteCustomerInvoice(item.id as number);
            if (res) {
              message.success('删除合同成功');
              invoiceOrderListReq(pageInfo.value.current);
            }
          },
        }),
      );
    };
    return {
      columns,
      pagination,
      searchInfo,
      resetAction,
      searchAction,
      pageInfo,
      showGoBack: !!route?.query.id,
      addMHistory,
      mRecordClose,
      mRecordSubmit,
      mRecordEdit,
      scanRecord,
      deleteInvoice,
      mRecordDrawerInfo,
      authShow
    };
  },
});
</script>
<style lang="less" scoped></style>
