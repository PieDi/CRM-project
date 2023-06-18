<template>
  <PageWrapper title="客户订单管理" :back-show="showGoBack">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户姓名">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.customerName"
          />
        </FormItem>
      
        <FormItem label="订单编号" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.orderNumber"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addOrder">新增订单</Button>
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
                scanOrder(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                drawerEdit(record);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteOrder(record);
              }
            "
            >删除</Button
          >
        </template>
      </template>
    </Table>
    <Modal
    :mask-closable="false"
      :destroy-on-close="true"
      :title="drawerInfo.title"
      @cancel="drawerOnClose"
      @ok="submit"
      width="60%"
      :visible="drawerInfo.visible"
    >
      <Form :labelCol="{ span: 4 }">
        <FormItem label="客户姓名">
          <Select
            :show-search="true"
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.customerId"
          >
            <SelectOption v-for="item of cDataSource" :value="item.id">{{
              item.name
            }}</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="订单产品">
          <Select
            :show-search="true"
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            :filter-option="pFilterOption"
            v-model:value="drawerInfo.item.productId"
          >
            <SelectOption
              v-for="item of pDataSource"
              :key="`${item.name}-${item.number}`"
              :value="item.id"
              >{{ item.name }}</SelectOption
            >
          </Select>
        </FormItem>

        <FormItem label="订单名称">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.orderName"
          />
        </FormItem>
        <FormItem label="下单时间">
          <DatePicker
            :disabled="drawerInfo.type === 'scan'"
            showTime
            placeholder="请选择"
            v-model:value="drawerInfo.item.orderDate"
          />
        </FormItem>

        <!-- <FormItem label="订单编号">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.orderNumber"
          />
        </FormItem> -->

        <FormItem label="订单数量">
          <InputNumber
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            min="1"
            :precision="0"
            v-model:value="drawerInfo.item.orderQuantity"
          />
        </FormItem>

        <FormItem label="订单金额">
          <InputNumber
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.orderAmount"
          />
        </FormItem>

        <!-- <FormItem label="关联合同">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem> -->

        <FormItem label="负责人">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.responsiblePerson"
          />
        </FormItem>

        <FormItem label="其他">
          <TextArea
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.remark"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
      </Form>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, computed, createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
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
  } from 'ant-design-vue';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { CustomerOrderInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import {
    getCustomerList,
    getCustomerOrderPage,
    saveCustomerOrder,
    updateCustomerOrder,
    deleteCustomerOrder,
  } from '/@/api/demo/customer';
  import { ProductInfo } from '/@/api/demo/model/product';
  import { getProductList } from '/@/api/demo/product';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useRoute } from 'vue-router';

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
      Modal,
      Select,
      SelectOption,
      InputNumber,
      DatePicker,
      TextArea,
    },
    setup() {
      const drawerInfo = ref<
        DrawerItemType<{
          id: number | undefined;
          orderAmount: number | undefined;
          orderDate: Dayjs | undefined;
          orderName: string | undefined;
          orderNumber: string | undefined;
          orderQuantity: number | undefined;
          productId: number | undefined;
          remark: string | undefined;
          responsiblePerson: string | undefined;
          customerId: number | undefined;
        }>
      >({
        visible: false,
        title: '',
        type: undefined,
        item: {
          id: undefined,
          orderAmount: undefined,
          orderDate: undefined,
          orderName: undefined,
          orderNumber: undefined,
          orderQuantity: undefined,
          productId: undefined,
          remark: undefined,
          responsiblePerson: undefined,
          customerId: undefined,
        },
      });

      const cDataSource = ref<Array<CustomerInfo>>([]);
      const searchInfo = ref({
        customerName: undefined,
        orderNumber: undefined,
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

      const customerReq = async () => {
        const res = await getCustomerList();
        if (res) {
          cDataSource.value = res;
        }
      };
      const pDataSource = ref<Array<ProductInfo>>([]);
      const productReq = async () => {
        const res = await getProductList();
        if (res) {
          pDataSource.value = res;
        }
      };

      const pFilterOption = (input: string, option: any) => {
        return (
          option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      };
      const route = useRoute();
      const customerOrderListReq = async (pageNum: number) => {
        const res = await getCustomerOrderPage({
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
      const resetAction = () => {
        searchInfo.value.customerName = undefined;
        searchInfo.value.orderNumber = undefined;
        customerOrderListReq(1);
      };
      const searchAction = () => {
        customerOrderListReq(1);
      };
      onMounted(() => {
        customerOrderListReq(1);
        customerReq();
        productReq();
      });

      const columns: ColumnsType<CustomerOrderInfo> = [
        {
          title: '客户姓名',
          dataIndex: 'customerName',
        },
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
        // {
        //   title: '订单类型',
        //   dataIndex: 'endTime',
        // },
        {
          title: '订单数量',
          dataIndex: 'orderQuantity',
        },
        {
          title: '订单金额',
          dataIndex: 'orderAmount',
        },
        {
          title: '合同名称',
          dataIndex: 'endTime',
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
      const addOrder = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增订单';
        drawerInfo.value.type = 'add';
      };
      const scanOrder = (item: CustomerOrderInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '订单信息';
        drawerInfo.value.type = 'scan';
        Object.keys(drawerInfo.value.item).forEach(key => { 
          drawerInfo.value.item[key] = item[key]  
        })
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
        Object.keys(drawerInfo.value.item).forEach(key => { 
          drawerInfo.value.item[key] = item[key]  
        })
        drawerInfo.value.item.orderDate = dayjs(item.orderDate);
      };
      const submit = async () => {
        let res;
        if (drawerInfo.value.type === 'add') {
          res = await saveCustomerOrder({
            ...drawerInfo.value.item,
            orderDate: drawerInfo.value.item.orderDate
              ? drawerInfo.value.item.orderDate.valueOf()
              : undefined,
          });
        } else {
          res = await updateCustomerOrder({
            ...drawerInfo.value.item,
            orderDate: drawerInfo.value.item.orderDate
              ? drawerInfo.value.item.orderDate.valueOf()
              : undefined,
          });
        }

        if (res) {
          message.success(drawerInfo.value.type === 'add' ? '新增订单成功' : '修改订单成功');
          customerOrderListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose();
        }
      };
      return {
        columns,
        pagination,
        searchInfo,
        resetAction,
        searchAction,
        pageInfo,
        drawerInfo,
        showGoBack: !!route?.query.id,
        
        addOrder,
        scanOrder,
        deleteOrder,
        drawerOnClose,
        drawerEdit,
        submit,
        // 客户相关
        cDataSource,
        // 产品
        // currentP,
        pDataSource,
        pFilterOption,
      };
    },
  });
</script>
<style lang="less" scoped></style>
