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
        <div>{{ item.visitTime }}</div>
      </div>
      <div class="item-des">
        <div class="label">内容简介</div>
        <div class="des-content">{{ item.visitContent }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, watch, ref, PropType } from 'vue';
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
    props: {
      disease: {
        type: Object as PropType<Array<VisitReturnInfo>>,
      },
    },
    setup(props) {

      const diseaseObject = ref();
      watch(
        () => props.disease,
        () => {
          diseaseObject.value = props.disease;
        },
        { immediate: true },
      );
      return {
        diseaseObject,
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
    padding: 0 16px;
    display: flex;

    .visit-item + .visit-item {
      margin-left: 16px;
    }

    .visit-item {
      background: #f8f9fa;
      height: 259px;
      width: calc(33.33% - 10.66px);
      flex-shrink: 0;
      padding: 16px;
      padding-top: 0;
      font-size: 14px;
      color: #7f8ca2;
      line-height: 20px;

      .item-title {
        height: 50px;
        line-height: 50px;
        font-weight: 600;
        color: #2e354f;
        border-bottom: 1px solid #dddddd;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

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
        overflow: hidden;

        .des-content {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          height: 60px;
        }
      }
    }
  }
</style>
