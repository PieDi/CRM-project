<template>
  <PageWrapper title="客户病史管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户姓名">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.customerName"
          />
        </FormItem>
        <FormItem label="疾病名称" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.diseaseName"
          />
        </FormItem>
        <FormItem label="就诊医院" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.hospitalName"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addMHistory">新增客户病史</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="false"
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
            >就诊记录</Button
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
      <d-record
        :drawer-info="dRecordDrawerInfo"
        @drawerOnClose="dRecordClose"
        @edit="dRecordEdit"
      ></d-record
    ></template>

    <template v-if="eRecordDrawerInfo.visible">
      <e-record
        :drawer-info="eRecordDrawerInfo"
        @drawerOnClose="eRecordClose"
        @edit="eRecordEdit"
      ></e-record
    ></template>

    <template v-if="iRecordDrawerInfo.visible">
      <i-record
        :drawer-info="iRecordDrawerInfo"
        @drawerOnClose="iRecordClose"
        @edit="iRecordEdit"
      ></i-record
    ></template>

    <template v-if="oRecordDrawerInfo.visible">
      <c-record
        :drawer-info="oRecordDrawerInfo"
        @drawerOnClose="oRecordClose"
        @edit="oRecordEdit"
      ></c-record
    ></template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button } from 'ant-design-vue';
  import { getCustomerMHPage } from '/@/api/demo/customer';
  import { CustomerMHInfo } from '/@/api/demo/model/customer';
  import mRecord from './m-record.vue';
  import dRecord from './d-record.vue';
  import eRecord from './e-record.vue';
  import iRecord from './i-record.vue';
  import cRecord from './c-record.vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { type ColumnsType } from 'ant-design-vue/lib/table';

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
      cRecord,
    },
    setup() {
      const searchInfo = ref({
        customerName: undefined,
        diseaseName: undefined,
        hospitalName: undefined,
      });

      const addMHistory = () => {
        mRecordDrawerInfo.value.title = '新增客户病史';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.type = 'add';
      };

      const pageInfo = ref<PageListInfo<CustomerMHInfo>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const pagination = computed(() => ({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          customerMHListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));

      const customerMHListReq = async (pageNum: number) => {
        const res = await getCustomerMHPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = [{}];
          // pageInfo.value.dataSource = res.data;
        }
      };
      const searchAction = () => {
        customerMHListReq(1);
      };
      onMounted(() => {
        customerMHListReq(1);
      });

      const columns: ColumnsType<CustomerMHInfo> = [
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
          title: '就诊记录',
          width: 80,
          dataIndex: 'other',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      // 病史记录
      const mRecordDrawerInfo = ref<DrawerItemType<any>>({ visible: false, title: '', item: {} });
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
      const scanMRecord = (item: CustomerMHInfo) => {
        mRecordDrawerInfo.value.title = '查看客户病史';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.item = item;
        mRecordDrawerInfo.value.type = 'scan';
      };
      const deleteMRecord = (item: CustomerMHInfo) => {};

      // 用药记录
      const dRecordDrawerInfo = ref<DrawerItemType<any>>({ visible: false, title: '', item: {} });
      const dRecordClose = () => {
        dRecordDrawerInfo.value.title = '';
        dRecordDrawerInfo.value.visible = false;
        dRecordDrawerInfo.value.item = undefined;
        dRecordDrawerInfo.value.type = undefined;
      };
      const dRecordClick = (item: any) => {
        dRecordDrawerInfo.value.title = '用药记录';
        dRecordDrawerInfo.value.visible = true;
        dRecordDrawerInfo.value.item = item;
        dRecordDrawerInfo.value.type = 'scan';
      };
      const dRecordEdit = () => {
        dRecordDrawerInfo.value.title = '编辑用药记录';
        dRecordDrawerInfo.value.type = 'edit';
      };

      // 检验记录
      const eRecordDrawerInfo = ref<DrawerItemType<any>>({
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
      const eRecordClick = (item: any) => {
        eRecordDrawerInfo.value.title = '检查记录';
        eRecordDrawerInfo.value.visible = true;
        eRecordDrawerInfo.value.item = item;
        eRecordDrawerInfo.value.type = 'scan';
      };
      const eRecordEdit = () => {
        eRecordDrawerInfo.value.title = '编辑检查记录';
        eRecordDrawerInfo.value.type = 'edit';
      };

      // 影像记录
      const iRecordDrawerInfo = ref<DrawerItemType<any>>({
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
      const iRecordClick = (item: any) => {
        iRecordDrawerInfo.value.title = '影像记录';
        iRecordDrawerInfo.value.visible = true;
        iRecordDrawerInfo.value.item = undefined;
        iRecordDrawerInfo.value.type = 'scan';
      };
      const iRecordEdit = () => {
        iRecordDrawerInfo.value.title = '编辑影像记录';
        iRecordDrawerInfo.value.type = 'edit';
      };

      // 就诊记录
      const oRecordDrawerInfo = ref<DrawerItemType<any>>({
        visible: false,
        title: '',
        item: undefined,
      });
      const oRecordClose = () => {
        oRecordDrawerInfo.value.title = '';
        oRecordDrawerInfo.value.visible = false;
        oRecordDrawerInfo.value.item = undefined;
        oRecordDrawerInfo.value.type = undefined;
      };
      const oRecordClick = (item: any) => {
        oRecordDrawerInfo.value.title = '就诊记录';
        oRecordDrawerInfo.value.visible = true;
        oRecordDrawerInfo.value.item = item;
        oRecordDrawerInfo.value.type = 'scan';
      };
      const oRecordEdit = () => {
        oRecordDrawerInfo.value.title = '编辑其他记录';
        oRecordDrawerInfo.value.type = 'edit';
      };

      return {
        columns,
        pagination,
        searchInfo,
        pageInfo,
        searchAction,
        addMHistory,

        mRecordDrawerInfo,
        mRecordClose,
        mRecordEdit,
        scanMRecord,
        deleteMRecord,

        dRecordDrawerInfo,
        dRecordClose,
        dRecordClick,
        dRecordEdit,

        eRecordDrawerInfo,
        eRecordClose,
        eRecordClick,
        eRecordEdit,

        iRecordDrawerInfo,
        iRecordClose,
        iRecordClick,
        iRecordEdit,

        oRecordDrawerInfo,
        oRecordClose,
        oRecordClick,
        oRecordEdit,
      };
    },
  });
</script>
