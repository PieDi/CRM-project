<template>
  <PageWrapper title="客户病史查询">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户名称">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <FormItem label="证件号码" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <Button type="primary" style="margin-left: 10px">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addMHistory">新增客户病史</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="data"
      :canResize="false"
      :loading="loading"
      :striped="false"
      :bordered="true"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, _text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                scanMRecord(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteMRecord(record);
              }
            "
            >删除</Button
          >
        </template>

        <template v-if="column.dataIndex === 'drug'">
          <Button
            type="link"
            @click="
              () => {
                dRecordClick(record);
              }
            "
            >用药记录</Button
          >
        </template>
        <template v-if="column.dataIndex === 'examine'">
          <Button
            type="link"
            @click="
              () => {
                eRecordClick(record);
              }
            "
            >检验记录</Button
          >
        </template>

        <template v-if="column.dataIndex === 'image'">
          <Button
            type="link"
            @click="
              () => {
                iRecordClick(record);
              }
            "
            >影像记录</Button
          >
        </template>
        <template v-if="column.dataIndex === 'other'">
          <Button
            type="link"
            @click="
              () => {
                oRecordClick(record);
              }
            "
            >其他记录</Button
          >
        </template>
      </template>
    </Table>
    <template v-if="mRecordDrawerInfo.visible">
      <m-record
        :drawer-info="mRecordDrawerInfo"
        @drawerOnClose="mRecordClose"
        @edit="mRecordEdit"
      ></m-record
    ></template>

    <template v-if="dRecordDrawerInfo.visible">
      <d-record :drawer-info="dRecordDrawerInfo" @drawerOnClose="dRecordClose"></d-record
    ></template>

    <template v-if="eRecordDrawerInfo.visible">
      <e-record :drawer-info="eRecordDrawerInfo" @drawerOnClose="eRecordClose"></e-record
    ></template>

    <template v-if="iRecordDrawerInfo.visible">
      <i-record :drawer-info="iRecordDrawerInfo" @drawerOnClose="iRecordClose"></i-record
    ></template>

    <template v-if="oRecordDrawerInfo.visible">
      <o-record :drawer-info="oRecordDrawerInfo" @drawerOnClose="oRecordClose"></o-record
    ></template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button } from 'ant-design-vue';
  import { getBasicData } from '../../table/tableData';
  import mRecord from './m-record.vue';
  import dRecord from './d-record.vue';
  import eRecord from './e-record.vue';
  import iRecord from './i-record.vue';
  import oRecord from './o-record.vue';
  import { DrawerItemType } from '../type';
  const FormItem = Form.Item;
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      FormItem,
      Input,
      Button,
      mRecord,
      dRecord,
      eRecord,
      iRecord,
      oRecord,
    },
    setup() {
      const loading = ref(false);
      const addMHistory = () => {
        mRecordDrawerInfo.value.title = '新增客户病史';
        mRecordDrawerInfo.value.visible = true;
      };
      const pagination = ref({
        total: 50,
        current: 1,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          console.log(2132323, page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      });
      const columns: any = [
        {
          title: '姓名',
          width: 90,
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '性别',
          width: 70,
          dataIndex: 'no',
        },
        {
          title: '证件类型',
          width: 90,
          dataIndex: 'type',
        },
        {
          title: '证件号码',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '医院名称',
          dataIndex: 'address',
        },
        {
          title: '科室',
          width: 70,
          dataIndex: 'no',
        },
        {
          title: '疾病名称',
          dataIndex: 'endTime',
        },
        {
          title: '用药记录',
          width: 80,
          dataIndex: 'drug',
        },
        {
          title: '检验记录',
          width: 80,
          dataIndex: 'examine',
        },
        {
          title: '影像记录',
          width: 80,
          dataIndex: 'image',
        },
        {
          title: '其他记录',
          width: 80,
          dataIndex: 'other',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      const mRecordDrawerInfo = ref<DrawerItemType>({ visible: false, title: '' });
      const mRecordClose = () => {
        mRecordDrawerInfo.value.title = '';
        mRecordDrawerInfo.value.visible = false;
        mRecordDrawerInfo.value.item = undefined;
        mRecordDrawerInfo.value.type = undefined;
      };
      const mRecordEdit = (item: any) => {
        mRecordDrawerInfo.value.title = '编辑客户病史';
        mRecordDrawerInfo.value.type = 'edit';
      };
      const scanMRecord = (item: any) => {
        mRecordDrawerInfo.value.title = '查看客户病史';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.item = item;
        mRecordDrawerInfo.value.type = 'scan';
      };

      const deleteMRecord = (item: any) => {};

      const dRecordDrawerInfo = ref<DrawerItemType>({ visible: false, title: '', item: undefined });
      const dRecordClose = () => {
        dRecordDrawerInfo.value.title = '';
        dRecordDrawerInfo.value.visible = false;
        dRecordDrawerInfo.value.item = undefined;
      };

      const dRecordClick = (item: any) => {
        dRecordDrawerInfo.value.title = '用药记录';
        dRecordDrawerInfo.value.visible = true;
        dRecordDrawerInfo.value.item = item;
      };

      const eRecordDrawerInfo = ref<DrawerItemType>({ visible: false, title: '', item: undefined });
      const eRecordClose = () => {
        eRecordDrawerInfo.value.title = '';
        eRecordDrawerInfo.value.visible = false;
        eRecordDrawerInfo.value.item = undefined;
      };
      const eRecordClick = (item: any) => {
        eRecordDrawerInfo.value.title = '检查记录';
        eRecordDrawerInfo.value.visible = true;
        eRecordDrawerInfo.value.item = item;
      };

      const iRecordDrawerInfo = ref<DrawerItemType>({ visible: false, title: '', item: undefined });
      const iRecordClose = () => {
        iRecordDrawerInfo.value.title = '';
        iRecordDrawerInfo.value.visible = false;
        iRecordDrawerInfo.value.item = undefined;
      };
      const iRecordClick = (item: any) => {
        iRecordDrawerInfo.value.title = '影像记录';
        iRecordDrawerInfo.value.visible = true;
        iRecordDrawerInfo.value.item = undefined;
      };

      const oRecordDrawerInfo = ref<DrawerItemType>({ visible: false, title: '', item: undefined });
      const oRecordClose = () => {
        oRecordDrawerInfo.value.title = '';
        oRecordDrawerInfo.value.visible = false;
        oRecordDrawerInfo.value.item = undefined;
      };
      const oRecordClick = (item: any) => {
        oRecordDrawerInfo.value.title = '其他信息';
        oRecordDrawerInfo.value.visible = true;
        oRecordDrawerInfo.value.item = item;
      };
      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        addMHistory,
        mRecordDrawerInfo,
        mRecordClose,
        mRecordEdit,
        scanMRecord,
        deleteMRecord,

        dRecordDrawerInfo,
        dRecordClose,
        dRecordClick,
        eRecordDrawerInfo,
        eRecordClose,
        eRecordClick,
        iRecordDrawerInfo,
        iRecordClose,
        iRecordClick,
        oRecordDrawerInfo,
        oRecordClose,
        oRecordClick,
      };
    },
  });
</script>
