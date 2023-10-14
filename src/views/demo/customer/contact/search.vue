<template>
  <PageWrapper title="客户合同管理" :back-show="showGoBack">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="合同名称">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.name"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>

      <Button type="primary" style="margin-left: 10px" @click="addMHistory">新增合同</Button>
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
            v-if="authShow"
            type="link"
            @click="
              () => {
                mRecordEdit(record);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            @click="
              () => {
                scanRecord(record);
              }
            "
            >查看</Button
          >
          <Button
            v-if="authShow"
            type="link"
            @click="
              () => {
                deleteContract(record);
              }
            "
            >删除</Button
          >
        </template>
      </template>
    </Table>
    <template v-if="mRecordDrawerInfo.visible">
      <m-record
        :drawer-info="mRecordDrawerInfo"
        @drawerOnClose="mRecordClose"
        @edit="mRecordEdit"
        @submit="mRecordSubmit"
      >
      </m-record>
    </template>
  </PageWrapper>
</template>

<script lang="ts">
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { defineComponent, ref, onMounted, computed, toRaw, createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { CustomerContractInfo } from '/@/api/demo/model/customer';
  import { getCustomerContractPage, deleteCustomerContract } from '/@/api/demo/customer';
  import { useRoute } from 'vue-router';
  import dayjs from 'dayjs';
  import mRecord from './components/addContract.vue';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Table, Form, Input, Button, message } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';

  const FormItem = Form.Item;
  const typeMap = {
    1: '销售合同',
    2: '采购合同',
    3: '其他合同',
  };
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      mRecord,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });
      const searchInfo = ref({
        name: undefined,
      });
      const pageInfo = ref<PageListInfo<CustomerContractInfo>>({
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
      const route = useRoute();
      const customerOrderListReq = async (pageNum: number) => {
        const res = await getCustomerContractPage({
          ...searchInfo.value,
          pageNum: pageNum,
          id: route?.query.id as string,
        });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.value.name = undefined;
        customerOrderListReq(1);
      };
      const searchAction = () => {
        customerOrderListReq(1);
      };

      const addCustomer = () => {};

      onMounted(() => {
        customerOrderListReq(1);
      });

      const columns: ColumnsType<CustomerContractInfo> = [
        {
          title: '客户名称',
          dataIndex: 'customerName',
          width: 200,
          ellipsis: true,
        },
        {
          title: '订单名称',
          dataIndex: 'orderName',
          width: 200,
          ellipsis: true,
        },
        {
          title: '合同类型',
          dataIndex: 'type',
          width: 100,
          customRender: (state) => typeMap[state.record.type as number],
        },
        {
          title: '合同名称',
          width: 200,
          ellipsis: true,
          dataIndex: 'name',
        },
        {
          title: '合同编号',
          width: 200,
          ellipsis: true,
          dataIndex: 'number',
        },
        {
          title: '金额',
          width: 160,
          ellipsis: true,
          dataIndex: 'price',
        },
        {
          title: '生效时间',
          width: 200,
          ellipsis: true,
          dataIndex: 'effectiveStart',
          customRender: (state) => dayjs(state.record.effectiveStart).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '截止时间',
          width: 200,
          ellipsis: true,
          dataIndex: 'effectiveEnd',
          customRender: (state) => dayjs(state.record.effectiveEnd).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '操作',
          width: 220,
          dataIndex: 'operation',
        },
      ];

      // 新增记录
      const addMHistory = () => {
        mRecordDrawerInfo.value.title = '新增合同';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.type = 'add';
      };

      // 弹框关闭
      const mRecordClose = () => {
        mRecordDrawerInfo.value.title = '';
        mRecordDrawerInfo.value.visible = false;
        mRecordDrawerInfo.value.type = undefined;
        Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
          mRecordDrawerInfo.value.item[key] = undefined;
        });
      };

      // 提交
      const mRecordSubmit = (reload: boolean) => {
        customerOrderListReq(reload ? 1 : pageInfo.value.current);
        mRecordClose();
      };
      // 编辑
      const mRecordEdit = (item: CustomerContractInfo) => {
        mRecordDrawerInfo.value.title = '编辑合同';
        mRecordDrawerInfo.value.type = 'edit';
        mRecordDrawerInfo.value.visible = true;
        Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
          mRecordDrawerInfo.value.item[key] = item[key];
        });
      };

      const scanRecord = (item: CustomerContractInfo) => {
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.title = '查看合同';
        mRecordDrawerInfo.value.type = 'scan';
        Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
          mRecordDrawerInfo.value.item[key] = item[key];
        });
      };

      // 记录
      const mRecordDrawerInfo = ref<DrawerItemType<CustomerContractInfo>>({
        visible: false,
        title: '',
        item: {
          id: undefined,
          customerId: undefined,
          orderId: undefined,
          orderName: undefined,
          name: undefined,
          number: undefined,
          price: undefined,
          type: undefined,
          status: undefined,
          signTime: undefined,
          description: undefined,
          effectiveStart: undefined,
          effectiveEnd: undefined,
          files: undefined,
        },
      });

      const deleteContract = (item: CustomerContractInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该合同',
            async onOk() {
              const res = await deleteCustomerContract(item.id as number);
              if (res) {
                message.success('删除合同成功');
                customerOrderListReq(pageInfo.value.current);
              }
            },
          }),
        );
      };

      return {
        columns,
        pagination,
        showGoBack: !!route?.query.id,
        pageInfo,
        customerOrderListReq,
        resetAction,
        searchAction,
        onMounted,
        searchInfo,
        addMHistory,
        addCustomer,
        mRecordClose,
        mRecordSubmit,
        mRecordEdit,
        deleteContract,
        scanRecord,
        mRecordDrawerInfo,
        authShow,
      };
    },
  });
</script>
<style lang="less" scoped></style>
