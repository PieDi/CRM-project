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
        <!-- <FormItem label="联系电话" style="margin-left: 10px;">
          <Input placeholder="请输入" allow-clear style="width: 150px;" />
        </FormItem> -->
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
      <Button type="primary" @click="addReturnPlan">新建回访</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :bordered="true"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div style="display: flex">
            <Button type="link" @click="scanReturnPlan(record)">查看</Button>
            <Button type="link" style="margin-left: 10px" @click="startVisit">开始回访</Button>
          </div>
        </template>
      </template>
    </Table>

    <Drawer
      :visible="drawerInfo.visible"
      :title="drawerInfo.title"
      placement="right"
      @close="drawerOnClose"
    >
      <template #extra>
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="drawerEdit">编辑</Button>
        <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="客户姓名">
          <Select
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            allow-clear
            v-model:value="drawerInfo.item.customerId"
          >
            <SelectOption v-for="item of dataSource" :value="item.id">{{ item.name }}</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="回访时间">
          <DatePicker
            :disabled="drawerInfo.type === 'scan'"
            show-time
            allow-clear
            placeholder="请选择"
            v-model:value="drawerInfo.item.visitTime"
          />
        </FormItem>

        <FormItem label="回访项目">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.item"
          />
          <!-- <Select
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            allow-clear
            v-model:value="drawerInfo.item.item"
          >
            <SelectOption :value="1">回访项目1</SelectOption>
            <SelectOption :value="2">回访项目2</SelectOption>
          </Select> -->
        </FormItem>

        <FormItem label="回访类型">
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
        <FormItem label="标题">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.title"
          />
        </FormItem>

        <FormItem label="回访内容">
          <TextArea
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.visitContent"
          />
        </FormItem>

        <FormItem label="下一步计划">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.nextPlan"
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
    </Drawer>
    <StartVisit :visible="showModal" @confirm="onModelConfirm" @cancel="onModelCancel" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { Form, Input, Button, Table, Drawer, DatePicker, Select, message } from 'ant-design-vue';
  import StartVisit from './start-visit/index.vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { getVisitPage, saveVisit } from '/@/api/demo/visit-return';
  import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { getCustomerList } from '/@/api/demo/customer';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import dayjs, { Dayjs } from 'dayjs';
  import { useRoute } from 'vue-router';
  const TextArea = Input.TextArea;
  const visitTypeMap: Record<number, string> = {
    1: '电话回访',
    2: '线下回访',
    3: '其他',
  };
  export default defineComponent({
    components: {
      PageWrapper,
      Form,
      FormItem: Form.Item,
      Input,
      Button,
      Table,
      Drawer,
      DatePicker,
      Select,
      SelectOption: Select.Option,
      StartVisit,
      TextArea,
    },
    setup() {
      const columns: ColumnsType<VisitReturnInfo> = [
        {
          title: '客户姓名',
          dataIndex: 'customerName',
        },
        {
          title: '标题',
          dataIndex: 'title',
        },
        {
          title: '回访项目',
          dataIndex: 'item',
        },
        {
          title: '回访类型',
          dataIndex: 'type',
          customRender: (state) => visitTypeMap[state.record.type as number],
        },
        {
          title: '回访时间',
          dataIndex: 'time',
          customRender: (state) => dayjs(state.record.visitTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '回访内容',
          dataIndex: 'visitContent',
        },
        {
          title: '下一步',
          dataIndex: 'nextPlan',
        },
        // {
        //   title: '回访状态',
        //   dataIndex: 'status',
        // },
        {
          title: '操作',
          dataIndex: 'operation',
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
        const res = await getVisitPage({ ...searchInfo.value, status: 1, pageNum, id });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const route = useRoute();
      onMounted(() => {
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

      // 抽屉
      const drawerInfo = ref<DrawerItemType<VisitReturnInfo>>({
        visible: false,
        type: undefined,
        title: '',
        item: {
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

      const addReturnPlan = () => {
        customerReq();
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新建回访';
        drawerInfo.value.type = 'add';
      };

      const scanReturnPlan = (item: VisitReturnInfo) => {
        customerReq();
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看回访';
        drawerInfo.value.type = 'scan';

        drawerInfo.value.item.customerId = item.customerId;
        drawerInfo.value.item.item = item.item;
        drawerInfo.value.item.nextPlan = item.nextPlan;
        drawerInfo.value.item.remark = item.remark;
        drawerInfo.value.item.title = item.title;
        drawerInfo.value.item.type = item.type;
        drawerInfo.value.item.visitContent = item.visitContent;
        drawerInfo.value.item.visitTime = dayjs(item.visitTime);
      };
      const drawerEdit = () => {
        drawerInfo.value.title = '编辑回访';
        drawerInfo.value.type = 'edit';
      };
      const resetDrawer = () => { 
        Object.keys(drawerInfo.value.item).forEach(key => { 
          drawerInfo.value.item[key] = undefined
        })
      }
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        resetDrawer()
      };

      const submit = async () => {
        let res;
        if (drawerInfo.value.type === 'add')
          res = await saveVisit({
            ...drawerInfo.value.item,
            visitTime: drawerInfo.value.item.visitTime
              ? drawerInfo.value.item.visitTime.valueOf()
              : undefined,
          });
        if (res) {
          message.success(
            drawerInfo.value.type === 'add' ? '新增回访计划成功' : '修改回访计划成功',
          );
          visitRListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose();
        }
      };
      /**
       * 开始回访
       */
      const showModal = ref(false);
      const startVisit = () => {
        showModal.value = true;
      };
      const onModelConfirm = () => {
        showModal.value = false;
      };
      const onModelCancel = () => {
        showModal.value = false;
      };
      const resetAction = () => {
        searchInfo.value.customerName = undefined;
        visitRListReq(1);
      };
      const searchAction = () => {
        visitRListReq(1)
      };
      return {
        columns,
        searchInfo,
        pageInfo,
        pagination,
        resetAction,
        searchAction,
        // 抽屉
        dataSource,
        drawerInfo,
        addReturnPlan,
        scanReturnPlan,
        drawerOnClose,
        drawerEdit,
        submit,
        // 开始回访
        showModal,
        startVisit,
        onModelConfirm,
        onModelCancel,
      };
    },
  });
</script>

<style lang="less" scoped></style>
