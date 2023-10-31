<template>
  <Modal :mask-closable="false" :destroy-on-close="true" title="订单列表" @cancel="mOrderOnClose" @ok="mOrderOnClose"
    :visible="mOrderModal?.visible" width="60%">

    <Table :columns="columns" :dataSource="pageInfo.dataSource" :scroll="{ x: '100%' }" :bordered="true"
      :pagination="pagination">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button type="link" @click="() => {
            scanOrder(record);
          }
            ">查看</Button>
          <Button type="link" @click="() => {
            drawerEdit(record);
          }
            ">编辑</Button>
          <Button  type="link" danger @click="() => {
            deleteOrder(record);
          }
            ">删除</Button>
        </template>
      </template>
    </Table>
    <OrderModal v-if="drawerInfo.item.customerId" :customer-id="drawerInfo.item.customerId" :drawer-info="drawerInfo"
      @drawerOnClose="drawerOnClose" @submit="orderSubmit"></OrderModal>

  </Modal>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeMount, computed, createVNode } from 'vue';
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Select,
  InputNumber,
  DatePicker,
  message,
  Space,
} from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { type ColumnsType } from 'ant-design-vue/lib/table';
import { DrawerItemType, PageListInfo } from '/@/views/type';
import { CustomerOrderInfo } from '/@/api/demo/model/customer';
import {
  getCustomerOrderPage,
  deleteCustomerOrder,
} from '/@/api/demo/customer';
import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
const FormItem = Form.Item;
const SelectOption = Select.Option;
const TextArea = Input.TextArea;
import OrderModal, { orderSourceMap, orderTypeMap, AAAA } from './order-modal.vue';


export default defineComponent({
  components: {
    Table,
    Form,
    FormItem,
    Input,
    Button,
    Modal,
    Select,
    SelectOption,
    InputNumber,
    DatePicker,
    TextArea,
    Space,
    DeleteOutlined,
    OrderModal
  },
  props: {
    mOrderModal: {
      type: Object as PropType<{ visible: boolean; customerId: any }>,
    },
  },
  setup(props, { emit }) {
    const drawerInfo = ref<
      DrawerItemType<AAAA>
    >({
      visible: false,
      title: '',
      type: undefined,
      item: {
        id: undefined,
        totalPrice: undefined,
        orderDate: undefined,
        orderName: undefined,
        orderNumber: undefined,
        products: [
          {
            productId: undefined,
            sum: undefined,
          },
        ],
        remark: undefined,
        responsiblePerson: undefined,
        customerId: undefined,
      },
    });
    const pageInfo = ref<PageListInfo<CustomerOrderInfo>>({
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
    const customerOrderListReq = async (pageNum: number) => {
      const res = await getCustomerOrderPage({
        pageNum,
        productType: 1,
        customerId: props.mOrderModal?.customerId,
      });
      if (res) {
        pageInfo.value.total = res.total;
        pageInfo.value.current = res.pageNum;
        pageInfo.value.dataSource = res.data;
      }
    };

    onBeforeMount(() => {
      customerOrderListReq(1);
    });

    const columns: ColumnsType<CustomerOrderInfo> = [
      {
        title: '订单名称',
        dataIndex: 'orderName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '订单来源',
        dataIndex: 'source',
        width: 120,
        customRender: (state) => orderSourceMap[state.record.source as number],
      },
      {
        title: '订单类型',
        dataIndex: 'type',
        width: 120,
        customRender: (state) => orderTypeMap[state.record.type as number],
      },
      {
        title: '下单时间',
        dataIndex: 'orderDate',
        width: 180,
        customRender: (state) => dayjs(state.record.orderDate).format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        title: '订单编号',
        dataIndex: 'orderNumber',
        width: 200,
      },
      {
        title: '订单金额',
        width: 180,
        dataIndex: 'totalPrice',
      },
      {
        title: '经办人',
        dataIndex: 'agent',
        width: 100,
      },
      {
        title: '操作',
        width: 300,
        dataIndex: 'operation',
      },
    ];

    const scanOrder = (item: CustomerOrderInfo) => {
      drawerInfo.value.visible = true;
      drawerInfo.value.title = '订单信息';
      drawerInfo.value.type = 'scan';
      Object.keys(drawerInfo.value.item).forEach((key) => {
        drawerInfo.value.item[key] = item[key];
      });
      //@ts-ignore
      drawerInfo.value.item.products = item.orderProducts.map((p) => ({
        productId: p.id,
        sum: p.sum,
      }));
      drawerInfo.value.item.orderDate = dayjs(item.orderDate);
    };

    const deleteOrder = (item: CustomerOrderInfo) => {
      confirm(
        withConfirm({
          icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
          content: '确定删除该订单',
          async onOk() {
            const res = await deleteCustomerOrder(item.id as number);
            if (res) {
              message.success('删除订单成功');
              emit('submit')
              customerOrderListReq(pageInfo.value.current);
            }
          },
        }),
      );
    };

    const drawerOnClose = () => {
      drawerInfo.value.visible = false;
      drawerInfo.value.title = '';
      drawerInfo.value.type = undefined;
      Object.keys(drawerInfo.value.item).forEach((key) => {
        drawerInfo.value.item[key] = undefined;
      });
    };
    const drawerEdit = (item: CustomerOrderInfo) => {
      drawerInfo.value.title = '编辑订单';
      drawerInfo.value.type = 'edit';
      drawerInfo.value.visible = true;
      Object.keys(drawerInfo.value.item).forEach((key) => {
        drawerInfo.value.item[key] = item[key];
      });
      //@ts-ignore
      drawerInfo.value.item.products = item.orderProducts.map((p) => ({
        productId: p.id,
        sum: p.sum,
      }));
      drawerInfo.value.item.orderDate = dayjs(item.orderDate);
    };

    const orderSubmit = () => {
      customerOrderListReq(pageInfo.value.current);
      emit('submit')
    };
    const mOrderOnClose = () => { emit('drawerOnClose'); }
    return {
      mOrderModal: props.mOrderModal,
      mOrderOnClose,
      columns,
      pagination,
      pageInfo,
      drawerInfo,
      scanOrder,
      deleteOrder,
      drawerOnClose,
      drawerEdit,
      orderSubmit,
    };
  },
});
</script>
<style lang="less" scoped></style>
