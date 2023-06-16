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
  
  
        <FormItem label="甲方">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="mInfo.firstParty"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        
        <FormItem label="乙方">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="mInfo.secondParty"
            :disabled="drawerInfo.type === 'scan'"
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
  
        <FormItem label="附件">
          <Upload
            :file-list="fileList"
            :before-upload="beforeUpload"
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
  
          <Button
            v-if="drawerInfo.type !== 'scan'"
            @click="handleUpload"
            type="link"
            :loading="uploading"
            >{{ uploading ? '上传中' : '上传' }}</Button
          >
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
    //   getCustomerList,
    //   saveCustomerMH,
    //   updateCustomerMH,
      fileMHUpload,
    //   getCustomerMHDetail,
    } from '/@/api/demo/customer';
    import { CustomerContractInfo, CustomerInfo } from '/@/api/demo/model/customer';
    import { DrawerItemType } from '/@/views/type';
    // import { SelectValue } from 'ant-design-vue/lib/select';
    import type { UploadProps } from 'ant-design-vue';
  
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
          type: Object as PropType<DrawerItemType<CustomerContractInfo>>,
          default: () => ({ visible: false, title: '' }),
        },
      },
      setup(props, { emit }) {
        const mInfo = ref<{
          name:  string | undefined,
          firstParty:  string | undefined,
          secondParty: string |  undefined,
          effectiveStart:  Dayjs | undefined,
          effectiveEnd: Dayjs | undefined,
          orderId: number | undefined,
        }>({
          name: props.drawerInfo?.item?.name || undefined,
          firstParty: props.drawerInfo?.item?.firstParty || undefined,         
          secondParty: props.drawerInfo?.item?.secondParty || undefined,
          effectiveStart: props.drawerInfo?.item?.effectiveStart
            ? dayjs(props.drawerInfo.item.effectiveStart)
            : undefined,
            effectiveEnd: props.drawerInfo?.item?.effectiveEnd
            ? dayjs(props.drawerInfo.item.effectiveEnd)
            : undefined,
            orderId: props.drawerInfo?.item?.orderId || undefined,
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
        // const dataSource = ref<Array<CustomerInfo>>([]);
        // const customerReq = async () => {
        //   const res = await getCustomerList();
        //   if (res) {
        //     dataSource.value = res;
        //     if (props.drawerInfo?.item.customerId) {
        //       //@ts-ignore
        //       const t = dataSource.value.find(
        //         (item: CustomerInfo) => item.id === props.drawerInfo?.item?.customerId,
        //       );
        //       if (t) currentCustomer.value = t;
        //       const detailRes = await getCustomerMHDetail(props.drawerInfo?.item?.id as number);
        //       if (detailRes) {
        //         const t: any[] = [];
        //         detailRes.files?.forEach((file, i) => {
        //           t.push({
        //             uid: i,
        //             name: file.fileName,
        //             status: 'done',
        //             url: file.path,
        //           });
        //         });
        //         fileList.value = t;
        //       }
        //     }
        //   }
        // };
        onMounted(() => {
        //   customerReq();
        });
  
        // const customerOnChange = (value: SelectValue) => {
        //   //@ts-ignore
        //   const t = dataSource.value.find((item: CustomerInfo) => item.id === value);
        //   if (t) currentCustomer.value = { ...t };
        // };
  
        const drawerOnClose = () => {
          emit('drawerOnClose');
        };
        const submit = async () => {
          if (props.drawerInfo.type === 'scan') { 
            drawerOnClose()
            return
          }
        //   if (currentCustomer.value.id) {
        //     const params = {
        //       customerId: currentCustomer.value.id,
        //       id: props.drawerInfo.item.id,
        //       ...mInfo.value,
        //       visitDate: mInfo.value.visitDate ? mInfo.value.visitDate.valueOf() : undefined,
        //       fileIds: filesId.value.length ? filesId.value : undefined,
        //     };
  
        //     let res;
        //     if (props.drawerInfo.type === 'add') res = await saveCustomerMH(params);
        //     if (props.drawerInfo.type === 'edit') res = await updateCustomerMH(params);
        //     if (res) {
        //       message.success(
        //         props.drawerInfo.type === 'add' ? '新增客户病史成功' : '修改客户病史成功',
        //       );
        //       emit('submit', props.drawerInfo.type === 'add' ? true : false);
        //     }
        //   }
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
          if (file.url) { }
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
              if (!file?.url) formData.append('files', file);
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
        //   customerOnChange,
          currentCustomer,
          mInfo,
        //   dataSource,
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
  