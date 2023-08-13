<template>
  <div class="ddd">
    <div v-for="item of diseaseObject" class="visit-item">
      <div class="item-title">
        <img src="/src/assets/images/visit-logo.png" class="item-logo" />
        {{ item.title }}
      </div>
      <div class="item-row">
        <div class="label">回访状态:</div>
        <div>{{ visitStatusMap[item.status as number] }}</div>
      </div>
      <div class="item-row">
        <div class="label">回访类型:</div>
        <div>{{ visitTypeMap[item.type as number] }}</div>
      </div>
      <div class="item-row">
        <div class="label">回访结果:</div>
        <div>{{ visitResMap[item.result as number] }}</div>
      </div>
      <div class="item-row">
        <div style="flex-shrink: 0" class="label">回访时间:</div>
        <div >{{ item.visitTime }}</div>
      </div>
      <div class="item-des">
        <div class="label">内容简介</div>
        <div>{{ item.remark }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import dayjs from 'dayjs';
import { Table, Button } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { CustomerOrderInfo } from '/@/api/demo/model/customer';
import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
const visitTypeMap: Record<number, string> = {
  1: '电话回访',
  2: '线下回访',
  3: '其他',
};
const visitResMap: Record<number, string> = {
  1: '超过预期',
  2: '达到预期',
  3: '结果一般',
};
const visitStatusMap: Record<number, string> = {
  1: '待回访',
  2: '已回访',
};
export default defineComponent({
  components: {
    Table,
    Button,
  },
  props: {
    disease: {
      type: Object as PropType<Array<VisitReturnInfo>>,
    },
  },
  setup(props) {
    const scanOrder = (item: CustomerOrderInfo) => { };
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

    return {
      linkClick,
      cLinkClick,
      iLinkClick,
      diseaseObject: props.disease,
      dayjs,
      scanOrder,
      visitTypeMap,
      visitResMap,
      visitStatusMap,
    };
  },
});
</script>
<style lang="less" scoped>
.ddd {
  overflow: hidden;
  padding: 16px;
  padding-top: 0;
  display: flex;

  .visit-item+.visit-item {
    margin-left: 16px;
  }

  .visit-item {
    background: #f8f9fa;
    height: 259px;
    width: 33%;
    padding: 16px;
    padding-top: 0;
    font-size: 14px;
    color: #7f8ca2;
    line-height: 20px;

    .item-title {
      height: 50px;
      line-height: 50px;
      font-weight: 600;
      color: #2E354F;
      border-bottom: 1px solid #dddddd;

      .item-logo {
        width: 22px;
        height: 22px;
      }
    }
    .label {
        width: 70px;
      }
    .item-row {
      margin-top: 8px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 20px;
      overflow: hidden;
      
    }
    .item-des {
      margin-top: 8px;
      border-top: 1px solid #dddddd;
      padding-top: 8px;
    }
  }
}
</style>
