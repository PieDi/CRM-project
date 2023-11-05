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
          <BasicInfo
            v-if="boardInfo?.customerBasic"
            :disease="boardInfo?.customerBasic"
            :callback="infoCallback"
          />
        </div>

        <div class="disease">
          <div class="block-tip"></div>
          <div class="info-title" :style="{ marginLeft: '16px' }"
            >客户病史信息<Button type="link" @click="addMHistory">新增</Button></div
          >
          <Disease
            v-if="boardInfo?.diseases"
            :disease="boardInfo?.diseases"
            @submit="infoCallback"
          />
        </div>
        <div class="data-report">
          <div class="block-tip"></div>
          <div class="info-title" :style="{ marginLeft: '16px' }">数据报告</div>
          <DataReport
            v-if="boardInfo?.customerBasic.id"
            :customer-id="boardInfo?.customerBasic.id"
            :disease="boardInfo?.customerBasic"
            @submit="infoCallback"
          />
        </div>
      </div>

      <div class="content-bottom">
        <div class="order">
          <div class="block-tip"></div>
          <div class="info-title" :style="{ marginLeft: '16px' }"
            >客户订单<Popover trigger="click">
              <template #content>
                <Button
                  type="link"
                  @click="
                    () => {
                      addOrder(1);
                    }
                  "
                  >标准订单</Button
                >
                <Button
                  type="link"
                  @click="
                    () => {
                      addOrder(2);
                    }
                  "
                  >非标准订单</Button
                >
              </template>
              <Button type="link">新增</Button>
            </Popover>
          </div>
          <div class="more">
            <div @click="mOrderClick">查看全部<img src="/src/assets/images/dis-more.png" /></div>
          </div>
          <OrderInfo
            v-if="boardInfo?.orders"
            :disease="boardInfo?.orders"
            @submit="orderInfoSubmit"
          />
        </div>

        <div class="visit">
          <div class="block-tip"></div>
          <div class="info-title" :style="{ marginLeft: '16px' }"
            >回访工作计划<Button type="link" @click="addVisitReturn">新增</Button></div
          >
          <div class="more">
            <div @click="hfClick">查看全部<img src="/src/assets/images/dis-more.png" /></div>
          </div>
          <ReturnInfo v-if="boardInfo?.returnVisits" :disease="boardInfo?.returnVisits" />
        </div>
      </div>
    </div>
    <!-- 新增病史 -->
    <m1-record
      v-if="mRecordDrawerInfo.item.customerId"
      :drawer-info="mRecordDrawerInfo"
      @drawerOnClose="mRecordClose"
      @submit="mRecordSubmit"
    ></m1-record>
    <!-- 全部订单 -->
    <MoreO
      v-if="mOrderDrawerInfo.customerId"
      :mOrderModal="mOrderDrawerInfo"
      @drawerOnClose="mOrderInfoClose"
      @submit="orderInfoSubmit"
    ></MoreO>
    <!-- 新增订单 -->
    <OrderModal
      v-if="orderDrawerInfo.item.customerId"
      :customer-id="orderDrawerInfo.item.customerId"
      :drawer-info="orderDrawerInfo"
      :product-type="orderDrawerInfo.productType"
      @drawerOnClose="orderInfoClose"
      @submit="orderInfoSubmit"
    ></OrderModal>
    <!-- 全部回访 -->
    <MoreHf
      v-if="hfDrawerInfo.customerId"
      :hf-modal="hfDrawerInfo"
      @drawerOnClose="hfInfoClose"
      @submit="hfInfoSubmit"
    ></MoreHf>
    <!-- 新建回访 -->
    <HfModal
      v-if="xjhfDrawerInfo.item.customerId"
      :customer-id="xjhfDrawerInfo.item.customerId"
      :drawer-info="xjhfDrawerInfo"
      @drawerOnClose="XJHFDrawerOnClose"
      @submit="XJHFSubmit"
    ></HfModal>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, onBeforeMount, unref } from 'vue';
  import { Button, Popover } from 'ant-design-vue';
  import { CustomerBoard } from '/@/api/demo/model/customer';
  import { useRoute, useRouter } from 'vue-router';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';
  import Disease from './components/disease.vue';
  import BasicInfo from './components/basicInfo.vue';
  import OrderInfo from './components/orderInfo.vue';
  import ReturnInfo from './components/returnInfo.vue';
  import { boardCustomer } from '/@/api/demo/customer';
  import M1Record from './components/m1-record.vue';
  import { type DrawerItemType } from '/@/views/type';
  import { CustomerMHInfo } from '/@/api/demo/model/customer';
  import MoreO from './components/more-o.vue';
  import OrderModal from './components/order-modal.vue';
  import MoreHf from './components/more-hf.vue';
  import HfModal from './components/hf-modal.vue';
  import DataReport from './components/data-report.vue';
  export default defineComponent({
    components: {
      Button,
      Disease,
      BasicInfo,
      OrderInfo,
      ReturnInfo,
      M1Record,
      MoreO,
      OrderModal,
      MoreHf,
      HfModal,
      Popover,
      DataReport,
    },
    setup() {
      const route = useRoute();
      const boardInfo = ref<CustomerBoard>();
      const customerInfoBoard = async () => {
        if (route.query?.id) {
          const res = await boardCustomer(route.query.id as string);
          if (res) boardInfo.value = res;
        }
      };
      onBeforeMount(() => {
        customerInfoBoard();
      });
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

      const pushVisit = (customerId) => {
        router.push({ path: '/return-visit/plan', query: { customerId } });
      };
      const infoCallback = () => {
        customerInfoBoard();
      };
      // 病史记录
      const mRecordDrawerInfo = ref<DrawerItemType<CustomerMHInfo>>({
        visible: false,
        title: '',
        item: {
          id: undefined,
          departmentName: undefined,
          diseaseName: undefined,
          hospitalName: undefined,
          visitDate: undefined,
          customerId: undefined,
          remark: undefined,
        },
      });
      const addMHistory = () => {
        mRecordDrawerInfo.value.title = '新增客户病史';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.type = 'add';
        mRecordDrawerInfo.value.item.customerId = boardInfo.value?.customerBasic.id;
        console.log(3456, mRecordDrawerInfo.value.item.customerId);
      };
      const mRecordClose = () => {
        mRecordDrawerInfo.value.title = '';
        mRecordDrawerInfo.value.visible = false;
        mRecordDrawerInfo.value.type = undefined;
        Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
          mRecordDrawerInfo.value.item[key] = undefined;
        });
      };
      const mRecordSubmit = () => {
        customerInfoBoard();
        mRecordClose();
      };
      // 全部订单
      const mOrderDrawerInfo = ref<{ visible: boolean; customerId: number | undefined }>({
        visible: false,
        customerId: undefined,
      });
      const mOrderInfoClose = () => {
        mOrderDrawerInfo.value.visible = false;
        mOrderDrawerInfo.value.customerId = undefined;
      };
      const mOrderClick = () => {
        mOrderDrawerInfo.value.visible = true;
        mOrderDrawerInfo.value.customerId = boardInfo.value?.customerBasic.id;
      };

      // 新增订单成功
      const orderDrawerInfo = ref<DrawerItemType<any>>({
        visible: false,
        title: '',
        type: undefined,
        productType: undefined,
        item: {
          id: undefined,
          totalPrice: undefined,
          orderDate: undefined,
          orderName: undefined,
          orderNumber: undefined,
          products: [
            {
              productId: undefined,
              sum: undefined,
            },
          ],
          remark: undefined,
          responsiblePerson: undefined,
          customerId: undefined,
        },
      });
      const addOrder = (type: number) => {
        orderDrawerInfo.value.visible = true;
        orderDrawerInfo.value.type = 'add';
        orderDrawerInfo.value.productType = type;
        orderDrawerInfo.value.title = '新增订单';
        orderDrawerInfo.value.item.customerId = boardInfo.value?.customerBasic?.id;
        orderDrawerInfo.value.item.products = [
          {
            productId: undefined,
            sum: undefined,
          },
        ];
      };
      const orderInfoClose = () => {
        orderDrawerInfo.value.visible = false;
        orderDrawerInfo.value.type = undefined;
        orderDrawerInfo.value.title = '';
        orderDrawerInfo.value.productType = undefined;
        Object.keys(orderDrawerInfo.value.item).forEach((key) => {
          orderDrawerInfo.value.item[key] = undefined;
        });
      };
      const orderInfoSubmit = () => {
        orderInfoClose();
        customerInfoBoard();
      };
      // 全部回访
      const hfDrawerInfo = ref<{ visible: boolean; customerId: number | undefined }>({
        visible: false,
        customerId: undefined,
      });
      const hfInfoClose = () => {
        hfDrawerInfo.value.visible = false;
        hfDrawerInfo.value.customerId = undefined;
        // customerInfoBoard();
      };
      const hfClick = () => {
        hfDrawerInfo.value.visible = true;
        hfDrawerInfo.value.customerId = boardInfo.value?.customerBasic.id;
      };
      const hfInfoSubmit = () => {
        hfInfoClose();
        customerInfoBoard();
      };

      const xjhfDrawerInfo = ref<DrawerItemType<any>>({
        visible: false,
        type: undefined,
        title: '',
        // @ts-ignore
        item: {
          id: undefined,
          customerId: boardInfo.value?.customerBasic.id,
          item: undefined,
          nextPlan: undefined,
          remark: undefined,
          title: undefined,
          type: undefined,
          visitContent: undefined,
          visitTime: undefined,
        },
      });
      const addVisitReturn = () => {
        xjhfDrawerInfo.value.title = '新建回访';
        xjhfDrawerInfo.value.type = 'add';
        xjhfDrawerInfo.value.visible = true;
        xjhfDrawerInfo.value.item.customerId = boardInfo.value?.customerBasic.id;
      };

      const XJHFDrawerOnClose = () => {
        xjhfDrawerInfo.value.visible = false;
        xjhfDrawerInfo.value.title = '';
        xjhfDrawerInfo.value.type = undefined;
        Object.keys(xjhfDrawerInfo.value.item).forEach((key) => {
          xjhfDrawerInfo.value.item[key] = undefined;
        });
      };

      const XJHFSubmit = async () => {
        XJHFDrawerOnClose();
        customerInfoBoard();
      };
      return {
        boardInfo,
        goBack,
        pushVisit,
        infoCallback,
        // 新增病史
        mRecordDrawerInfo,
        addMHistory,
        mRecordClose,
        mRecordSubmit,
        // 更多订单
        mOrderDrawerInfo,
        mOrderInfoClose,
        mOrderClick,
        // 新增订单
        orderDrawerInfo,
        addOrder,
        orderInfoClose,
        orderInfoSubmit,
        //全部回访
        xjhfDrawerInfo,
        addVisitReturn,
        XJHFDrawerOnClose,
        XJHFSubmit,
        hfDrawerInfo,
        hfClick,
        hfInfoClose,
        hfInfoSubmit,
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
        margin-bottom: 10px;
      }

      .content-top {
        display: flex;

        .info-basic {
          position: relative;
          width: 280px;
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
          margin: 0 20px;
          border-radius: 8px;
        }

        .data-report {
          position: relative;
          width: 380px;
          background: #fff;
          border-radius: 8px;
          padding: 10px 16px 20px;
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
          color: #007aff;
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
  }
</style>
