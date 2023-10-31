<template>
  <div class="bbb">
    <div class="basic">
      <div class="header"><img src="/src/assets/images/dis-hospital.png" /><span :style="{ fontSize: '24px' }">{{
        diseaseObject.diseaseBasic.hospitalName
      }}</span></div>
      <div class="header"><img src="/src/assets/images/dis-time.png" />
        <span class="tips">时间:</span>
        <span>{{ `${dayjs(diseaseObject.diseaseBasic.visitDate).format('YYYY-MM-DD')}` }}</span>
        <span class="label">最新</span>
      </div>
      <div class="header"><img src="/src/assets/images/dis-name.png" />
        <span class="tips">疾病名称:</span>
        <span :style="{ color: '#CF8903' }">{{ `${diseaseObject.diseaseBasic.diseaseName}` }}</span>
      </div>
      <div class="header"><img src="/src/assets/images/dis-depart.png" />
        <span class="tips">科室:</span>
        <span>{{ `${diseaseObject.diseaseBasic.departmentName}` }}</span>
      </div>
      <div class="header">
        <img src="/src/assets/images/medicine-5.png" />
        <span class="tips">附件:</span>
        <div class="link" :style="{ color: '#007AFF' }" @click="() => {
          handlePreView(diseaseObject.diseaseBasic.id as number, 0)
        }">查看附件</div>
      </div>
    </div>

    <div class="dis-content">
      <div class="record-content">
        <div class="content">
          <div class="item-title">
            <div class="record-title">用药记录</div>
            <div style="display: flex; align-items: center">
              <Button type="link" @click="dRecordClick">新增</Button>
              <div class="record-number" style="cursor: pointer" @click="() => {
                viewAll(1, diseaseObject.diseaseBasic.id as number);
              }
                ">{{ `查看全部(${diseaseObject.diseaseMedicine?.count || 0})` }}</div>
            </div>
          </div>
          <div class="item-content">
            <template v-for="item of diseaseObject.diseaseMedicine.medicines">
              <div class="block-content" :style="{ background: '#F5F8FC' }">
                <img src="/src/assets/images/medicine-4.png" class="item-logo" />
                <div class="content-label">
                  <img src="/src/assets/images/medicine-1.png" />
                  <div class="label">药品名称:</div>
                  <div class="label-1">{{ item.medicineName }}</div>
                </div>
                <div>
                  <div class="content-label">
                    <img src="/src/assets/images/medicine-2.png" />
                    <div class="label">用药剂量:</div>
                    <div class="label-1">{{ item.useDose }}</div>
                  </div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-3.png" />
                  <div class="label">用药时间:</div>
                  <div class="label-1">{{ dayjs(item.useDate).format('YYYY-MM-DD') }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-5.png" />
                  <div class="label" style="margin-right: -20px">附件:</div>
                  <img src="/src/assets/images/medicine-6.png" />
                  <div class="link" :style="{ color: '#007AFF' }" @click="() => {
                    handlePreView(item.id as number, 1)
                  }">查看附件</div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="content">
          <div class="item-title">
            <div class="record-title">检验记录</div>

            <div style="display: flex; align-items: center">
              <Button type="link" @click="eRecordClick">新增</Button>
              <div class="record-number" @click="() => {
                viewAll(2, diseaseObject.diseaseBasic.id as number);
              }
                ">{{ `查看全部(${diseaseObject.diseaseCheck?.count || 0})` }}</div>
            </div>
          </div>
          <div class="item-content">
            <template v-for="item of diseaseObject.diseaseCheck.checks">
              <div class="block-content" :style="{ background: '#F5FCFB' }">
                <img src="/src/assets/images/check-4.png" class="item-logo" />
                <div class="content-label">
                  <img src="/src/assets/images/check-1.png" />
                  <div class="label">检验类型:</div>
                  <div class="label-1">{{ item.checkType }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/check-2.png" />
                  <div class="label">检验机构:</div>
                  <div class="label-1">{{ item.checkMechanism }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-3.png" />
                  <div class="label">检验时间:</div>
                  <div class="label-1">{{ dayjs(item.checkDate).format('YYYY-MM-DD') }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-5.png" />
                  <div class="label" style="margin-right: -20px">附件:</div>
                  <img src="/src/assets/images/medicine-6.png" />
                  <div class="link" :style="{ color: '#007AFF' }" @click="() => {
                    handlePreView(item.id as number, 2)
                  }">查看附件</div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="content">
          <div class="item-title">
            <div class="record-title">影像记录</div>
            <div style="display: flex; align-items: center">
              <Button type="link" @click="iRecordClick">新增</Button>
              <div class="record-number" @click="() => {
                viewAll(3, diseaseObject.diseaseBasic.id as number);
              }
                ">{{ `查看全部(${diseaseObject.diseaseImage?.count || 0})` }}</div>
            </div>
          </div>
          <div class="item-content">
            <template v-for="item of diseaseObject.diseaseImage.images">
              <div class="block-content" :style="{ background: '#FAF5FC' }">
                <img src="/src/assets/images/image-4.png" class="item-logo" />
                <div class="content-label">
                  <img src="/src/assets/images/image-1.png" />
                  <div class="label">检验类别:</div>
                  <div class="label-1">{{ iCheckType[item.checkType as number] }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/image-2.png" />
                  <div class="label">检验部位:</div>
                  <div class="label-1">{{ item.checkPart }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-3.png" />
                  <div class="label">检验时间:</div>
                  <div class="label-1">{{ dayjs(item.checkDate).format('YYYY-MM-DD') }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-5.png" />
                  <div class="label" style="margin-right: -20px">附件:</div>
                  <img src="/src/assets/images/medicine-6.png" />
                  <div class="link" :style="{ color: '#007AFF' }" @click="() => {
                    handlePreView(item.id as number, 3)
                  }">查看附件</div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <div class="content">
          <div class="item-title">
            <div class="record-title">就诊记录</div>

            <div style="display: flex; align-items: center">
              <Button type="link" @click="cRecordClick">新增</Button>
              <div class="record-number" @click="() => {
                viewAll(4, diseaseObject.diseaseBasic.id as number);
              }
                ">{{ `查看全部(${diseaseObject.diseaseConsultation?.count || 0})` }}</div>
            </div>
          </div>
          <div class="item-content">
            <template v-for="item of diseaseObject.diseaseConsultation.consultations">
              <div class="block-content" :style="{ background: '#FCF9F5' }">
                <img src="/src/assets/images/consultation-4.png" class="item-logo" />
                <div class="content-label">
                  <img src="/src/assets/images/consultation-1.png" />
                  <div class="label">会诊内容:</div>
                  <div class="label-1">{{ item.consultationContent }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/consultation-2.png" />
                  <div class="label">会诊专家:</div>
                  <div class="label-1">{{ item.consultationExpert }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-3.png" />
                  <div class="label">就诊时间:</div>
                  <div class="label-1">{{ dayjs(item.consultationDate).format('YYYY-MM-DD') }}</div>
                </div>
                <div class="content-label">
                  <img src="/src/assets/images/medicine-5.png" />
                  <div class="label" style="margin-right: -20px">附件:</div>
                  <img src="/src/assets/images/medicine-6.png" />
                  <div class="link" :style="{ color: '#007AFF' }" @click="() => {
                    handlePreView(item.id as number, 4)
                  }">查看附件</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <div class="bottom-mask">
        <div class="basic">
          <div class="header"><img src="/src/assets/images/dis-hospital.png" /><span :style="{ fontSize: '24px' }">{{
            diseaseObject.diseaseBasic.hospitalName
          }}</span></div>
          <div class="header"><img src="/src/assets/images/dis-time.png" />
            <span class="tips">时间:</span>
            <span>{{ `${dayjs(diseaseObject.diseaseBasic.visitDate).format('YYYY-MM-DD')}` }}</span>
            <span class="label">最新</span>
          </div>
          <div class="header"><img src="/src/assets/images/dis-name.png" />
            <span class="tips">疾病名称:</span>
            <span :style="{ color: '#CF8903' }">{{
              `${diseaseObject.diseaseBasic.diseaseName}`
            }}</span>
          </div>
          <div class="header"><img src="/src/assets/images/dis-depart.png" />
            <span class="tips">科室:</span>
            <span>{{ `${diseaseObject.diseaseBasic.departmentName}` }}</span>
          </div>
        </div>
      </div>
      <div class="bottom-mask more">
        <div @click="() => {
          linkMore(diseaseObject.diseaseBasic.customerId as number);
        }">查看更多病史信息<img src="/src/assets/images/dis-more.png" /></div>
      </div>
    </div>

    <ItemTable v-if="modalConfig.visible" :modal-config="modalConfig" @close="modalClose" />

    <MHModal v-if="drawerInfo.customerId" :drawer-info="drawerInfo" @drawerOnClose="drawerInfoClose"></MHModal>

    <c1-record v-if="dRecordDrawerInfo.visible" :drawer-info="dRecordDrawerInfo" @drawerOnClose="dRecordClose"
      @submit="dRecordSubmit"></c1-record>

    <e1-record v-if="eRecordDrawerInfo.visible" :drawer-info="eRecordDrawerInfo" @drawerOnClose="eRecordClose"
      @submit="eRecordSubmit"></e1-record>

    <i1-record v-if="iRecordDrawerInfo.visible" :drawer-info="iRecordDrawerInfo" @drawerOnClose="iRecordClose"
      @submit="iRecordSubmit"></i1-record>

    <c1-record v-if="cRecordDrawerInfo.visible" :drawer-info="cRecordDrawerInfo" @drawerOnClose="cRecordClose"
      @submit="cRecordSubmit"></c1-record>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, reactive, PropType } from 'vue';
import dayjs from 'dayjs';
import { Button, Table } from 'ant-design-vue';
import { type DrawerItemType } from '/@/views/type';
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
  getCustomerCList,
  boardFileView,
} from '/@/api/demo/customer';
import ItemTable from './item-table.vue';
import MHModal from '../../m-history/mh-modal.vue';
import D1Record from './d1-record.vue';
import E1Record from './e1-record.vue';
import I1Record from './i1-record.vue';
import C1Record from './c1-record.vue';
import { emitError } from 'vue-json-pretty/types/utils';
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
    MHModal,
    D1Record,
    E1Record,
    I1Record,
    C1Record,
  },
  props: {
    disease: {
      required: true,
      type: Object as PropType<
        Array<{
          diseaseBasic: CustomerMHInfo;
          diseaseMedicine: {
            count: number;
            medicines: Array<CustomerDInfo>;
          };
          diseaseCheck: {
            count: number;
            checks: Array<CustomerEInfo>;
          };
          diseaseImage: {
            count: number;
            images: Array<CustomerIInfo>;
          };
          diseaseConsultation: {
            count: number;
            consultations: Array<CustomerCInfo>;
          };
        }>
      >,
    },
  },
  setup(props, { emit}) {
    const drawerInfo = ref<{ visible: boolean; customerId: number | undefined }>({
      visible: false,
      customerId: undefined,
    });
    const drawerInfoClose = () => { 
      drawerInfo.value.visible = false
      drawerInfo.value.customerId = undefined
    };

    const linkMore = (customerId: number) => {
      drawerInfo.value.visible = true
      drawerInfo.value.customerId = diseaseObject.value.diseaseBasic.customerId
    };
    const modalConfig = reactive<{
      dataSource: any[];
      columns: any[];
      visible: boolean;
      title: string;
    }>({ title: '', visible: false, dataSource: [], columns: [] });
    const viewAll = async (type: number, diseaseId: number) => {
      modalConfig.visible = true;
      let res;
      switch (type) {
        case 1:
          res = await getCustomerDList(diseaseId);
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
          res = await getCustomerEList(diseaseId);
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
          res = await getCustomerIList(diseaseId);
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
          res = await getCustomerCList(diseaseId);
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
              title: '就诊时间',
              dataIndex: 'consultationDate',
              customRender: (state) =>
                dayjs(state.record.consultationDate).format('YYYY-MM-DD HH:mm:ss'),
            },
          ];
          break;
        default:
          break;
      }
      if (res) modalConfig.dataSource = res;
    };
    const modalClose = () => {
      modalConfig.title = '';
      modalConfig.visible = false;
      modalConfig.columns = [];
      modalConfig.dataSource = [];
    };
    const handlePreView = async (id: number, type: number) => {
      const res = await boardFileView(id, type);
      if (res) {
        res.forEach((url) => window.open(url));
      }
    };
    //用药记录
    const dRecordDrawerInfo = ref<DrawerItemType<number | undefined>>({
      visible: false,
      title: '',
      item: undefined,
    });
    const dRecordClose = () => {
      dRecordDrawerInfo.value.title = '';
      dRecordDrawerInfo.value.visible = false;
      dRecordDrawerInfo.value.item = undefined;
      dRecordDrawerInfo.value.type = undefined;
    };
    const dRecordClick = () => {
      dRecordDrawerInfo.value.title = '用药记录';
      dRecordDrawerInfo.value.visible = true;
      dRecordDrawerInfo.value.item = diseaseObject.value.diseaseBasic.id;
    };
    const dRecordSubmit = () => {
      dRecordClose();
      emit('submit')
    };

    // 检验记录
    const eRecordDrawerInfo = ref<DrawerItemType<number | undefined>>({
      visible: false,
      title: '',
      item: undefined,
    });
    const eRecordClose = () => {
      eRecordDrawerInfo.value.title = '';
      eRecordDrawerInfo.value.visible = false;
      eRecordDrawerInfo.value.item = undefined;
      eRecordDrawerInfo.value.type = undefined;
    };
    const eRecordClick = () => {
      eRecordDrawerInfo.value.title = '检查记录';
      eRecordDrawerInfo.value.visible = true;
      eRecordDrawerInfo.value.item = diseaseObject.value.diseaseBasic.id;
    };
    const eRecordSubmit = () => {
      eRecordClose();
      emit('submit')
    };

    // 影像记录
    const iRecordDrawerInfo = ref<DrawerItemType<number | undefined>>({
      visible: false,
      title: '',
      item: undefined,
    });
    const iRecordClose = () => {
      iRecordDrawerInfo.value.title = '';
      iRecordDrawerInfo.value.visible = false;
      iRecordDrawerInfo.value.item = undefined;
      iRecordDrawerInfo.value.type = undefined;
    };
    const iRecordClick = () => {
      iRecordDrawerInfo.value.title = '影像记录';
      iRecordDrawerInfo.value.visible = true;
      iRecordDrawerInfo.value.item = diseaseObject.value.diseaseBasic.id;
    };
    const iRecordSubmit = () => {
      iRecordClose();
      emit('submit')
    };

    // 就诊记录
    const cRecordDrawerInfo = ref<DrawerItemType<number | undefined>>({
      visible: false,
      title: '',
      item: undefined,
    });
    const cRecordClose = () => {
      cRecordDrawerInfo.value.title = '';
      cRecordDrawerInfo.value.visible = false;
      cRecordDrawerInfo.value.item = undefined;
      cRecordDrawerInfo.value.type = undefined;
    };
    const cRecordClick = () => {
      cRecordDrawerInfo.value.title = '就诊记录';
      cRecordDrawerInfo.value.visible = true;
      cRecordDrawerInfo.value.item = diseaseObject.value.diseaseBasic.id;
    };
    const cRecordSubmit = () => {
      cRecordClose();
      emit('submit')
    };

    const diseaseObject = ref();
    watch(
      () => props.disease,
      () => {
        diseaseObject.value = props.disease[0];
      },
      { immediate: true },
    );
    return {
      diseaseObject,
      modalConfig,
      iCheckType,
      drawerInfo,
      drawerInfoClose,
      linkMore,
      dayjs,
      viewAll,
      modalClose,
      handlePreView,
      // 用药记录
      dRecordDrawerInfo,
      dRecordClick,
      dRecordClose,
      dRecordSubmit,
      // 检验记录
      eRecordDrawerInfo,
      eRecordClick,
      eRecordClose,
      eRecordSubmit,
      // 影像记录
      iRecordDrawerInfo,
      iRecordClick,
      iRecordClose,
      iRecordSubmit,

      //就诊记录
      cRecordDrawerInfo,
      cRecordClick,
      cRecordClose,
      cRecordSubmit,
    };
  },
});
</script>
<style lang="less" scoped>
.bbb {
  flex: 1;

  .basic {
    display: flex;
    align-items: center;
    height: 65px;
    background: #f5f8fc;
    color: #2e354f;
    font-weight: 500;
    padding-left: 24px;

    .header {
      margin-right: 10px;
      font-size: 18px;
      display: flex;
      align-items: center;

      img {
        margin-right: 6px;
      }

      .tips {
        display: inline-block;
        margin-right: 5px;
        color: #99a8bf;
      }

      .label {
        margin-left: 5px;
        color: #03bf8a;
        background: rgba(99, 207, 177, 0.1);
        padding: 5px 10px;
        border-radius: 4px;
      }
    }
  }

  .dis-content {
    position: relative;
    height: calc(100% - 65px);

    .record-content {
      display: flex;
      padding: 20px 25px;
      padding-bottom: 0;

      .content {
        width: 25%;
        padding-left: 0;

        .item-title {
          font-size: 20px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .record-title {
            height: 25px;
            font-size: 18px;
            font-weight: 600;
            color: #2e354f;
            line-height: 25px;
          }

          .record-number {
            font-size: 16px;
            font-weight: 400;
            color: #007aff;
            line-height: 22px;
            cursor: pointer;
          }
        }

        .item-content {
          margin-top: 15px;
          overflow: hidden;
          height: 380px;

          .block-content {
            height: 172px;
            padding: 16px;
            position: relative;
            border-radius: 4px;

            img {
              z-index: 5;
            }

            div {
              z-index: 10;
            }

            .content-label {
              display: flex;
              margin-bottom: 10px;
              font-size: 16px;
              color: #7f8ca2;
              line-height: 22px;

              img {
                margin-right: 5px;
                height: 20px;
                width: 20px;
              }

              .label {
                width: 70px;
                margin-right: 2px;
              }

              .label-1 {
                flex: 1;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                /* 这里是超出几行省略 */
                overflow: hidden;
              }
            }

            .item-logo {
              position: absolute;
              bottom: 0;
              right: 0;
              height: 75px;
              width: 89px;
              object-fit: contain;
            }
          }

          .block-content+.block-content {
            margin-top: 16px;
          }
        }
      }

      .content+.content {
        margin-left: 10px;
      }
    }

    .bottom-mask {
      position: absolute;
      height: 90px;
      left: 0;
      bottom: 0;
      right: 0;
      overflow: hidden;
    }

    .more {
      background: rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(10px);
      text-align: center;
      padding-top: 20px;
      font-size: 16px;
      cursor: pointer;
      color: #007aff;
    }
  }
}
</style>
<style lang="less">
.bbb {
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
}
</style>
