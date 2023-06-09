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
        label="客户姓名"
        name="customerId"
        :rules="{
          required: true,
          message: '请选择客户姓名',
          trigger: 'change',
        }"
      >
        <Select
          :disabled="drawerInfo.type == 'scan'"
          placeholder="请选择"
          @change="customerOnChange"
          v-model:value="mInfo.customerId"
        >
          <SelectOption v-for="item of dataSource" :value="item.id">{{ item.name }}</SelectOption>
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
        label="发票名称"
        name="name"
        :rules="{
          required: true,
          message: '请输入发票名称',
          trigger: 'change',
        }"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.name"
        />
      </FormItem>
      <FormItem
        label="发票编号"
        name="number"
        :rules="{
          required: true,
          message: '请输入发票编号',
          trigger: 'change',
        }"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.number"
        />
      </FormItem>

      <FormItem
        label="经手人"
        name="agent"
        :rules="{
          required: true,
          message: '请输入经手人',
          trigger: 'change',
        }"
      >
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.agent"
        />
      </FormItem>

      <FormItem
        label="金额"
        name="amount"
        :rules="{
          required: true,
          message: '请输入金额',
          trigger: 'change',
        }"
      >
        <InputNumber
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.amount"
        />
      </FormItem>

      <FormItem
        label="发票号"
        name="serial"
        :rules="{
          required: true,
          message: '请输入发票号',
          trigger: 'change',
        }"
      >
        <InputNumber
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.serial"
        />
      </FormItem>

      <FormItem
        label="开票日期"
        name="invoiceTime"
        :rules="{
          required: true,
          message: '请输入开票日期',
          trigger: 'change',
        }"
      >
        <DatePicker
          :show-time="true"
          v-model:value="mInfo.invoiceTime"
          :disabled="drawerInfo.type === 'scan'"
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
                >预览</Button
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
      <FormItem label="描述">
        <InputTextArea
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.description"
        />
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
  import dayjs, { Dayjs } from 'dayjs';
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
        customerId: number | undefined;
        name: string | undefined;
        number: string | undefined;
        agent: string | undefined;
        serial: string | undefined;
        amount: number | undefined;
        status: number | undefined;
        invoiceTime: Dayjs | undefined;
        description: string | undefined;
      }>({
        id: props.drawerInfo.item.id,
        orderId: props.drawerInfo.item.orderId,
        customerId: props.drawerInfo?.item?.customerId,
        name: props.drawerInfo?.item?.name,
        number: props.drawerInfo?.item?.number,
        agent: props.drawerInfo.item.agent,
        serial: props.drawerInfo.item.serial,
        amount: props.drawerInfo?.item?.amount,
        status: props.drawerInfo?.item?.status,
        description: props.drawerInfo?.item?.description,
        invoiceTime: props.drawerInfo?.item?.invoiceTime
          ? dayjs(props.drawerInfo.item.invoiceTime)
          : undefined,
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
      };
    },
  });
</script>
<style lang="less" scoped></style>
