<template>
  <page-wrapper>
    <div style="display: flex; justify-content: space-between">
      <div style="display: flex">
        <FormItem label="客户姓名">
          <Input
            placeholder="请输入"
            v-model:value="searchInfo.customerName"
            allow-clear
            style="width: 150px"
          />
        </FormItem>
        <!-- <FormItem label="联系电话" style="margin-left: 10px">
          <Input placeholder="请输入" allow-clear style="width: 150px" />
        </FormItem> -->
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
    </div>

    <Table 
    :columns="columns"
    :dataSource="pageInfo.dataSource"
    :canResize="false"
    :striped="false"
    :bordered="true"
    :pagination="pagination"
    >
    </Table>
  </page-wrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { getVisitPage } from '/@/api/demo/visit-return';
  import { Form, Input, Select, DatePicker, Button,Table } from 'ant-design-vue';

  const DateRangePicker = DatePicker.RangePicker;
  const FormItem = Form.Item;
  const SelectOption = Select.Option;

  export default defineComponent({
    components: {
      PageWrapper,
      FormItem,
      Input,
      DateRangePicker,
      Select,
      SelectOption,
      Button,
      Table
    },
    setup() {
      const drawerInfo = ref<DrawerItemType<any>>({ visible: false, title: '', item: {} });
 
      const searchInfo = ref({
        customerName: undefined,
      });
      const pageInfo = ref<PageListInfo<any>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const pagination = computed(() => ({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          visitRListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));

      const visitRListReq = async (pageNum: number) => {
        const res = await getVisitPage({ ...searchInfo.value, status: 2, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      onMounted(() => {
        visitRListReq(1);
      });

      const columns: any = [
      {
        title: '患者姓名',
        dataIndex: 'name',
        width: 100
      },
      {
        title: '患者来源',
        dataIndex: 'source'
      },
      {
        title: '标签',
        dataIndex: 'tag'
      },
      {
        title: '疾病种类',
        dataIndex: 'kind'
      },
      {
        title: '患者等级',
        dataIndex: 'level'
      },
      {
        title: '计划回访时间',
        dataIndex: 'time'
      },
      {
        title: '联系电话',
        dataIndex: 'mobile'
      },
      {
        title: '回访类型',
        dataIndex: 'type'
      },
      {
        title: '执行人员',
        dataIndex: 'staff'
      },
      {
        title: '回访状态',
        dataIndex: 'status'
      },
      // {
      //   title: '操作',
      //   dataIndex: 'operation'
      // }
    ]
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

      const resetAction = () => {
        searchInfo.value.customerName = undefined
        visitRListReq(1)
      };
      const searchAction = () => {};
      return {
        columns,
        searchInfo,
        pageInfo,
        pagination,
        drawerInfo,
        addCustomer,
        editCustomer,
        deleteCustomer,
        drawerOnClose,
        resetAction,
        searchAction,
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
