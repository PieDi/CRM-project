<template>
  <PageWrapper title="小程序订单管理">
    <OrderContent :source="2"/>
  </PageWrapper>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import OrderContent from './components/order-content.vue';
import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: {
      PageWrapper,
      OrderContent,
     
    },
    setup() {
     

      return {
        
      };
    },
  });
</script>
<style lang="less" scoped></style>
