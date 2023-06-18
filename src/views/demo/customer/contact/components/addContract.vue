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
    <Form :labelCol="{ span: 4 }">
      <FormItem label="合同名称">
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.name"
        />
      </FormItem>
      <FormItem label="合同编号">
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.number"
        />
      </FormItem>
      <FormItem label="订单ID">
        <Input
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.orderId"
        />
      </FormItem>

      <FormItem label="金额">
        <InputNumber
          placeholder="请输入"
          allowClear
          :disabled="drawerInfo.type == 'scan'"
          v-model:value="mInfo.price"
        />
      </FormItem>
      <FormItem label="生效日期">
        <DatePicker
          :show-time="true"
          v-model:value="mInfo.effectiveStart"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>

      <FormItem label="截止日期">
        <DatePicker
          :show-time="true"
          v-model:value="mInfo.effectiveEnd"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>
      <FormItem label="签约时间">
        <DatePicker
          :show-time="true"
          v-model:value="mInfo.signTime"
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
          v-model:value="mInfo.orderId"
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
    saveCustomerContract,
    updateCustomerContract,
    fileContractUpload,
    fileContractDelete,
  } from '/@/api/demo/customer';
  import { CustomerContractInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import { DrawerItemType } from '/@/views/type';
  import type { UploadProps } from 'ant-design-vue';

  import dayjs, { Dayjs } from 'dayjs';
  const FormItem = Form.Item;
  const InputTextArea = Input.TextArea;
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
    },
    props: {
      drawerInfo: {
        type: Object as PropType<DrawerItemType<CustomerContractInfo>>,
        default: () => ({ visible: false, title: '' }),
      },
    },
    setup(props, { emit }) {
      const mInfo = ref<{
        id?: number | undefined;
        orderId: string | undefined;
        name: string | undefined;
        number: string | undefined;
        price: number | undefined;
        status: number | undefined;
        signTime: Dayjs | undefined;
        effectiveStart: Dayjs | undefined;
        effectiveEnd: Dayjs | undefined;
        description: string | undefined;
      }>({
        id: props.drawerInfo.item.id,
        orderId: props.drawerInfo?.item?.orderId,
        name: props.drawerInfo?.item?.name,
        number: props.drawerInfo?.item?.number,
        price: props.drawerInfo?.item?.price,
        status: props.drawerInfo?.item?.status,
        signTime: props.drawerInfo?.item?.effectiveStart
          ? dayjs(props.drawerInfo.item.effectiveStart)
          : undefined,
        description: props.drawerInfo?.item?.description,
        effectiveStart: props.drawerInfo?.item?.effectiveStart
          ? dayjs(props.drawerInfo.item.effectiveStart)
          : undefined,
        effectiveEnd: props.drawerInfo?.item?.effectiveEnd
          ? dayjs(props.drawerInfo.item.effectiveEnd)
          : undefined,
      });

      //@ts-ignore
      const currentCustomer = ref<CustomerInfo>({
        id: undefined,
        birth: undefined,
        documentNumber: undefined,
        documentType: undefined,
        mobile: undefined,
        name: undefined,
        sex: undefined,
      });
      onMounted(() => {
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
        const params = {
          ...mInfo.value,
          signTime: mInfo.value.signTime ? mInfo.value.signTime.valueOf() : undefined,
          effectiveStart: mInfo.value.effectiveStart
            ? mInfo.value.effectiveStart.valueOf()
            : undefined,
          effectiveEnd: mInfo.value.effectiveEnd ? mInfo.value.effectiveEnd.valueOf() : undefined,
          fileIds: filesId.value.filter((id) => !!id),
        };
        let res;
        if (props.drawerInfo.type === 'add') res = await saveCustomerContract(params);
        if (props.drawerInfo.type === 'edit') res = await updateCustomerContract(params);
        if (res) {
          message.success(
            props.drawerInfo.type === 'add' ? '新增客户合同成功' : '修改客户合同成功',
          );
          emit('submit', props.drawerInfo.type === 'add' ? true : false);
        }
      };
      // 文件上传
      const fileList = ref<UploadProps['fileList']>([]);
      const handleRemove = async (file: any) => {
        if (file?.url) {
          const res = await fileContractDelete(file?.id);
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

      const filesId = ref<any[]>([]);
      const uploadAction = async (o: any) => {
        const fileData = new FormData();
        fileData.append('files', o.file);
        const res = await fileContractUpload(fileData);
        if (res) {
          //@ts-ignore
          fileList.value = [...fileList.value, o.file];
          filesId.value.push(res[0]);
        }
      };
      return {
        drawerInfo: props.drawerInfo,
        currentCustomer,
        mInfo,
        drawerOnClose,
        submit,
        // 文件上传
        fileList,
        handleRemove,
        handleDownload,
        uploadAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
