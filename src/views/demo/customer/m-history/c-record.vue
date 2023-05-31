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
            <FormItem label="会诊日期">
              <DatePicker
                :show-time="true"
                allowClear
                v-model:value="item.consultationDate"
                :disabled="drawerInfo.type === 'scan'"
              />
            </FormItem>

            <FormItem label="会诊专家">
              <TextArea
                placeholder="请输入"
                allowClear
                v-model:value="item.consultationExpert"
                :disabled="drawerInfo.type === 'scan'"
              />
            </FormItem>

            <FormItem label="会诊内容">
              <TextArea
                placeholder="请输入"
                allowClear
                v-model:value="item.consultationContent"
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
                          handleDownload(file, i);
                        }
                      "
                      >下载</Button
                    >
                    <Button
                      v-if="drawerInfo.type !== 'scan'"
                      type="link"
                      @click="
                        () => {
                          handleRemove(file, i);
                        }
                      "
                      >删除</Button
                    >
                  </Space>
                </template>
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
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
    DatePicker,
    Upload,
    Space,
    message,
  } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { DrawerItemType } from '/@/views/type';
  import type { UploadProps } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { getCustomerCList, saveCustomerC, fileCUpload } from '/@/api/demo/customer';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
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
      TextArea,
      Upload,
      Space,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<DrawerItemType<any>>,
        default: () => ({ visible: false, title: '' }),
      },
    },
    setup(props, { emit }) {
      const listInfo = ref<
        Array<{
          id: number | string | undefined;
          consultationContent: string | undefined;
          consultationExpert: string | undefined;
          consultationDate: Dayjs | undefined;
        }>
      >([]);
      const dListReq = async () => {
        if (props.drawerInfo.item) {
          const res = await getCustomerCList(props.drawerInfo.item);
          if (res) {
            const list: Array<any> = [];
            res.forEach((item, i) => {
              list.push({
                id: item?.id,
                consultationContent: item?.consultationContent,
                consultationExpert: item?.consultationExpert,
                consultationDate: item?.consultationDate
                  ? dayjs(item?.consultationDate)
                  : undefined,
              });
              const t: any[] = [];
              item.files?.forEach((file, j) => { 
                t.push({
                  uid: j,
                  name: file.fileName,
                  status: 'done',
                  url: file.path,
                });
              })
              fileListMap.value[i] = t
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
              consultationContent: item.consultationContent,
              consultationExpert: item.consultationExpert,
              consultationDate: item.consultationDate ? item.consultationDate.valueOf() : undefined,
              fileIds: filesIdMap.value[i]
                ? filesIdMap.value[i].length
                  ? filesIdMap.value[i]
                  : undefined
                : undefined,
            };
          });
          const res = await saveCustomerC(params);
          if (res) {
            message.success('会诊记录录入成功');
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
          consultationContent: undefined,
          consultationDate: undefined,
          consultationExpert: undefined,
        });
      };
      const deleteRecord = (i: number) => {
        listInfo.value.splice(i, 1);
        delete fileListMap.value[i];
      };
      // 文件上传
      const fileListMap = ref<{ [number: string]: UploadProps['fileList'] }>({});
      const uploadingMap = ref<{ [number: string]: boolean }>({});

      const handleDownload = (file: any, i: number) => {
        if (file.url) window.open(file.url)
      };

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
          const res = await fileCUpload(formData);
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
        handleDownload,
        handleRemove,
        beforeUpload,
        handleUpload,
      };
    },
  });
</script>
<style lang="less" scoped></style>
