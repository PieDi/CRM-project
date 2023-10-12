<template>
  <PageWrapper title="客户信息管理">
    <Tabs>
      <TabPane :key="1" tab="个人客户"> <Search1 /></TabPane>
      <TabPane :key="2" tab="企业客户"> <Search2 /></TabPane>
    </Tabs>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import Search1 from './search1.vue';
  import Search2 from './search2.vue';
  export default defineComponent({
    components: {
      PageWrapper,
      Tabs,
      TabPane,
      Search1,
      Search2,
    },
    setup() {
      return {};
    },
  });
</script>
<style lang="less" scoped></style>
