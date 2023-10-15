<template>
  <PageWrapper>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex">
        <FormItem label="客户姓名">
          <Input
            placeholder="请输入"
            v-model:value="searchInfo.customerName"
            allow-clear
            style="width: 150px"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
      <div>
        <Button type="primary" style="margin-right: 10px" @click="exportPlan">导出</Button>
        <Button type="primary" @click="addReturnPlan">新建回访计划</Button>
      </div>
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :bordered="true"
      :pagination="pagination"
      :scroll="{ x: 'max-content' }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div style="display: flex">
            <Button v-if="record.status === 2" type="link" @click="scanReturnPlan(record)">查看回访单</Button>
            <!-- <Button type="link" @click="print(record)">打印</Button> -->
            <Button v-if="record.status === 1 && record.editRight" type="link" @click="drawerEdit(record)">编辑</Button>
            <Button v-if="record.editRight" type="link" danger @click="deletePlan(record)">删除</Button>
            <Button
              v-if="record.status === 1 && record.editRight"
              type="link"
              style="margin-left: 10px"
              @click="
                () => {
                  startVisit(record);
                }
              "
              >开始回访</Button
            >
          </div>
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
            :disabled="drawerInfo.type !== 'add'"
            show-search
            :filter-option="filterOption"
            placeholder="请选择"
            allow-clear
            v-model:value="drawerInfo.item.customerId"
          >
            <SelectOption
              v-for="item of dataSource"
              :value="item.id"
              :key="`${item.name}_${item.id}`"
              >{{ item.name }}</SelectOption
            >
          </Select>
        </FormItem>

        <FormItem
          label="回访时间"
          name="visitTime"
          :rules="{
            required: true,
            message: '请选择回访时间',
            trigger: 'change',
          }"
        >
          <DatePicker
            :disabled="drawerInfo.type === 'scan'"
            allow-clear
            placeholder="请选择"
            v-model:value="drawerInfo.item.visitTime"
          />
        </FormItem>

        <FormItem
          label="回访类型"
          name="type"
          :rules="{
            required: true,
            message: '请选择回访类型',
            trigger: 'change',
          }"
        >
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            allow-clear
            v-model:value="drawerInfo.item.type"
          >
            <SelectOption :value="1">电话回访</SelectOption>
            <SelectOption :value="2">线下回访</SelectOption>
            <SelectOption :value="3">其他</SelectOption>
          </Select>
        </FormItem>

        <FormItem
          label="标题"
          name="title"
          :rules="{
            required: true,
            message: '请输入回访标题',
            trigger: 'change',
          }"
        >
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.title"
          />
        </FormItem>

        <FormItem
          label="内容简述"
          name="visitContent"
          :rules="{
            required: true,
            message: '内容简述',
            trigger: 'change',
          }"
        >
          <TextArea
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.visitContent"
          />
        </FormItem>

        <FormItem label="备注">
          <TextArea
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.remark"
          />
        </FormItem>
      </Form>
    </Modal>
    <template v-if="showModal && visitInfo.info && visitInfo.plan">
      <StartVisit
        :visible="showModal"
        @confirm="onModelConfirm"
        @cancel="onModelCancel"
        :customer-info="visitInfo.info"
        :visit-plan="visitInfo.plan"
      />
    </template>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, onMounted, toRaw, computed, createVNode } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { Form, Input, Button, Table, Modal, DatePicker, Select, message } from 'ant-design-vue';
  import StartVisit from './start-visit/index.vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import {
    getVisitPage,
    saveVisit,
    updateVisit,
    deleteVisit,
    getVisit,
  } from '/@/api/demo/visit-return';
  import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { getCustomerList } from '/@/api/demo/customer';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

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
      PageWrapper,
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
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });
      const formRef = ref<FormInstance>();
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
      const searchInfo = ref({
        customerName: undefined,
      });
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

      const visitRListReq = async (pageNum: number, id?: string) => {
        const res = await getVisitPage({ ...searchInfo.value, pageNum, id,customerId:route.query?.customerId });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const route = useRoute();
      onMounted(() => {
        customerReq();
        visitRListReq(1, route.query?.id ? (route.query?.id as string) : undefined);
      });
      // 客户
      const dataSource = ref<Array<CustomerInfo>>([]);
      const customerReq = async () => {
        const res = await getCustomerList();
        if (res) {
          dataSource.value = res;
        }
      };
      const filterOption = (input: string, option: any) => {
        return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
              }
            },
          }),
        );
      };

      const addReturnPlan = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新建回访';
        drawerInfo.value.type = 'add';
        console.log(34567)
      };

      const scanReturnPlan = async (item: VisitReturnInfo) => {
        const res = await getVisit(item.id as number);
        if (res) window.open(`http://129.204.202.223:8001/basic-api${res}`);
      };
      const print = (item: VisitReturnInfo) => {
        // drawerInfo.value.visible = true;
        // drawerInfo.value.title = '查看回访';
        // drawerInfo.value.type = 'scan';
        // Object.keys(drawerInfo.value.item).forEach((key) => {
        //   drawerInfo.value.item[key] = item[key];
        // });
        // drawerInfo.value.item.visitTime = dayjs(item.visitTime, 'YYYY-MM-DD');
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

      const submit = async () => {
        formRef.value?.validate().then(async () => {
          let res;
          if (drawerInfo.value.type === 'add') {
            res = await saveVisit({
              ...drawerInfo.value.item,
              visitTime: drawerInfo.value.item.visitTime
                ? drawerInfo.value.item.visitTime.format('YYYY-MM-DD')
                : undefined,
            });
          } else {
            res = await updateVisit({
              ...drawerInfo.value.item,
              visitTime: drawerInfo.value.item.visitTime
                ? drawerInfo.value.item.visitTime.valueOf()
                : undefined,
            });
          }
          if (res) {
            message.success(
              drawerInfo.value.type === 'add' ? '新增回访计划成功' : '修改回访计划成功',
            );
            visitRListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
            drawerOnClose();
          }
        });
      };
      const resetAction = () => {
        searchInfo.value.customerName = undefined;
        visitRListReq(1);
      };
      const searchAction = () => {
        visitRListReq(1);
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
        visitRListReq(pageInfo.value.current, route.query?.id ? (route.query?.id as string) : undefined);
      };
      const onModelCancel = () => {
        showModal.value = false;
        visitInfo.value.info = undefined;
        visitInfo.value.plan = undefined;
      };

      const exportPlan = async () => {
        window.open('http://129.204.202.223:8001/basic-api/customer/returnVisit/export')
      };

      return {
        formRef,
        columns,
        searchInfo,
        pageInfo,
        pagination,
        resetAction,
        searchAction,
        deletePlan,
        // 抽屉
        dataSource,
        drawerInfo,
        addReturnPlan,
        scanReturnPlan,
        print,
        drawerOnClose,
        drawerEdit,
        submit,
        // 开始回访
        showModal,
        visitInfo,
        startVisit,
        onModelConfirm,
        onModelCancel,
        authShow,
        filterOption,
        exportPlan,
      };
    },
  });
</script>

<style lang="less" scoped></style>
