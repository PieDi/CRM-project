<template>
  <Drawer
    :mask-closable="false"
    :destroy-on-close="true"
    :title="drawerInfo.title"
    placement="right"
    @close="drawerOnClose"
    :visible="drawerInfo.visible"
  >
    <template #extra>
      <Button v-if="drawerInfo.type === 'scan'" type="link" @click="edit">编辑</Button>
      <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
    </template>
    <Form :labelCol="{ span: 6 }">
      <FormItem label="客户姓名">
        <Select
          :disabled="drawerInfo.type !== 'add'"
          placeholder="请选择"
          @change="customerOnChange"
          v-model:value="currentCustomer.id"
        >
          <SelectOption v-for="item of dataSource" :value="item.id">{{ item.name }}</SelectOption>
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

      <FormItem label="就诊医院">
        <Input
          placeholder="请输入"
          allowClear
          v-model:value="mInfo.hospitalName"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>
      <FormItem label="会诊日期">
        <DatePicker
          :show-time="true"
          v-model:value="mInfo.visitDate"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>

      <FormItem label="科室">
        <Input
          placeholder="请输入"
          allowClear
          v-model:value="mInfo.departmentName"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>
      <FormItem label="疾病名称">
        <Input
          placeholder="请输入"
          allowClear
          v-model:value="mInfo.diseaseName"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>
      <FormItem label="附件">
        <Upload
          :file-list="fileList"
          :before-upload="beforeUpload"
          :disabled="drawerInfo.type === 'scan'"
        >
          <Button :disabled="drawerInfo.type === 'scan'">选择</Button>

          <template #itemRender="{ file, actions }">
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

        <Button
          v-if="drawerInfo.type !== 'scan'"
          @click="handleUpload"
          type="link"
          :loading="uploading"
          >{{ uploading ? '上传中' : '上传' }}</Button
        >
      </FormItem>
    </Form>
  </Drawer>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, onMounted } from 'vue';
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
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
    getCustomerMHDetail,
  } from '/@/api/demo/customer';
  import { CustomerMHInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import { DrawerItemType } from '/@/views/type';
  import { SelectValue } from 'ant-design-vue/lib/select';
  import type { UploadProps } from 'ant-design-vue';

  import dayjs, { Dayjs } from 'dayjs';
  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  export default defineComponent({
    components: {
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
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
      const mInfo = ref<{
        departmentName: string | undefined;
        diseaseName: string | undefined;
        hospitalName: undefined | string;
        visitDate: Dayjs | undefined;
      }>({
        departmentName: props.drawerInfo?.item?.departmentName || undefined,
        diseaseName: props.drawerInfo?.item?.diseaseName || undefined,
        hospitalName: props.drawerInfo?.item?.hospitalName || undefined,
        visitDate: props.drawerInfo?.item?.visitDate
          ? dayjs(props.drawerInfo.item.visitDate)
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
                });
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

      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = async () => {
        if (currentCustomer.value.id) {
          const params = {
            customerId: currentCustomer.value.id,
            id: props.drawerInfo.item.id,
            ...mInfo.value,
            visitDate: mInfo.value.visitDate ? mInfo.value.visitDate.valueOf() : undefined,
            fileIds: filesId.value.length ? filesId.value : undefined,
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
      };
      const edit = () => {
        // 编辑附件时  视为准备重新上传附件
        fileList.value = [];
        emit('edit');
      };
      // 文件上传
      const fileList = ref<UploadProps['fileList']>([]);
      const uploading = ref<boolean>(false);

      const handleRemove = (file: any) => {
        //@ts-ignore
        const index = fileList.value.indexOf(file);
        //@ts-ignore
        const newFileList = fileList.value.slice();
        newFileList.splice(index, 1);
        fileList.value = newFileList;
      };
      const handleDownload = async (file: any) => {
        if (file?.url)
          window.open(`http://129.204.202.223:8001/basic-api/customer/file/download?path=${file.url}`);
      };

      const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        //@ts-ignore
        fileList.value = [...fileList.value, file];
        return false;
      };
      const filesId = ref<number[]>([]);
      const handleUpload = async () => {
        if (fileList.value?.length) {
          const formData = new FormData();
          fileList.value?.forEach((file) => {
            // @ts-ignore
            formData.append('files', file);
          });
          const res = await fileMHUpload(formData);
          if (res) {
            message.success('上传成功');
            filesId.value = res;
          }
        }
      };
      return {
        drawerInfo: props.drawerInfo,
        customerOnChange,
        currentCustomer,
        mInfo,
        dataSource,
        drawerOnClose,
        submit,
        edit,
        // 文件上传
        fileList,
        uploading,
        handleRemove,
        handleDownload,
        beforeUpload,
        handleUpload,
      };
    },
  });
</script>
<style lang="less" scoped></style>
