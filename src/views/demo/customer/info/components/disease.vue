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
        <div>用药记录</div>
        <ItemTable
          :data-source="item.diseaseMedicine"
          :columns="[
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
          ]"
        />
      </div>
      <div class="content">
        <div>检验记录</div>
        <ItemTable
          :data-source="item.diseaseCheck"
          :columns="[
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
              customRender: (state) => dayjs(state.record.checkDate).format('YYYY-MM-DD HH:mm:ss'),
            },
          ]"
        />
      </div>
    </div>
    <div style="display: flex">
      <div class="content">
        <div>影像记录</div>
        <ItemTable
          :data-source="item.diseaseImage"
          :columns="[
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
              customRender: (state) => iCheckType[state.record.sex as number],
            },
            {
              title: '检验时间',
              dataIndex: 'checkDate',
              customRender: (state) => dayjs(state.record.checkDate).format('YYYY-MM-DD HH:mm:ss'),
            },
            
          ]"
        />
      </div>
      <div class="content">
        <div>就诊记录</div>
        <ItemTable
          :data-source="item.diseaseConsultation"
          :columns="[
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
            }
          ]"
        />
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
  import ItemTable from './item-table.vue';

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
      ItemTable,
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
    
     
      return {
        diseaseObject: props.disease,
        iCheckType,
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
      // height: 200px;
      padding: 10px;
      // overflow-y: auto;
    }
  }
</style>
