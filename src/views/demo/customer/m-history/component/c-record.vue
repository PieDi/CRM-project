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
    <div style="overflow: hidden">
      <Button style="float: right" type="link" @click="add">新增</Button>
    </div>
    <template v-if="listInfo.length === 0">
      <div>暂时没有相关记录</div>
    </template>
    <template v-else>
      <Form :labelCol="{ span: 4 }">
        <template v-for="(item, i) in listInfo">
          <div>
            <FormItem label="会诊日期">
              <DatePicker :show-time="true" allowClear v-model:value="item.consultationDate" />
            </FormItem>

            <FormItem label="会诊专家">
              <TextArea placeholder="请输入" allowClear v-model:value="item.consultationExpert" />
            </FormItem>

            <FormItem label="会诊内容">
              <TextArea placeholder="请输入" allowClear v-model:value="item.consultationContent" />
            </FormItem>

            <FormItem label="附件">
              <Upload
                :file-list="fileListMap[i]"
                :customRequest="
                  (file) => {
                    uploadAction(file, i);
                  }
                "
                :disabled="drawerInfo.type === 'scan'"
              >
                <Button>选择</Button>
                <template #itemRender="{ file }">
                  <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
                  <Space>
                    <Button
                      type="link"
                      @click="
                        () => {
                          handleDownload(file, i);
                        }
                      "
                      >下载</Button
                    >
                    <Button
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
            </FormItem>

            <div style="overflow: hidden; margin-top: -20px">
              <Button
                style="float: right"
                type="link"
                @click="
                  () => {
                    deleteRecord(i);
                  }
                "
              >
                <template #icon><DeleteOutlined /></template
              ></Button>
            </div>
          </div>
        </template>
      </Form>
    </template>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType, onMounted } from 'vue';
  import {
    Table,
    Form,
    Input,
    Button,
    Modal,
    DatePicker,
    Upload,
    Space,
    message,
  } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { DrawerItemType } from '/@/views/type';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    getCustomerCList,
    saveCustomerC,
    updateCustomerC,
    fileCUpload,
    fileCDelete,
  } from '/@/api/demo/customer';
  import { CustomerCInfo } from '/@/api/demo/model/customer';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  export default defineComponent({
    components: {
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Modal,
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
      const cDataSource = ref<Array<CustomerCInfo>>([]);
      const dListReq = async () => {
        const res = await getCustomerCList(props.drawerInfo.item);
        if (res) {
          cDataSource.value = res;
          const list: Array<any> = [];
          res.forEach((item, i) => {
            list.push({
              id: item?.id,
              consultationContent: item?.consultationContent,
              consultationExpert: item?.consultationExpert,
              consultationDate: item?.consultationDate ? dayjs(item?.consultationDate) : undefined,
              files: item.files,
            });
            const t: any[] = [];
            const p: any[] = [];
            item.files?.forEach((file, j) => {
              t.push({
                uid: j,
                name: file.fileName,
                status: 'done',
                url: file.path,
              });
              p.push(null);
            });
            fileListMap.value[i] = t;
            filesIdMap.value[i] = p;
          });
          listInfo.value = list;
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
        if (!cDataSource.value.length && !listInfo.value.length) {
          message.warn('暂未添加用药记录');
          return;
        }
        const list = listInfo.value.map((item, i) => {
          const t = {
            id: item.id,
            diseaseId: props.drawerInfo.item,
            consultationContent: item.consultationContent,
            consultationExpert: item.consultationExpert,
            consultationDate: item.consultationDate ? item.consultationDate.valueOf() : undefined,
          };
          const mF = filesIdMap.value[i]?.filter((id) => !!id);
          // @ts-ignore
          t.fileIds = mF;
          return t;
        });
        const params = {
          list,
          diseaseId: props.drawerInfo.item,
        };
        let res;
        if (cDataSource.value.length) {
          res = await updateCustomerC(params);
        } else {
          res = await saveCustomerC(params);
        }

        if (res) {
          message.success('会诊记录录入成功');
          emit('submit');
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
        filesIdMap.value[listInfo.value.length] = [];
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
      const fileListMap = ref<{ [number: string]: any }>({});
      const handleDownload = (file: any, i: number) => {
        if (file?.url)
          window.open(
            `http://129.204.202.223:8001/basic-api/customer/file/download?path=${file.url}`,
          );
      };

      const handleRemove = async (file: any, i: number) => {
        if (file?.url) {
          const res = await fileCDelete(file?.id);
          if (res) message.success('删除成功');
        }

        const fileList = fileListMap.value[i];
        //@ts-ignore
        const index = fileList.indexOf(file);
        //@ts-ignore
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        fileListMap.value[i] = newFileList;

        const filesId = filesIdMap.value[i];
        const newFilesId = filesId.slice();
        newFilesId.splice(index, 1);
        filesIdMap.value[i] = newFilesId;
      };

      const filesIdMap = ref<{ [number: string]: number[] }>({});
      const uploadAction = async (o: any, i: number) => {
        const fileData = new FormData();
        fileData.append('files', o.file);
        const res = await fileCUpload(fileData);
        if (res) {
          const fileList = fileListMap.value[i];
          fileListMap.value[i] = [...fileList, o.file];
          filesIdMap.value[i].push(res[0]);
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
        handleDownload,
        handleRemove,
        uploadAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
