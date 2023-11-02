<template>
  <PageWrapper title="库存查询">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="材料名称">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.name"
          />
        </FormItem>

        <FormItem label="材料编号" style="margin-left: 10px">
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
      <Button type="primary" style="margin-left: 10px" @click="addProduct">新增材料</Button>
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
          <!-- <Button
            type="link"
            @click="
              () => {
                scanProduct(record);
              }
            "
            >查看</Button
          > -->
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
        <FormItem label="品牌" >
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.brand"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="材料名称" v-bind="validateInfos.name">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="材料编号">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.number"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="计量单位" v-bind="validateInfos.unit">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.unit"
          />
        </FormItem>
      </Form>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, onBeforeMount, createVNode, reactive } from 'vue';
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
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { type MaterialsInfo, getMaterialsPage, saveMaterials, updateMaterials, removeMaterials } from '/@/api/demo/materials';
  
  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;
  const useForm = Form.useForm;

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
      const drawerInfo = ref<DrawerItemType<MaterialsInfo>>({
        visible: false,
        title: '',
        item: {
          number: undefined,
          unit: undefined,
          brand: undefined,
          name: undefined,
          id: undefined,
        },
      });

      const pageInfo = ref<PageListInfo<MaterialsInfo>>({
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
        const res = await getMaterialsPage({ ...searchInfo.value, pageNum });
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
      onBeforeMount(() => {
        productListReq(1);
      });

      const columns: ColumnsType<MaterialsInfo> = [
        {
          title: '品牌',
          dataIndex: 'brand',
          width: 120
        },
        {
          title: '材料名称',
          dataIndex: 'name',
          width: 200,
        },
        {
          title: '材料编号',
          dataIndex: 'number',
          width: 160,
        },
        {
          title: '计量单位',
          dataIndex: 'unit',
          width: 120,
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      const addProduct = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增材料';
        drawerInfo.value.type = 'add';
      };

      const editProduct = (item: MaterialsInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑材料';
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
      };
      const deleteProduct = (item: MaterialsInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该材料',
            async onOk() {
              const res = await removeMaterials(item.id as number);
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
            res = await saveMaterials({ ...drawerInfo.value.item });
          } else {
            res = await updateMaterials({ ...drawerInfo.value.item });
          }
          if (res) {
            message.success(drawerInfo.value.type === 'add' ? '新增材料成功' : '修改材料成功');
            productListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
            drawerOnClose();
          }
        });
      };
      const rulesRef = reactive({
        name: [
          {
            required: true,
            message: '请输入材料名称',
          },
        ]
      });
      const { validate, validateInfos } = useForm(drawerInfo.value.item, rulesRef);

      return {
        columns,
        pagination,
        drawerInfo,
        pageInfo,
        addProduct,
        // scanProduct,
        editProduct,
        deleteProduct,
        drawerOnClose,
        submit,
        resetAction,
        searchAction,
        searchInfo,
        validateInfos,
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
