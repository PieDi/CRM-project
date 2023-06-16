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
      <!-- :disabled="drawerInfo.type === 'scan'" -->
      <Form :labelCol="{ span: 4 }">
        <template v-for="(item, i) in listInfo">
          <div>
            <h3>{{ `用药记录（${i + 1}）` }}</h3>
            <FormItem label="药物名称">
              <Input placeholder="请输入" allowClear v-model:value="item.medicineName" />
            </FormItem>
            <FormItem label="用药计量">
              <Input placeholder="请输入" allowClear v-model:value="item.useDose" />
            </FormItem>

            <FormItem label="用药时间">
              <DatePicker allowClear v-model:value="item.useDate" />
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
              <Button
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
    Modal,
    Table,
    Form,
    Input,
    Button,
    DatePicker,
    Upload,
    Space,
    message,
  } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { DrawerItemType } from '/@/views/type';
  import {
    getCustomerDList,
    saveCustomerD,
    updateCustomerD,
    fileDUpload,
    fileDDelete,
  } from '/@/api/demo/customer';
  import { CustomerDInfo } from '/@/api/demo/model/customer';

  const FormItem = Form.Item;
  export default defineComponent({
    components: {
      Modal,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      DatePicker,
      DeleteOutlined,
      Upload,
      Space,
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
          files: any[] | undefined;
        }>
      >([]);
      const dDataSource = ref<Array<CustomerDInfo>>([]);
      const dListReq = async () => {
        if (props.drawerInfo.item) {
          const res = await getCustomerDList(props.drawerInfo.item);
          if (res) {
            dDataSource.value = res;
            const list: Array<any> = [];
            res.forEach((item, i) => {
              list.push({
                id: item?.id,
                medicineName: item?.medicineName,
                useDose: item?.useDose,
                files: item.files,
                useDate: item?.useDate ? dayjs(item?.useDate, 'YYYY-MM-DD') : undefined,
              });
              const t: any[] = [];
              item.files?.forEach((file, j) => {
                t.push({
                  uid: j,
                  id: file.id,
                  name: file.fileName,
                  status: 'done',
                  url: file.path,
                });
              });
              fileListMap.value[i] = t;
            });
            listInfo.value = list;
          }
        }
      };
      onMounted(() => {
        dListReq();
      });
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = async () => {
        if (!dDataSource.value.length && !listInfo.value.length) {
          message.warn('暂未添加用药记录');
          return;
        }
        const list = listInfo.value.map((item, i) => {
          const t = {
            id: item.id,
            medicineName: item.medicineName,
            useDose: item.useDose,
            useDate: item.useDate ? item.useDate.format('YYYY-MM-DD') : undefined,
          };
          const mF = filesIdMap.value[i];
          // @ts-ignore
          t.fileIds = mF;
          return t;
        });
        const params = {
          list,
          diseaseId: props.drawerInfo.item,
        };

        let res;
        if (dDataSource.value.length) {
          res = await updateCustomerD(params);
        } else {
          res = await saveCustomerD(params);
        }
        if (res) {
          message.success('用药记录录入成功');
          emit('submit');
        }
      };
      // const edit = () => {
      //   Object.keys(fileListMap.value).forEach((key) => {
      //     fileListMap.value[key] = [];
      //   });
      //   emit('edit');
      // };
      const add = () => {
        fileListMap.value[listInfo.value.length] = [];
        listInfo.value.push({
          id: undefined,
          medicineName: undefined,
          useDate: undefined,
          useDose: undefined,
          files: undefined,
        });
      };
      const deleteRecord = (i: number) => {
        listInfo.value.splice(i, 1);
        delete fileListMap.value[i];
      };
      // 文件上传
      const fileListMap = ref<{ [number: string]: any }>({});
      const uploadingMap = ref<{ [number: string]: boolean }>({});
      const handleDownload = (file: any, i: number) => {
        if (file?.url)
          window.open(
            `http://129.204.202.223:8001/basic-api/customer/file/download?path=${file.url}`,
          );
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
        console.log(345678, fileList)
        if (fileList?.length) {
          const formData = new FormData();
          fileList?.forEach((file) => {
            // @ts-ignore
            if (!file?.url) formData.append('files', file);
          });
          const res = await fileDUpload(formData);
          if (res) {
            message.success('上传成功');
            filesIdMap.value[i] = res;
          }
        }
      };
      return {
        drawerInfo: props.drawerInfo,
        listInfo,
        drawerOnClose,
        submit,
        // edit,
        add,
        deleteRecord,
        // 文件上传
        fileListMap,
        uploadingMap,
        handleRemove,
        handleDownload,
        beforeUpload,
        handleUpload,
      };
    },
  });
</script>
<style lang="less" scoped></style>
