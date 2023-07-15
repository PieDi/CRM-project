<template>
  <PageWrapper title="小程序客户委派">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客户姓名">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.name"
          />
        </FormItem>

        <FormItem label="证件号码" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.documentNumber"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <!-- <Button type="primary" style="margin-left: 10px" @click="addCustomer">新增客户</Button> -->
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="true"
      :bordered="true"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, _text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                appointStaff(record);
              }
            "
            >员工委派</Button
          >
        </template>
      </template>
    </Table>
    <Drawer
      :destroy-on-close="true"
      :title="drawerInfo.title"
      placement="right"
      @close="drawerOnClose"
      :visible="drawerInfo.visible"
      :pagination="pagination"
    >
      <template #extra>
        <Button type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="指定员工">
          <Select
            placeholder="请选择"
            v-model:value="drawerInfo.item.staffId"
          >
            <SelectOption v-for="item in staffSourceData" :key="item.userId">{{
              item.userName
            }}</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
    Select,
    InputNumber,
    DatePicker,
    message,
  } from 'ant-design-vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import { getCustomerPage, assignCustomer } from '/@/api/demo/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import { getUserList } from '/@/api/sys/user';
  import { UserInfo } from '/#/store';
  import { sexMap, docTypeMap } from '/@/views/const';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const TextArea = Input.TextArea;
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      Select,
      SelectOption,
      InputNumber,
      ExclamationCircleOutlined,
      DatePicker,
      TextArea,
    },
    setup() {
      const searchInfo = ref({
        name: undefined,
        documentNumber: undefined,
      });

      const drawerInfo = ref<
        DrawerItemType<{ staffId: number | undefined; id: number | undefined }>
      >({
        visible: false,
        title: '',
        item: {
          id: undefined,
          staffId: undefined,
        },
      });

      const pageInfo = ref<PageListInfo<CustomerInfo>>({
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
          customerListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const customerListReq = async (pageNum: number) => {
        const res = await getCustomerPage({ ...searchInfo.value, assign: 0, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => { 
        searchInfo.value.name = undefined
        searchInfo.value.documentNumber = undefined
        customerListReq(1);
      }
      const searchAction = () => {
        customerListReq(1);
      };
      onMounted(() => {
        customerListReq(1);
      });

      const columns: ColumnsType<CustomerInfo> = [
        {
          title: '姓名',
          dataIndex: 'name',
        },
        {
          title: '电话',
          dataIndex: 'mobile',
        },
        {
          title: '性别',
          dataIndex: 'sex',
          customRender: (state) => sexMap[state.record.sex as number],
        },
        {
          title: '证件类型',
          dataIndex: 'documentType',
          customRender: (state) => docTypeMap[state.record.documentType as number],
        },
        {
          title: '证件号码',
          dataIndex: 'documentNumber',
        },
        {
          title: '年龄',
          dataIndex: 'age',
        },
        {
          title: '联系地址',
          dataIndex: 'contactAddress',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      const staffSourceData = ref<UserInfo[]>([]);
      const userListReq = async () => {
        const res = await getUserList();
        if (res) {
          staffSourceData.value = res;
        }
      };

      const appointStaff = (item: CustomerInfo) => {
        userListReq();
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '员工委派';
        drawerInfo.value.type = 'scan';
        drawerInfo.value.item.id = item.id;
      };

      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;

        drawerInfo.value.item.staffId = undefined;
        drawerInfo.value.item.id = undefined;
      };

      const submit = async () => {
        const res = await assignCustomer({ ...drawerInfo.value.item });
        if (res) {
          message.success('委派员工成功');
          customerListReq(pageInfo.value.current);
          drawerOnClose()
        }
      };

      return {
        columns,
        pagination,
        pageInfo,
        drawerInfo,
        searchInfo,
        appointStaff,
        drawerOnClose,
        resetAction,
        searchAction,
        submit,
        staffSourceData,
      };
    },
  });
</script>
<style lang="less" scoped></style>
