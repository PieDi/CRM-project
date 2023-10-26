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
          </ul>
        </template>
      </Calendar>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { onMounted, computed, ref } from 'vue';
  import { Calendar, Badge, Avatar } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { getVisitCalendar } from '/@/api/demo/visit-return';
  import { CalendarObject } from '/@/api/demo/model/visit-return';
  import { Dayjs } from 'dayjs';
  import { useRouter } from 'vue-router';
  import headerImg from '/@/assets/images/header.jpg';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);
  const sourceData = ref<Array<CalendarObject>>([]);
  onMounted(async () => {
    const res = await getVisitCalendar({});
    if (res) sourceData.value = res;
  });
  const onPanelChange = async (val: any) => {
    const res = await getVisitCalendar({ year: val.format('YYYY'), month: val.format('MM') });
    if (res) sourceData.value = res;
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
