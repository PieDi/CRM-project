<template>
  <PageWrapper title="客户信息管理">
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
        <!-- <FormItem label="负责人" style="margin-left: 10px">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            :style="{ width: '150px' }"
          >
            <SelectOption key="1">男</SelectOption>
            <SelectOption key="2">女</SelectOption>
          </Select>
        </FormItem> -->
        <FormItem label="所属分组" style="margin-left: 10px">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="searchInfo.groupType"
          >
            <SelectOption :key="1">个人客户</SelectOption>
            <SelectOption :key="2">企业客户</SelectOption>
            <SelectOption :key="3">默认</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件号码" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.documentNumber"
          />
        </FormItem>

        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addCustomer">新增客户</Button>
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
                scanCustomer(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteAction(record);
              }
            "
            >删除</Button
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
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="drawerEdit">编辑</Button>

        <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="客户姓名">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
          />
        </FormItem>

        <FormItem label="客户电话">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.mobile"
          />
        </FormItem>
        <FormItem label="性别">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.sex"
          >
            <SelectOption :key="1">男</SelectOption>
            <SelectOption :key="2">女</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件类型">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.documentType"
          >
            <SelectOption :key="1">身份证</SelectOption>
            <SelectOption :key="2">护照</SelectOption>
            <SelectOption :key="3">军官证</SelectOption>
            <SelectOption :key="4">港澳通行证</SelectOption>
            <SelectOption :key="5">台湾通行证</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件号码">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.documentNumber"
          />
        </FormItem>

        <FormItem label="出生日期">
          <DatePicker
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            allowClear
            v-model:value="datePickerValue"
          />
        </FormItem>

        <FormItem label="年龄">
          <InputNumber
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            min="1"
            :precision="0"
            v-model:value="drawerInfo.item.age"
          />
        </FormItem>
        <FormItem label="客户等级">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.level"
          />
        </FormItem>
        <FormItem label="客户来源">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.source"
          />
        </FormItem>
        <FormItem label="联系地址">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.contactAddress"
          />
        </FormItem>
        <FormItem label="所属分组">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.groupType"
          >
            <SelectOption :key="1">个人客户</SelectOption>
            <SelectOption :key="2">企业客户</SelectOption>
            <SelectOption :key="3">默认</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="客户标签">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.tag"
          />
        </FormItem>

        <FormItem label="备注">
          <TextArea
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.remark"
          />
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
  import {
    getCustomerPage,
    saveCustomer,
    updateCustomer,
    deleteCustomer,
  } from '/@/api/demo/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import dayjs, { Dayjs } from 'dayjs';

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
        groupType: undefined,
        documentNumber: undefined,
      });

      const drawerInfo = ref<DrawerItemType<CustomerInfo>>({
        visible: false,
        title: '',
        item: {
          id: undefined,
          age: undefined,
          birth: undefined,
          contactAddress: undefined,
          documentNumber: undefined,
          documentType: undefined,
          groupType: undefined,
          level: undefined,
          mobile: undefined,
          name: undefined,
          remark: undefined,
          sex: undefined,
          source: undefined,
          tag: undefined,
        },
      });
      const datePickerValue = ref<Dayjs>();

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
        const res = await getCustomerPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
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
        },
        {
          title: '证件类型',
          dataIndex: 'documentType',
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
          title: '负责人',
          dataIndex: 'endTime',
        },
        {
          title: '所属分组',
          dataIndex: 'groupType',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addCustomer = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增客户';
        drawerInfo.value.type = 'add';
      };
      const scanCustomer = (item: CustomerInfo) => {
        console.log(2123323, item);
        drawerInfo.value.item.age = item.age;
        drawerInfo.value.item.birth = item.birth;
        drawerInfo.value.item.contactAddress = item.contactAddress;
        drawerInfo.value.item.documentNumber = item.documentNumber;
        drawerInfo.value.item.documentType = item.documentType;
        drawerInfo.value.item.groupType = item.groupType;
        drawerInfo.value.item.level = item.level;
        drawerInfo.value.item.mobile = item.mobile;
        drawerInfo.value.item.name = item.name;
        drawerInfo.value.item.remark = item.remark;
        drawerInfo.value.item.sex = item.sex;
        drawerInfo.value.item.source = item.source;
        drawerInfo.value.item.tag = item.tag;
        if (item.birth) datePickerValue.value = dayjs(item.birth, 'YYYY-MM-DD');

        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看客户信息';
        drawerInfo.value.type = 'scan';
      };
      const deleteAction = (item: CustomerInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该客户',
            async onOk() {
              const res = await deleteCustomer({});
              // searchInfo.value.name = undefined;
              // searchInfo.value.groupType = undefined;
              // searchInfo.value.documentNumber = undefined;
              // customerListReq(1);
            },
          }),
        );
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;

        drawerInfo.value.item.age = undefined;
        drawerInfo.value.item.birth = undefined;
        drawerInfo.value.item.contactAddress = undefined;
        drawerInfo.value.item.documentNumber = undefined;
        drawerInfo.value.item.documentType = undefined;
        drawerInfo.value.item.groupType = undefined;
        drawerInfo.value.item.level = undefined;
        drawerInfo.value.item.mobile = undefined;
        drawerInfo.value.item.name = undefined;
        drawerInfo.value.item.remark = undefined;
        drawerInfo.value.item.sex = undefined;
        drawerInfo.value.item.source = undefined;
        drawerInfo.value.item.tag = undefined;

        datePickerValue.value = undefined;
      };
      const drawerEdit = () => {
        drawerInfo.value.title = '编辑客户信息';
        drawerInfo.value.type = 'edit';
      };
      const submit = async () => {
        if (datePickerValue.value)
          drawerInfo.value.item.birth = dayjs(datePickerValue.value).format('YYYY-MM-DD');
        let res;
        if (drawerInfo.value.type === 'add') {
          res = await saveCustomer({ ...drawerInfo.value.item });
        } else {
          res = await updateCustomer({ ...drawerInfo.value.item });
        }
        if (res) {
          message.success(drawerInfo.value.type === 'add' ? '添加客户成功' : '修改用户信息成功');
        }
      };

      return {
        columns,
        pagination,
        pageInfo,
        drawerInfo,
        datePickerValue,
        searchInfo,
        addCustomer,
        scanCustomer,
        deleteAction,
        drawerOnClose,
        drawerEdit,
        searchAction,
        submit,
      };
    },
  });
</script>
<style lang="less" scoped></style>
