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
      <Button v-if="drawerInfo.type !== 'scan'" type="link" @click="add">新增</Button>
      <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
    </template>
    <template v-if="listInfo.length === 0">
      <div>{{ `暂时没有相关记录${editAble ? '' : '，请点击编辑后开始新增'}` }} </div>
    </template>
    <template v-else>
      <Form :labelCol="{ span: 6 }">
        <template v-for="(item, i) in listInfo">
          <div>
            <FormItem label="药物名称">
              <Input placeholder="请输入" allowClear v-model:value="item.medicineName" />
            </FormItem>
            <FormItem label="用药计量">
              <Input placeholder="请输入" allowClear v-model:value="item.useDose" />
            </FormItem>

            <FormItem label="用药时间">
              <DatePicker :show-time="true" allowClear v-model:value="item.useDate" />
            </FormItem>

            <FormItem label="附件">
              <Upload
                :file-list="fileListMap[i]"
                :before-upload="
                  (file) => {
                    beforeUpload(file, i);
                  }
                "
                @remove="
                  (file:any) => {
                    handleRemove(file, i);
                  }
                "
                :disabled="drawerInfo.type === 'scan'"
              >
                <Button :disabled="drawerInfo.type === 'scan'">选择</Button>
              </Upload>
              <Button
                v-if="drawerInfo.type !== 'scan'"
                @click="
                  () => {
                    handleUpload(i);
                  }
                "
                type="link"
                :loading="uploadingMap[i]"
                >{{ uploadingMap[i] ? '上传中' : '上传' }}</Button
              >
            </FormItem>

            <template v-if="i !== 0">
              <Button
                type="link"
                @click="
                  () => {
                    deleteRecord(i);
                  }
                "
              >
                <template #icon><DeleteOutlined /></template
              ></Button>
            </template>
          </div>
        </template>
      </Form>
    </template>
  </Drawer>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';
  import { Table, Form, Input, Button, Drawer, DatePicker, Upload, message } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { DrawerItemType } from '/@/views/type';
  import type { UploadProps } from 'ant-design-vue';
  import { CustomerDInfo } from '/@/api/demo/model/customer';
  import { number } from 'echarts';

  const FormItem = Form.Item;
  export default defineComponent({
    components: {
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      DatePicker,
      DeleteOutlined,
      Upload,
    },
    props: {
      // 用药记录是用 customerId
      drawerInfo: {
        type: Object as PropType<DrawerItemType<any>>,
        default: () => ({ visible: false, title: '' }),
      },
    },
    setup(props, { emit }) {
      const listInfo = ref<
        Array<{
          id: number | string | undefined;
          medicineName: string | undefined;
          useDose: string | undefined;
          useDate: Dayjs | undefined;
        }>
      >([]);
      const editAble = ref(false);
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = () => {
        emit('submit', listInfo.value);
      };
      const edit = () => {
        editAble.value = true;
        emit('edit');
      };
      const add = () => {
        listInfo.value.push({
          id: undefined,
          medicineName: undefined,
          useDate: undefined,
          useDose: undefined,
        });
      };
      const deleteRecord = (i: number) => {
        listInfo.value.splice(i, 1);
      };
      // 文件上传
      const fileListMap = ref<{ [number: string]: UploadProps['fileList'] }>({});
      const uploadingMap = ref<{ [number: string]: boolean }>({});

      const handleRemove = (file: File, i: number) => {
        console.log(24343 ,file)

        //@ts-ignore
        const index = fileList.value.indexOf(file);
        //@ts-ignore
        const newFileList = fileList.value.slice();
        newFileList.splice(index, 1);
        fileList.value = newFileList;
      };

      const beforeUpload = (file:File, i: number) => {
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
        editAble,
        drawerInfo: props.drawerInfo,
        listInfo,
        drawerOnClose,
        submit,
        edit,
        add,
        deleteRecord,
        // 文件上传
        fileListMap,
        uploadingMap,
        handleRemove,
        beforeUpload,
        handleUpload,
      };
    },
  });
</script>
<style lang="less" scoped></style>
