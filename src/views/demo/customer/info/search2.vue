<template>
  <div :style="{ display: 'flex', justifyContent: 'space-between' }">
    <div :style="{ display: 'flex' }">
      <FormItem label="企业名称">
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
              drawerEdit(record);
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
      <FormItem label="企业姓名" v-bind="validateInfos.name">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.name"
        />
      </FormItem>

      <FormItem label="统一社会信用代码" v-bind="validateInfos.uscc">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.uscc"
        />
      </FormItem>

      <FormItem label="联系人">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.contactName"
        />
      </FormItem>
      <FormItem label="联系方式">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.contactMobile"
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
      <FormItem label="银行开户行">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.dpositBank"
        />
      </FormItem>
      <FormItem label="银行账号">
        <Input
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.bankAccount"
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
  import { Table, Form, Input, Button, Modal, Select, message } from 'ant-design-vue';
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
      ExclamationCircleOutlined,
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
      });
      const drawerInfo = ref<DrawerItemType<any>>({
        visible: false,
        title: '',
        //@ts-ignore
        item: {
          id: undefined,
          name: undefined,
          uscc: undefined,
          contactName: undefined,
          contactMobile: undefined,
          contactAddress: undefined,
          dpositBank: undefined,
          bankAccount: undefined,
          groupId: undefined,
          remark: undefined,
          sourceId: undefined,
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
        const res = await getCustomerPage({ ...searchInfo.value, resource: 1, type: 2, pageNum });
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
            title: '企业名称',
            dataIndex: 'name',
            width: 200,
          },
          {
            title: '统一社会信用代码',
            dataIndex: 'uscc',
            width: 140,
          },
          {
            title: '联系人',
            dataIndex: 'contactName',
            width: 120,
          },
          {
            title: '联系方式',
            dataIndex: 'contactMobile',
            width: 180,
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
        xsInfo.saleId = item.saleId;
        //@ts-ignore
        xsInfo.id = item.id;
      };
      const xsDrawerOnClose = () => {
        xsInfo.visible = false;
        xsInfo.saleId = undefined;
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
        clearValidate();
      };

      const rulesRef = reactive({
        name: [
          {
            required: true,
            message: '请输入企业名称',
          },
        ],
        uscc: [
          {
            required: true,
            message: '请输入统一社会信用代码',
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
      });
      const { validate, validateInfos, clearValidate } = useForm(drawerInfo.value.item, rulesRef);
      const submit = async () => {
        validate().then(async () => {
          let res;
          if (drawerInfo.value.type === 'add') {
            res = await saveCustomer({ ...drawerInfo.value.item, type: 2, level: undefined });
          } else {
            res = await updateCustomer({ ...drawerInfo.value.item, type: 2, level: undefined });
          }
          if (res) {
            message.success(drawerInfo.value.type === 'add' ? '添加客户成功' : '修改用户信息成功');
            customerListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
            drawerOnClose();
          }
        });
      };

      const customerExport = async () => {
        const t = selectedRowKeys.value.join(',');
        window.open(`http://129.204.202.223:8001/basic-api/customer/basic/export?ids=${t}&type=2&id=${userInfo.value.userId}`);
      };
      return {
        columns,
        pagination,
        pageInfo,
        drawerInfo,
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
