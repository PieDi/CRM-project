<template>
  <div class="disease-item" v-for="(item, i) of diseaseObject">
    <h3 class="header">{{ `客户病史信息${i + 1}` }}</h3>
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
        <div class="item-title">
          <div
            @click="
              () => {
                linkClick(item.diseaseBasic.id as number);
              }"
            >用药记录</div
          >
          <div
            style="cursor: pointer"
            @click="
              () => {
                viewAll(1, item.diseaseBasic.id as number);
              }
            "
            >查看全部</div
          >
        </div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div v-for="d of item.diseaseMedicine" class="block">
              <div class="block-content">
                <div>
                  <div class="content-label">
                    <span>用药时间:</span>{{ dayjs(d.useDate).format('YYYY-MM-DD') }}</div
                  >
                  <div class="content-label"> <span>药品名称:</span>{{ d.medicineName }}</div>
                </div>
                <div>
                  <div class="content-label"><span>用药剂量:</span>{{ d.useDose }}</div>
                </div>
              </div>
            </div> </template
          ><div v-else class="block-content">暂无数据</div>
        </div>
      </div>
      <div class="content">
        <div class="item-title">
          <div
            @click="
              () => {
                linkClick(item.diseaseBasic.id as number);
              }"
            >检验记录</div
          >
          <div
            style="cursor: pointer"
            @click="
              () => {
                viewAll(2, item.diseaseBasic.id as number);
              }
            "
            >查看全部</div
          >
        </div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div v-for="d of item.diseaseCheck" class="block">
              <div class="block-content">
                <div>
                  <div class="content-label">
                    <span>检验时间:</span>{{ dayjs(d.checkDate).format('YYYY-MM-DD') }}</div
                  >
                  <div class="content-label"> <span>检验机构:</span>{{ d.checkMechanism }}</div>
                </div>
                <div>
                  <div class="content-label"><span>检验类型:</span>{{ d.checkType }}</div>
                </div>
              </div>
            </div> </template
          ><div v-else class="block-content">暂无数据</div>
        </div>
      </div>
    </div>
    <div style="display: flex">
      <div class="content">
        <div class="item-title">
          <div
            @click="
              () => {
                linkClick(item.diseaseBasic.id as number);
              }"
            >影像记录</div
          >
          <div
            style="cursor: pointer"
            @click="
              () => {
                viewAll(3, item.diseaseBasic.id as number);
              }
            "
            >查看全部</div
          >
        </div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div v-for="d of item.diseaseImage" class="block">
              <div class="block-content">
                <div>
                  <div class="content-label">
                    <span>检验时间:</span>{{ dayjs(d.checkDate).format('YYYY-MM-DD') }}</div
                  >
                  <div> <span>检验机构:</span>{{ d.checkMechanism }}</div>
                </div>
                <div>
                  <div class="content-label"
                    ><span>检验类型:</span>{{ iCheckType[d.checkType as number] }}</div
                  >
                  <div class="content-label"><span>检验部位:</span>{{ d.checkPart }}</div>
                </div>
              </div></div
            >
          </template>
          <div v-else class="block-content">暂无数据</div>
        </div>
      </div>
      <div class="content">
        <div class="item-title">
          <div
            @click="
              () => {
                linkClick(item.diseaseBasic.id as number);
              }"
            >就诊记录</div
          >
          <div
            style="cursor: pointer"
            @click="
              () => {
                viewAll(4, item.diseaseBasic.id as number);
              }
            "
            >查看全部</div
          >
        </div>
        <div class="item-content">
          <template v-if="item.diseaseMedicine.length">
            <div v-for="d of item.diseaseConsultation" class="block">
              <div class="block-content">
                <div>
                  <div class="content-label">
                    <span>会诊日期:</span>{{ dayjs(d.consultationDate).format('YYYY-MM-DD') }}</div
                  >
                  <div class="content-label">
                    <span>会诊内容:</span>{{ d.consultationContent }}</div
                  >
                </div>
                <div>
                  <div class="content-label"><span>会诊专家:</span>{{ d.consultationExpert }}</div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="block-content">暂无数据</div>
        </div>
      </div>
    </div>
  </div>
  <ItemTable :modal-config="modalConfig" @close="modalClose" />
</template>
<script lang="ts">
  import { defineComponent, reactive, PropType } from 'vue';
  import dayjs from 'dayjs';
  import { Button, Table } from 'ant-design-vue';
  import {
    CustomerMHInfo,
    CustomerDInfo,
    CustomerEInfo,
    CustomerIInfo,
    CustomerCInfo,
} from '/@/api/demo/model/customer';
import {
  getCustomerDList,
  getCustomerEList,
  getCustomerIList,
    getCustomerCList
  } from '/@/api/demo/customer';
  
  import ItemTable from './item-table.vue';
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
      ItemTable,
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
      const modalConfig = reactive<{
        dataSource: any[];
        columns: any[];
        visible: boolean;
        title: string;
      }>({ title: '', visible: false, dataSource: [], columns: [] });
      const viewAll = async (type: number,diseaseId: number) => {
        modalConfig.visible = true;
        let res 
        switch (type) {
          case 1:
            res = await getCustomerDList(diseaseId)
            modalConfig.title = '用药记录';
            modalConfig.columns = [
              {
                title: '药品名称',
                dataIndex: 'medicineName',
              },
              {
                title: '用药剂量',
                dataIndex: 'useDose',
              },
              {
                title: '用药时间',
                dataIndex: 'useDate',
                customRender: (state) => dayjs(state.record.useDate).format('YYYY-MM-DD'),
              },
            ];
            break;
          case 2:
          res = await getCustomerEList(diseaseId)
            modalConfig.title = '检验记录';
            modalConfig.columns = [
              {
                title: '检验机构',
                dataIndex: 'checkMechanism',
              },
              {
                title: '检验类型',
                dataIndex: 'checkType',
              },
              {
                title: '检验时间',
                dataIndex: 'checkDate',
                customRender: (state) =>
                  dayjs(state.record.checkDate).format('YYYY-MM-DD HH:mm:ss'),
              },
            ];
            break;
          case 3:
          res = await getCustomerIList(diseaseId)
            modalConfig.title = '影像记录';
            modalConfig.columns = [
              {
                title: '检验机构',
                dataIndex: 'checkMechanism',
              },
              {
                title: '检验部位',
                dataIndex: 'checkPart',
              },
              {
                title: '检验类别',
                dataIndex: 'checkType',
                customRender: (state) => iCheckType[state.record.checkType as number],
              },
              {
                title: '检验时间',
                dataIndex: 'checkDate',
                width: 180,
                customRender: (state) =>
                  dayjs(state.record.checkDate).format('YYYY-MM-DD HH:mm:ss'),
              },
            ];
            break;
          case 4:
          res = await getCustomerCList(diseaseId)
            modalConfig.title = '就诊记录';
            modalConfig.columns = [
              {
                title: '会诊专家',
                dataIndex: 'consultationExpert',
              },
              {
                title: '会诊内容',
                dataIndex: 'consultationContent',
              },
              {
                title: '会诊日期',
                dataIndex: 'consultationDate',
                customRender: (state) =>
                  dayjs(state.record.consultationDate).format('YYYY-MM-DD HH:mm:ss'),
              },
            ];
            break;
          default:
            break;
        }
        if (res) modalConfig.dataSource = res
      };
      const modalClose = () => {
        modalConfig.title = '';
        modalConfig.visible = false;
        modalConfig.columns = [];
        modalConfig.dataSource = [];
      };
      return {
        diseaseObject: props.disease,
        modalConfig,
        iCheckType,
        linkClick,
        dayjs,
        viewAll,
        modalClose,
      };
    },
  });
</script>
<style lang="less" scoped>
  .disease-item {
    .header {
      color: #fff;
      margin-right: 10px;
      font-size: 20px;
      font-weight: 600;
    }
    .basic {
      display: flex;
    }
    .content {
      width: 50%;
      padding: 10px;
      padding-left: 0;
      .item-title {
        font-size: 20px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .item-content {
        height: 110px;
        overflow: hidden;
        .block {
          padding: 15px;
          background: rgba(255, 255, 255, 0.05);
          .block-content {
            display: flex;
            justify-content: space-between;
            .content-label {
              margin-bottom: 10px;
            }
          }
          span {
            margin-right: 6px;
          }
        }
        .block + .block {
          margin-top: 8px;
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
