<template>
  <Modal :mask-closable="false" :destroy-on-close="true" title="回访列表" @cancel="hfOnClose" @ok="hfOnClose"
    :visible="hfModal?.visible" width="60%">
    <Table :columns="columns" :dataSource="pageInfo.dataSource" :bordered="true" :pagination="pagination"
      :scroll="{ x: 'max-content' }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div style="display: flex">
            <Button v-if="record.status === 2" type="link" @click="scanReturnPlan(record)">查看回访单</Button>
            <Button v-if="record.status === 1 && record.editRight" type="link" @click="drawerEdit(record)">编辑</Button>
            <Button v-if="record.editRight" type="link" danger @click="deletePlan(record)">删除</Button>
            <Button v-if="record.status === 1 && record.editRight" type="link" style="margin-left: 10px" @click="() => {
              startVisit(record);
            }
              ">开始回访</Button>
          </div>
        </template>
      </template>
    </Table>
    <HfModal v-if="drawerInfo.item.customerId" :customer-id="drawerInfo.item.customerId" :drawer-info="drawerInfo"
      @drawerOnClose="drawerOnClose" @submit="HFSubmit"></HfModal>
    <!-- 开始回访 -->
    <template v-if="showModal && visitInfo.info && visitInfo.plan">
      <StartVisit :visible="showModal" @confirm="onModelConfirm" @cancel="onModelCancel" :customer-info="visitInfo.info"
        :visit-plan="visitInfo.plan" />
    </template>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount, computed, createVNode } from 'vue';
import { Form, Input, Button, Table, Modal, DatePicker, Select, message } from 'ant-design-vue';
import StartVisit from '/@/views/demo/visit-return/start-visit/index.vue';
import { type DrawerItemType, PageListInfo } from '/@/views/type';
import {
  getVisitPage,
  deleteVisit,
  getVisit,
} from '/@/api/demo/visit-return';
import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
import { type ColumnsType } from 'ant-design-vue/lib/table';
import { getCustomerList } from '/@/api/demo/customer';
import { CustomerInfo } from '/@/api/demo/model/customer';
import dayjs from 'dayjs';
import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import HfModal from './hf-modal.vue';

const TextArea = Input.TextArea;
const visitTypeMap: Record<number, string> = {
  1: '电话回访',
  2: '线下回访',
  3: '其他',
};
const visitResMap: Record<number, string> = {
  1: '超过预期',
  2: '达到预期',
  3: '结果一般',
};
const visitStatusMap: Record<number, string> = {
  1: '待回访',
  2: '已回访',
};
export default defineComponent({
  components: {
    Form,
    FormItem: Form.Item,
    Input,
    Button,
    Table,
    Modal,
    DatePicker,
    Select,
    SelectOption: Select.Option,
    StartVisit,
    TextArea,
    HfModal
  },
  props: {
    hfModal: {
      type: Object as PropType<{ visible: boolean; customerId: any }>,
    },
  },
  setup(props, { emit }) {
    const columns: ColumnsType<VisitReturnInfo> = [
      {
        title: '客户姓名',
        dataIndex: 'customerName',
        width: 100,
      },
      {
        title: '标题',
        dataIndex: 'title',
        width: 200,
        ellipsis: true,
      },
      {
        title: '回访状态',
        dataIndex: 'type',
        width: 100,
        customRender: (state) => visitStatusMap[state.record.status as number],
      },
      {
        title: '回访类型',
        dataIndex: 'type',
        width: 100,
        customRender: (state) => visitTypeMap[state.record.type as number],
      },
      {
        title: '回访结果',
        dataIndex: 'type',
        width: 100,
        customRender: (state) =>
          state.record.result ? visitResMap[state.record.result as number] : '',
      },
      {
        title: '回访时间',
        dataIndex: 'visitTime',
        width: 120,
      },
      {
        title: '内容简述',
        dataIndex: 'visitContent',
        width: 200,
        ellipsis: true,
      },
      {
        title: '经办人',
        dataIndex: 'agent',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 350,
      },
    ];
    const pageInfo = ref<PageListInfo<VisitReturnInfo>>({
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
        visitRListReq(page);
      },
      showQuickJumper: false,
      showSizeChanger: false,
    }));

    const visitRListReq = async (pageNum: number) => {
      const res = await getVisitPage({ pageNum, customerId: props.hfModal?.customerId });
      if (res) {
        pageInfo.value.total = res.total;
        pageInfo.value.current = res.pageNum;
        pageInfo.value.dataSource = res.data;
      }
    };
    onBeforeMount(() => {
      customerReq();
      visitRListReq(1);
    });
    // 客户
    const dataSource = ref<Array<CustomerInfo>>([]);
    const customerReq = async () => {
      const res = await getCustomerList();
      if (res) {
        dataSource.value = res;
      }
    };

    // 抽屉
    const drawerInfo = ref<DrawerItemType<VisitReturnInfo>>({
      visible: false,
      type: undefined,
      title: '',
      // @ts-ignore
      item: {
        id: undefined,
        customerId: undefined,
        item: undefined,
        nextPlan: undefined,
        remark: undefined,
        title: undefined,
        type: undefined,
        visitContent: undefined,
        visitTime: undefined,
      },
    });

    const deletePlan = (item: VisitReturnInfo) => {
      confirm(
        withConfirm({
          icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
          content: '确定删除该回访计划',
          async onOk() {
            const res = await deleteVisit(item.id as number);
            if (res) {
              message.success('删除回访计划成功');
              visitRListReq(pageInfo.value.current);
              emit('submit')
            }
          },
        }),
      );
    };

    const scanReturnPlan = async (item: VisitReturnInfo) => {
      const res = await getVisit(item.id as number);
      if (res) window.open(`http://129.204.202.223:8001/basic-api${res}`);
    };
    const drawerEdit = (item: VisitReturnInfo) => {
      drawerInfo.value.title = '编辑回访';
      drawerInfo.value.type = 'edit';
      drawerInfo.value.visible = true;
      Object.keys(drawerInfo.value.item).forEach((key) => {
        drawerInfo.value.item[key] = item[key];
      });
      drawerInfo.value.item.visitTime = dayjs(item.visitTime, 'YYYY-MM-DD');
    };

    const drawerOnClose = () => {
      drawerInfo.value.visible = false;
      drawerInfo.value.title = '';
      drawerInfo.value.type = undefined;
      Object.keys(drawerInfo.value.item).forEach((key) => {
        drawerInfo.value.item[key] = undefined;
      });
    };

    const HFSubmit = async () => {
      visitRListReq(1);
      emit('submit')
    };
    /**
     * 开始回访
     */
    const showModal = ref(false);
    const visitInfo = ref<{
      info?: CustomerInfo;
      plan?: VisitReturnInfo;
    }>({
      info: undefined,
      plan: undefined,
    });
    const startVisit = (item: VisitReturnInfo) => {
      const t = dataSource.value.filter((o) => o.id === item.customerId);
      if (t.length) {
        visitInfo.value.info = t[0];
        visitInfo.value.plan = item;
      }
      showModal.value = true;
    };
    const onModelConfirm = () => {
      showModal.value = false;
      visitRListReq(pageInfo.value.current);
      emit('submit')
    };
    const onModelCancel = () => {
      showModal.value = false;
      visitInfo.value.info = undefined;
      visitInfo.value.plan = undefined;
    };
    const hfOnClose = () => { emit('drawerOnClose') }
    return {
      hfModal: props.hfModal,
      columns,
      pageInfo,
      pagination,
      deletePlan,
      hfOnClose,
      // 抽屉
      dataSource,
      drawerInfo,
      scanReturnPlan,
      drawerOnClose,
      drawerEdit,
      HFSubmit,
      // 开始回访
      showModal,
      visitInfo,
      startVisit,
      onModelConfirm,
      onModelCancel,
    };
  },
});
</script>

<style lang="less" scoped></style>
