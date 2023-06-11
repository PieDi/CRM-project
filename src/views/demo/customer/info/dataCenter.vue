<template>
  <PageWrapper title="客户信息看板" :back-show="true">
    <div class="info-board">
      <div class="info-basic">
        <h3>基本信息</h3>
        <BasicInfo v-if="boardInfo?.customerBasic" :disease="boardInfo?.customerBasic" />
      </div>
      <div class="info-content">
        <div class="disease">
          <h3>客户病史信息</h3>
          <Disease v-if="boardInfo?.diseases" :disease="boardInfo?.diseases" />
        </div>
        <div class="order">
          <h3 style="margin-top: 10px; margin-left: 10px">客户订单</h3>
          <OrderInfo v-if="boardInfo?.orders" :disease="boardInfo?.orders" />
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, computed } from 'vue';
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
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerBoard } from '/@/api/demo/model/customer';
  import { useRoute } from 'vue-router';
  import Disease from './components/disease.vue';
  import BasicInfo from './components/basicInfo.vue';
  import OrderInfo from './components/orderInfo.vue';
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
      Disease,
      BasicInfo,
      OrderInfo,
    },
    setup() {
      const route = useRoute();
      const boardInfo = ref<CustomerBoard>();
      const customerInfoBoard = async () => {
        if (route.query?.id) {
          const res = await boardCustomer(route.query.id as string);
          if (res) {
            boardInfo.value = res;
          }
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
      return {
        pagination,
        pageInfo,
        searchInfo,
        resetAction,
        searchAction,
        boardInfo,
      };
    },
  });
</script>
<style lang="less" scoped>
  .info-board {
    display: flex;
    // height: calc(100vh - 184px);
    background-image: url('@/assets/images/board-bg-2.jpg');
    background-size: 100% 100%;
    .info-basic {
      background: rgba(255, 255, 255, 0.2);
      padding-top: 10px;
      padding-left: 10px;
      width: 260px;
      min-height: 600px;
    }
    .info-content {
      flex: 1;
      .disease {
        background: rgba(255, 255, 255, 0.2);
        min-height: 400px;
        max-height: 500px;
        padding: 10px;
        overflow-y: scroll;
      }
      .order {
        background: rgba(255, 255, 255, 0.2);
        min-height: 300px;
        padding: 10px;
      }
    }
    // 添加测试信息
  }
</style>
