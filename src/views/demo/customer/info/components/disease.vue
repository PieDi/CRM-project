<template>
  <PageWrapper title="客户信息看板">
    <div class="info-board">
      <div class="info-basic"></div>
      <div class="info-content">
        <div class="disease"></div>
        <div class="order"></div>
      </div>
    </div>
    <!-- <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户姓名">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.name"
          />
        </FormItem>

        <FormItem label="证件号码" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.documentNumber"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="true"
      :bordered="true"
      :pagination="pagination"
    >
    </Table> -->
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
    Select,
    InputNumber,
    DatePicker,
  } from 'ant-design-vue';
  import { type PageListInfo } from '/@/views/type';
  import { getCustomerPage, boardCustomer } from '/@/api/demo/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerBoard } from '/@/api/demo/model/customer';
  import { sexMap, docTypeMap } from '/@/views/const';
  import { useRoute } from 'vue-router';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const TextArea = Input.TextArea;
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      Select,
      SelectOption,
      InputNumber,
      ExclamationCircleOutlined,
      DatePicker,
      TextArea,
    },
    setup() {
      const route = useRoute();
      const boardInfo = ref<CustomerBoard>()
      const customerInfoBoard = async () => {
        if (route.query?.id) {
          const res = await boardCustomer(route.query.id as string);
          if(res) boardInfo.value = res
         }
      };
      onMounted(() => {
        customerInfoBoard();
        customerListReq(1);
      });

      const searchInfo = ref({
        name: undefined,
        documentNumber: undefined,
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
          customerListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const customerListReq = async (pageNum: number) => {
        const res = await getCustomerPage({ ...searchInfo.value, assign: 0, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.value.name = undefined;
        searchInfo.value.documentNumber = undefined;
        customerListReq(1);
      };
      const searchAction = () => {
        customerListReq(1);
      };

      const columns: ColumnsType<CustomerInfoBoard> = [
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          customRender: (state) => sexMap[state.record.sex as number],
        },
        {
          title: '电话',
          dataIndex: 'mobile',
        },
        {
          title: '证件类型',
          dataIndex: 'documentType',
          customRender: (state) => docTypeMap[state.record.documentType as number],
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '联系地址',
          dataIndex: 'contactAddress',
        },

        {
          title: '诊疗记录',
          dataIndex: 'zhenliao',
        },
        {
          title: '检查记录',
          dataIndex: 'jiancha',
        },
        {
          title: '会诊记录',
          dataIndex: 'huizhen',
        },
        {
          title: '检验记录',
          dataIndex: 'jianyan',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      return {
        columns,
        pagination,
        pageInfo,
        searchInfo,
        resetAction,
        searchAction,
      };
    },
  });
</script>
<style lang="less" scoped>
  .info-board {
    display: flex;
    .info-basic {
      background: #fff;
      width: 200px;
      min-height: 600px;
    }
    .info-content {
      
      margin-left: 1px;
      flex:1;
      .disease {
        background: #fff;
        min-height: 400px;
      }
      .order {
        margin-top: 1px;
        background: #fff;
        min-height: 300px;
      }
    }
  }
</style>
