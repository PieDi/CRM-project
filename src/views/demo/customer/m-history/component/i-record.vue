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
              <DatePicker :show-time="true" v-model:value="item.checkDate" />
            </FormItem>
            <FormItem label="检查机构">
              <Input placeholder="请输入" allowClear v-model:value="item.checkMechanism" />
            </FormItem>
            <FormItem label="检查部位">
              <Input placeholder="请输入" allowClear v-model:value="item.checkPart" />
            </FormItem>

            <FormItem label="检查类别">
              <Select placeholder="请选择" allowClear v-model:value="item.checkType">
                <SelectOption :key="1">CT</SelectOption>
                <SelectOption :key="2">MR</SelectOption>
                <SelectOption :key="3">PET-CT</SelectOption>
                <SelectOption :key="4">PET-MR</SelectOption>
                <SelectOption :key="5">超声</SelectOption>
                <SelectOption :key="6">钼靶</SelectOption>
                <SelectOption :key="7">ECT</SelectOption>
                <SelectOption :key="8">DR</SelectOption>
              </Select>
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
    Select,
    DatePicker,
    Space,
    message,
    Upload,
  } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import { DrawerItemType } from '/@/views/type';
  import dayjs, { Dayjs } from 'dayjs';
  import {
    getCustomerIList,
    saveCustomerI,
    updateCustomerI,
    fileIUpload,
    fileIDelete,
  } from '/@/api/demo/customer';
  import { CustomerIInfo } from '/@/api/demo/model/customer';
  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  export default defineComponent({
    components: {
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Modal,
      Select,
      SelectOption,
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
          checkPart: string | undefined;
          checkType: string | undefined;
          checkDate: Dayjs | undefined;
        }>
      >([]);
      const iDataSource = ref<Array<CustomerIInfo>>([]);
      const dListReq = async () => {
        if (props.drawerInfo.item) {
          const res = await getCustomerIList(props.drawerInfo.item);
          if (res) {
            iDataSource.value = res;
            const list: Array<any> = [];
            res.forEach((item, i) => {
              list.push({
                id: item?.id,
                checkMechanism: item?.checkMechanism,
                checkType: item?.checkType,
                checkPart: item.checkPart,
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
        if (!iDataSource.value.length && !listInfo.value.length) {
          message.warn('暂未添加用药记录');
          return;
        }
        const list = listInfo.value.map((item, i) => {
          const t = {
            id: item.id,
            diseaseId: props.drawerInfo.item,
            checkMechanism: item.checkMechanism,
            checkType: item.checkType,
            checkPart: item.checkPart,
            checkDate: item.checkDate ? item.checkDate.valueOf() : undefined,
          };
          const mF = filesIdMap.value[i].filter((id) => !!id);
          // @ts-ignore
          t.fileIds = mF;
          return t;
        });
        const params = {
          list,
          diseaseId: props.drawerInfo.item,
        };
        let res;
        if (iDataSource.value.length) {
          res = await updateCustomerI(params);
        } else {
          res = await saveCustomerI(params);
        }

        if (res) {
          message.success('影像记录录入成功');
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
        listInfo.value.push({
          id: undefined,
          checkMechanism: undefined,
          checkPart: undefined,
          checkType: undefined,
          checkDate: undefined,
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
          const res = await fileIDelete(file?.id);
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
        const res = await fileIUpload(fileData);
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
