<template>
  <PageWrapper title="订单统计">
    <FormItem label="统计维度">
      <Select
        placeholder="请选择"
        :style="{ width: '150px' }"
        @change="typeChange"
        v-model:value="sType"
      >
        <SelectOption :key="1">日</SelectOption>
        <SelectOption :key="2">月</SelectOption>
        <SelectOption :key="3">年</SelectOption>
      </Select>
    </FormItem>
    <OrderAnalysisBar :dataSource="dataSource" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Form, Select } from 'ant-design-vue';
  import { SelectValue } from 'ant-design-vue/lib/select';
  import OrderAnalysisBar from './components/OrderAnalysisBar.vue';
  import { columnarCustomerOrder } from '/@/api/demo/customer';

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
      const sType = ref<number>(1);
      const typeChange = (type: SelectValue) => {
        customerOrderListReq()
      };
      const dataSource = ref<Array<{ date: string; count: number }>>([]);
      const customerOrderListReq = async () => {
        const res = await columnarCustomerOrder(sType.value);
        if (res) {
          dataSource.value = res;
        }
      };

      onMounted(() => {
        customerOrderListReq();
      });

      return {
        sType,
        dataSource,
        typeChange,
      };
    },
  });
</script>
<style lang="less" scoped></style>
