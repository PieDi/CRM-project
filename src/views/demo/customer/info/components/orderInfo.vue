<template>
  <div class="ccc">
    <div v-for="item of diseaseObject" class="order-item">
      <img src="/src/assets/images/order-logo.png" class="item-logo" />
      <div class="column column-1">
        <div class="value" style="font-weight: 500; font-size: 20px">{{
          `￥${item.order.totalPrice}`
        }}</div>
        <div>订单金额</div>
      </div>
      <div class="column column-2">
        <div class="value">{{ item.order.orderTime }}</div>
        <div>下单时间</div>
      </div>
      <div class="column column-3">
        <div class="value">{{ item.order.orderName }}</div>
        <div>订单名称</div>
      </div>
      <div class="column column-4">
        <div class="value">{{ orderSourceMap[item.order.source as number] }}</div>
        <div>订单来源</div>
      </div>
      <div class="column column-5">
        <div class="value">{{ orderStatusMap[item.order.status as number] }}</div>
        <div>订单状态</div>
      </div>
      <div class="column column-6">
        <div class="link" @click="()=>{handlePreView(item.order.id as number, 5) }">查看发票</div>
        <div>客户发票信息</div>
      </div>
      <div class="column column-4">
        <div class="link" @click="()=>{ handlePreView(item.order.id as number, 6)}">查看合同</div>
        <div>客户合同信息</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import dayjs from 'dayjs';
  import { Table, Button } from 'ant-design-vue';
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
      const scanOrder = (item: CustomerOrderInfo) => {};
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
    margin-top: 10px;
    overflow: hidden;
    padding: 0 16px;
    .order-item {
      height: 84px;
      border-bottom: 1px solid #ebebeb;
      display: flex;
      align-items: center;
      .item-logo {
        margin-left: 24px;
        width: 32px;
        height: 32px;
      }
      .column {
        margin: 0 16px;
        .value {
          font-size: 16px;
          color: #2e354f;
          line-height: 22px;
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
