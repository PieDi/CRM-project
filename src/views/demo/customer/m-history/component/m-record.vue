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
          :disabled="drawerInfo.type !== 'add'"
          show-search
          :filter-option="filterOption"
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

      <template v-if="currentCustomer?.id">
        <FormItem label="性别">
          <Select placeholder="请选择" disabled v-model:value="currentCustomer.sex">
            <SelectOption :key="1">男</SelectOption>
            <SelectOption :key="2">女</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件类型">
          <Select placeholder="请选择" disabled v-model:value="currentCustomer.documentType">
            <SelectOption :key="1">身份证</SelectOption>
            <SelectOption :key="2">护照</SelectOption>
            <SelectOption :key="3">军官证</SelectOption>
            <SelectOption :key="4">港澳通行证</SelectOption>
            <SelectOption :key="5">台湾通行证</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="证件号码">
          <Input
            placeholder="请输入"
            allowClear
            disabled
            v-model:value="currentCustomer.documentNumber"
          />
        </FormItem>
      </template>

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
  } from 'ant-design-vue';
  import {
    getCustomerList,
    saveCustomerMH,
    updateCustomerMH,
    fileMHUpload,
    fileMHDelete,
    getCustomerMHDetail,
    getCustomerFileView,
  } from '/@/api/demo/customer';
  import { CustomerMHInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import { DrawerItemType } from '/@/views/type';
  import { SelectValue } from 'ant-design-vue/lib/select';
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
      const dataSource = ref<Array<CustomerInfo>>([]);
      const customerReq = async () => {
        const res = await getCustomerList();
        if (res) {
          dataSource.value = res;
          if (props.drawerInfo?.item.customerId) {
            //@ts-ignore
            const t = dataSource.value.find(
              (item: CustomerInfo) => item.id === props.drawerInfo?.item?.customerId,
            );
            if (t) currentCustomer.value = t;
            const detailRes = await getCustomerMHDetail(props.drawerInfo?.item?.id as number);
            if (detailRes) {
              const t: any[] = [];
              detailRes.files?.forEach((file, i) => {
                t.push({
                  uid: i,
                  name: file.fileName,
                  status: 'done',
                  url: file.path,
                  id: file.id,
                });
                filesId.value.push(null);
              });
              fileList.value = t;
            }
          }
        }
      };
      onMounted(() => {
        customerReq();
      });

      const customerOnChange = (value: SelectValue) => {
        //@ts-ignore
        const t = dataSource.value.find((item: CustomerInfo) => item.id === value);
        if (t) currentCustomer.value = { ...t };
      };
      const filterOption = (input: string, option: any) => {
        return option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };

      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = async () => {
        if (props.drawerInfo.type === 'scan') {
          drawerOnClose();
          return;
        }
        formRef.value?.validate().then(async () => {
          if (currentCustomer.value.id) {
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
        drawerInfo: props.drawerInfo,
        customerOnChange,
        currentCustomer,
        mInfo,
        dataSource,
        drawerOnClose,
        submit,
        // 文件上传
        fileList,
        uploadAction,
        handleRemove,
        handleDownload,
        handlePreView,
        filterOption,
      };
    },
  });
</script>
<style lang="less" scoped></style>
