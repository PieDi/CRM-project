<template>
  <page-wrapper>
    <!-- 筛选框 -->
    <!-- tab列表 -->
    <all-return-list />
  </page-wrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';

  import { getBasicData } from '../table/tableData';
  import RecentReturnList from './return-list/recent-return-list.vue';
  import AgainReturnList from './return-list/again-return-list.vue';
  import AllReturnList from './return-list/all-return-list.vue';

  export default defineComponent({
    components: {
      PageWrapper,
      RecentReturnList,
      AgainReturnList,
      AllReturnList
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
    padding: 0 15px;
    background: #fff;
  }
</style>
