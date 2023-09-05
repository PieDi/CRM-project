<template>
  <div class="ccc">
    <div v-for="item of diseaseObject" class="order-item">
      <img src="/src/assets/images/order-logo.png" class="item-logo" />
      <div class="column-1 column">
        <div class="value" style="font-weight: 500; font-size: 20px">{{
          `￥${item.order.totalPrice}`
        }}</div>
        <div>订单金额</div>
      </div>
      <div class="column-2 column">
        <Tooltip :title="item.order.orderTime">
          <div class="value">{{ item.order.orderTime }}</div>
        </Tooltip>
        <div>下单时间</div>
      </div>
      <div class="column-3 column">
        <Tooltip :title="item.order.orderName">
          <div class="value">{{ item.order.orderName }}</div>
        </Tooltip>
        <div>订单名称</div>
      </div>
      <div class="column-4 column">
        <Tooltip :title="orderSourceMap[item.order.source as number]">
          <div class="value">{{ orderSourceMap[item.order.source as number] }}</div>
        </Tooltip>
        <div>订单来源</div>
      </div>
      <div class="column-5 column">
        <Tooltip :title="orderStatusMap[item.order.status as number]">
          <div class="value">{{ orderStatusMap[item.order.status as number] }}</div>
        </Tooltip>
        <div>订单状态</div>
      </div>
      <div class="column-6 column">
        <Tooltip title="查看发票">
          <div class="link" @click="() => { handlePreView(item.order.id as number, 5) }">查看发票</div>
        </Tooltip>
        <div>客户发票信息</div>
      </div>
      <div class="column-6 column">
        <Tooltip title="查看合同">
          <div class="link" @click="() => { handlePreView(item.order.id as number, 6) }">查看合同</div>
        </Tooltip>
        <div>客户合同信息</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import dayjs from 'dayjs';
import { Table, Button, Tooltip } from 'ant-design-vue';
import { type ColumnsType } from 'ant-design-vue/lib/table';
import { useRouter } from 'vue-router';
import {
  CustomerOrderInfo,
  CustomerContractInfo,
  CustomerInvoiceInfo,
} from '/@/api/demo/model/customer';
import { boardFileView } from '/@/api/demo/customer';
const orderSourceMap: Record<number, string> = {
  1: 'CRM',
  2: '小程序',
};
const orderStatusMap: Record<number, string> = {
  1: '待授权',
  2: '待审核',
  5: '已完成',
};
export default defineComponent({
  components: {
    Table,
    Button,
    Tooltip
  },
  props: {
    disease: {
      type: Object as PropType<
        Array<{
          order: CustomerOrderInfo;
          orderContracts: Array<CustomerContractInfo>;
          orderInvoices: Array<CustomerInvoiceInfo>;
        }>
      >,
    },
  },
  setup(props) {
    const columns: ColumnsType<{
      order: CustomerOrderInfo;
      orderContracts: Array<CustomerContractInfo>;
      orderInvoices: Array<CustomerInvoiceInfo>;
    }> = [
        {
          title: '订单名称',
          dataIndex: 'orderName',
        },
        {
          title: '下单时间',
          dataIndex: 'orderDate',
          customRender: (state) =>
            dayjs(state.record.order.orderDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '订单编号',
          dataIndex: 'orderNumber',
          customRender: (state) => state.record.order.orderNumber,
        },
        {
          title: '订单数量',
          dataIndex: 'orderQuantity',
          customRender: (state) => state.record.order.orderQuantity,
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount',
          customRender: (state) => state.record.order.totalPrice,
        },
        {
          title: '关联合同',
          dataIndex: 'contracts',
        },
        {
          title: '关联发票',
          dataIndex: 'invoices',
        },
      ];
    const scanOrder = (item: CustomerOrderInfo) => { };
    const router = useRouter();
    const linkClick = (id: number) => {
      router.push({ path: '/customer/order/search', query: { id } });
    };
    const cLinkClick = (id: number) => {
      router.push({ path: '/customer/contact/search', query: { id } });
    };
    const iLinkClick = (id: number) => {
      router.push({ path: '/customer/invoice/search', query: { id } });
    };
    const handlePreView = async (id: number, type: number) => {
      const res = await boardFileView(id, type);
      if (res) {
        res.forEach((url) => window.open(url));
      }
    };
    return {
      linkClick,
      cLinkClick,
      iLinkClick,
      diseaseObject: props.disease,
      dayjs,
      columns,
      scanOrder,
      orderSourceMap,
      orderStatusMap,
      handlePreView,
    };
  },
});
</script>
<style lang="less" scoped>
.ccc {
  padding: 0 16px;
  height: 271px;
  overflow-y: auto;

  .order-item {
    height: 84px;
    border-bottom: 1px solid #ebebeb;
    display: flex;
    align-items: center;

    .item-logo {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    .column-1 {
      width: 120px;
    }

    .column {
      margin: 0 4px;
      width: calc(16.66% - 26.66px);

      .value {
        font-size: 16px;
        color: #2e354f;
        line-height: 22px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .link {
        cursor: pointer;
        font-size: 16px;
        color: #007aff;
        line-height: 22px;
      }
    }
  }
}
</style>
