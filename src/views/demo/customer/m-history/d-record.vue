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
              <Input
                placeholder="请输入"
                allowClear
                v-model:value="item.medicineName"
                :disabled="drawerInfo.type === 'scan'"
              />
            </FormItem>
            <FormItem label="用药计量">
              <Input
                placeholder="请输入"
                allowClear
                v-model:value="item.useDose"
                :disabled="drawerInfo.type === 'scan'"
              />
            </FormItem>

            <FormItem label="用药时间">
              <DatePicker
                allowClear
                v-model:value="item.useDate"
                :disabled="drawerInfo.type === 'scan'"
              />
            </FormItem>

            <FormItem label="附件">
              <Upload
                :file-list="fileListMap[i]"
                :before-upload="
                  (file) => {
                    beforeUpload(file, i);
                    return false;
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
  import { defineComponent, ref, PropType, onMounted } from 'vue';
  import { Table, Form, Input, Button, Drawer, DatePicker, Upload, message } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { DrawerItemType } from '/@/views/type';
  import type { UploadProps } from 'ant-design-vue';
  import { getCustomerDList, saveCustomerD, fileDUpload } from '/@/api/demo/customer';

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
          id: number | undefined;
          medicineName: string | undefined;
          useDose: string | undefined;
          useDate: Dayjs | undefined;
        }>
      >([]);
      const dListReq = async () => {
        if (props.drawerInfo.item) {
          const res = await getCustomerDList(props.drawerInfo.item);
          if (res) {
            const list: Array<any> = [];
            res.forEach((item) => {
              list.push({
                id: item?.id,
                medicineName: item?.medicineName,
                useDose: item?.useDose,
                useDate: item?.useDate ? dayjs(item?.useDate, 'YYYY-MM-DD') : undefined,
              });
            });
            listInfo.value = list;
          }
        }
      };
      onMounted(() => {
        dListReq();
      });
      const editAble = ref(false);
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = async () => {
        if (listInfo.value.length) {
          const params = listInfo.value.map((item, i) => {
            return {
              diseaseId: props.drawerInfo.item,
              medicineName: item.medicineName,
              useDose: item.useDose,
              useDate: item.useDate ? item.useDate.format('YYYY-MM-DD') : undefined,
              fileIds: filesIdMap.value[i]
                ? filesIdMap.value[i].length
                  ? filesIdMap.value[i]
                  : undefined
                : undefined,
            };
          });
          console.log(1212121, params);
          const res = await saveCustomerD(params);
          if (res) {
            message.success('用药记录录入成功');
            emit('submit');
          }
        }
      };
      const edit = () => {
        editAble.value = true;
        Object.keys(fileListMap.value).forEach((key) => {
          fileListMap.value[key] = [];
        });
        emit('edit');
      };
      const add = () => {
        fileListMap.value[listInfo.value.length] = [];
        listInfo.value.push({
          id: undefined,
          medicineName: undefined,
          useDate: undefined,
          useDose: undefined,
        });
      };
      const deleteRecord = (i: number) => {
        listInfo.value.splice(i, 1);
        delete fileListMap.value[i];
      };
      // 文件上传
      const fileListMap = ref<{ [number: string]: UploadProps['fileList'] }>({});
      const uploadingMap = ref<{ [number: string]: boolean }>({});

      const handleRemove = (file: File, i: number) => {
        const fileList = fileListMap.value[i];
        //@ts-ignore
        const index = fileList.indexOf(file);
        //@ts-ignore
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        fileListMap.value[i] = newFileList;
      };

      const beforeUpload = (file: File, i: number) => {
        const fileList = fileListMap.value[i];
        //@ts-ignore
        fileListMap.value[i] = [...fileList, file];
        return false;
      };
      const filesIdMap = ref<{ [number: string]: number[] }>({});
      const handleUpload = async (i: number) => {
        const fileList = fileListMap.value[i];
        if (fileList?.length) {
          const formData = new FormData();
          fileList?.forEach((file) => {
            // @ts-ignore
            formData.append('files', file);
          });
          const res = await fileDUpload(formData);
          if (res) {
            message.success('上传成功');
            filesIdMap.value[i] = res;
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
