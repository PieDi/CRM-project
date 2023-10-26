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
        label="就诊医院"
        name="hospitalName"
        :rules="{
          required: true,
          message: '请输入就诊医院',
          trigger: 'change',
        }"
      >
        <Input
          placeholder="请输入"
          allowClear
          v-model:value="mInfo.hospitalName"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>

      <FormItem
        label="科室"
        name="departmentName"
        :rules="{
          required: true,
          message: '请输入科室',
          trigger: 'change',
        }"
      >
        <Input
          placeholder="请输入"
          allowClear
          v-model:value="mInfo.departmentName"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>
      <FormItem
        label="疾病名称"
        name="diseaseName"
        :rules="{
          required: true,
          message: '请输入疾病名称',
          trigger: 'change',
        }"
      >
        <Input
          placeholder="请输入"
          allowClear
          v-model:value="mInfo.diseaseName"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>

      <FormItem
        label="就诊时间"
        name="visitDate"
        :rules="{
          required: true,
          message: '请输入就诊时间',
          trigger: 'change',
        }"
      >
        <DatePicker v-model:value="mInfo.visitDate" :disabled="drawerInfo.type === 'scan'" />
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
    </Form>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';
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
  } from 'ant-design-vue';
  import {
    saveCustomerMH,
    updateCustomerMH,
    fileMHUpload,
    fileMHDelete,
    getCustomerFileView,
  } from '/@/api/demo/customer';
  import { CustomerMHInfo } from '/@/api/demo/model/customer';
  import { DrawerItemType } from '/@/views/type';
  import type { UploadProps } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  const FormItem = Form.Item;
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
      SelectOption,
      DatePicker,
      Upload,
      Space,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<DrawerItemType<CustomerMHInfo>>,
        default: () => ({ visible: false, title: '' }),
      },
      fixedCustomerID: Number,
    },
    setup(props, { emit }) {
      const formRef = ref<FormInstance>();
      const mInfo = ref<{
        customerId: number | undefined;
        departmentName: string | undefined;
        diseaseName: string | undefined;
        hospitalName: undefined | string;
        visitDate: Dayjs | undefined;
      }>({
        customerId: props.drawerInfo?.item?.customerId || undefined,
        departmentName: props.drawerInfo?.item?.departmentName || undefined,
        diseaseName: props.drawerInfo?.item?.diseaseName || undefined,
        hospitalName: props.drawerInfo?.item?.hospitalName || undefined,
        visitDate: props.drawerInfo?.item?.visitDate
          ? dayjs(props.drawerInfo.item.visitDate, 'YYYY-MM-DD')
          : undefined,
      });
      console.log(111,  props.drawerInfo?.item, mInfo)

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
              id: props.drawerInfo.item.id,
              ...mInfo.value,
              visitDate: mInfo.value.visitDate
                ? mInfo.value.visitDate.format('YYYY-MM-DD')
                : undefined,
              fileIds: filesId.value.filter((id) => !!id),
            };
            let res;
            if (props.drawerInfo.type === 'add') res = await saveCustomerMH(params);
            if (props.drawerInfo.type === 'edit') res = await updateCustomerMH(params);
            if (res) {
              message.success(
                props.drawerInfo.type === 'add' ? '新增客户病史成功' : '修改客户病史成功',
              );
              emit('submit', props.drawerInfo.type === 'add' ? true : false);
            }
        });
      };
      // 文件上传
      const fileList = ref<UploadProps['fileList']>([]);
      const handleRemove = async (file: any) => {
        if (file?.url) {
          const res = await fileMHDelete(file?.id);
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
        const res = await fileMHUpload(fileData);
        if (res) {
          //@ts-ignore
          fileList.value = [...fileList.value, o.file];
          filesId.value.push(res[0]);
        }
      };

      return {
        formRef,
        fixedCustomerID: props.fixedCustomerID,
        drawerInfo: props.drawerInfo,
        mInfo,
        drawerOnClose,
        submit,
        // 文件上传
        fileList,
        uploadAction,
        handleRemove,
        handleDownload,
        handlePreView,
      };
    },
  });
</script>
<style lang="less" scoped></style>
