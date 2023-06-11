<template>
  <div class="disease-item" v-for="item of diseaseObject">
    <div class="basic">
      <div class="header"
        ><span>疾病名称:</span><span>{{ item.diseaseBasic.diseaseName }}</span></div
      >
      <div class="header"
        ><span>医院名称:</span><span>{{ item.diseaseBasic.hospitalName }}</span></div
      >
      <div class="header"
        ><span>科室:</span><span>{{ item.diseaseBasic.departmentName }}</span></div
      >
      <div class="header"
        ><span>会诊时间名称:</span
        ><span>{{ dayjs(item.diseaseBasic.visitDate).format('YYYY-MM-DD') }}</span></div
      >
    </div>
    <div style="display: flex">
      <div class="content">
        <div class="item-title">用药记录</div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div
              v-for="d of item.diseaseMedicine"
              class="block"
              @click="
              () => {
                linkClick(d.diseaseId as number);
              }
            "
            >
              <div class="block-content">
                <div>
                  <div> <span>用药时间:</span>{{ dayjs(d.useDate).format('YYYY-MM-DD') }}</div>
                  <div> <span>药品名称:</span>{{ d.useDose }}</div>
                </div>
                <div>
                  <div><span>用药剂量:</span>{{ d.medicineName }}</div>
                </div>
              </div>
            </div></template
          >
          <div v-else>暂无数据</div>
        </div>
      </div>
      <div class="content">
        <div class="item-title">检验记录</div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div
              v-for="d of item.diseaseCheck"
              class="block"
              @click="
              () => {
                linkClick(d.diseaseId as number);
              }
            "
            >
              <div class="block-content">
                <div>
                  <div> <span>检验时间:</span>{{ dayjs(d.checkDate).format('YYYY-MM-DD') }}</div>
                  <div> <span>检验机构:</span>{{ d.checkMechanism }}</div>
                </div>
                <div>
                  <div><span>检验类型:</span>{{ d.checkType }}</div>
                </div>
              </div>
            </div></template
          >
          <div v-else>暂无数据</div>
        </div>
      </div>
    </div>
    <div style="display: flex">
      <div class="content">
        <div class="item-title">影像记录</div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div
              v-for="d of item.diseaseImage"
              class="block"
              @click="
              () => {
                linkClick(d.diseaseId as number);
              }
            "
            >
              <div class="block-content">
                <div>
                  <div> <span>检验时间:</span>{{ dayjs(d.checkDate).format('YYYY-MM-DD') }}</div>
                  <div> <span>检验机构:</span>{{ d.checkMechanism }}</div>
                </div>
                <div>
                  <div><span>检验类型:</span>{{ iCheckType[d.checkType as number] }}</div>
                  <div><span>检验部位:</span>{{ d.checkPart }}</div>
                </div>
              </div>
            </div></template
          >
          <div v-else>暂无数据</div>
        </div>
      </div>
      <div class="content">
        <div class="item-title">就诊记录</div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div
              v-for="d of item.diseaseConsultation"
              class="block"
              @click="
              () => {
                linkClick(d.diseaseId as number);
              }
            "
            >
              <div class="block-content">
                <div>
                  <div>
                    <span>会诊日期:</span>{{ dayjs(d.consultationDate).format('YYYY-MM-DD') }}</div
                  >
                  <div> <span>会诊内容:</span>{{ d.consultationContent }}</div>
                </div>
                <div>
                  <div><span>会诊专家:</span>{{ d.consultationExpert }}</div>
                </div>
              </div>
            </div>
          </template>
          <div v-else>暂无数据</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import dayjs from 'dayjs';
  import { Button, Table } from 'ant-design-vue';
  import {
    CustomerMHInfo,
    CustomerDInfo,
    CustomerEInfo,
    CustomerIInfo,
    CustomerCInfo,
  } from '/@/api/demo/model/customer';
  import { useRouter } from 'vue-router';

  const iCheckType = {
    1: 'CT',
    2: 'MR',
    3: 'PET-CT',
    4: 'PET-MR',
    6: '钼靶',
    7: 'ECT',
    8: 'DR',
  };
  export default defineComponent({
    components: {
      Button,
      Table,
    },
    props: {
      disease: {
        type: Object as PropType<
          Array<{
            diseaseBasic: CustomerMHInfo;
            diseaseMedicine: Array<CustomerDInfo>;
            diseaseCheck: Array<CustomerEInfo>;
            diseaseImage: Array<CustomerIInfo>;
            diseaseConsultation: Array<CustomerCInfo>;
          }>
        >,
      },
    },
    setup(props) {
      const router = useRouter();
      const linkClick = (id: number) => {
        router.push({ path: '/customer/mHistory/search', query: { id } });
      };
      return {
        diseaseObject: props.disease,
        iCheckType,
        linkClick,
        dayjs,
      };
    },
  });
</script>
<style lang="less" scoped>
  .disease-item {
    .basic {
      display: flex;
      .header {
        margin-right: 10px;
      }
    }
    .content {
      width: 50%;
      padding: 10px;
      padding-left: 0;
      .item-title {
        font-size: 20px;
        font-weight: 600;
      }
      .item-content {
        height: 180px;
        overflow-y: auto;
        .block {
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          .block-content {
            display: flex;
            justify-content: space-between;
          }
          span {
            margin-right: 6px;
          }
        }
        .block + .block {
          margin-top: 5px;
        }
      }
    }
  }
</style>
<style lang="less">
  .ant-table {
    background: rgba(255, 255, 255, 0.2);
  }

  ::v-deep .ant-table-tbody tr th {
    background-color: transparent !important;
  }
  ::v-deep.ant-table-cell {
    background: rgba(255, 255, 255, 0.2);
  }

  ::v-deep.ant-table-cell-row-hover {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
