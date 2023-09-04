<template>
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
        <template v-if="nsOrder">
          <Button
            v-if="record.status === 1"
            type="link"
            @click="
              () => {
                scanOrder(record);
              }
            "
            >授权</Button
          >
          <Button
            v-if="record.status === 2"
            type="link"
            @click="
              () => {
                scanOrder(record);
              }
            "
            >审核</Button
          >
        </template>
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
  <Drawer
    :destroy-on-close="true"
    :title="drawerInfo.title"
    placement="right"
    @close="drawerOnClose"
    :visible="drawerInfo.visible"
  >
    <Form :labelCol="{ span: 6 }">
      <FormItem label="客户姓名">
        <Select
          :show-search="true"
          :disabled="drawerInfo.type !== 'add'"
          placeholder="请选择"
          v-model:value="drawerInfo.item.customerId"
        >
          <SelectOption v-for="item of cDataSource" :value="item.id">{{ item.name }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="订单产品">
        <Select
          :show-search="true"
          :disabled="drawerInfo.type !== 'add'"
          placeholder="请选择"
          v-model:value="drawerInfo.item.productId"
        >
          <SelectOption
            v-for="item of pDataSource"
            :key="`${item.id}-${item.name}`"
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

      <FormItem label="订单编号">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.orderNumber"
        />
      </FormItem>

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
  </Drawer>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, computed, toRaw } from 'vue';
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
    Select,
    InputNumber,
    DatePicker,
    Popover,
    message,
  } from 'ant-design-vue';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { CustomerOrderInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import { getCustomerList, getCustomerOrderPage, handleCustomerOrder } from '/@/api/demo/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { ProductInfo } from '/@/api/demo/model/product';
  import { getProductList } from '/@/api/demo/product';
  import dayjs, { Dayjs } from 'dayjs';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const TextArea = Input.TextArea;
  export default defineComponent({
    components: {
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
      Popover,
    },
    props: {
      source: Number,
      productType: Number,
    },
    setup(props) {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];

      const handleShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });

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

      const customerOrderListReq = async (pageNum: number) => {
        //@ts-ignore
        const res = await getCustomerOrderPage({
          ...searchInfo.value,
          pageNum,
          source: props.source,
          productType: props.productType,
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
        {
          title: '订单金额',
          dataIndex: 'totalPrice',
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

      const cDataSource = ref<Array<CustomerInfo>>([]);
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

      const scanOrder = (item: CustomerOrderInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '订单信息';
        drawerInfo.value.type = 'scan';

        drawerInfo.value.item.id = item.id;
        drawerInfo.value.item.customerId = item.customerId;
        drawerInfo.value.item.orderAmount = item.orderAmount;
        drawerInfo.value.item.orderDate = dayjs(item.orderDate);
        drawerInfo.value.item.orderName = item.orderName;
        drawerInfo.value.item.productId = item.productId;
        drawerInfo.value.item.remark = item.remark;
        drawerInfo.value.item.responsiblePerson = item.responsiblePerson;

        customerReq();
        productReq();
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;

        drawerInfo.value.item.id = undefined;
        drawerInfo.value.item.customerId = undefined;
        drawerInfo.value.item.orderAmount = undefined;
        drawerInfo.value.item.orderDate = undefined;
        drawerInfo.value.item.orderName = undefined;
        drawerInfo.value.item.productId = undefined;
        drawerInfo.value.item.remark = undefined;
        drawerInfo.value.item.responsiblePerson = undefined;
      };

      const handleAction = async (p: any) => {
        const res = await handleCustomerOrder(p);
        if (res) {
          message.success('操作成功');
          customerOrderListReq(pageInfo.value.current);
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
        scanOrder,
        microOrder: props.source === 2,
        nsOrder: props.productType === 2,
        drawerOnClose,
        cDataSource,
        pDataSource,
        handleShow,
        handleAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
