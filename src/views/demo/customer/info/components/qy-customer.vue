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
      <FormItem label="企业姓名" v-bind="validateInfos.name">
        <Input
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.name"
        />
      </FormItem>

      <FormItem label="统一社会信用代码" v-bind="validateInfos.uscc">
        <Input
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.uscc"
        />
      </FormItem>

      <FormItem label="联系人">
        <Input
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.contactName"
        />
      </FormItem>
      <FormItem label="联系方式">
        <Input
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.contactMobile"
        />
      </FormItem>
      <FormItem label="联系地址">
        <Input
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.contactAddress"
        />
      </FormItem>
      <FormItem label="银行开户行">
        <Input
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.dpositBank"
        />
      </FormItem>
      <FormItem label="银行账号">
        <Input
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.bankAccount"
        />
      </FormItem>

      <FormItem label="客户来源" v-bind="validateInfos.sourceId">
        <Select
          placeholder="请选择"
          v-model:value="drawerInfo.sourceId"
          
        >
          <SelectOption v-for="item in customerSourceList" :key="item.id">{{
            item.name
          }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="所属分组" v-bind="validateInfos.groupId">
        <Select
          
          placeholder="请选择"
          v-model:value="drawerInfo.groupId"
        >
          <SelectOption v-for="item in customerGroupList" :key="item.id">{{
            item.name
          }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="备注">
        <TextArea
          
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.remark"
        />
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
    message,
  } from 'ant-design-vue';
  import { defineComponent, PropType, ref, reactive, onBeforeMount } from 'vue';
  import { CustomerGroupInfo, CustomerSourceInfo } from '/@/api/demo/model/customer';
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
      TextArea,
    },
    props: {
      customerId: {
        type: Number,
        required: true,
      },
      qyDrawerInfo: {
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
      });
      const customerInfoRequest = async () => {
        const res = await getCustomerDetail(props.customerId as number);
        if (res) {
          Object.keys(drawerInfo).forEach((key) => {
            drawerInfo[key] = res[key];
          });
        }
      };
      const drawerOnClose = () => {
        Object.keys(drawerInfo).forEach((key) => {
          drawerInfo[key] = undefined;
        });
        clearValidate();
        emit('drawerOnClose')
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
      const { validate, validateInfos, clearValidate } = useForm(drawerInfo, rulesRef);
      const submit = async () => {
        validate().then(async () => {
          const res = await updateCustomer({ ...drawerInfo, type: 2, level: undefined });
          if (res) {
            message.success('修改用户信息成功');
            emit('submit')
          }
        });
      };
      return {
        visible: props.qyDrawerInfo.visible,
        customerGroupList,
        customerSourceList,
        drawerInfo,
        validateInfos,
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
