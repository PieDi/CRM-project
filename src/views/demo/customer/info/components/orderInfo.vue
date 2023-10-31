<template>
  <div class="ccc">
    <div v-for="item of diseaseObject" class="order-item">
      <img src="/src/assets/images/order-logo.png" class="item-logo" />
      <div class="column-1 column">
        <div class="value" style="font-weight: 500; font-size: 20px">{{
          `￥${item.order.totalPrice}`
        }}</div>
        <div>订单金额</div>
      </div>
      <div class="column-2 column">
        <Tooltip :title="item.order.orderTime">
          <span class="value">{{ item.order.orderTime }}</span>
        </Tooltip>
        <div>下单时间</div>
      </div>
      <div class="column-3 column">
        <Tooltip :title="item.order.orderName">
          <span class="value">{{ item.order.orderName }}</span>
        </Tooltip>
        <div>订单名称</div>
      </div>
      <div class="column-4 column">
        <Tooltip :title="orderSourceMap[item.order.source as number]">
          <span class="value">{{ orderSourceMap[item.order.source as number] }}</span>
        </Tooltip>
        <div>订单来源</div>
      </div>
      <div class="column-6 column">
        <Tooltip title="订单类型">
          <span class="value">{{ orderTypeMap[item.order.type as number] }}</span>
        </Tooltip>
        <div>订单类型</div>
      </div>

      <div class="column-7 column">
        <div style="display: flex; align-items: center"
          >合同操作：
          <Button type="link" @click="()=>{uploadAction(7, item.order.id as number)}">上传</Button>
          <Button type="link" @click="()=>{scanFJAction(7, item.order.id as number)}">查看</Button>
        </div>
        <div style="display: flex; align-items: center"
          >发票操作：
          <Button type="link" @click="()=>{uploadAction(8, item.order.id as number)}">上传</Button>
          <Button type="link" @click="()=>{scanFJAction(8, item.order.id as number)}">查看</Button>
        </div>
      </div>

      <div class="column-8 column">
        <Button
          type="primary"
          @click="
            () => {
              editOrder(item.order);
            }
          "
          >编辑</Button
        >
      </div>
    </div>
    <!-- 订单编辑 -->
    <OrderModal
      v-if="orderDrawerInfo.item.customerId"
      :customer-id="orderDrawerInfo.item.customerId"
      :drawer-info="orderDrawerInfo"
      @drawerOnClose="orderInfoClose"
      @submit="orderInfoSubmit"
    ></OrderModal>
    <!-- 文件上传 -->
    <UploadModal
      v-if="uploadDrawerInfo.id"
      :drawer-info="uploadDrawerInfo"
      @drawerOnClose="uploadClose"
      @submit="uploadSubmit"
    ></UploadModal>
    <!-- 更多附件 -->
    <MoreFj
      v-if="moreFJDrawerInfo.id"
      :drawer-info="moreFJDrawerInfo"
      @drawerOnClose="moreFJClose"
      @submit="moreFJSubmit"
    ></MoreFj>
  </div>
</template>

<script lang="ts">
  import { defineComponent, watch, ref, PropType } from 'vue';
  import dayjs from 'dayjs';
  import { Table, Button, Tooltip } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import {
    CustomerOrderInfo,
    CustomerContractInfo,
    CustomerInvoiceInfo,
  } from '/@/api/demo/model/customer';
  import { boardFileView } from '/@/api/demo/customer';
  import { type DrawerItemType } from '/@/views/type';
  import OrderModal, { orderSourceMap, orderTypeMap } from './order-modal.vue';
  import UploadModal from './upload-modal.vue';
  import MoreFj, { UploadAA } from './more-fj.vue';
  import { reactive } from 'vue';
  interface BBBB {
    order: CustomerOrderInfo;
    productBasics;
    orderContracts: Array<CustomerContractInfo>;
    orderInvoices: Array<CustomerInvoiceInfo>;
  }
  export default defineComponent({
    components: {
      Table,
      Button,
      Tooltip,
      OrderModal,
      UploadModal,
      MoreFj,
    },
    props: {
      disease: {
        type: Object as PropType<Array<any>>,
      },
    },
    setup(props, { emit }) {
      const scanOrder = (item: CustomerOrderInfo) => {};
      const router = useRouter();
      const linkClick = (id: number) => {
        router.push({ path: '/customer/order/search', query: { id } });
      };
      const cLinkClick = (id: number) => {
        router.push({ path: '/customer/contact/search', query: { id } });
      };
      const iLinkClick = (id: number) => {
        router.push({ path: '/customer/invoice/search', query: { id } });
      };
      const handlePreView = async (id: number, type: number) => {
        const res = await boardFileView(id, type);
        if (res) {
          res.forEach((url) => window.open(url));
        }
      };
      const diseaseObject = ref<Array<BBBB>>();
      watch(
        () => props.disease,
        () => {
          diseaseObject.value = props.disease;
        },
        { immediate: true },
      );
      // 订单编辑
      const orderDrawerInfo = ref<DrawerItemType<any>>({
        visible: false,
        title: '',
        type: undefined,
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
      const editOrder = (item: CustomerOrderInfo) => {
        orderDrawerInfo.value.visible = true;
        orderDrawerInfo.value.type = 'edit';
        orderDrawerInfo.value.title = '编辑订单';
        Object.keys(orderDrawerInfo.value.item).forEach((key) => {
          orderDrawerInfo.value.item[key] = item[key];
        });
        orderDrawerInfo.value.item.products = item.orderProducts?.map((p) => ({
          productId: p.id,
          sum: p.sum,
        }));
        orderDrawerInfo.value.item.orderDate = dayjs(item.orderTime);
      };
      const orderInfoClose = () => {
        orderDrawerInfo.value.visible = false;
        orderDrawerInfo.value.type = undefined;
        orderDrawerInfo.value.title = '';
        Object.keys(orderDrawerInfo.value.item).forEach((key) => {
          orderDrawerInfo.value.item[key] = undefined;
        });
      };
      const orderInfoSubmit = () => {
        orderInfoClose();
        emit('submit');
      };
      // 附件上传
      const uploadDrawerInfo = reactive<UploadAA>({
        visible: false,
        id: undefined,
        type: undefined,
      });
      const uploadAction = (type: number, id: number) => {
        uploadDrawerInfo.visible = true;
        uploadDrawerInfo.type = type;
        uploadDrawerInfo.id = id;
      };
      const uploadClose = () => {
        uploadDrawerInfo.visible = false;
        uploadDrawerInfo.type = undefined;
        uploadDrawerInfo.id = undefined;
      };
      const uploadSubmit = () => {
        uploadClose();
        emit('submit');
      };
      // 更多附件
      const moreFJDrawerInfo = reactive<UploadAA>({
        visible: false,
        id: undefined,
        type: undefined,
      });
      const scanFJAction = (type: number, id: number) => {
        moreFJDrawerInfo.visible = true;
        moreFJDrawerInfo.type = type;
        moreFJDrawerInfo.id = id;
      };
      const moreFJClose = () => {
        moreFJDrawerInfo.visible = false;
        moreFJDrawerInfo.type = undefined;
        moreFJDrawerInfo.id = undefined;
      };
      const moreFJSubmit = () => {
        // moreFJClose();
        emit('submit');
      };
      return {
        diseaseObject,
        linkClick,
        cLinkClick,
        iLinkClick,
        dayjs,
        scanOrder,
        orderSourceMap,
        orderTypeMap,
        handlePreView,
        // 编辑订单
        editOrder,
        orderDrawerInfo,
        orderInfoClose,
        orderInfoSubmit,
        // 附件上传
        uploadDrawerInfo,
        uploadAction,
        uploadClose,
        uploadSubmit,
        // 查看附件
        moreFJDrawerInfo,
        scanFJAction,
        moreFJClose,
        moreFJSubmit
      };
    },
  });
</script>
<style lang="less" scoped>
  .ccc {
    padding: 0 16px;
    height: 271px;
    overflow-y: auto;

    .order-item {
      height: 84px;
      border-bottom: 1px solid #ebebeb;
      display: flex;
      align-items: center;

      .item-logo {
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }

      .column {
        margin: 0 4px;
        width: calc(33.33% - 290px);

        .value {
          display: inline-block;
          font-size: 16px;
          color: #2e354f;
          height: 18px;
          line-height: 22px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .link {
          cursor: pointer;
          font-size: 16px;
          color: #007aff;
          line-height: 22px;
        }
      }

      .column-1 {
        width: 140px;
      }

      .column-2 {
        width: 200px;
      }

      .column-7 {
        width: 320px;
      }

      .column-8 {
        width: 100px;
      }
    }
  }
</style>
