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
            <li class="item" v-for="item in getListData(current)" :key="item.id">
              <Badge
                :status="item.type"
                :text="item.task"
                @click="
                  () => {
                    taskEdit(item);
                  }
                "
              />
              <Button
              v-if="item.editRight"
                type="link"
                danger
                @click="
                  () => {
                    taskDelete(item.id);
                  }
                "
                >删除</Button
              >
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
    </div>
    <Modal
      :mask-closable="false"
      :destroy-on-close="true"
      title="个人任务"
      @cancel="drawerOnClose"
      @ok="submit"
      width="50%"
      :visible="drawerInfo.visible"
    >
      <Form :labelCol="{ span: 4 }">
        <Form :labelCol="{ span: 4 }">
          <FormItem label="创建者" v-if="drawerInfo.type === 'edit'">
            <div>{{ drawerInfo.creator }}</div>
          </FormItem>
          <FormItem label="个人任务">
            <TextArea v-model:value="drawerInfo.task" placeholder="请输入"></TextArea>
          </FormItem>
        </Form>
      </Form>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onBeforeMount, computed, ref, reactive, createVNode } from 'vue';
  import {
    Calendar,
    Badge,
    Avatar,
    Button,
    Input,
    Modal,
    Form,
    FormItem,
    message,
  } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    getTaskCalendar,
    saveTaskCalendar,
    updateTaskCalendar,
    deleteTaskCalendar,
  } from '/@/api/demo/visit-return';
  import { TaskObject } from '/@/api/demo/model/visit-return';
  import dayjs, { Dayjs } from 'dayjs';
  import headerImg from '/@/assets/images/header.jpg';
  import { useUserStore } from '/@/store/modules/user';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

  const TextArea = Input.TextArea;
  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);
  const sourceData = ref<Array<TaskObject>>([]);
  const taskRequest = async (params: any) => {
    const res = await getTaskCalendar(params);
    if (res) sourceData.value = res;
  };
  const c = ref(dayjs());
  onBeforeMount(async () => {
    taskRequest({});
  });
  const onPanelChange = async (val: any) => {
    c.value = val;
    taskRequest({ year: val.format('YYYY'), month: val.format('MM') });
  };
  const getListData = (value: Dayjs) => {
    let listData: Array<{ type: 'warning'; task: string; id: number, editRight: boolean, creator: string }> = [];
    sourceData.value.forEach((o) => {
      if (value.format('YYYY-MM-DD') === o.date) {
        o.tasks.forEach((i) => {
          // @ts-ignore
          listData.push({ type: 'warning', task: i.task, id: i.id, date: o.date, editRight: i.editRight, creator: i.creator });
        });
      }
    });
    return listData;
  };
  const taskDelete = (id: number) => {
    confirm(
      withConfirm({
        icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
        content: '确定删除该订单',
        async onOk() {
          const res = await deleteTaskCalendar([id]);
          if (res) {
            message.success('删除任务成功');
            taskRequest({ year: c.value.format('YYYY'), month: c.value.format('MM') });
          }
        },
      }),
    );
  };
  const taskEdit = (o: any) => {
    drawerInfo.visible = true;
    //@ts-ignore
    drawerInfo.type = 'edit';
    drawerInfo.task = o.task;
    drawerInfo.id = o.id;
    drawerInfo.creator = o.creator
    //@ts-ignore
    drawerInfo.taskTime = o.date;
  };

  const drawerInfo = reactive({
    type: undefined,
    visible: false,
    creator: undefined,
    task: undefined,
    taskTime: undefined,
    id: undefined,
  });
  const taskAdd = (value: Dayjs) => {
    drawerInfo.visible = true;
    //@ts-ignore
    drawerInfo.type = 'add';
    drawerInfo.task = undefined;
    drawerInfo.id = undefined;
    //@ts-ignore
    drawerInfo.taskTime = value.format('YYYY-MM-DD');
  };
  const drawerOnClose = () => {
    drawerInfo.visible = false;
    drawerInfo.task = undefined;
    drawerInfo.taskTime = undefined;
  };
  const submit = async () => {
    let res;
    if (drawerInfo.type === 'add') {
      res = await saveTaskCalendar({
        task: drawerInfo.task,
        taskTime: drawerInfo.taskTime,
      });
    } else {
      res = await updateTaskCalendar({
        task: drawerInfo.task,
        taskTime: drawerInfo.taskTime,
        id: drawerInfo.id
      });
    }

    if (res) {
      message.success('更新任务成功');
      drawerOnClose();
      taskRequest({ year: c.value.format('YYYY'), month: c.value.format('MM') });
    }
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
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
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
