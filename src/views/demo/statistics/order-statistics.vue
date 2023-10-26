<template>
  <PageWrapper title="客户订单统计">
    <div style="display: flex">
      <FormItem label="统计维度">
        <Select
          placeholder="请选择"
          :style="{ width: '150px' }"
          @change="typeChange"
          v-model:value="searchInfo.type"
        >
          <SelectOption :key="1">日</SelectOption>
          <SelectOption :key="2">月</SelectOption>
          <SelectOption :key="3">年</SelectOption>
        </Select>
      </FormItem>
      <FormItem label="日期" style="margin-left: 10px">
        <template v-if="searchInfo.type === 3">
          <DatePicker picker="year" v-model:value="searchInfo.year"></DatePicker>
        </template>
        <template v-else>
          <RangePicker 
          :picker="(modeMap[searchInfo.type] as string)" v-model:value="searchInfo.range as [Dayjs, Dayjs]" />
        </template>
      </FormItem>
      <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
    </div>

    <OrderAnalysisBar :dataSource="dataSource" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Form, Select,Button, DatePicker, RangePicker } from 'ant-design-vue';
  import { SelectValue } from 'ant-design-vue/lib/select';
  import OrderAnalysisBar from './components/OrderAnalysisBar.vue';
  import { columnarCustomerOrder } from '/@/api/demo/customer';
  import dayjs, { Dayjs } from 'dayjs';
  const FormItem = Form.Item;
  const SelectOption = Select.Option;

  export default defineComponent({
    components: {
      PageWrapper,
      FormItem,
      Select,
      SelectOption,
      OrderAnalysisBar,
      RangePicker,
      DatePicker,
      Button
    },
    setup() {
      const modeMap = ref({
        1: 'date',
        2: 'month',
        3: 'year',
      });
      const searchInfo = ref({
        type: 1,
        year: dayjs(),
        range: [dayjs().subtract(30, 'day'), dayjs()],
      });
      const typeChange = (type: SelectValue) => {
        //@ts-ignore
        searchInfo.value.range = [undefined, undefined];
        //@ts-ignore
        searchInfo.value.year = undefined;
        if (type === 1) {
          searchInfo.value.range = [dayjs().subtract(30, 'day'), dayjs()];
        } else if (type === 2) {
          searchInfo.value.range = [dayjs().subtract(12, 'month'), dayjs()];
        } else if (type === 3) {
          searchInfo.value.year = dayjs();
        }
      };
      const dataSource = ref<Array<any>>([]);
      const customerOrderListReq = async () => {
        const t: any = { type: searchInfo.value.type };
        if (searchInfo.value.type === 1) {
          t.timeEnd = searchInfo.value.range[1].format('YYYY-MM-DD');
          t.timeStart = searchInfo.value.range[0].format('YYYY-MM-DD');
        } else if (searchInfo.value.type === 2) {
          t.timeEnd = searchInfo.value.range[1].format('YYYY-MM');
          t.timeStart = searchInfo.value.range[0].format('YYYY-MM');
        } else if (searchInfo.value.type === 3) {
          // searchInfo.value.year = dayjs()
          t.timeStart = searchInfo.value.year.subtract(10, 'year').format('YYYY');
          t.timeEnd = searchInfo.value.year.format('YYYY');
        }
        const res = await columnarCustomerOrder(t);
        if (res) {
          dataSource.value = res;
        }
      };
      const searchAction = () => {
        customerOrderListReq();
      };

      onMounted(() => {
        customerOrderListReq();
      });

      return {
        searchInfo,
        dataSource,
        searchAction,
        typeChange,
        modeMap,
      };
    },
  });
</script>
<style lang="less" scoped></style>
