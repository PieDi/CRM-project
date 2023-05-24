<template>
  <PageWrapper title="客户订单管理">
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
        <!-- <FormItem label="负责人" style="margin-left: 10px">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            :style="{ width: '150px' }"
          >
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem> -->
        <FormItem label="订单编号" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.orderNumber"
          />
        </FormItem>
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
      <template #bodyCell="{ column, _text, record }">
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
                deleteOrder(record);
              }
            "
            >删除</Button
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
      <template #extra>
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="drawerEdit">编辑</Button>
        <Button v-if="drawerInfo.type !== 'scan'" type="primary">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="客户姓名">
          <Select
            :show-search="true"
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            :filter-option="filterOption"
            @change="customerOnChange"
            v-model:value="currentCustomer.mobile"
          >
            <SelectOption
              v-for="item of dataSource"
              :key="`${item.id}-${item.name}`"
              :value="item.mobile"
              >{{ `${item.name}-${item.mobile}` }}</SelectOption
            >
          </Select>
        </FormItem>

        <FormItem label="订单名称">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>
        <FormItem label="下单时间">
          <DatePicker :disabled="drawerInfo.type === 'scan'" />
        </FormItem>

        <FormItem label="订单编号">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            :value="cInfo.name"
          />
        </FormItem>

        <FormItem label="订单类型">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption :key="1">标准产品</SelectOption>
            <SelectOption :key="2">非标准产品</SelectOption>
            <SelectOption :key="3">其他产品</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="订单数量">
          <InputNumber
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            min="1"
            :precision="0"
          />
        </FormItem>

        <FormItem label="订单金额">
          <InputNumber :disabled="drawerInfo.type === 'scan'" placeholder="请输入" allowClear />
        </FormItem>

        <FormItem label="关联合同">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem>

        <!-- <FormItem label="负责人">
          <Select :disabled="drawerInfo.type === 'scan'" placeholder="请选择">
            <SelectOption key="1">身份证</SelectOption>
            <SelectOption key="2">护照</SelectOption>
            <SelectOption key="3">军官证</SelectOption>
            <SelectOption key="4">港澳通行证</SelectOption>
            <SelectOption key="5">台湾通行证</SelectOption>
          </Select>
        </FormItem> -->

        <FormItem label="其他">
          <TextArea
            placeholder="请输入"
            allowClear
            :value="cInfo.des"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
    Select,
    InputNumber,
    DatePicker,
} from 'ant-design-vue';
import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { CustomerOrderInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import {
    getCustomerList,
    getCustomerOrderPage,
    updateCustomerMH,
    fileMHUpload,
  } from '/@/api/demo/customer';
  import { SelectValue } from 'ant-design-vue/lib/select';

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
      Drawer,
      Select,
      SelectOption,
      InputNumber,
      DatePicker,
      TextArea,
    },
    setup() {
      const drawerInfo = ref<DrawerItemType<any>>({
        visible: false,
        title: '',
        type: undefined,
        item: {
          //         id: undefined,
          // orderAmount:undefined,
          // orderDate:number | undefined;
          // orderName: string | undefined;
          // orderNumber: string | undefined;
          // productId: string | undefined;
          // remark: string | undefined;
          // responsiblePerson: string | undefined;
        },
      });

      const cInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });

      const dataSource = ref<Array<CustomerInfo>>([]);
      //@ts-ignore
      const currentCustomer = ref<CustomerInfo>({
        id: undefined,
        birth: undefined,
        documentNumber: undefined,
        documentType: undefined,
        mobile: undefined,
        name: undefined,
        sex: undefined,
      });
      const customerOnChange = (value: SelectValue, option: any) => {
        //@ts-ignore
        currentCustomer.value = dataSource.value.find(
          (item: CustomerInfo) => item.mobile === (option.value as string),
        );
      };
      const filterOption = (input: string, option: any) => {
        return (
          option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      };
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
          customerMHListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));

      const customerReq = async () => {
        const res = await getCustomerList();
        if (res) {
          dataSource.value = res;
          if (drawerInfo.value.type !== 'add') {
            //@ts-ignore
            currentCustomer.value = dataSource.value.find(
              (item: CustomerInfo) => item.id === drawerInfo.value?.item?.id,
            );
            // 编辑时设置默认的 currentCustomer
          }
        }
      };
      const customerMHListReq = async (pageNum: number) => {
        const res = await getCustomerOrderPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const searchAction = () => {
        customerMHListReq(1);
      };
      onMounted(() => {
        customerMHListReq(1);
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
          dataIndex: 'no',
        },
        {
          title: '订单编号',
          dataIndex: 'orderNumber',
        },
        {
          title: '订单类型',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '订单数量',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '订单金额',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '合同名称',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '负责人',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '其他',
          width: 150,
          dataIndex: 'endTime',
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
        customerReq();
      };
      const scanOrder = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看订单信息';
        drawerInfo.value.item = item;
        drawerInfo.value.type = 'scan';
        customerReq();
      };
      const deleteOrder = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.item = undefined;
        drawerInfo.value.type = undefined;
      };
      const drawerEdit = () => {
        drawerInfo.value.title = '编辑订单信息';
        drawerInfo.value.type = 'edit';
      };
      return {
        columns,
        pagination,
        searchInfo,
        searchAction,
        pageInfo,
        drawerInfo,
        cInfo,
        addOrder,
        scanOrder,
        deleteOrder,
        drawerOnClose,
        drawerEdit,
        // 客户相关
        customerOnChange,
        currentCustomer,
        dataSource,
        filterOption,
      };
    },
  });
</script>
<style lang="less" scoped></style>
