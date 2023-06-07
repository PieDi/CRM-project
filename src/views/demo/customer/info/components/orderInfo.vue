<template>
  <Table
    :columns="columns"
    :dataSource="diseaseObject"
    :canResize="false"
    :striped="false"
    :bordered="true"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'orderName'">
        <Button type="link" @click="()=>{linkClick(record.order.id as number)}">{{
          record.order.orderName
        }}</Button>
      </template>
      <template v-if="column.dataIndex === 'contracts'">
        <div style="display: flex; flex-direction: column;">
          <Button type="link" @click="()=>{cLinkClick(c.id as number)}" v-for="c of record.orderContracts">{{
          c.name
        }}</Button>
        </div>
        
      </template>
      <template v-if="column.dataIndex === 'invoices'">
        <div style="display: flex; flex-direction: column;">
          <Button type="link" @click="()=>{iLinkClick(c.id as number)}" v-for="c of record.orderInvoices">{{
          c.name
        }}</Button>
        </div>
      </template>
    </template>
  </Table>
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
          customRender: (state) => state.record.order.orderAmount,
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
      
      return {
        linkClick,
        cLinkClick,
        iLinkClick,
        diseaseObject: props.disease,
        dayjs,
        columns,
        scanOrder,
      };
    },
  });
</script>
<style lang="less" scoped></style>
