<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    :title="title"
    @cancel="orderDrawerOnClose"
    @ok="orderSubmit"
    width="60%"
    :visible="visible"
  >
    <Form :labelCol="{ span: 4 }" ref="orderFormRef" :model="orderDrawerInfo">
      <FormItem
        label="订单名称"
        name="orderName"
        :rules="{
          required: true,
          message: '请输入订单名称',
          trigger: 'change',
        }"
      >
        <Input
          :disabled="type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="orderDrawerInfo.orderName"
        />
      </FormItem>
      <FormItem
        label="下单时间"
        name="orderDate"
        :rules="{
          required: true,
          message: '请选择订单时间',
          trigger: 'change',
        }"
      >
        <DatePicker
          :disabled="type === 'scan'"
          showTime
          placeholder="请选择"
          v-model:value="orderDrawerInfo.orderDate"
        />
      </FormItem>

      <FormItem label="订单产品" style="margin-bottom: 0">
        <Button style="float: right" type="link" @click="addProduct">新增</Button>
        <Space v-for="(p, i) of orderDrawerInfo.products" align="start">
          <FormItem
            label="产品名称"
            :name="['products', i, 'productId']"
            :rules="{
              required: true,
              message: '请选择产品名称',
              trigger: 'change',
            }"
          >
            <Select
              :show-search="true"
              placeholder="请选择"
              v-model:value="p.productId"
              style="width: 220px"
              :filter-option="pFilterOption"
              :disabled="type !== 'add'"
            >
              <SelectOption
                v-for="item of pDataSource"
                :key="`${item.name}-${item.id}`"
                :value="item.id"
                >{{ item.name }}</SelectOption
              >
            </Select>
          </FormItem>

          <FormItem
            label="产品数量"
            :name="['products', i, 'sum']"
            :rules="{
              required: true,
              message: '请选择输入产品数量',
              trigger: 'change',
            }"
          >
            <InputNumber
              :disabled="type === 'scan'"
              placeholder="请输入"
              allowClear
              min="1"
              :precision="0"
              v-model:value="p.sum"
              style="width: 150px"
            />
          </FormItem>

          <Button
            v-if="type === 'add'"
            style="float: right"
            type="link"
            @click="
              () => {
                deleteProduct(i);
              }
            "
          >
            <template #icon> <DeleteOutlined /> </template
          ></Button>
        </Space>
      </FormItem>

      <FormItem
        label="订单金额"
        name="totalPrice"
        :rules="{
          required: true,
          message: '请输入订单金额',
          trigger: 'change',
        }"
      >
        <InputNumber
          :disabled="type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="orderDrawerInfo.totalPrice"
        />
      </FormItem>

      <FormItem
        label="负责人"
        name="responsiblePerson"
        :rules="{
          required: true,
          message: '请输入负责人',
          trigger: 'change',
        }"
      >
        <Input
          :disabled="type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="orderDrawerInfo.responsiblePerson"
        />
      </FormItem>

      <FormItem label="其他">
        <TextArea
          :disabled="type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="orderDrawerInfo.remark"
        />
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, onBeforeMount, ref, reactive } from 'vue';
  import {
    Modal,
    Space,
    Table,
    Form,
    Input,
    Button,
    Drawer,
    Select,
    SelectOption,
    InputNumber,
    DatePicker,
    message,
  } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { saveCustomerOrder, updateCustomerOrder } from '/@/api/demo/customer';
  import { type DrawerItemType } from '/@/views/type';
  import { Dayjs } from 'dayjs';
  import type { FormInstance } from 'ant-design-vue';
  import { type ProductInfo } from '/@/api/demo/model/product';
  import { getProductList } from '/@/api/demo/product';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  export const orderSourceMap: Record<number, string> = {
    1: 'CRM',
    2: '小程序',
  };
  export const orderTypeMap: Record<number, string> = {
    1: '标准订单',
    2: '非标订单',
  };
  export interface AAAA {
    id: number | undefined;
    totalPrice: number | undefined;
    orderDate: Dayjs | undefined;
    orderName: string | undefined;
    orderNumber: string | undefined;
    products: Array<{ productId: number | undefined; sum: number | undefined }> | undefined;
    remark: string | undefined;
    responsiblePerson: string | undefined;
    customerId: number | undefined;
  }
  export default defineComponent({
    components: {
      Modal,
      Space,
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
      DeleteOutlined,
    },
    props: {
      customerId: {
        type: Number,
        required: true,
      },
      productType: {
        type: Number,
      },
      drawerInfo: {
        type: Object as PropType<DrawerItemType<any>>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const orderFormRef = ref<FormInstance>();
      const orderDrawerInfo = reactive<AAAA>({
        id: props?.drawerInfo?.item?.id,
        totalPrice: props?.drawerInfo?.item?.totalPrice,
        orderDate: props?.drawerInfo?.item?.orderDate,
        orderName: props?.drawerInfo?.item?.orderName,
        orderNumber: props?.drawerInfo?.item?.orderNumber,
        products: props?.drawerInfo?.item?.products,
        remark: props?.drawerInfo?.item?.remark,
        responsiblePerson: props?.drawerInfo?.item?.responsiblePerson,
        customerId: props?.drawerInfo?.item?.customerId,
      });

      const orderDrawerOnClose = () => {
        emit('drawerOnClose');
        Object.keys(orderDrawerInfo).forEach((key) => {
          orderDrawerInfo[key] = undefined;
        });
      };
      const orderSubmit = async () => {
        if (props?.drawerInfo?.type === 'scan') {
          orderDrawerOnClose();
          return;
        }
        orderFormRef.value?.validate().then(async () => {
          let res;
          if (props.drawerInfo.type === 'add') {
            res = await saveCustomerOrder({
              ...orderDrawerInfo,
              orderDate: orderDrawerInfo.orderDate
                ? orderDrawerInfo.orderDate.valueOf()
                : undefined,
            });
          } else if (props.drawerInfo.type === 'edit') {
            res = await updateCustomerOrder({
              ...orderDrawerInfo,
              orderDate: orderDrawerInfo.orderDate
                ? orderDrawerInfo.orderDate.valueOf()
                : undefined,
            });
          }
          if (res) {
            message.success(props.drawerInfo.type === 'add' ? '新增订单成功' : '修改订单成功');
            emit('submit');
            orderDrawerOnClose();
          }
        });
      };
      const pFilterOption = (input: string, option: any) => {
        return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      const addProduct = () => {
        const products = orderDrawerInfo.products || [];
        products?.push({
          productId: undefined,
          sum: undefined,
        });
        orderDrawerInfo.products = products;
      };
      const deleteProduct = (i: number) => {
        if (orderDrawerInfo.products?.length) {
          const products = [...orderDrawerInfo.products];
          products.splice(i, 1);
          orderDrawerInfo.products = products;
        }
      };
      const pDataSource = ref<Array<ProductInfo>>([]);
      const productReq = async () => {
        const res = await getProductList({ type: props.productType });
        if (res) pDataSource.value = res;
      };
      onBeforeMount(() => {
        productReq();
      });

      return {
        // 新增订单
        visible: props?.drawerInfo?.visible,
        title: props?.drawerInfo?.title,
        type: props?.drawerInfo?.type,
        // 表单信息
        orderFormRef,
        orderDrawerInfo,
        orderDrawerOnClose,
        orderSubmit,
        pFilterOption,
        addProduct,
        deleteProduct,
        pDataSource,
      };
    },
  });
</script>
