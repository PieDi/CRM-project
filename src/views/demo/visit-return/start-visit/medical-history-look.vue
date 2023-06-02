<template>
  <Modal
    :visible="visible"
    width="70%"
    centered
    :maskClosable="false"
    :destroyOnClose="true"
    :footer="null"
    @ok="onModalOk"
  >
    <div style="overflow-y: hidden; padding: 20px; height: 553px">
      <Tabs centered>
        <TabPane key="1" tab="用药记录">
          <Record v-if="dDataSource.length" :columns="dColumns" :dataSource="dDataSource" />
        </TabPane>
        <TabPane key="2" tab="检验记录">
          <Record v-if="eDataSource.length" :columns="eColumns" :dataSource="eDataSource" />
        </TabPane>
        <TabPane key="3" tab="影像记录">
          <Record v-if="iDataSource.length" :columns="iColumns" :dataSource="iDataSource" />
        </TabPane>
        <TabPane key="4" tab="就诊记录">
          <Record v-if="cDataSource.length" :columns="cColumns" :dataSource="cDataSource" />
        </TabPane>
      </Tabs>
    </div>
  </Modal>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Modal, Tabs, Table } from 'ant-design-vue';
  import Record from './record.vue';
  import {
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
  } from '/@/api/demo/customer';
  import dayjs from 'dayjs';

  const eTypeMap: Record<number, string> = {
    1: 'CT',
    2: 'MR',
    3: 'PET-CT',
    4: 'PET-MR',
    5: '超声',
    6: '钼靶',
    7: 'ECT',
    8: 'DR',
  };
  export default defineComponent({
    components: {
      Modal,
      Tabs,
      TabPane: Tabs.TabPane,
      Table,
      Record,
    },
    props: {
      diseaseId: {
        type: Number,
        required: true,
      },
      visible: propTypes.bool,
    },
    setup(props, { emit }) {
      // 用药
      const dDataSource = ref<Array<CustomerDInfo>>([]);
      const dListReq = async () => {
        const res = await getCustomerDList(props.diseaseId);
        if (res) dDataSource.value = res;
      };
      // 检验
      const eDataSource = ref<Array<CustomerEInfo>>([]);
      const eListReq = async () => {
        const res = await getCustomerEList(props.diseaseId);
        if (res) eDataSource.value = res;
      };
      // 影像
      const iDataSource = ref<Array<CustomerIInfo>>([]);
      const iListReq = async () => {
        const res = await getCustomerIList(props.diseaseId);
        if (res) iDataSource.value = res;
      };
      // 会诊
      const cDataSource = ref<Array<CustomerCInfo>>([]);
      const cListReq = async () => {
        const res = await getCustomerCList(props.diseaseId);
        if (res) cDataSource.value = res;
      };

      onMounted(() => {
        dListReq();
        eListReq();
        iListReq();
        cListReq();
      });

      const dColumns = [
        {
          title: '药物名称',
          dataIndex: 'medicineName',
        },
        {
          title: '用药剂量',
          dataIndex: 'useDose',
        },
        {
          title: '用药时间',
          dataIndex: 'useDate',
        },
        {
          title: '附件',
          dataIndex: 'visitContent',
        },
      ];
      const eColumns = [
        {
          title: '检查日期',
          dataIndex: 'checkDate',
          customRender: (state) => dayjs(state.record.checkDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '检查机构',
          dataIndex: 'checkMechanism',
        },
        {
          title: '检查类型',
          dataIndex: 'checkType',
        },
        {
          title: '附件',
          dataIndex: 'visitContent',
        },
      ];
      const iColumns = [
        {
          title: '检查日期',
          dataIndex: 'checkDate',
          customRender: (state) => dayjs(state.record.checkDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '检查机构',
          dataIndex: 'checkMechanism',
        },
        {
          title: '检查部位',
          dataIndex: 'checkPart',
        },
        {
          title: '检查类别',
          dataIndex: 'checkType',
          customRender: (state) => eTypeMap[state.record.checkType],
        },
        {
          title: '附件',
          dataIndex: 'visitContent',
        },
      ];
      const cColumns = [
        {
          title: '会诊日期',
          dataIndex: 'consultationDate',
          customRender: (state) =>
            dayjs(state.record.consultationDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '会诊专家',
          dataIndex: 'consultationExpert',
        },
        {
          title: '会诊内容',
          dataIndex: 'consultationContent',
        },
        {
          title: '附件',
          dataIndex: 'visitContent',
        },
      ];

      const onModalOk = () => {
        emit('confirm');
      };

      return {
        onModalOk,
        dDataSource,
        dColumns,

        eDataSource,
        eColumns,

        iDataSource,
        iColumns,

        cDataSource,
        cColumns,
      };
    },
  });
</script>

<style lang="less" scoped></style>
