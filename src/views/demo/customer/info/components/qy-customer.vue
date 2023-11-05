<template>
  <div class="aaa">
    <div class="info-content">
      <span class="a">{{ diseaseObject?.surName || 'z' }}</span>
      <span>{{ diseaseObject?.name }}</span>
      <span v-if="diseaseObject?.type === 1" class="b">{{ diseaseObject?.age }}</span>
      <span v-if="diseaseObject?.type === 1" class="b">{{ sex }}</span>
      <Button type="link" size="small" @click="drawerEdit"> 编辑 </Button>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%', marginTop: '16px' }">
        <img src="/src/assets/images/info-birth.png" />
        <div class="right">
          <div>生日:</div>
          <div class="label">{{
            diseaseObject?.type === 1 ? diseaseObject?.birth : ''
          }}</div>
        </div>
      </div>
      <div class="content" :style="{ width: '50%', marginTop: '16px' }">
        <img src="/src/assets/images/info-mobile.png" />
        <div class="right">
          <div>电话:</div>
          <div class="label">{{
            diseaseObject?.type === 1 ? diseaseObject?.mobile : diseaseObject?.contactMobile
          }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <img src="/src/assets/images/info-address.png" />
      <div class="right">
        <div>地址:</div>
        <div class="label">{{ diseaseObject?.contactAddress }}</div>
      </div>
    </div>
    <div class="content">
      <img src="/src/assets/images/info-card.png" />
      <div class="right">
        <div>证件类型:</div>
        <div class="label">{{
          diseaseObject?.type === 1 ? docTypeMap[diseaseObject?.documentType as number] : '企业用户'
        }}</div>
      </div>
    </div>
    <div class="content">
      <img src="/src/assets/images/info-cardNo.png" />
      <div class="right">
        <div>证件号码:</div>
        <div class="label">{{
          diseaseObject?.type === 1 ? diseaseObject?.documentNumber : diseaseObject?.uscc
        }}</div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-level.png" />
        <div class="right">
          <div>客户等级:</div>
          <div class="label">{{ diseaseObject?.levelName }}</div>
        </div>
      </div>

      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-source.png" />
        <div class="right">
          <div>客户来源:</div>
          <div class="label">{{ source }}</div>
        </div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-group.png" />
        <div class="right">
          <div>所属分组:</div>
          <div class="label">{{ groupStr }}</div>
        </div>
      </div>
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-tag.png" />
        <div class="right">
          <div>客服:</div>
          <div class="label">{{ diseaseObject?.agent }}</div>
        </div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-tag.png" />
        <div class="right">
          <div>备注:</div>
          <div class="label">{{ diseaseObject?.remark }}</div>
        </div>
      </div>
    </div>

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
  </div>
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
  import { type DrawerItemType } from '/@/views/type';
  import { defineComponent, PropType, ref, reactive, watch, onBeforeMount } from 'vue';
  import { CustomerInfo, CustomerGroupInfo, CustomerSourceInfo } from '/@/api/demo/model/customer';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    getCustomerDetail,
    updateCustomer,
    getCustomerGList,
    getCustomerSList,
  } from '/@/api/demo/customer';

  const docTypeMap: Record<number, string> = {
    1: '身份证',
    2: '护照',
    3: '军官证',
    4: '港澳通行证',
    5: '台湾通行证',
  };
  const TextArea = Input.TextArea;
  const useForm = Form.useForm;

  export default defineComponent({
    props: {
      disease: {
        type: Object as PropType<any>,
        required: true,
      },
      callback: Function,
    },
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
    setup(props) {
      const customerGroupList = ref<CustomerGroupInfo[]>([]);
      const groupStr = ref<string>('');

      const getCustomerG = async () => {
        const res = await getCustomerGList();
        if (res) {
          groupStr.value = res.find((o) => o.id === props?.disease?.groupId)?.name || '';
          customerGroupList.value = res;
        }
      };
      const customerSourceList = ref<CustomerSourceInfo[]>([]);
      const source = ref<string>('');

      const getCustomerS = async () => {
        const res = await getCustomerSList();
        if (res) {
          customerSourceList.value = res;
          source.value = res.find((o) => o.id === props?.disease?.sourceId)?.name || '';
        }
      };

      onBeforeMount(() => {
        getCustomerG();
        getCustomerS();
      });
      const drawerEdit = async () => {
        const res = await getCustomerDetail(props.disease.id as number);
        if (res) {
          drawerInfo.value.visible = true;
          drawerInfo.value.title = '编辑客户信息';
          drawerInfo.value.type = 'edit';
          Object.keys(drawerInfo.value.item).forEach((key) => {
            drawerInfo.value.item[key] = res[key];
          });
          if (props.disease.birth) datePickerValue.value = dayjs(res.birth, 'YYYY-MM-DD');
        }
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
      const datePickerValue = ref<Dayjs>();
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
      const birthChange = () => {
        if (datePickerValue.value)
          drawerInfo.value.item.birth = dayjs(datePickerValue.value).format('YYYY-MM-DD');
      };
      const submit = async () => {
        validate().then(async () => {
          const res = await updateCustomer({ ...drawerInfo.value.item, type: 1, level: undefined });

          if (res) {
            message.success('修改用户信息成功');
            if (props.callback) props.callback();
            drawerOnClose();
          }
        });
      };
      const diseaseObject = ref();
      watch(
        () => props.disease,
        () => {
          diseaseObject.value = props.disease;
        },
        { immediate: true },
      );
      return {
        diseaseObject,
        sex: props.disease?.sex != 1 ? '女' : '男',
        dayjs,
        docTypeMap,
        groupStr,
        source,
        customerGroupList,
        customerSourceList,
        drawerInfo,
        validateInfos,
        documentChange,
        birthChange,
        datePickerValue,
        submit,
        drawerOnClose,
        drawerEdit,
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
