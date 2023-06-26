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
            <FormItem label="检查日期">
              <DatePicker :show-time="true" allowClear v-model:value="item.checkDate" />
            </FormItem>
            <FormItem label="检查机构">
              <Input placeholder="请输入" allowClear v-model:value="item.checkMechanism" />
            </FormItem>

            <FormItem label="检验类型">
              <Input placeholder="请输入" allowClear v-model:value="item.checkType" />
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
                      v-if="file?.url"
                      type="link"
                      @click="
                        () => {
                          handleDownload(file);
                        }
                      "
                      >下载</Button
                    >
                    <Button
                      type="link"
                      v-if="file?.url"
                      @click="
                        () => {
                          handlePreView(file);
                        }
                      "
                      >预览</Button
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
    saveCustomerE,
    updateCustomerE,
    fileEUpload,
    getCustomerEList,
    fileEDelete,
    getCustomerFileView,
  } from '/@/api/demo/customer';
  import { CustomerEInfo } from '/@/api/demo/model/customer';

  const FormItem = Form.Item;
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
          checkMechanism: string | undefined;
          checkType: string | undefined;
          checkDate: Dayjs | undefined;
        }>
      >([]);
      const eDataSource = ref<Array<CustomerEInfo>>([]);
      const dListReq = async () => {
        if (props.drawerInfo.item) {
          const res = await getCustomerEList(props.drawerInfo.item);
          if (res) {
            eDataSource.value = res;
            const list: Array<any> = [];
            res.forEach((item, i) => {
              list.push({
                id: item?.id,
                checkMechanism: item?.checkMechanism,
                checkType: item?.checkType,
                checkDate: item?.checkDate ? dayjs(item?.checkDate) : undefined,
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
        if (!eDataSource.value.length && !listInfo.value.length) {
          message.warn('暂未添加用药记录');
          return;
        }
        const list = listInfo.value.map((item, i) => {
          const t = {
            id: item.id,
            diseaseId: props.drawerInfo.item,
            checkMechanism: item.checkMechanism,
            checkType: item.checkType,
            checkDate: item.checkDate ? item.checkDate.valueOf() : undefined,
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
        if (eDataSource.value.length) {
          res = await updateCustomerE(params);
        } else {
          res = await saveCustomerE(params);
        }
        if (res) {
          message.success('检验记录录入成功');
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
          checkDate: undefined,
          checkMechanism: undefined,
          checkType: undefined,
        });
      };
      const deleteRecord = (i: number) => {
        listInfo.value.splice(i, 1);
        delete fileListMap.value[i];
      };
      // 文件上传
      const fileListMap = ref<{ [number: string]: any }>({});
      const handleDownload = (file: any) => {
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
      const handleRemove = async (file: any, i: number) => {
        if (file?.url) {
          const res = await fileEDelete(file?.id);
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
        const res = await fileEUpload(fileData);
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
        handlePreView,
        handleRemove,
        uploadAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
