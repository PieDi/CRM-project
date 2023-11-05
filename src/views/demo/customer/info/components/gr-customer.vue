<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="编辑客户信息"
    @cancel="drawerOnClose"
    @ok="submit"
    width="60%"
    :visible="visible"
  >
    <Form :labelCol="{ span: 4 }">
      <FormItem label="客户姓名" v-bind="validateInfos.name">
        <Input placeholder="请输入" allowClear v-model:value="drawerInfo.name" />
      </FormItem>

      <FormItem label="客户电话" v-bind="validateInfos.mobile">
        <Input placeholder="请输入" allowClear v-model:value="drawerInfo.mobile" />
      </FormItem>
      <FormItem label="性别" v-bind="validateInfos.sex">
        <Select placeholder="请选择" v-model:value="drawerInfo.sex">
          <SelectOption :key="1">男</SelectOption>
          <SelectOption :key="2">女</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="证件类型" v-bind="validateInfos.documentType">
        <Select
          placeholder="请选择"
          @change="documentChange"
          v-model:value="drawerInfo.documentType"
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
          placeholder="请输入"
          allowClear
          @change="documentChange"
          v-model:value="drawerInfo.documentNumber"
        />
      </FormItem>

      <FormItem label="出生日期" v-bind="validateInfos.birth">
        <DatePicker
          placeholder="请选择"
          allowClear
          v-model:value="datePickerValue"
          @change="birthChange"
        />
      </FormItem>

      <FormItem label="年龄" v-bind="validateInfos.age">
        <InputNumber
          placeholder="请输入"
          allowClear
          min="1"
          :precision="0"
          v-model:value="drawerInfo.age"
        />
      </FormItem>
      <FormItem label="客户来源" v-bind="validateInfos.sourceId">
        <Select placeholder="请选择" v-model:value="drawerInfo.sourceId">
          <SelectOption v-for="item in customerSourceList" :key="item.id">{{
            item.name
          }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="所属分组" v-bind="validateInfos.groupId">
        <Select placeholder="请选择" v-model:value="drawerInfo.groupId">
          <SelectOption v-for="item in customerGroupList" :key="item.id">{{
            item.name
          }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="联系地址" v-bind="validateInfos.contactAddress">
        <Input placeholder="请输入" allowClear v-model:value="drawerInfo.contactAddress" />
      </FormItem>

      <FormItem label="备注">
        <TextArea placeholder="请输入" allowClear v-model:value="drawerInfo.remark" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script lang="ts">
  import {
    Form,
    FormItem,
    Input,
    Button,
    Modal,
    Select,
    SelectOption,
    InputNumber,
    DatePicker,
    message,
  } from 'ant-design-vue';
  import { defineComponent, PropType, ref, reactive, onBeforeMount } from 'vue';
  import { CustomerGroupInfo, CustomerSourceInfo } from '/@/api/demo/model/customer';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    getCustomerDetail,
    updateCustomer,
    getCustomerGList,
    getCustomerSList,
  } from '/@/api/demo/customer';

  const TextArea = Input.TextArea;
  const useForm = Form.useForm;

  export default defineComponent({
    components: {
      Form,
      FormItem,
      Input,
      Button,
      Modal,
      Select,
      SelectOption,
      InputNumber,
      DatePicker,
      TextArea,
    },
    props: {
      customerId: {
        type: Number,
        required: true,
      },
      grDrawerInfo: {
        type: Object as PropType<any>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const customerGroupList = ref<CustomerGroupInfo[]>([]);
      const getCustomerG = async () => {
        const res = await getCustomerGList();
        if (res) {
          customerGroupList.value = res;
        }
      };
      const customerSourceList = ref<CustomerSourceInfo[]>([]);
      const getCustomerS = async () => {
        const res = await getCustomerSList();
        if (res) {
          customerSourceList.value = res;
        }
      };
      onBeforeMount(() => {
        customerInfoRequest();
        getCustomerG();
        getCustomerS();
      });
      const drawerInfo = reactive({
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
      });
      const customerInfoRequest = async () => {
        const res = await getCustomerDetail(props.customerId as number);
        if (res) {
          Object.keys(drawerInfo).forEach((key) => {
            drawerInfo[key] = res[key];
          });
          if (res.birth) datePickerValue.value = dayjs(res.birth, 'YYYY-MM-DD');
        }
      };
      const drawerOnClose = () => {
        Object.keys(drawerInfo).forEach((key) => {
          drawerInfo[key] = undefined;
        });
        datePickerValue.value = undefined;
        clearValidate();
        emit('drawerOnClose')
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
      const { validate, validateInfos, clearValidate } = useForm(drawerInfo, rulesRef);
      const datePickerValue = ref<Dayjs>();
      const documentChange = () => {
        if (
          drawerInfo.documentType === 1 &&
          //@ts-ignore
          drawerInfo.documentNumber?.length === 18
        ) {
          //@ts-ignore
          const t = drawerInfo.documentNumber.slice(6, 14);
          datePickerValue.value = dayjs(t, 'YYYYMMDD');
          //@ts-ignore
          drawerInfo.birth = datePickerValue.value.format('YYYY-MM-DD');
          //@ts-ignore
          drawerInfo.age = dayjs().year() - Number(t.slice(0, 4));
        }
      };
      const birthChange = () => {
        if (datePickerValue.value) {
          //@ts-ignore
          drawerInfo.birth = dayjs(datePickerValue.value).format('YYYY-MM-DD');
        }
      };
      const submit = async () => {
        validate().then(async () => {
          const res = await updateCustomer({ ...drawerInfo, type: 1, level: undefined });
          if (res) {
            message.success('修改用户信息成功');
            emit('submit')
          }
        });
      };
      return {
        visible: props.grDrawerInfo.visible,
        customerGroupList,
        customerSourceList,
        drawerInfo,
        validateInfos,
        documentChange,
        birthChange,
        datePickerValue,
        submit,
        drawerOnClose
      };
    },
  });
</script>
<style lang="less" scoped>
  .aaa {
    .info-content {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebebeb;
      span {
        display: inline-block;
        margin-right: 16px;
      }

      span + span {
        height: 22px;
        font-size: 16px;
        color: #ff2d70;
        line-height: 22px;
      }

      .a {
        width: 48px;
        height: 48px;
        background: #99a8bf;
        border-radius: 8px;
        color: #fff;
        font-size: 28px;
        text-align: center;
      }

      .b {
        width: 22px;
        background: rgba(255, 45, 112, 0.1);
        text-align: center;
        border-radius: 4px;
      }
    }

    // 添加测试信息
    .content {
      display: flex;
      margin-top: 26px;

      img {
        width: 16px;
        height: 16px;
        margin-top: 4px;
        margin-right: 5px;
      }

      .label {
        color: #2e354f;
      }
    }
  }
</style>
