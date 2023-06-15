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
            <Button type="link" @click="drawerEdit(record)">再次回访</Button>
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

      <Form :labelCol="{ span: 4 }">
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
        </FormItem>

        <template v-if="drawerInfo.type === 'edit'">
          <FormItem label="回访类型">
            <Select
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
              placeholder="请输入"
              allowClear
              v-model:value="drawerInfo.item.title"
            />
          </FormItem>

          <FormItem label="回访内容">
            <TextArea
              placeholder="请输入"
              allowClear
              v-model:value="drawerInfo.item.visitContent"
            />
          </FormItem>
        </template>
        <template v-else>
          <FormItem label="回访类型">
            <Select
              :disabled="drawerInfo.type === 'scan'"
              placeholder="请选择"
              allow-clear
              v-model:value="drawerInfo.item.way"
            >
              <SelectOption :value="1">电话回访</SelectOption>
              <SelectOption :value="2">线下回访</SelectOption>
              <SelectOption :value="3">其他</SelectOption>
            </Select>
          </FormItem>

          <FormItem label="回访结果">
            <Select
              placeholder="请选择"
              style="width: 150px"
              v-model:value="drawerInfo.item.result"
              :disabled="drawerInfo.type === 'scan'"
            >
              <SelectOption :value="1">超过预期</SelectOption>
              <SelectOption :value="2">达到预期</SelectOption>
              <SelectOption :value="3">结果一般</SelectOption>
            </Select>
          </FormItem>

          <FormItem label="结果">
            <TextArea
              :disabled="drawerInfo.type === 'scan'"
              placeholder="请输入"
              allowClear
              v-model:value="drawerInfo.item.supplement"
            />
          </FormItem>
        </template>

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
    </Modal>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { PageWrapper } from '@/components/Page';
  import { Form, Input, Button, Table, Modal, DatePicker, Select, message } from 'ant-design-vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { getVisitPage, saveVisit } from '/@/api/demo/visit-return';
  import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { getCustomerList } from '/@/api/demo/customer';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import dayjs from 'dayjs';

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
      TextArea,
    },
    setup() {
      const columns: ColumnsType<VisitReturnInfo> = [
        {
          title: '客户姓名',
          dataIndex: 'customerName',
        },
        {
          title: '回访时间',
          dataIndex: 'time',
          customRender: (state) => dayjs(state.record.visitTime).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '回访项目',
          dataIndex: 'item',
        },
        {
          title: '回访类型',
          dataIndex: 'way',
          customRender: (state) => visitTypeMap[state.record.way as number],
        },
        {
          title: '回访结果',
          dataIndex: 'result',
          customRender: (state) => visitResMap[state.record.way as number],
        },
        {
          title: '结果',
          dataIndex: 'supplement',
        },
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
        const res = await getVisitPage({ ...searchInfo.value, status: 2, pageNum, id });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };

      onMounted(() => {
        visitRListReq(1);
        customerReq();
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
        //@ts-ignore
        item: {
          customerId: undefined,
          item: undefined,
          nextPlan: undefined,
          remark: undefined,
          supplement: undefined,
          way: undefined,
          result: undefined,
          visitTime: undefined,
        },
      });

      const addReturnPlan = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新建回访';
        drawerInfo.value.type = 'add';
      };

      const resetDrawer = () => {
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = undefined;
        });
      };
      const scanReturnPlan = (item: VisitReturnInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看回访';
        drawerInfo.value.type = 'scan';
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
        drawerInfo.value.item.visitTime = dayjs(item.visitTime);
      };
      const drawerEdit = (item: VisitReturnInfo) => {
        drawerInfo.value.title = '再次回访';
        drawerInfo.value.type = 'edit';
        drawerInfo.value.visible = true;
        resetDrawer();
        drawerInfo.value.item.customerId = item.customerId;
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        resetDrawer();
      };

      const submit = async () => {
        let res = await saveVisit({
          ...drawerInfo.value.item,
          visitTime: drawerInfo.value.item.visitTime
            ? drawerInfo.value.item.visitTime.valueOf()
            : undefined,
        });
        if (res) {
          message.success('新建再次回访计划成功');
          // visitRListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose();
        }
      };

      const resetAction = () => {
        searchInfo.value.customerName = undefined;
        visitRListReq(1);
      };
      const searchAction = () => {
        visitRListReq(1);
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
      };
    },
  });
</script>

<style lang="less" scoped></style>
