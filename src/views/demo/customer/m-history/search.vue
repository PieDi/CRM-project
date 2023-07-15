<template>
  <PageWrapper title="客户病史管理" :back-show="showGoBack">
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
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addMHistory">新增客户就诊记录</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="false"
      :striped="false"
      :bordered="true"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                mRecordEdit(record);
              }
            "
            >编辑</Button
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
            style="padding: 0"
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
            style="padding: 0"
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
            style="padding: 0"
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
            style="padding: 0"
            @click="
              () => {
                cRecordClick(record);
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
        @submit="mRecordSubmit"
      ></m-record
    ></template>

    <template v-if="dRecordDrawerInfo.visible">
      <d-record
        :drawer-info="dRecordDrawerInfo"
        @drawerOnClose="dRecordClose"
        @edit="dRecordEdit"
        @submit="dRecordSubmit"
      ></d-record
    ></template>

    <template v-if="eRecordDrawerInfo.visible">
      <e-record
        :drawer-info="eRecordDrawerInfo"
        @drawerOnClose="eRecordClose"
        @edit="eRecordEdit"
        @submit="eRecordSubmit"
      ></e-record
    ></template>

    <template v-if="iRecordDrawerInfo.visible">
      <i-record
        :drawer-info="iRecordDrawerInfo"
        @drawerOnClose="iRecordClose"
        @edit="iRecordEdit"
        @submit="iRecordSubmit"
      ></i-record
    ></template>

    <template v-if="cRecordDrawerInfo.visible">
      <c-record
        :drawer-info="cRecordDrawerInfo"
        @drawerOnClose="cRecordClose"
        @edit="cRecordEdit"
        @submit="cRecordSubmit"
      ></c-record
    ></template>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, onMounted, createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, message } from 'ant-design-vue';
  import { getCustomerMHPage, deleteCustomerMH } from '/@/api/demo/customer';
  import { CustomerMHInfo } from '/@/api/demo/model/customer';
  import mRecord from './component/m-record.vue';
  import dRecord from './component/d-record.vue';
  import eRecord from './component/e-record.vue';
  import iRecord from './component/i-record.vue';
  import cRecord from './component/c-record.vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import dayjs from 'dayjs';
  import confirm from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { useRoute, useRouter } from 'vue-router';

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
      const route = useRoute();
      const customerMHListReq = async (pageNum: number) => {
        const res = await getCustomerMHPage({
          ...searchInfo.value,
          pageNum,
          id: route?.query.id as string,
        });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.value.diseaseName = undefined;
        searchInfo.value.hospitalName = undefined;
        searchInfo.value.customerName = undefined;
        customerMHListReq(1);
      };
      const searchAction = () => {
        customerMHListReq(1);
      };
      onMounted(() => {
        customerMHListReq(1);
      });
      const router = useRouter()
      const goBack = () => {
        router.back()
       }
      const columns: ColumnsType<CustomerMHInfo> = [
        {
          title: '姓名',
          dataIndex: 'customerName',
        },
        {
          title: '就诊时间',
          width: 120,
          dataIndex: 'visitDate',
          // customRender: (state) => dayjs(state.record.visitDate).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          title: '医院名称',
          width: 200,
          dataIndex: 'hospitalName',
        },
        {
          title: '科室',
          width: 120,
          dataIndex: 'departmentName',
        },
        {
          title: '疾病名称',
          width: 200,
          dataIndex: 'diseaseName',
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
      const mRecordDrawerInfo = ref<DrawerItemType<CustomerMHInfo>>({
        visible: false,
        title: '',
        item: {
          id: undefined,
          departmentName: undefined,
          diseaseName: undefined,
          hospitalName: undefined,
          visitDate: undefined,
          customerId: undefined,
          remark: undefined
        },
      });
      const mRecordClose = () => {
        mRecordDrawerInfo.value.title = '';
        mRecordDrawerInfo.value.visible = false;
        mRecordDrawerInfo.value.type = undefined;
        Object.keys(mRecordDrawerInfo.value.item).forEach(key => { 
          mRecordDrawerInfo.value.item[key] = undefined
        })
      };
      const mRecordEdit = (item: CustomerMHInfo) => {
        mRecordDrawerInfo.value.title = '编辑客户病史';
        mRecordDrawerInfo.value.type = 'edit';
        mRecordDrawerInfo.value.visible = true;
        Object.keys(mRecordDrawerInfo.value.item).forEach(key => { 
          mRecordDrawerInfo.value.item[key] = item[key]
        })
      };
      const scanMRecord = (item: CustomerMHInfo) => {
        mRecordDrawerInfo.value.title = '查看客户病史';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.type = 'scan';
        Object.keys(mRecordDrawerInfo.value.item).forEach(key => { 
          mRecordDrawerInfo.value.item[key] = item[key]
        })
      };
      const deleteMRecord = (item: CustomerMHInfo) => {
        confirm({
          icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
          content: '确定删除该记录',
          okText: '确定',
          async onOk() {
            const res = await deleteCustomerMH(item.id as number);
            if (res) {
              message.success('删除成功');
              customerMHListReq(pageInfo.value.current);
            }
          },
        });
      };
      const mRecordSubmit = (reload: boolean) => {
        customerMHListReq(reload ? 1 : pageInfo.value.current);
        mRecordClose();
      };

      // 用药记录
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
      const dRecordClick = (item: CustomerMHInfo) => {
        dRecordDrawerInfo.value.title = '用药记录';
        dRecordDrawerInfo.value.visible = true;
        // dRecordDrawerInfo.value.type = 'scan';
        dRecordDrawerInfo.value.item = item.id;
      };
      const dRecordEdit = () => {
        dRecordDrawerInfo.value.title = '编辑用药记录';
        dRecordDrawerInfo.value.type = 'edit';
      };
      const dRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
        dRecordClose();
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
      const eRecordClick = (item: CustomerMHInfo) => {
        eRecordDrawerInfo.value.title = '检查记录';
        eRecordDrawerInfo.value.visible = true;
        eRecordDrawerInfo.value.item = item.id;
        // eRecordDrawerInfo.value.type = 'scan';
      };
      const eRecordEdit = () => {
        eRecordDrawerInfo.value.title = '编辑检查记录';
        eRecordDrawerInfo.value.type = 'edit';
      };
      const eRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
        eRecordClose();
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
      const iRecordClick = (item: CustomerMHInfo) => {
        iRecordDrawerInfo.value.title = '影像记录';
        iRecordDrawerInfo.value.visible = true;
        iRecordDrawerInfo.value.item = item.id;
        // iRecordDrawerInfo.value.type = 'scan';
      };
      const iRecordEdit = () => {
        iRecordDrawerInfo.value.title = '编辑影像记录';
        iRecordDrawerInfo.value.type = 'edit';
      };
      const iRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
        iRecordClose();
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
      const cRecordClick = (item: CustomerMHInfo) => {
        cRecordDrawerInfo.value.title = '就诊记录';
        cRecordDrawerInfo.value.visible = true;
        cRecordDrawerInfo.value.item = item.id;
        // cRecordDrawerInfo.value.type = 'scan';
      };
      const cRecordEdit = () => {
        cRecordDrawerInfo.value.title = '编辑其他记录';
        cRecordDrawerInfo.value.type = 'edit';
      };
      const cRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
        cRecordClose();
      };

      return {
        columns,
        pagination,
        searchInfo,
        pageInfo,
        resetAction,
        searchAction,
        addMHistory,
        showGoBack: !!route?.query.id,
        goBack,

        mRecordDrawerInfo,
        mRecordClose,
        mRecordEdit,
        scanMRecord,
        deleteMRecord,
        mRecordSubmit,

        dRecordDrawerInfo,
        dRecordClose,
        dRecordClick,
        dRecordEdit,
        dRecordSubmit,

        eRecordDrawerInfo,
        eRecordClose,
        eRecordClick,
        eRecordEdit,
        eRecordSubmit,

        iRecordDrawerInfo,
        iRecordClose,
        iRecordClick,
        iRecordEdit,
        iRecordSubmit,

        cRecordDrawerInfo,
        cRecordClose,
        cRecordClick,
        cRecordEdit,
        cRecordSubmit,
      };
    },
  });
</script>
<style lang="less" scoped>
.go-back {
  color: #0960bd;
  cursor: pointer;
}
</style>
