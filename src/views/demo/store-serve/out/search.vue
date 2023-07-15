<template>
  <PageWrapper title="出库管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="产品名称">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.productName"
          />
        </FormItem>
        <FormItem label="产品编号" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.productNumber"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
      <Button type="primary" style="margin-left: 10px" @click="addStoreOut">新增出库</Button>
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
                scanStoreOut(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                editStoreOut(record);
              }
            "
            >编辑</Button
          >
          <!-- <Button v-if="authShow" type="link" danger @click="() => {}">删除</Button> -->
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
        <FormItem label="产品名称" v-bind="validateInfos.productId">
          <Select
            :show-search="true"
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            @change="pChange"
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

        <FormItem label="客户信息" v-bind="validateInfos.customerId">
          <Select
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.customerId"
          >
            <SelectOption v-for="item of cDataSource" :value="item.id">{{
              item.name
            }}</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="订单名称" v-bind="validateInfos.orderId">
          <Select
            placeholder="请选择"
            v-model:value="drawerInfo.item.orderId"
            :disabled="drawerInfo.type === 'scan'"
          >
            <SelectOption v-for="item of oDataSource" :value="item.id">{{
              item.orderName
            }}</SelectOption>
          </Select>
        </FormItem>
        <FormItem
          label="出库数量"
          v-bind="validateInfos.amount"
          :help="`当前库存数量:${cProduct?.amount || ''}`"
        >
          <InputNumber
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.amount"
            :disabled="drawerInfo.type === 'scan'"
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
  import { defineComponent, ref, computed, onMounted, reactive, toRaw } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Modal, InputNumber, Select, message } from 'ant-design-vue';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { ProductInfo, ProductOutInfo } from '/@/api/demo/model/product';
  import {
    getProductList,
    getProductOutPage,
    updateProductOut,
    saveProductOut,
  } from '/@/api/demo/product';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { getCustomerList, getCustomerOrderList } from '/@/api/demo/customer';
import { CustomerInfo, CustomerOrderInfo } from '/@/api/demo/model/customer';
import { useUserStore } from '/@/store/modules/user';
import { RoleEnum } from '/@/enums/roleEnum';
  
  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;
  const useForm = Form.useForm;
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Modal,
      TextArea,
      Select,
      SelectOption,
      InputNumber,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER, RoleEnum.ADMIN].includes(role));
      });
      const drawerInfo = ref<
        DrawerItemType<{
          id: number | undefined;
          amount: number | undefined;
          customerId: string | undefined;
          orderId: string | undefined;
          productId: number | undefined;
          unit: string | undefined;
          remark: string | undefined;
        }>
      >({
        visible: false,
        title: '',
        item: {
          id: undefined,
          amount: undefined,
          customerId: undefined,
          orderId: undefined,
          productId: undefined,
          unit: undefined,
          remark: undefined,
        },
      });
      const pageInfo = ref<PageListInfo<ProductOutInfo>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const pagination = computed(() => ({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {},
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const searchInfo = ref({
        productName: undefined,
        productNumber: undefined,
      });
      const pOutListReq = async (pageNum: number) => {
        const res = await getProductOutPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.value.productName = undefined;
        searchInfo.value.productNumber = undefined;
        pOutListReq(1);
      };
      const searchAction = () => {
        pOutListReq(1);
      };
      onMounted(() => {
        pOutListReq(1);
        productReq();
        customerReq();
        orderListReq();
      });

      const columns: ColumnsType<ProductOutInfo> = [
        {
          title: '产品名称',
          dataIndex: 'productName',
          width: 200
        },
        {
          title: '产品编号',
          dataIndex: 'productNumber',
          width: 200
        },
        {
          title: '出库数量',
          dataIndex: 'amount',
          width: 120
        },
        {
          title: '购买人员',
          dataIndex: 'customerName',
          width: 120
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
      const pDataSource = ref<Array<ProductInfo>>([]);
      const productReq = async () => {
        const res = await getProductList();
        if (res) {
          pDataSource.value = res;
        }
      };
      const cProduct = ref<ProductInfo>();
      const pChange = () => {
        const p = pDataSource.value.find((t) => t.id === drawerInfo.value.item.productId);
        cProduct.value = p;
      };
      // 客户信息
      const cDataSource = ref<Array<CustomerInfo>>([]);
      const customerReq = async () => {
        const res = await getCustomerList();
        if (res) {
          cDataSource.value = res;
        }
      };
      const oDataSource = ref<Array<CustomerOrderInfo>>([]);
      const orderListReq = async () => {
        const res = await getCustomerOrderList();
        if (res) {
          oDataSource.value = res.filter((item) => !item.outStorage);
        }
      };
      const addStoreOut = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'add';
        drawerInfo.value.title = '新增出库';
      };
      const scanStoreOut = (item: ProductOutInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'scan';
        drawerInfo.value.title = '查看出库';
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
      };
      const editStoreOut = (item: ProductOutInfo) => {
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑出库';
        drawerInfo.value.visible = true;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = undefined;
        });
      };
      const submit = async () => {
        validate().then(async () => {
          const params = { ...drawerInfo.value.item };
          let res;
          if (drawerInfo.value.type === 'add') {
            // 新增客服
            res = await saveProductOut(params);
          } else {
            res = await updateProductOut(params);
          }
          if (res) {
            message.success(drawerInfo.value.type === 'add' ? '新增出库成功' : '修改出库成功');
            pOutListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
            drawerOnClose();
          }
        });
      };
      const rulesRef = reactive({
        customerId: [
          {
            required: true,
            message: '请选择客户',
          },
        ],
        productId: [
          {
            required: true,
            message: '请选择产品名称',
          },
        ],
        orderId: [
          {
            required: true,
            message: '请选择订单名称',
          },
        ],
        amount: [
          {
            required: true,
            message: '请输入入库数量',
          },
        ],
      });
      const { validate, validateInfos } = useForm(drawerInfo.value.item, rulesRef);
      return {
        columns,
        resetAction,
        searchAction,
        pagination,
        pageInfo,
        drawerInfo,
        searchInfo,
        addStoreOut,
        scanStoreOut,
        editStoreOut,
        drawerOnClose,
        submit,
        // 产品
        pDataSource,
        pChange,
        cProduct,
        // 客户信息
        cDataSource,
        // 订单信息
        oDataSource,
        validateInfos,
        authShow
      };
    },
  });
</script>
<style lang="less" scoped></style>
