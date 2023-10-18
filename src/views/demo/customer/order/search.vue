<template>
  <PageWrapper title="客户订单管理" :back-show="showGoBack">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="客户姓名">
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
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
      <div :style="{ display: 'flex' }">
        <Button type="primary" style="margin-left: 10px" @click="orderExport">订单导出</Button>
        <Button type="primary" style="margin-left: 10px" @click="addOrder">新增订单</Button>
      </div>
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :scroll="{ x: '100%' }"
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

          <!-- <template v-if="record.productType === 2">
            <Button
              type="link"
              v-if="record.status === 1"
              @click="
                () => {
                  drawerEdit(record);
                }
              "
              >编辑</Button
            ></template
          >
          <template v-else>
            <Button
              type="link"
              v-if="record.status === 2"
              @click="
                () => {
                  drawerEdit(record);
                }
              "
              >编辑</Button
            >
          </template> -->
          <!-- <Button
            v-if="authShow && record.status === 1"
            type="link"
            @click="
              () => {
                authOrder(record);
              }
            "
            >授权</Button
          >
          <Button
            v-if="authShow && record.status === 2"
            type="link"
            @click="
              () => {
                auditOrder(record);
              }
            "
            >审核</Button
          > -->
          <Button
            v-if="authShow"
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
      <Form :labelCol="{ span: 4 }" ref="formRef" :model="drawerInfo.item">
        <FormItem
          label="客户姓名"
          name="customerId"
          :rules="{
            required: true,
            message: '请选择客户姓名',
            trigger: 'change',
          }"
        >
          <Select
            show-search
            :filter-option="filterOption"
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.customerId"
          >
            <SelectOption
              v-for="item of cDataSource"
              :value="item.id"
              :key="`${item.name}_${item.id}`"
              >{{ item.name }}
            </SelectOption>
          </Select>
        </FormItem>

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
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.orderName"
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
            :disabled="drawerInfo.type === 'scan'"
            showTime
            placeholder="请选择"
            v-model:value="drawerInfo.item.orderDate"
          />
        </FormItem>

        <FormItem label="订单产品" style="margin-bottom: 0">
          <Button
            v-if="drawerInfo.type !== 'scan'"
            style="float: right"
            type="link"
            @click="addProduct"
            >新增</Button
          >
          <Space v-for="(p, i) of drawerInfo.item.products" align="start">
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
                :disabled="drawerInfo.type !== 'add'"
                placeholder="请选择"
                v-model:value="p.productId"
                style="width: 220px"
                :filter-option="pFilterOption"
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
                :disabled="drawerInfo.type === 'scan'"
                placeholder="请输入"
                allowClear
                min="1"
                :precision="0"
                v-model:value="p.sum"
                style="width: 150px"
              />
            </FormItem>

            <Button
              v-if="drawerInfo.type !== 'scan'"
              style="float: right"
              type="link"
              @click="
                () => {
                  deleteProduct(i);
                }
              "
            >
              <template #icon>
                <DeleteOutlined /> </template
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
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.totalPrice"
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

    <Modal
      title="订单授权"
      :width="400"
      :visible="authInfo.visible"
      :mask-closable="false"
      :destroy-on-close="true"
      @cancel="authOnClose"
      @ok="authSubmit"
    >
      <RadioGroup v-model:value="authInfo.status">
        <Radio :value="1">通过</Radio>
        <Radio :value="2">不通过</Radio>
      </RadioGroup>
    </Modal>

    <Modal
      title="订单审核"
      :width="400"
      :visible="auditInfo.visible"
      :mask-closable="false"
      :destroy-on-close="true"
      @cancel="authOnClose"
      @ok="auditSubmit"
    >
      <RadioGroup v-model:value="auditInfo.status">
        <Radio :value="1">通过</Radio>
        <Radio :value="2">不通过</Radio>
      </RadioGroup>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, computed, createVNode, toRaw } from 'vue';
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
    Space,
    RadioGroup,
    Radio,
  } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { CustomerOrderInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import {
    getCustomerList,
    getCustomerOrderPage,
    saveCustomerOrder,
    updateCustomerOrder,
    deleteCustomerOrder,
    authCustomerOrder,
    auditCustomerOrder,
  } from '/@/api/demo/customer';
  import { ProductInfo } from '/@/api/demo/model/product';
  import { getProductList } from '/@/api/demo/product';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { reactive } from 'vue';
  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const TextArea = Input.TextArea;
  const orderSourceMap: Record<number, string> = {
    1: 'CRM',
    2: '小程序',
  };
  const orderStatusMap: Record<number, string> = {
    1: '待授权',
    2: '待审核',
    5: '已完成',
    18: '授权不通过',
    19: '审核不通过',
  };
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
      Space,
      DeleteOutlined,
      RadioGroup,
      Radio,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });
      const formRef = ref<FormInstance>();
      const drawerInfo = ref<
        DrawerItemType<{
          id: number | undefined;
          totalPrice: number | undefined;
          orderDate: Dayjs | undefined;
          orderName: string | undefined;
          orderNumber: string | undefined;
          products: Array<{ productId: number | undefined; sum: number | undefined }> | undefined;
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

      const cDataSource = ref<Array<CustomerInfo>>([]);
      const searchInfo = ref({
        customerName: undefined,
        orderNumber: undefined,
        source: undefined,
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
        const res = await getProductList({type: 1});
        if (res) {
          pDataSource.value = res;
        }
      };

      const route = useRoute();
      const customerOrderListReq = async (pageNum: number) => {
        const res = await getCustomerOrderPage({
          ...searchInfo.value,
          pageNum,
          productType: 1,
          customerId: route?.query.customerId as string,
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
        searchInfo.value.source = undefined;
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
          width: 120,
        },
        {
          title: '订单名称',
          dataIndex: 'orderName',
          ellipsis: true,
          width: 200,
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
        // {
        //   title: '订单来源',
        //   dataIndex: 'source',
        //   width: 120,
        //   customRender: (state) => orderSourceMap[state.record.source as number],
        // },
        // {
        //   title: '订单状态',
        //   dataIndex: 'status',
        //   width: 120,
        //   customRender: (state) => orderStatusMap[state.record.status as number],
        // },
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
          title: '其他',
          dataIndex: 'remark',
        },
        {
          title: '操作',
          width: 300,
          dataIndex: 'operation',
        },
      ];
      const addProduct = () => {
        const products = drawerInfo.value.item.products || [];
        products?.push({
          productId: undefined,
          sum: undefined,
        });
        drawerInfo.value.item.products = products;
      };
      const deleteProduct = (i: number) => {
        if (drawerInfo.value.item.products?.length) {
          const products = [...drawerInfo.value.item.products];
          products.splice(i, 1);
          drawerInfo.value.item.products = products;
        }
      };

      const addOrder = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增订单';
        drawerInfo.value.type = 'add';
        drawerInfo.value.item.products = [
          {
            productId: undefined,
            sum: undefined,
          },
        ];
      };
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

      const authInfo = reactive({
        visible: false,
        id: undefined,
        status: undefined,
      });
      const authOrder = (item: CustomerOrderInfo) => {
        authInfo.visible = true;
        //@ts-ignore
        authInfo.id = item.id;
      };
      const auditInfo = reactive({
        visible: false,
        id: undefined,
        status: undefined,
      });
      const auditOrder = (item: CustomerOrderInfo) => {
        auditInfo.visible = true;
        //@ts-ignore
        auditInfo.id = item.id;
      };
      const authOnClose = () => {
        authInfo.visible = false;
        authInfo.id = undefined;
        authInfo.status = undefined;

        auditInfo.visible = false;
        auditInfo.id = undefined;
        auditInfo.status = undefined;
      };
      const authSubmit = async () => {
        const res = await authCustomerOrder({ id: auditInfo.id, status: auditInfo.status });
        if (res) {
          message.success('授权订单成功');
          authOnClose()
          customerOrderListReq(pageInfo.value.current);
        }
      };
      const auditSubmit = async () => {
        const res = await auditCustomerOrder({ id: auditInfo.id, status: auditInfo.status });
        if (res) {
          message.success('审核订单成功');
          authOnClose()
          customerOrderListReq(pageInfo.value.current);
        }
      };

      const submit = async () => {
        formRef.value?.validate().then(async () => {
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
        });
      };
      const filterOption = (input: string, option: any) => {
        return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      const pFilterOption = (input: string, option: any) => {
        return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      const orderExport = () => {
        const t = pageInfo.value.dataSource.map((item) => item.id).join(',')
        window.open(
          `http://129.204.202.223:8001/basic-api/customer/order/exportOrder?ids=${t}`,
        );
      };
      return {
        formRef,
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
        authOrder,
        auditOrder,
        submit,
        addProduct,
        deleteProduct,
        // 客户相关
        cDataSource,
        // 产品
        // currentP,
        pDataSource,
        filterOption,
        pFilterOption,
        authShow,
        orderExport,
        authInfo,
        auditInfo,
        authOnClose,
        authSubmit,
        auditSubmit,
      };
    },
  });
</script>
<style lang="less" scoped></style>
