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
        <FormItem label="客户分组" style="margin-left: 10px">
          <Select
            placeholder="请选择"
            v-model:value="searchInfo.groupId"
            :style="{ width: '150px' }"
          >
            <SelectOption v-for="item in customerGroupList" :key="item.id">{{
              item.name
            }}</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="客户来源" style="margin-left: 10px">
          <Select
            placeholder="请选择"
            v-model:value="searchInfo.sourceId"
            :style="{ width: '150px' }"
          >
            <SelectOption v-for="item in customerSourceList" :key="item.id">{{
              item.name
            }}</SelectOption>
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
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
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
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                boardCustomer(record.id);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                drawerEdit(record);
              }
            "
            >编辑</Button
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
    <Modal
      :mask-closable="false"
      :destroy-on-close="true"
      :title="drawerInfo.title"
      @cancel="drawerOnClose"
      @ok="submit"
      width="60%"
      :visible="drawerInfo.visible"
    >
      <Form :labelCol="{ span: 4 }">
        <FormItem label="客户姓名" v-bind="validateInfos.name">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
          />
        </FormItem>

        <FormItem label="客户电话" v-bind="validateInfos.mobile">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.mobile"
          />
        </FormItem>
        <FormItem label="性别" v-bind="validateInfos.sex">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.sex"
          >
            <SelectOption :key="1">男</SelectOption>
            <SelectOption :key="2">女</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件类型" v-bind="validateInfos.documentType">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            @change="documentChange"
            v-model:value="drawerInfo.item.documentType"
          >
            <SelectOption :key="1">身份证</SelectOption>
            <SelectOption :key="2">护照</SelectOption>
            <SelectOption :key="3">军官证</SelectOption>
            <SelectOption :key="4">港澳通行证</SelectOption>
            <SelectOption :key="5">台湾通行证</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件号码" v-bind="validateInfos.documentNumber">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            @change="documentChange"
            v-model:value="drawerInfo.item.documentNumber"
          />
        </FormItem>

        <FormItem label="出生日期" v-bind="validateInfos.birth">
          <DatePicker
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            allowClear
            v-model:value="datePickerValue"
            @change="birthChange"
          />
        </FormItem>

        <FormItem label="年龄" v-bind="validateInfos.age">
          <InputNumber
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            min="1"
            :precision="0"
            v-model:value="drawerInfo.item.age"
          />
        </FormItem>
        <FormItem label="客户来源" v-bind="validateInfos.sourceId">
          <Select
            placeholder="请选择"
            :disabled="drawerInfo.type === 'scan'"
            v-model:value="drawerInfo.item.sourceId"
            :style="{ width: '150px' }"
          >
            <SelectOption v-for="item in customerSourceList" :key="item.id">{{
              item.name
            }}</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="所属分组" v-bind="validateInfos.groupId">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.groupId"
          >
            <SelectOption v-for="item in customerGroupList" :key="item.id">{{
              item.name
            }}</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="客户等级" v-bind="validateInfos.level">
          <InputNumber
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            min="1"
            :precision="0"
            allowClear
            v-model:value="drawerInfo.item.level"
          />
        </FormItem>

        <FormItem label="联系地址" v-bind="validateInfos.contactAddress">
          <Input
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.contactAddress"
          />
        </FormItem>

        <FormItem label="客户标签" v-bind="validateInfos.tag">
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
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode, computed, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Form,
    Input,
    Button,
    Modal,
    Select,
    InputNumber,
    DatePicker,
    message,
  } from 'ant-design-vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import {
    getCustomerPage,
    getCustomerDetail,
    saveCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerGList,
    getCustomerSList,
  } from '/@/api/demo/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerInfo, CustomerGroupInfo, CustomerSourceInfo } from '/@/api/demo/model/customer';
  import dayjs, { Dayjs } from 'dayjs';
  import { sexMap, docTypeMap } from '/@/views/const';
  import { useRouter } from 'vue-router';
  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const TextArea = Input.TextArea;
  const useForm = Form.useForm;

  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Modal,
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
        groupId: undefined,
        sourceId: undefined,
        documentNumber: undefined,
      });

      const drawerInfo = ref<DrawerItemType<CustomerInfo>>({
        visible: false,
        title: '',
        //@ts-ignore
        item: {
          id: undefined,
          age: undefined,
          birth: undefined,
          contactAddress: undefined,
          documentNumber: undefined,
          documentType: undefined,
          groupId: undefined,
          level: undefined,
          mobile: undefined,
          name: undefined,
          remark: undefined,
          sex: undefined,
          sourceId: undefined,
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
      const resetAction = () => {
        searchInfo.value.name = undefined;
        searchInfo.value.groupId = undefined;
        searchInfo.value.sourceId = undefined;
        searchInfo.value.documentNumber = undefined;
        customerListReq(1);
      };
      const searchAction = () => {
        customerListReq(1);
      };
      onMounted(() => {
        customerListReq(1);
        getCustomerG();
        getCustomerS();
      });
      const router = useRouter();
      const boardCustomer = (id: number) => {
        router.push({ path: '/customer-board', query: { id } });
      };
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
          title: '所属分组',
          dataIndex: 'groupId',
          customRender: (state) => {
            const group = customerGroupList.value.find((item) => item.id === state.record.groupId);
            return group ? group.name : '';
          },
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const customerGroupList = ref<CustomerGroupInfo[]>([]);
      const getCustomerG = async () => {
        const res = await getCustomerGList();
        if (res) customerGroupList.value = res;
      };
      const customerSourceList = ref<CustomerSourceInfo[]>([]);
      const getCustomerS = async () => {
        const res = await getCustomerSList();
        if (res) customerSourceList.value = res;
      };
      const addCustomer = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增客户';
        drawerInfo.value.type = 'add';
      };
      const drawerEdit = async (item: CustomerInfo) => {
        const res = await getCustomerDetail(item.id as number);
        if (res) {
          drawerInfo.value.visible = true;
          drawerInfo.value.title = '编辑客户信息';
          drawerInfo.value.type = 'edit';
          Object.keys(drawerInfo.value.item).forEach((key) => {
            drawerInfo.value.item[key] = res[key];
          });
          if (item.birth) datePickerValue.value = dayjs(res.birth, 'YYYY-MM-DD');
        }
      };
      const deleteAction = (item: CustomerInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该客户',
            async onOk() {
              const res = await deleteCustomer(item.id as number);
              if (res) {
                message.success('删除客户成功');
                customerListReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = undefined;
        });
        datePickerValue.value = undefined;
      };

      const rulesRef = reactive({
        name: [
          {
            required: true,
            message: '请输入名字',
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入电话',
          },
        ],
        sex: [
          {
            required: true,
            message: '请选择性别',
          },
        ],
        documentType: [
          {
            required: true,
            message: '请选择证件类型',
          },
        ],
        documentNumber: [
          {
            required: true,
            message: '请输入证件号码',
          },
        ],
        age: [
          {
            required: true,
            message: '请输入年龄',
          },
        ],
        birth: [
          {
            required: true,
            message: '请输入出生日期',
          },
        ],
        groupId: [
          {
            required: true,
            message: '请选择分组',
          },
        ],
        sourceId: [
          {
            required: true,
            message: '请选择来源',
          },
        ],
        level: [
          {
            required: true,
            message: '请输入客户等级',
          },
        ],
        contactAddress: [
          {
            required: true,
            message: '请输入联系地址',
          },
        ],
        tag: [
          {
            required: true,
            message: '请输入客户标签',
          },
        ],
      });
      const { validate, validateInfos } = useForm(drawerInfo.value.item, rulesRef);
      const submit = async () => {
        validate().then(async () => {
          let res;
          if (drawerInfo.value.type === 'add') {
            res = await saveCustomer({ ...drawerInfo.value.item });
          } else {
            res = await updateCustomer({ ...drawerInfo.value.item });
          }
          if (res) {
            message.success(drawerInfo.value.type === 'add' ? '添加客户成功' : '修改用户信息成功');
            customerListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
            drawerOnClose();
          }
        });
      };
      const birthChange = () => { 
        if (datePickerValue.value)
          drawerInfo.value.item.birth = dayjs(datePickerValue.value).format('YYYY-MM-DD');
      }
      const documentChange = () => {
        if (
          drawerInfo.value.item.documentType === 1 &&
          drawerInfo.value.item.documentNumber?.length === 18
        ) {
          const t = drawerInfo.value.item.documentNumber.slice(6, 14);
          datePickerValue.value = dayjs(t, 'YYYYMMDD');
          drawerInfo.value.item.birth = datePickerValue.value.format('YYYY-MM-DD');
          drawerInfo.value.item.age = dayjs().year() - Number(t.slice(0, 4));
        }
      };
      return {
        columns,
        pagination,
        pageInfo,
        drawerInfo,
        datePickerValue,
        searchInfo,
        boardCustomer,
        addCustomer,
        deleteAction,
        drawerOnClose,
        drawerEdit,
        resetAction,
        searchAction,
        submit,
        customerGroupList,
        customerSourceList,
        documentChange,
        birthChange,
        validateInfos,
      };
    },
  });
</script>
<style lang="less" scoped></style>
