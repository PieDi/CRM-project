<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    :title="drawerInfo.title"
    @cancel="drawerOnClose"
    @ok="submit"
    :visible="drawerInfo.visible"
    width="60%"
  >
    <Form :labelCol="{ span: 4 }" ref="formRef" :model="mInfo">
      <FormItem
        label="客户名称"
        name="customerId"
        :rules="{
          required: true,
          message: '请选择客户名称',
          trigger: 'change',
        }"
      >
        <Select
          show-search
          :filter-option="filterOption"
          :disabled="drawerInfo.type == 'scan'"
          placeholder="请选择"
          @change="customerOnChange"
          v-model:value="mInfo.customerId"
        >
          <SelectOption
            v-for="item of dataSource"
            :value="item.id"
            :key="`${item.name}_${item.id}`"
            >{{ item.name }}</SelectOption
          >
        </Select>
      </FormItem>
      <FormItem
        label="订单名称"
        name="orderId"
        :rules="{
          required: true,
          message: '请选择订单姓名',
          trigger: 'change',
        }"
      >
        <Select
          :disabled="drawerInfo.type == 'scan'"
          placeholder="请选择"
          v-model:value="mInfo.orderId"
        >
          <SelectOption v-for="item of orderDataSource" :value="item.id">{{
            item.orderName
          }}</SelectOption>
        </Select>
      </FormItem>

      <FormItem
        label="发票类型"
        name="type"
        :rules="{
          required: true,
          message: '请选择发票类型',
          trigger: 'change',
        }"
      >
        <Select
          :disabled="drawerInfo.type == 'scan'"
          placeholder="请选择"
          v-model:value="mInfo.type"
        >
          <SelectOption :value="1">个人</SelectOption>
          <SelectOption :value="2">企业</SelectOption>
        </Select>
      </FormItem>

      <FormItem
        label="开票企业名称"
        name="name"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.name"
        />
      </FormItem>

      <FormItem
        label="企业税号"
        name="number"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.number"
        />
      </FormItem>

      <FormItem
        label="开户银行"
        name="bank"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.bank"
        />
      </FormItem>

      <FormItem
        label="银行账号"
        name="bankAccount"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.bankAccount"
        />
      </FormItem>

      <FormItem
        label="开票方联系人"
        name="agent"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.agent"
        />
      </FormItem>

      <FormItem
        label="联系人手机号"
        name="mobile"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.mobile"
        />
      </FormItem>
      <FormItem
        label="联系人邮箱"
        name="email"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.email"
        />
      </FormItem>

      
      <FormItem
        label="金额"
        name="amount"
      >
        <InputNumber
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.amount"
        />
      </FormItem>

      <FormItem
        label="企业地址"
        name="serial"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.serial"
        />
      </FormItem>

      <FormItem label="附件">
        <Upload
          :file-list="fileList"
          :customRequest="uploadAction"
          :disabled="drawerInfo.type === 'scan'"
        >
          <Button :disabled="drawerInfo.type === 'scan'">选择</Button>

          <template #itemRender="{ file }">
            <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
            <Space>
              <Button
                type="link"
                v-if="drawerInfo.type === 'scan'"
                @click="
                  () => {
                    handleDownload(file);
                  }
                "
                >下载</Button
              >
              <Button
                type="link"
                v-if="drawerInfo.type === 'scan'"
                @click="
                  () => {
                    handlePreView(file);
                  }
                "
                >查看</Button
              >
              <Button
                v-if="drawerInfo.type !== 'scan'"
                type="link"
                @click="
                  () => {
                    handleRemove(file);
                  }
                "
                >删除</Button
              >
            </Space>
          </template>
        </Upload>
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, onMounted } from 'vue';
  import {
    Modal,
    Table,
    Form,
    Input,
    Button,
    Select,
    DatePicker,
    Upload,
    Space,
    message,
    InputNumber,
  } from 'ant-design-vue';
  import {
    getCustomerList,
    getCustomerOrderList,
    saveCustomerInvoice,
    updateCustomerInvoice,
    fileInvoiceUpload,
    fileInvoiceDelete,
    getCustomerFileView,
  } from '/@/api/demo/customer';
  import { CustomerInvoiceInfo, CustomerInfo, CustomerOrderInfo } from '/@/api/demo/model/customer';
  import { DrawerItemType } from '/@/views/type';
  import type { UploadProps } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';
  const FormItem = Form.Item;
  const InputTextArea = Input.TextArea;
  const SelectOption = Select.Option;

  export default defineComponent({
    components: {
      Modal,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Select,
      InputTextArea,
      DatePicker,
      Upload,
      Space,
      InputNumber,
      SelectOption,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<DrawerItemType<CustomerInvoiceInfo>>,
        default: () => ({ visible: false, title: '' }),
      },
    },
    setup(props, { emit }) {
      const formRef = ref<FormInstance>();
      const mInfo = ref<{
        id?: number | undefined;
        orderId: number | undefined;
        type: number | undefined;
        customerId: number | undefined;
        name: string | undefined;
        number: string | undefined;
        agent: string | undefined;
        serial: string | undefined;
        amount: number | undefined;
        status: number | undefined;
        mobile: string | undefined;
        email: string | undefined;
        bankAccount: string | undefined;
        bank: string | undefined;
      }>({
        id: props.drawerInfo.item.id,
        orderId: props.drawerInfo.item.orderId,
        type: props.drawerInfo.item.type,
        customerId: props.drawerInfo?.item?.customerId,
        name: props.drawerInfo?.item?.name,
        number: props.drawerInfo?.item?.number,
        agent: props.drawerInfo.item.agent,
        serial: props.drawerInfo.item.serial,
        amount: props.drawerInfo?.item?.amount,
        status: props.drawerInfo?.item?.status,
        mobile: props.drawerInfo?.item?.mobile,
        email: props.drawerInfo?.item?.email,
        bankAccount: props.drawerInfo?.item?.bankAccount,
        bank: props.drawerInfo?.item?.bank
      });

      const dataSource = ref<Array<CustomerInfo>>([]);
      const customerReq = async () => {
        const res1 = await getCustomerList();
        if (res1) dataSource.value = res1;
        if (props.drawerInfo?.item?.customerId) {
          const res2 = await getCustomerOrderList(undefined, props.drawerInfo?.item?.customerId);
          if (res2) orderDataSource.value = res2;
        }
      };
      const orderDataSource = ref<Array<CustomerOrderInfo>>([]);
      const customerOnChange = async (value: any) => {
        mInfo.value.orderId = undefined;
        const res = await getCustomerOrderList(undefined, value);
        if (res) orderDataSource.value = res;
      };
      onMounted(() => {
        customerReq();
        const t: any[] = [];
        props.drawerInfo?.item?.files?.forEach((f, i) => {
          t.push({
            uid: i,
            name: f.fileName,
            status: 'done',
            url: f.path,
            id: f.id,
          });
          filesId.value.push(null);
        });
        fileList.value = t;
      });
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = async () => {
        if (props.drawerInfo.type === 'scan') {
          drawerOnClose();
          return;
        }
        formRef.value?.validate().then(async () => {
          const params = {
            ...mInfo.value,
            invoiceTime: mInfo.value.invoiceTime ? mInfo.value.invoiceTime.valueOf() : undefined,
            fileIds: filesId.value.filter((id) => !!id),
          };
          let res;
          if (props.drawerInfo.type === 'add') res = await saveCustomerInvoice(params);
          if (props.drawerInfo.type === 'edit') res = await updateCustomerInvoice(params);
          if (res) {
            message.success(
              props.drawerInfo.type === 'add' ? '新增客户发票成功' : '修改客户发票成功',
            );
            emit('submit', props.drawerInfo.type === 'add' ? true : false);
          }
        });
      };
      // 文件上传
      const fileList = ref<UploadProps['fileList']>([]);
      const handleRemove = async (file: any) => {
        if (file?.url) {
          const res = await fileInvoiceDelete(file?.id);
          if (res) message.success('删除成功');
        }
        //@ts-ignore
        const index = fileList.value.indexOf(file);
        //@ts-ignore
        const newFileList = fileList.value.slice();
        newFileList.splice(index, 1);
        fileList.value = newFileList;

        const newFilesId = filesId.value.slice();
        newFilesId.splice(index, 1);
        filesId.value = newFilesId;
      };
      const handleDownload = async (file: any) => {
        if (file?.url)
          window.open(
            `http://129.204.202.223:8001/basic-api/customer/file/download?path=${file.url}`,
          );
      };
      const handlePreView = async (file: any) => {
        const res = await getCustomerFileView(file?.id);
        if (res) {
          window.open(res);
        }
      };

      const filesId = ref<any[]>([]);
      const uploadAction = async (o: any) => {
        const fileData = new FormData();
        fileData.append('files', o.file);
        const res = await fileInvoiceUpload(fileData);
        if (res) {
          //@ts-ignore
          fileList.value = [...fileList.value, o.file];
          filesId.value.push(res[0]);
        }
      };
      const filterOption = (input: string, option: any) => {
        return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };
      return {
        formRef,
        drawerInfo: props.drawerInfo,
        mInfo,
        drawerOnClose,
        submit,
        // 文件上传
        fileList,
        handleRemove,
        handleDownload,
        handlePreView,
        uploadAction,
        // 客户信息
        dataSource,
        customerOnChange,
        orderDataSource,
        filterOption,
      };
    },
  });
</script>
<style lang="less" scoped></style>
