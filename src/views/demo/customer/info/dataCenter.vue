<template>
  <div class="info-board">
    <div class="title">
      <img @click="goBack" referrerpolicy="no-referrer" src="/src/assets/images/exit.png" />
      <span @click="goBack" class="text_1">客户信息</span>
    </div>

    <div class="content">
      <div class="content-top">
        <div class="info-basic">
          <div class="block-tip"></div>
          <div class="vip-tag">
            <img src="/src/assets/images/vip-tag.png" />
          </div>
          <div class="info-title">基本信息</div>
          <BasicInfo v-if="boardInfo?.customerBasic" :disease="boardInfo?.customerBasic" />
        </div>

        <div class="disease">
          <div class="block-tip"></div>
          <div class="info-title" :style="{ marginLeft: '16px' }">客户病史信息</div>
          <Disease v-if="boardInfo?.diseases" :disease="boardInfo?.diseases" />
        </div>
      </div>

      <div class="content-bottom">
        <div class="order">
          <div class="block-tip"></div>
          <div class="info-title" :style="{ marginLeft: '16px' }">客户订单</div>
          <div class="more">
            <div @click="() => {pushOrder(boardInfo?.customerBasic.id) }">查看全部<img src="/src/assets/images/dis-more.png" /></div>
          </div>
          <OrderInfo v-if="boardInfo?.orders" :disease="boardInfo?.orders" />
        </div>

        <div class="visit">
          <div class="block-tip"></div>
          <div class="info-title" :style="{ marginLeft: '16px' }">回访工作计划</div>
          <div class="more">
            <div @click="() => {pushVisit(boardInfo?.customerBasic.id) }">查看全部<img src="/src/assets/images/dis-more.png" /></div>
          </div>
          <ReturnInfo v-if="boardInfo?.returnVisits" :disease="boardInfo?.returnVisits" />
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
import ReturnInfo from './components/returnInfo.vue';

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
    ReturnInfo,
    ArrowLeftOutlined,
  },
  setup() {
    const route = useRoute();
    const boardInfo = ref<CustomerBoard>();
    const customerInfoBoard = async () => {
      if (route.query?.id ) {
        const res = await boardCustomer(route.query.id as string);
        if (res) {
          boardInfo.value = res;
        }
      }
    };
    onMounted(() => {
      customerInfoBoard();
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
    const pushOrder = (customerId) => { 
      router.push({ path: '/order/search', query: { customerId } });
    }
    const pushVisit = (customerId) => { 
      router.push({ path: '/return-visit/plan', query: { customerId } });
    }
    return {
      pagination,
      pageInfo,
      searchInfo,
      resetAction,
      searchAction,
      boardInfo,
      goBack,
      pushOrder,
      pushVisit
    };
  },
});
</script>
<style lang="less" scoped>
.info-board {
  background: #f0f2f5;
  color: #7f8ca2;
  height: 100%;

  .title {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    height: 48px;
    padding-left: 10px;
    background: #0c2135;
    display: flex;
    align-items: center;

    .text_1 {
      color: #fff;
    }
  }

  .content {
    min-height: calc(100% - 48px);
    font-size: 16px;
    background: inherit;
    padding: 20px;
    .block-tip {
      position: absolute;
      width: 3px;
      height: 16px;
      background: #007aff;
      left: 0;
      top: 15px;
    }

    .info-title {
      height: 25px;
      font-size: 18px;
      font-weight: 600;
      color: #2e354f;
      line-height: 25px;
      margin-bottom: 20px;
    }

    .content-top {
      display: flex;

      .info-basic {
        position: relative;
        width: 280px;
        // height: 646px;
        background: #fff;
        border-radius: 8px;
        padding: 10px 16px 20px;

        .vip-tag {
          position: absolute;
          top: 0;
          right: 0;
          width: 72px;
          height: 28px;
          padding: 0 16px;
          background: #fff0d2;
        }
      }

      .disease {
        display: flex;
        flex-direction: column;
        position: relative;
        flex: 1;
        padding-top: 10px;
        background: #fff;
        margin-left: 20px;
        border-radius: 8px;
      }
    }

    .content-bottom {
      margin-top: 20px;
      display: flex;

      .more {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 80px;
        height: 22px;
        font-size: 16px;
        color: #007AFF;
        line-height: 22px;
      }

      .order {
        width: 60%;
        background: #fff;
        position: relative;
        padding-top: 10px;
        height: 326px;
      }

      .visit {
        width: calc(40% - 20px);
        margin-left: 20px;
        background: #fff;
        position: relative;
        padding-top: 10px;
        height: 326px;
        overflow: hidden;
      }
    }

    .info-content {
      flex: 1;
      padding: 0 10px;

      .disease {
        position: relative;
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
}</style>
