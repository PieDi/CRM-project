<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="上传"
    @cancel="drawerOnClose"
    @ok="submit"
    :visible="drawerInfo.visible"
    :width="600"
  >
    <Form :labelCol="{ span: 4 }">
      <FormItem label="附件">
        <Upload :file-list="fileList" :customRequest="uploadAction">
          <Button>选择</Button>
          <template #itemRender="{ file }">
            <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
            <Button
              type="link"
              @click="
                () => {
                  handleRemove(file);
                }
              "
              >删除</Button
            >
          </template>
        </Upload>
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, onBeforeMount } from 'vue';
  import { Form, Button, Modal, Upload, message } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import type { UploadProps } from 'ant-design-vue';
  import { boardFJUpload } from '/@/api/demo/customer';
  const FormItem = Form.Item;

  export default defineComponent({
    components: {
      Form,
      FormItem,
      Button,
      Modal,
      DeleteOutlined,
      Upload,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<any>,
        required: true,
      },
    },
    setup(props, { emit }) {
      onBeforeMount(() => {});
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = async () => {
        const fileData = new FormData();
        fileList.value?.forEach((o) => {
          //@ts-ignore
          fileData.append('files', o);
        });
        fileData.append('id', props.drawerInfo.id);
        fileData.append('type', props.drawerInfo.type);
        const res = await boardFJUpload(fileData);
        if (res) {
          message.success('附件上传成功')
          emit('')
        }
      };
      // 文件上传
      const fileList = ref<UploadProps['fileList']>([]);
      const handleRemove = async (file: any) => {
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

      const filesId = ref<any[]>([]);
      const uploadAction = async (o: any) => {
        //@ts-ignore
        fileList.value = [...fileList.value, o.file];
      };
      return {
        drawerInfo: props.drawerInfo,
        drawerOnClose,
        submit,
        // 文件上传
        fileList,
        handleRemove,
        uploadAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
