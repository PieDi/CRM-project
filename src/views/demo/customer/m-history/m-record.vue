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
          :show-search="true"
          :disabled="drawerInfo.type === 'scan'"
          placeholder="请选择"
          :filter-option="filterOption"
          @change="customerOnChange"
        >
          <SelectOption v-for="item of dataSource" :key="item.mobile" :value="item.name">{{
            `${item.name}-${item.mobile}`
          }}</SelectOption>
        </Select>
      </FormItem>

      <template v-if="currentCustomer">
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
          :value="mInfo.name"
          :disabled="drawerInfo.type === 'scan' || drawerInfo.type === 'edit'"
        />
      </FormItem>
      <FormItem label="会诊日期">
        <DatePicker :show-time="true" />
      </FormItem>

      <FormItem label="科室">
        <Input
          placeholder="请输入"
          allowClear
          min="1"
          :precision="0"
          :disabled="drawerInfo.type === 'scan' || drawerInfo.type === 'edit'"
        />
      </FormItem>
      <FormItem label="疾病名称">
        <Input
          placeholder="请输入"
          allowClear
          :value="mInfo.name"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>
      <FormItem label="附件">
        <Upload :file-list="fileList" :before-upload="beforeUpload" @remove="handleRemove">
          <Button>选择</Button>
        </Upload>
        <Button @click="handleUpload" type="link" :loading="uploading">{{
          uploading ? '上传中' : '上传'
        }}</Button>
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
    message,
  } from 'ant-design-vue';
  import { getCustomerList } from '/@/api/demo/customer';
  import { CustomerMHInfo, CustomerInfo } from '/@/api/demo/model/customer';
  import { DrawerItemType } from '/@/views/type';
  import { SelectValue } from 'ant-design-vue/lib/select';
  import type { UploadProps } from 'ant-design-vue';
  import { fileMHUpload } from '/@/api/demo/customer';

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
    },
    props: {
      drawerInfo: {
        type: Object as PropType<DrawerItemType<CustomerMHInfo>>,
        default: () => ({ visible: false, title: '' }),
      },
    },
    setup(props, { emit }) {
      const mInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const dataSource = ref<Array<CustomerInfo>>([]);
      onMounted(async () => {
        const res = await getCustomerList();
        if (res) dataSource.value = res;
      });
      const currentCustomer = ref<CustomerInfo>();
      const customerOnChange = (value: SelectValue, option: any) => {
        currentCustomer.value = dataSource.value.find(
          (item: CustomerInfo) => item.mobile === (option.key as string),
        );
        console.log(11111, currentCustomer.value);
      };
      const filterOption = (input: string, option: any) => {
        console.log(233423424, input, option);
        return (
          option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      };
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = () => {
        emit('submit', mInfo.value);
      };
      const edit = () => {
        emit('edit');
      };
      // 文件上传
      const fileList = ref<UploadProps['fileList']>([]);
      const uploading = ref<boolean>(false);

      const handleRemove: UploadProps['onRemove'] = (file) => {
        //@ts-ignore
        const index = fileList.value.indexOf(file);
        //@ts-ignore
        const newFileList = fileList.value.slice();
        newFileList.splice(index, 1);
        fileList.value = newFileList;
      };

      const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        //@ts-ignore
        fileList.value = [...fileList.value, file];
        return false;
      };

      const handleUpload = () => {
        const formData = new FormData();
        //@ts-ignore
        formData.append('files', fileList.value);
        // uploading.value = true;
        // You can use any AJAX library you like
        fileMHUpload(formData);
        // request('https://www.mocky.io/v2/5cc8019d300000980a055e76', {
        //   method: 'post',
        //   data: formData,
        // })
        //   .then(() => {
        //     fileList.value = [];
        //     uploading.value = false;
        //     message.success('upload successfully.');
        //   })
        //   .catch(() => {
        //     uploading.value = false;
        //     message.error('upload failed.');
        //   });
      };
      return {
        drawerInfo: props.drawerInfo,
        customerOnChange,
        currentCustomer,
        mInfo,
        dataSource,
        filterOption,
        drawerOnClose,
        submit,
        edit,
        // 文件上传
        fileList,
        uploading,
        handleRemove,
        beforeUpload,
        handleUpload,
      };
    },
  });
</script>
<style lang="less" scoped></style>
<style lang="less" scoped></style>
