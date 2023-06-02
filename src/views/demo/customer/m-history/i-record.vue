<template>
  <Drawer :mask-closable="false" :destroy-on-close="true" :title="drawerInfo.title" placement="right"
    @close="drawerOnClose" :visible="drawerInfo.visible">
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
            <FormItem label="检查日期">
              <DatePicker :show-time="true" v-model:value="item.checkDate" :disabled="drawerInfo.type === 'scan'" />
            </FormItem>
            <FormItem label="检查机构">
              <Input placeholder="请输入" allowClear v-model:value="item.checkMechanism"
                :disabled="drawerInfo.type === 'scan'" />
            </FormItem>
            <FormItem label="检查部位">
              <Input placeholder="请输入" allowClear v-model:value="item.checkPart" :disabled="drawerInfo.type === 'scan'" />
            </FormItem>

            <FormItem label="检查类别">
              <Select placeholder="请选择" allowClear v-model:value="item.checkType" :disabled="drawerInfo.type === 'scan'">
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
              <Upload :file-list="fileListMap[i]" :before-upload="(file) => {
                  beforeUpload(file, i);
                  return false;
                }
                " :disabled="drawerInfo.type === 'scan'">
                <Button :disabled="drawerInfo.type === 'scan'">选择</Button>
                <template #itemRender="{ file, actions }">
                  <span :style="file.status === 'error' ? 'color: red' : ''">{{ file.name }}</span>
                  <Space>
                    <Button type="link" v-if="drawerInfo.type === 'scan'" @click="() => {
                        handleDownload(file, i);
                      }
                      ">下载</Button>
                    <Button v-if="drawerInfo.type !== 'scan'" type="link" @click="() => {
                        handleRemove(file, i);
                      }
                      ">删除</Button>
                  </Space>
                </template>
              </Upload>
              <Button v-if="drawerInfo.type !== 'scan'" @click="() => {
                  handleUpload(i);
                }
                " type="link" :loading="uploadingMap[i]">{{ uploadingMap[i] ? '上传中' : '上传' }}</Button>
            </FormItem>

            <template v-if="i !== 0">
              <Button type="link" @click="() => {
                  deleteRecord(i);
                }
                ">
                <template #icon>
                  <DeleteOutlined />
                </template></Button>
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
  Select,
  DatePicker,
  Space,
  message,
  Upload,
} from 'ant-design-vue';
import { DeleteOutlined } from '@ant-design/icons-vue';
import { DrawerItemType } from '/@/views/type';
import type { UploadProps } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import {
  getCustomerIList,
  saveCustomerI,
  updateCustomerI,
  fileIUpload,
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
    Drawer,
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
            item.files?.forEach((file, j) => {
              t.push({
                uid: j,
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
    const editAble = ref(false);
    const drawerOnClose = () => {
      emit('drawerOnClose');
    };
    const submit = async () => {
      if (listInfo.value.length) {
        const params = listInfo.value.map((item, i) => {
          const t = {
            id: item.id,
            diseaseId: props.drawerInfo.item,
            checkMechanism: item.checkMechanism,
            checkType: item.checkType,
            checkPart: item.checkPart,
            checkDate: item.checkDate ? item.checkDate.valueOf() : undefined,
          };
          const mF = filesIdMap.value[i];
          // 编辑数据
          if (iDataSource.value.length) {
            if (mF && mF.length) {
              // @ts-ignore
              t.newFiles = {
                id: item.id,
                fileIds: mF,
              };
            }
          } else {
            // @ts-ignore
            t.fileIds = mF;
          }
          return t;
        });
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
    const fileListMap = ref<{ [number: string]: UploadProps['fileList'] }>({});
    const uploadingMap = ref<{ [number: string]: boolean }>({});
    const handleDownload = (file: any, i: number) => {
      if (file.url) window.open(file.url);
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
        const res = await fileIUpload(formData);
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
