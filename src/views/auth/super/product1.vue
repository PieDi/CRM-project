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
          <Button
            type="link"
            @click="
              () => {
                editProduct(record);
              }
            "
            >详情</Button
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
      :width="800"
    >
      <Form :labelCol="{ span: 4 }">
        <FormItem label="类别" v-bind="validateInfos.types">
          <Cascader
            placeholder="请输入"
            allowClear
            :options="typeOptions"
            v-model:value="drawerInfo.item.types"
            :disabled="drawerInfo.type !== 'add'"
          />
        </FormItem>

        <FormItem label="名称" v-bind="validateInfos.name">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
            :disabled="drawerInfo.type !== 'add'"
          />
        </FormItem>

        <FormItem label="品牌">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.brand"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="厂家货号">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.number"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="规格">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.specification"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="单位" v-bind="validateInfos.unit">
          <Input placeholder="请输入" allowClear v-model:value="drawerInfo.item.unit" />
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
    Cascader,
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
  import {
    type MaterialsInfo,
    getMaterialsTypes,
    getMaterialsPage,
    saveMaterials,
    updateMaterials,
    removeMaterials,
  } from '/@/api/demo/materials';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;
  const useForm = Form.useForm;

  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      Cascader,
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
      const drawerInfo = reactive<DrawerItemType<MaterialsInfo>>({
        visible: false,
        title: '',
        item: {
          types: undefined,
          number: undefined,
          unit: undefined,
          specification: undefined,
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
      const typeOptions = ref();
      onBeforeMount(async () => {
        productListReq(1);
        const res = await getMaterialsTypes();
        if (res) {
          const a = [];
          res?.forEach((l) => {
            const b = [];
            l?.child?.forEach((m) => {
              const c = [];
              m?.child?.forEach((n) => {
                //@ts-ignore
                c.push({ label: n.name, value: n.id });
              });
              //@ts-ignore
              b.push({ label: m.name, value: m.id, children: c });
            });
            //@ts-ignore
            a.push({ label: l.name, value: l.id, children: b });
          });
          typeOptions.value = a
        }
      });

      const columns: ColumnsType<MaterialsInfo> = [
        {
          title: '类别',
          dataIndex: 'typeName',
          width: 200,
        },
        {
          title: '名称',
          dataIndex: 'name',
          width: 200,
        },
        {
          title: '品牌',
          dataIndex: 'brand',
          width: 200,
        }, 
        {
          title: '厂家货号',
          dataIndex: 'number',
          width: 160,
        },
        {
          title: '库存',
          dataIndex: 'amount',
          width: 120,
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      const addProduct = () => {
        drawerInfo.visible = true;
        drawerInfo.title = '新增材料';
        drawerInfo.type = 'add';
        clearValidate()
      };
      const drawerOnClose = () => {
        drawerInfo.visible = false;
        drawerInfo.title = '';
        drawerInfo.type = undefined;
        Object.keys(drawerInfo.item).forEach((key) => {
          drawerInfo.item[key] = undefined;
        });
      };
      const editProduct = (item: MaterialsInfo) => {
        drawerInfo.visible = true;
        drawerInfo.type = 'edit';
        drawerInfo.title = '编辑材料';
        Object.keys(drawerInfo.item).forEach((key) => {
          drawerInfo.item[key] = item[key];
        });
        clearValidate()
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
      
      const submit = async () => {
        validate().then(async () => {
          let res;
          if (drawerInfo.type === 'add') {
            // 新增客服
            res = await saveMaterials({ ...drawerInfo.item });
          } else {
            res = await updateMaterials({ ...drawerInfo.item });
          }
          if (res) {
            message.success(drawerInfo.type === 'add' ? '新增材料成功' : '修改材料成功');
            productListReq(drawerInfo.type === 'add' ? 1 : pageInfo.value.current);
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
        ],
        types: [
          {
            required: true,
            message: '请选择材料类别',
          },
        ],
      });
      const { validate, validateInfos, clearValidate } = useForm(drawerInfo.item, rulesRef);

      return {
        columns,
        pagination,
        drawerInfo,
        pageInfo,
        typeOptions,
        addProduct,
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
