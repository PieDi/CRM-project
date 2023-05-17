<template>
  <PageWrapper title="订单统计">
    <FormItem label="统计维度">
      <Select placeholder="请选择" :style="{ width: '150px' }" @change="typeChange">
        <SelectOption key="1">日</SelectOption>
        <SelectOption key="2">月</SelectOption>
        <SelectOption key="3">季度</SelectOption>
        <SelectOption key="4">年</SelectOption>
      </Select>
    </FormItem>
    <OrderAnalysisBar />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Form, Select } from 'ant-design-vue';
  import { SelectValue } from 'ant-design-vue/lib/select';
  import OrderAnalysisBar from './components/OrderAnalysisBar.vue';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  export default defineComponent({
    components: {
      PageWrapper,
      FormItem,
      Select,
      SelectOption,
      OrderAnalysisBar,
    },
    setup() {
      const cInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const loading = ref(false);
      const typeChange = (type: SelectValue) => {};
      return {
        loading,
        cInfo,
        typeChange,
      };
    },
  });
</script>
<style lang="less" scoped></style>
