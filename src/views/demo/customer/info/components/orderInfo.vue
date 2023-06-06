<template>
    <PageWrapper title="客户订单">
        <Table
        :columns="columns"
        :dataSource="diseaseObject"
        :canResize="false"
        :striped="false"
        :bordered="true"
        >
        <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                scanOrder(record);
              }
            "
            >查看</Button
          >
        </template>
      </template>


    </Table>
    </PageWrapper>
 
 </template>
 
 <script lang="ts">
    import { defineComponent, PropType } from 'vue';
    import dayjs from 'dayjs';
    import { Table,Button } from 'ant-design-vue';
    import { type ColumnsType } from 'ant-design-vue/lib/table';


    import {
        CustomerOrderInfo
   } from '/@/api/demo/model/customer';
 
   const columns: ColumnsType<CustomerOrderInfo> = [
        {
          title: '订单名称',
          dataIndex: 'orderName',
        },
        
        {
          title: '下单时间',
          dataIndex: 'orderDate',
          customRender: (state) => dayjs(state.record.orderDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '订单编号',
          dataIndex: 'orderNumber',
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
          title: '负责人',
          dataIndex: 'responsiblePerson',
        },
        {
          title: '其他',
          dataIndex: 'remark',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
 
   export default defineComponent({
     components: {
       Table,
       Button
     },
     props: {
       disease: {
         type: Object as PropType<
            Array<CustomerOrderInfo>>,
       },
     },
     setup(props) {
        const scanOrder = (item: CustomerOrderInfo) => {
        };
       return {
         diseaseObject: props.disease,
         dayjs,
         columns,
         scanOrder,
       };
     },
     
   });
 
 </script>
 <style lang="less" scoped>
   
 </style>