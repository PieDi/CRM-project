<template>
  <div class="info-board">
    <div class="info-protial">
      <img src="@/assets/images/portail.png" alt="" />
    </div>
    <div class="info-content">
      <div class="disease">
        <span>{{ diseaseObject?.name }}</span>
      </div>
      <div class="order">
        <span>{{ sex }}</span>
      </div>
    </div>
  </div>
  <div class="content">
    <span class="label">生日:</span>
    <span>{{ diseaseObject?.birth }}</span>
  </div>
  <div class="content">
    <span class="label">电话:</span>
    <span>{{ diseaseObject?.mobile }}</span>
  </div>
  <div class="content">
    <span class="label">地址:</span>
    <span>{{ diseaseObject?.contactAddress }}</span>
  </div>
  <div class="content">
    <span class="label">证件类型:</span>
    <span>{{ docTypeMap[diseaseObject?.documentType as number] }}</span>
  </div>
  <div class="content">
    <span class="label">证件号码:</span>
    <span>{{ diseaseObject?.documentNumber }}</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import dayjs from 'dayjs';
  import { CustomerInfo } from '/@/api/demo/model/customer';

  const docTypeMap: Record<number, string> = {
    1: '身份证',
    2: '护照',
    3: '军官证',
    4: '港澳通行证',
    5: '台湾通行证',
  };
  export default defineComponent({
    props: {
      disease: {
        type: Object as PropType<CustomerInfo>,
      },
    },
    setup(props) {
      return {
        diseaseObject: props.disease,
        sex: props.disease?.sex != 1 ? '女' : '男',
        dayjs,
        docTypeMap
      };
    },
  });
</script>
<style lang="less" scoped>
  .info-board {
    margin-left: 10px;
    margin-top: 30px;
    height: 60px;
    display: flex;
    .info-protial {
      background: transparent;
      width: 20%;
    }
    .info-content {
      margin-left: 1px;
      flex: 1;
      .disease {
        margin-left: 10px;
        width: 60%;
        height: 40%;
      }
      .order {
        margin-left: 10px;
        width: 60%;
        height: 40%;
      }
    }
    // 添加测试信息
    .content {
      padding-left: 10px;
      padding-right: 10px;
      margin-bottom: 10px;
      .label{
        display: inline-block;
        width: 80px;
      }
    }
  }
</style>
<style lang="less">
.ant-table {
  background: rgba(255, 255, 255, 0.2);
}
</style>