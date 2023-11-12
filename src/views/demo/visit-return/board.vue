<template>
  <PageWrapper>
    <template #headerContent>
      <div class="lg:flex">
        <Avatar :src="headerImg" :size="72" class="!mx-auto !block" />
        <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
          <h1 class="md:text-lg text-md">早安, {{ userinfo.userName }}, 开始您一天的工作吧！</h1>
        </div>

        <div class="flex flex-1 justify-end md:mt-0 mt-4"> </div>
      </div>
    </template>
    <div class="calendar-board">
      <Calendar @panel-change="onPanelChange">
        <template #dateCellRender="{ current }">
          <ul class="events">
            <li
              v-for="item in getListData(current)"
              :key="item.content"
              @click="
                () => {
                  liClick(item);
                }
              "
            >
              <Badge :status="item.type" :text="item.content" />
            </li>
            <li
              ><Button
                v-if="c.format('MM') === current.format('MM')"
                type="link"
                @click="
                  () => {
                    taskAdd(current);
                  }
                "
                >新增</Button
              ></li
            >
          </ul>
        </template>
      </Calendar>

      <Modal
        :mask-closable="false"
        :destroy-on-close="true"
        title="新增回访"
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
            label="回访类型"
            name="type"
            :rules="{
              required: true,
              message: '请选择回访类型',
              trigger: 'change',
            }"
          >
            <Select placeholder="请选择" allow-clear v-model:value="drawerInfo.item.type">
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
            <Input placeholder="请输入" allowClear v-model:value="drawerInfo.item.title" />
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
              placeholder="请输入"
              allowClear
              v-model:value="drawerInfo.item.visitContent"
            />
          </FormItem>

          <FormItem label="备注">
            <TextArea placeholder="请输入" allowClear v-model:value="drawerInfo.item.remark" />
          </FormItem>
        </Form>
      </Modal>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onBeforeMount, computed, ref, reactive } from 'vue';
  import {
    Calendar,
    Badge,
    Avatar,
    Button,
    Modal,
    Form,
    FormItem,
    Input,
    Select,
    SelectOption,
    message,
  } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { getVisitCalendar, saveVisit } from '/@/api/demo/visit-return';
  import { CalendarObject } from '/@/api/demo/model/visit-return';
  import dayjs, { Dayjs } from 'dayjs';
  import { getCustomerList } from '/@/api/demo/customer';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import { useRouter } from 'vue-router';
  import headerImg from '/@/assets/images/header.jpg';
  import { useUserStore } from '/@/store/modules/user';
  import type { FormInstance } from 'ant-design-vue';

  const TextArea = Input.TextArea;
  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);
  const sourceData = ref<Array<CalendarObject>>([]);
  const c = ref(dayjs());
  const calendarRequest = async (params: any) => {
    const res = await getVisitCalendar(params);
    if (res) sourceData.value = res;
  };
  onBeforeMount(async () => {
    customerReq();
    calendarRequest({});
  });
  const onPanelChange = async (val: any) => {
    c.value = val;
    calendarRequest({ year: val.format('YYYY'), month: val.format('MM') })
  };
  const getListData = (value: Dayjs) => {
    let listData: Array<{ type: 'warning'; content: string; id: number }> = [];
    sourceData.value.forEach((o) => {
      // const d = o.date.split('-')[2];
      // console.log(32232323, o.date)
      if (value.format('YYYY-MM-DD') === o.date) {
        o.visits.forEach((i) => {
          // @ts-ignore
          listData.push({ type: 'warning', content: i.title, id: i.id });
        });
      }
    });
    return listData;
  };
  const router = useRouter();
  const liClick = (o: any) => {
    router.push({ path: '/return-visit/plan', query: { id: o.id } });
  };
  // 新增计划
  const formRef = ref<FormInstance>();
  const taskAdd = (value: Dayjs) => {
    drawerInfo.visible = true;
    drawerInfo.item.visitTime = value;
  };
  const drawerInfo = reactive<any>({
    visible: false,
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
  const drawerOnClose = () => {
    drawerInfo.visible = false;
    Object.keys(drawerInfo.item).forEach((key) => {
      drawerInfo.item[key] = undefined;
    });
  };
  const submit = async () => {
    formRef.value?.validate().then(async () => {
      const res = await saveVisit({
        ...drawerInfo.item,
        visitTime: drawerInfo.item.visitTime
          ? drawerInfo.item.visitTime.format('YYYY-MM-DD')
          : undefined,
      });
      if (res) {
        message.success('新增回访计划成功');
        calendarRequest({ year: c.value.format('YYYY'), month: c.value.format('MM') })
        drawerOnClose();
      }
    });
  };
</script>

<style lang="less">
  .calendar-board {
    .ant-picker-calendar-header {
      .ant-radio-group {
        .ant-radio-button-wrapper {
          display: none;
        }
      }
    }
    .events {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .events .ant-badge-status {
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }
</style>
