<template>
  <div :style="{ display: 'flex', justifyContent: 'space-between' }">
    <div :style="{ display: 'flex' }">
      <FormItem label="客户姓名">
        <Input
          placeholder="请输入"
          allowClear
          :style="{ width: '120px' }"
          v-model:value="searchInfo.name"
        />
      </FormItem>
      <FormItem label="客户分组" style="margin-left: 10px">
        <Select placeholder="请选择" v-model:value="searchInfo.groupId" :style="{ width: '120px' }">
          <SelectOption v-for="item in customerGroupList" :key="item.id">{{
            item.name
          }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="客户来源" style="margin-left: 10px">
        <Select
          placeholder="请选择"
          v-model:value="searchInfo.sourceId"
          :style="{ width: '120px' }"
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
          :style="{ width: '120px' }"
          v-model:value="searchInfo.documentNumber"
        />
      </FormItem>
      <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
      <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
    </div>

    <div :style="{ display: 'flex' }">
      <Button type="primary" style="margin-left: 10px" @click="customerExport">客户信息导出</Button>
      <Button type="primary" style="margin-left: 10px" @click="addCustomer">新增客户</Button>
    </div>
  </div>

  <Table
    :columns="columns"
    :dataSource="pageInfo.dataSource"
    :bordered="true"
    :pagination="pagination"
    :scroll="{ x: 'max-content' }"
    row-key="id"
    :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }"
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
          >客户信息编辑查看</Button
        >
        <Button
          v-if="authShow"
          type="link"
          @click="
            () => {
              levelAction(record);
            }
          "
          >客户等级</Button
        >
        <Button
          v-if="authShow"
          type="link"
          @click="
            () => {
              xsAction(record);
            }
          "
          >销售委派</Button
        >
        <Button
          v-if="authShow"
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
          v-model:value="drawerInfo.item.sourceId"
          :disabled="drawerInfo.type === 'scan'"
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

      <FormItem label="联系地址" v-bind="validateInfos.contactAddress">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.contactAddress"
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
  <!-- 客户等级 -->
  <CLevel
    v-if="levelInfo.id"
    :level-modal="levelInfo"
    @drawerOnClose="levelDrawerOnClose"
    @submit="levelSubmit"
  ></CLevel>
  <!-- 销售委派 -->
  <XSWeipai
    v-if="xsInfo.id"
    :xs-modal="xsInfo"
    @drawerOnClose="xsDrawerOnClose"
    @submit="xsSubmit"
  ></XSWeipai>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode, computed, reactive, toRaw } from 'vue';
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
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerInfo, CustomerGroupInfo, CustomerSourceInfo } from '/@/api/demo/model/customer';
  import dayjs, { Dayjs } from 'dayjs';
  import { sexMap, docTypeMap } from '/@/views/const';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import XSWeipai from './xs-weipai.vue';
  import CLevel from './c-level.vue';
  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  const TextArea = Input.TextArea;
  const useForm = Form.useForm;

  export default defineComponent({
    components: {
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
      XSWeipai,
      CLevel,
    },
    setup() {
      const userStore = useUserStore();
      const userInfo = computed(() => userStore.getUserInfo);
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });
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
        const res = await getCustomerPage({ ...searchInfo.value, resource: 1, type: 1, pageNum });
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
      const columns = computed(() => {
        const t = [
          {
            title: '姓名',
            dataIndex: 'name',
            width: 100,
          },
          {
            title: '电话',
            dataIndex: 'mobile',
            width: 140,
          },
          {
            title: '性别',
            dataIndex: 'sex',
            width: 70,
            customRender: (state) => sexMap[state.record.sex as number],
          },
          {
            title: '证件类型',
            dataIndex: 'documentType',
            width: 120,
            customRender: (state) => docTypeMap[state.record.documentType as number],
          },
          {
            title: '证件号码',
            dataIndex: 'documentNumber',
            width: 200,
          },
          {
            title: '年龄',
            width: 70,
            dataIndex: 'age',
          },
          {
            title: '客户来源',
            dataIndex: 'sourceId',
            width: 200,
            customRender: (state) => {
              const source = customerSourceList.value.find(
                (item) => item.id === state.record.sourceId,
              );
              return source ? source.name : '';
            },
          },
          {
            title: '所属分组',
            width: 120,
            dataIndex: 'groupId',
            customRender: (state) => {
              const group = customerGroupList.value.find(
                (item) => item.id === state.record.groupId,
              );
              return group ? group.name : '';
            },
          },
          {
            title: '经办人',
            dataIndex: 'agent',
            width: 100,
          },
        ];
        if (authShow.value) {
          t.push({
            title: '客户等级',
            dataIndex: 'levelName',
            width: 120,
          });
          t.push({
            title: '销售委派',
            dataIndex: 'saleAgent',
            width: 120,
          });
        }
        t.push({
          title: '操作',
          dataIndex: 'operation',
          width: 420,
        });
        return t;
      });
      const selectedRowKeys = ref([]);
      const onSelectChange = (key: any) => {
        selectedRowKeys.value = key;
      };
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
      //客户等级
      const levelInfo = reactive({
        visible: false,
        level: undefined,
        id: undefined,
      });
      const levelAction = (item: CustomerInfo) => {
        levelInfo.visible = true;
        //@ts-ignore
        levelInfo.level = item.level;
        //@ts-ignore
        levelInfo.id = item.id;
      };
      const levelDrawerOnClose = () => {
        levelInfo.visible = false;
        levelInfo.level = undefined;
        levelInfo.id = undefined;
      };
      const levelSubmit = async () => {
        levelDrawerOnClose();
        customerListReq(pageInfo.value.current);
      };
      // 客服委派
      const xsInfo = reactive({
        visible: false,
        saleId: undefined,
        id: undefined,
      });
      const xsAction = (item: CustomerInfo) => {
        xsInfo.visible = true;
        //@ts-ignore
        xsInfo.id = item.id;
      };
      const xsDrawerOnClose = () => {
        xsInfo.visible = false;
        xsInfo.id = undefined;
      };
      const xsSubmit = () => {
        xsDrawerOnClose();
        customerListReq(pageInfo.value.current);
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
        clearValidate();
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
        contactAddress: [
          {
            required: true,
            message: '请输入联系地址',
          },
        ],
      });
      const { validate, validateInfos, clearValidate } = useForm(drawerInfo.value.item, rulesRef);
      const submit = async () => {
        validate().then(async () => {
          let res;
          if (drawerInfo.value.type === 'add') {
            res = await saveCustomer({ ...drawerInfo.value.item, type: 1, level: undefined });
          } else {
            res = await updateCustomer({ ...drawerInfo.value.item, type: 1, level: undefined });
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
      };
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
      const customerExport = async () => {
        const t = selectedRowKeys.value.join(',');
        window.open(`http://129.204.202.223:8001/basic-api/customer/basic/export?ids=${t}&type=1&userId=${userInfo.value.userId}`);
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
        authShow,
        customerExport,
        selectedRowKeys,
        onSelectChange,
        //客户等级
        levelInfo,
        levelAction,
        levelSubmit,
        levelDrawerOnClose,

        //销售委派
        xsInfo,
        xsAction,
        xsDrawerOnClose,
        xsSubmit,
      };
    },
  });
</script>
<style lang="less" scoped></style>
