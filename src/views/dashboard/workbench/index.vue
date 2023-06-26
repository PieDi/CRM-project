<template>
  <PageWrapper>
    <template #headerContent> <WorkbenchHeader /> </template>
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
  import { onMounted, ref } from 'vue';
  import { Calendar, Badge } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import WorkbenchHeader from './components/WorkbenchHeader.vue';
  import { getVisitCalendar } from '/@/api/demo/visit-return';
  import { CalendarObject } from '/@/api/demo/model/visit-return';
  import { Dayjs } from 'dayjs';
  import { useRouter } from 'vue-router';
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
