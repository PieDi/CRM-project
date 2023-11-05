<template>
  <PageWrapper title="库存查询">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="产品名称">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.name"
          />
        </FormItem>

        <FormItem label="产品编号" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.number"
          />
        </FormItem>

        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <!-- <Button type="primary" style="margin-left: 10px" @click="addProduct">新增产品</Button> -->
    </div>

    <Table
      :columns="columns"
      :dataSource="pageInfo.dataSource"
      :canResize="false"
      :striped="false"
      :bordered="true"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'introduction'">
          <Tooltip :title="record.introduction"
            ><div class="ellipsis">
              {{ record.introduction }}
            </div></Tooltip
          >
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                scanProduct(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                editProduct(record);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            danger
            @click="
              () => {
                deleteProduct(record);
              }
            "
            >删除</Button
          >
        </template>
      </template>
    </Table>

    <Modal
      :mask-closable="false"
      :destroy-on-close="true"
      :title="drawerInfo.title"
      placement="right"
      @cancel="drawerOnClose"
      @ok="submit"
      :visible="drawerInfo.visible"
      width="60%"
    >
      <Form :labelCol="{ span: 4 }">
        <FormItem label="产品名称" v-bind="validateInfos.name">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="产品编号" v-bind="validateInfos.number">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.number"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="产品类型" v-bind="validateInfos.type">
          <Select
            :disabled="drawerInfo.type === 'scan'"
            placeholder="请选择"
            v-model:value="drawerInfo.item.type"
          >
            <SelectOption :key="1">标准产品</SelectOption>
            <SelectOption :key="2">非标准产品</SelectOption>
            <SelectOption :key="3">其他产品</SelectOption>
          </Select>
        </FormItem>

        <FormItem label="产品原价">
          <InputNumber
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.originalPrice"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="产品售价" v-bind="validateInfos.price">
          <InputNumber
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.price"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="计量单位" v-bind="validateInfos.unit">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.unit"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="产品运费">
          <InputNumber
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.freight"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="积分兑换" v-bind="validateInfos.integral">
          <RadioGroup
            v-model:value="drawerInfo.item.integral"
            name="integral"
            :disabled="drawerInfo.type === 'scan'"
          >
            <Radio :value="2" name="integral">是</Radio>
            <Radio :value="1" name="integral">否</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="产品描述" v-bind="validateInfos.introduction">
          <TextArea
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.introduction"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="产品轮播图">
          <Upload
            :file-list="fileList"
            :customRequest="uploadAction"
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
                  type="link"
                  v-if="drawerInfo.type === 'scan'"
                  @click="
                    () => {
                      handlePreView(file);
                    }
                  "
                  >查看</Button
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
        </FormItem>

        <FormItem label="产品详情图">
          <Upload
            :file-list="fileList"
            :customRequest="uploadAction"
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
                  type="link"
                  v-if="drawerInfo.type === 'scan'"
                  @click="
                    () => {
                      handlePreView(file);
                    }
                  "
                  >查看</Button
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
        </FormItem>
      </Form>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, onMounted, createVNode, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Form,
    Input,
    InputNumber,
    Button,
    Modal,
    Select,
    message,
    RadioGroup,
    Radio,
    Upload,
    Tooltip,
  } from 'ant-design-vue';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { getProductPage, saveProduct, updateProduct, removalProduct } from '/@/api/demo/product';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { ProductInfo } from '/@/api/demo/model/product';
  import { fileMHUpload, fileMHDelete, getCustomerFileView } from '/@/api/demo/customer';
  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;
  const useForm = Form.useForm;
  const productTypeMap: Record<number, string> = {
    1: '标准产品',
    2: '非标准产品',
    3: '其他产品',
  };
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      InputNumber,
      Button,
      Modal,
      TextArea,
      Select,
      SelectOption,
      Upload,
      RadioGroup,
      Radio,
      Tooltip,
    },
    setup() {
      const drawerInfo = ref<DrawerItemType<ProductInfo>>({
        visible: false,
        title: '',
        item: {
          number: undefined,
          unit: undefined,
          introduction: undefined,
          name: undefined,
          type: undefined,
          id: undefined,
          originalPrice: undefined,
          price: undefined,
          freight: undefined,
          amount: undefined,
          integral: 2,
        },
      });

      const pageInfo = ref<PageListInfo<ProductInfo>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const pagination = computed(() => ({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          productListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const searchInfo = ref({
        name: undefined,
        number: undefined,
      });
      const productListReq = async (pageNum: number) => {
        const res = await getProductPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.value.name = undefined;
        searchInfo.value.number = undefined;
        productListReq(1);
      };
      const searchAction = () => {
        productListReq(1);
      };
      onMounted(() => {
        productListReq(1);
      });

      const columns: ColumnsType<ProductInfo> = [
        {
          title: '产品名称',
          dataIndex: 'name',
          width: 200,
        },
        {
          title: '产品编号',
          dataIndex: 'number',
          width: 160,
        },
        {
          title: '产品类型',
          dataIndex: 'type',
          width: 120,
          customRender: (state) => productTypeMap[state.record.type as number],
        },
        {
          title: '产品库存',
          dataIndex: 'amount',
          width: 120,
        },
        {
          title: '库存管理',
          dataIndex: 'amount',
          width: 120,
          customRender: (state) => (state.record.lowStocks ? '库存不足' : '库存充足'),
        },
        {
          title: '产品描述',
          width: '200px',
          dataIndex: 'introduction',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addProduct = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增产品';
        drawerInfo.value.type = 'add';
      };
      const scanProduct = (item: ProductInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'scan';
        drawerInfo.value.title = '查看产品';
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
      };
      const editProduct = (item: ProductInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑产品';
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
      };
      const deleteProduct = (item: ProductInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该产品',
            async onOk() {
              const res = await removalProduct(item.id as number);
              if (res) {
                message.success('删除产品成功');
                productListReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = undefined;
        });
      };
      const submit = async () => {
        validate().then(async () => {
          let res;
          if (drawerInfo.value.type === 'add') {
            // 新增客服
            res = await saveProduct({ ...drawerInfo.value.item });
          } else {
            res = await updateProduct({ ...drawerInfo.value.item });
          }
          if (res) {
            message.success(drawerInfo.value.type === 'add' ? '新增产品成功' : '修改产品成功');
            productListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
            drawerOnClose();
          }
        });
      };
      const rulesRef = reactive({
        name: [
          {
            required: true,
            message: '请输入产品名称',
          },
        ],
        number: [
          {
            required: true,
            message: '请输入产品编号',
          },
        ],
        introduction: [
          {
            required: true,
            message: '请输入产品描述',
          },
        ],
        price: [
          {
            required: true,
            message: '请输入产品价格',
          },
        ],
        type: [
          {
            required: true,
            message: '请选择产品类型',
          },
        ],
        unit: [
          {
            required: true,
            message: '请输入计量单位',
          },
        ],
      });
      const { validate, validateInfos } = useForm(drawerInfo.value.item, rulesRef);

      // 文件上传
      const fileList = ref<any[]>([]);
      const handleRemove = async (file: any) => {
        if (file?.url) {
          const res = await fileMHDelete(file?.id);
          if (res) message.success('删除成功');
        }
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
      const handleDownload = async (file: any) => {
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
      const filesId = ref<any[]>([]);
      const uploadAction = async (o: any) => {
        const fileData = new FormData();
        fileData.append('files', o.file);
        const res = await fileMHUpload(fileData);
        if (res) {
          //@ts-ignore
          fileList.value = [...fileList.value, o.file];
          filesId.value.push(res[0]);
        }
      };

      return {
        columns,
        pagination,
        drawerInfo,
        pageInfo,
        addProduct,
        scanProduct,
        editProduct,
        deleteProduct,
        drawerOnClose,
        submit,
        resetAction,
        searchAction,
        searchInfo,
        validateInfos,
        // 文件上传
        fileList,
        handleRemove,
        handleDownload,
        handlePreView,
        uploadAction,
      };
    },
  });
</script>
<style lang="less" scoped>
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
</style>
