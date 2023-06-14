<template>
  <div class="info-board">
    <div class="title" @click="goBack">
      <ArrowLeftOutlined style="color: #fff; margin-right: 10px" /> <span>客户信息</span></div
    >
    <div class="content">
      <div class="info-basic">
        <h3>基本信息</h3>
        <BasicInfo v-if="boardInfo?.customerBasic" :disease="boardInfo?.customerBasic" />
      </div>
      <div class="info-content">
        <div class="disease">
          
          <Disease v-if="boardInfo?.diseases" :disease="boardInfo?.diseases" />
          <div v-else>暂无病史数据</div>
        </div>
        <div class="order">
          <h3 style="margin-top: 10px">客户订单</h3>
          <OrderInfo v-if="boardInfo?.orders" :disease="boardInfo?.orders" />
          <div v-else>暂无订单数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, computed, unref } from 'vue';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
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
  import { useRoute, useRouter } from 'vue-router';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

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
      ArrowLeftOutlined,
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
      const router = useRouter();
      const tabStore = useMultipleTabStore();
      const { currentRoute } = router;

      function getCurrentTab() {
        const route = unref(currentRoute);
        return tabStore.getTabList.find((item) => item.fullPath === route.fullPath)!;
      }
      const goBack = () => {
        router.back();
        tabStore.closeTab(getCurrentTab(), router);
      };
      return {
        pagination,
        pageInfo,
        searchInfo,
        resetAction,
        searchAction,
        boardInfo,
        goBack,
      };
    },
  });
</script>
<style lang="less" scoped>
  .info-board {
    background: rgb(20, 50, 93);
    color: #fff;
    height: 100%;
    .title {
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      height: 50px;
      padding: 15px 10px;
      background: rgb(18, 77, 129);
      margin: 0 0 15px;
      display: flex;
      align-items: center;
    }
    .content {
      display: flex;
      min-height: calc(100% - 65px);
      font-size: 18px;
      background: inherit;
      h3 {
        color: #fff;
        font-weight: 600;
      }

      .info-basic {
        padding: 20px 20px;
        width: 350px;
        background: rgb(18, 77, 129);
      }
      .info-content {
        flex: 1;
        padding: 0 10px;
        .disease {
          height: 610px;
          background: rgb(18, 77, 129);
          overflow-y: scroll;
          padding-left: 20px;
          padding-top: 15px;
        }
        .order {
          min-height: 300px;
          // height: calc(100% - 560px);
          margin-top: 10px;
          padding-left: 20px;
          padding-top: 15px;
          background: rgb(18, 77, 129);
        }
      }
    }

    // 添加测试信息
  }
</style>
