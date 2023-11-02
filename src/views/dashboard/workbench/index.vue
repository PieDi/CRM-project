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
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onBeforeMount, computed, ref, createVNode } from 'vue';
  import { Calendar, Badge, Avatar, Button, Input } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { getTaskCalendar } from '/@/api/demo/visit-return';
  import { CalendarObject } from '/@/api/demo/model/visit-return';
  import dayjs, { Dayjs } from 'dayjs';
  import { useRouter } from 'vue-router';
  import headerImg from '/@/assets/images/header.jpg';
  import { useUserStore } from '/@/store/modules/user';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  const TextArea = Input.TextArea;
  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);
  const sourceData = ref<Array<CalendarObject>>([]);
  onBeforeMount(async () => {
    const c = dayjs();
    const res = await getTaskCalendar({ year: c.format('YYYY'), month: c.format('MM') });
    if (res) sourceData.value = res;
  });
  const onPanelChange = async (val: any) => {
    const res = await getTaskCalendar({ year: val.format('YYYY'), month: val.format('MM') });
    if (res) sourceData.value = res;
  };
  const getListData = (value: Dayjs) => {
    let listData: Array<{ type: 'warning'; content: string; id: number }> = [];
    sourceData.value.forEach((o) => {
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
  const aaa = ref();
  const taskAdd = (value: Dayjs) => {};
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
