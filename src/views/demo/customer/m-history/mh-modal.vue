<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="更多就诊信息"
    @cancel="drawerOnClose"
    @ok="drawerOnClose"
    :visible="drawerInfo?.visible"
    width="60%"
  >
    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :pagination="pagination"
      :scroll="{ x: '100%' }"
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
        @submit="mRecordSubmit"
      ></m-record
    ></template>

    <template v-if="dRecordDrawerInfo.visible">
      <d-record
        :drawer-info="dRecordDrawerInfo"
        @drawerOnClose="dRecordClose"
        @submit="dRecordSubmit"
      ></d-record
    ></template>

    <template v-if="eRecordDrawerInfo.visible">
      <e-record
        :drawer-info="eRecordDrawerInfo"
        @drawerOnClose="eRecordClose"
        @submit="eRecordSubmit"
      ></e-record
    ></template>

    <template v-if="iRecordDrawerInfo.visible">
      <i-record
        :drawer-info="iRecordDrawerInfo"
        @drawerOnClose="iRecordClose"
        @submit="iRecordSubmit"
      ></i-record
    ></template>

    <template v-if="cRecordDrawerInfo.visible">
      <c-record
        :drawer-info="cRecordDrawerInfo"
        @drawerOnClose="cRecordClose"
        @submit="cRecordSubmit"
      ></c-record
    ></template>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, onBeforeMount, createVNode } from 'vue';
  import { Modal, Table, Form, Input, Button, message } from 'ant-design-vue';
  import { getCustomerMHPage, deleteCustomerMH } from '/@/api/demo/customer';
  import { CustomerMHInfo } from '/@/api/demo/model/customer';
  import mRecord from './component/m-record.vue';
  import dRecord from './component/d-record.vue';
  import eRecord from './component/e-record.vue';
  import iRecord from './component/i-record.vue';
  import cRecord from './component/c-record.vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

  const FormItem = Form.Item;
  export default defineComponent({
    components: {
      Modal,
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
    props: {
      drawerInfo: {
        type: Object as PropType<{ visible: boolean; customerId: any }>,
      },
    },
    setup(props, { emit }) {
      const drawerOnClose = () => {
        emit('drawerOnClose');
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
        const res = await getCustomerMHPage({
          pageNum,
          customerId: props?.drawerInfo?.customerId,
        });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };

      onBeforeMount(() => {
        customerMHListReq(1);
      });

      const columns: ColumnsType<CustomerMHInfo> = [
        {
          title: '姓名',
          dataIndex: 'customerName',
          width: 100,
        },
        {
          title: '就诊时间',
          width: 140,
          dataIndex: 'visitDate',
        },
        {
          title: '医院名称',
          width: 200,
          dataIndex: 'hospitalName',
          ellipsis: true,
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
          width: 100,
          dataIndex: 'drug',
        },
        {
          title: '检验记录',
          width: 100,
          dataIndex: 'examine',
        },
        {
          title: '影像记录',
          dataIndex: 'image',
          width: 100,
        },
        {
          title: '就诊记录',
          width: 100,
          dataIndex: 'other',
        },
        {
          title: '操作',
          width: 160,
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
          remark: undefined,
        },
      });
      const mRecordClose = () => {
        mRecordDrawerInfo.value.title = '';
        mRecordDrawerInfo.value.visible = false;
        mRecordDrawerInfo.value.type = undefined;
        Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
          mRecordDrawerInfo.value.item[key] = undefined;
        });
      };
      const mRecordEdit = (item: CustomerMHInfo) => {
        mRecordDrawerInfo.value.title = '编辑客户病史';
        mRecordDrawerInfo.value.type = 'edit';
        mRecordDrawerInfo.value.visible = true;
        Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
          mRecordDrawerInfo.value.item[key] = item[key];
        });
      };
      const scanMRecord = (item: CustomerMHInfo) => {
        mRecordDrawerInfo.value.title = '查看客户病史';
        mRecordDrawerInfo.value.visible = true;
        mRecordDrawerInfo.value.type = 'scan';
        Object.keys(mRecordDrawerInfo.value.item).forEach((key) => {
          mRecordDrawerInfo.value.item[key] = item[key];
        });
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
              emit('submit')
              customerMHListReq(pageInfo.value.current);
            }
          },
        });
      };
      const mRecordSubmit = (reload: boolean) => {
        customerMHListReq(reload ? 1 : pageInfo.value.current);
        mRecordClose();
        emit('submit')
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
        dRecordDrawerInfo.value.item = item.id;
      };
      const dRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
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
      const eRecordClick = (item: CustomerMHInfo) => {
        eRecordDrawerInfo.value.title = '检查记录';
        eRecordDrawerInfo.value.visible = true;
        eRecordDrawerInfo.value.item = item.id;
        // eRecordDrawerInfo.value.type = 'scan';
      };
      const eRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
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
      const iRecordClick = (item: CustomerMHInfo) => {
        iRecordDrawerInfo.value.title = '影像记录';
        iRecordDrawerInfo.value.visible = true;
        iRecordDrawerInfo.value.item = item.id;
      };
      const iRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
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
      const cRecordClick = (item: CustomerMHInfo) => {
        cRecordDrawerInfo.value.title = '就诊记录';
        cRecordDrawerInfo.value.visible = true;
        cRecordDrawerInfo.value.item = item.id;
        // cRecordDrawerInfo.value.type = 'scan';
      };
      const cRecordSubmit = () => {
        customerMHListReq(pageInfo.value.current);
        cRecordClose();
        emit('submit')
      };

      return {
        drawerInfo: props.drawerInfo,
        columns,
        pagination,
        pageInfo,
        drawerOnClose,
        mRecordDrawerInfo,
        mRecordClose,
        mRecordEdit,
        scanMRecord,
        deleteMRecord,
        mRecordSubmit,

        dRecordDrawerInfo,
        dRecordClose,
        dRecordClick,
        dRecordSubmit,

        eRecordDrawerInfo,
        eRecordClose,
        eRecordClick,
        eRecordSubmit,

        iRecordDrawerInfo,
        iRecordClose,
        iRecordClick,
        iRecordSubmit,

        cRecordDrawerInfo,
        cRecordClose,
        cRecordClick,
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
