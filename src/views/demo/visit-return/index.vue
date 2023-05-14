<template>
  <PageWrapper title="回访信息查询">
    <!-- v-model:activeKey="activeKey" -->
    <div class="visit-return-content">
      <Tabs>
        <tab-pane key="1" tab="近期回访">Content of Tab Pane 1</tab-pane>
        <tab-pane key="2" tab="再次回访" force-render>Content of Tab Pane 2</tab-pane>
        <!-- <tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</tab-pane> -->
        <tab-pane key="3" tab="全部回访" force-render>Content of Tab Pane 2</tab-pane>
      </Tabs>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, TabPane } from 'ant-design-vue';
  import { getBasicData } from '../table/tableData';

  export default defineComponent({
    components: {
      PageWrapper,

      Tabs,
      TabPane,
    },
    setup() {
      const drawerInfo = ref({ visible: false, title: '' });
      const cInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const loading = ref(false);
      const pagination = ref({
        total: 50,
        current: 1,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          console.log(2132323, page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      });

      const columns: any = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '电话',
          dataIndex: 'address',
        },
        {
          title: '性别',
          dataIndex: 'no',
        },
        {
          title: '证件类型',
          width: 150,
          dataIndex: 'beginTime',
        },
        {
          title: '证件号码',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '年龄',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '联系地址',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '标签',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '所属分组',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addCustomer = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增客户';
      };
      const editCustomer = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '编辑客户';
      };
      const deleteCustomer = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
      };
      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        drawerInfo,
        cInfo,
        addCustomer,
        editCustomer,
        deleteCustomer,
        drawerOnClose,
      };
    },
  });
</script>
<style lang="less" scoped>
  .visit-return-content {
    height: calc(100vh - 184px);
    padding: 0 15px;
    background: #fff;
  }
</style>
