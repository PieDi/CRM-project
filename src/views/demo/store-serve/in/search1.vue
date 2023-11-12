<template>
  <PageWrapper title="库存入库">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="材料名称">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.materialsName"
          />
        </FormItem>
        <!-- <FormItem label="材料编号" style="margin-left: 10px">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.productNumber"
          />
        </FormItem> -->
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
      <Button type="primary" style="margin-left: 10px" @click="addStoreIn">新增入库</Button>
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
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                editStoreIn(record);
              }
            "
            >编辑</Button
          >
        </template>
      </template>
    </Table>

    <Modal
      :mask-closable="false"
      :destroy-on-close="true"
      :title="drawerInfo.title"
      @cancel="drawerOnClose"
      @ok="submit"
      :width="900"
      :visible="drawerInfo.visible"
    >
      <Form :labelCol="{ span: 4 }" ref="inFormRef" :model="drawerInfo.item">
        <FormItem label="生产批号">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.batchNumber"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="有效期">
          <DatePicker
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.validity"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="代理商名称">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.agentName"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem
          label="入库日期"
          name="inDate"
          :rules="{
            required: true,
            message: '请选择入库日期',
            trigger: 'change',
          }"
        >
          <DatePicker
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.inDate"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="货架号">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.racksNumber"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="入库材料" style="margin-bottom: 0">
          <Button
            v-if="drawerInfo.type === 'add'"
            style="float: right"
            type="link"
            @click="addProduct"
            >新增</Button
          >
          <Space v-for="(p, i) of drawerInfo.item.materials" align="start">
            <FormItem
              label="材料名称"
              :name="['materials', i, 'id']"
              :rules="{
                required: true,
                message: '请选择产品名称',
                trigger: 'change',
              }"
            >
              <Select
                :show-search="true"
                :disabled="drawerInfo.type !== 'add'"
                placeholder="请选择"
                v-model:value="p.id"
                :style="{ width: '180px' }"
              >
                <SelectOption
                  v-for="item of pDataSource"
                  :key="`${item.name}-${item.number}`"
                  :value="item.id"
                  >{{ item.name }}</SelectOption
                >
              </Select>
            </FormItem>

            <FormItem
              label="入库数量"
              :name="['materials', i, 'amount']"
              :rules="{
                required: true,
                message: '请输入入库数量',
                trigger: 'change',
              }"
            >
              <InputNumber
                placeholder="请输入"
                allowClear
                v-model:value="p.amount"
                :disabled="drawerInfo.type === 'scan'"
              />
            </FormItem>

            <Button
              v-if="drawerInfo.type === 'add'"
              style="float: right"
              type="link"
              @click="
                () => {
                  deleteProduct(i);
                }
              "
            >
              <template #icon> <DeleteOutlined /> </template
            ></Button>
          </Space>
        </FormItem>

        <FormItem label="备注">
          <TextArea
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.remark"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
      </Form>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, onBeforeMount, createVNode, toRaw, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Space,
    Form,
    Input,
    Button,
    Modal,
    InputNumber,
    Select,
    DatePicker,
    message,
  } from 'ant-design-vue';
  import { PageListInfo } from '/@/views/type';
  import {
    type MaterialsInfo,
    getMaterialsList,
    getMaterialsInPage,
    saveMaterialsIn,
    updateMaterialsIn,
    deleteMaterialsIn,
  } from '/@/api/demo/materials';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;

  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Space,
      Form,
      FormItem,
      Input,
      Button,
      DatePicker,
      Modal,
      TextArea,
      Select,
      SelectOption,
      InputNumber,
      DeleteOutlined,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });
      const inFormRef = ref<FormInstance>();
      const drawerInfo = ref<any>({
        visible: false,
        type: undefined,
        title: '',
        item: {
          id: undefined,
          batchNumber: undefined,
          agentName: undefined,
          inDate: undefined,
          validity: undefined,
          racksNumber: undefined,
          materials: undefined,
          remark: undefined,
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
          pInListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const searchInfo = reactive({
        materialsName: undefined,
      });
      const pInListReq = async (pageNum: number) => {
        const res = await getMaterialsInPage({ ...searchInfo, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.materialsName = undefined;
        pInListReq(1);
      };
      const searchAction = () => {
        pInListReq(1);
      };
      onBeforeMount(() => {
        pInListReq(1);
        productReq();
      });

      const columns: ColumnsType<MaterialsInfo> = [
        {
          title: '入库日期',
          dataIndex: 'inDate',
          width: 200,
        },
        {
          title: '生产批号',
          dataIndex: 'batchNumber',
          width: 200,
        },
        {
          title: '有效期',
          dataIndex: 'validity',
          width: 200,
        },
        {
          title: '代理商名称',
          dataIndex: 'agentName',
          width: 200,
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      const pDataSource = ref<Array<MaterialsInfo>>([]);
      const productReq = async () => {
        const res = await getMaterialsList();
        if (res) {
          pDataSource.value = res;
        }
      };
      const addProduct = () => {
        const products = drawerInfo.value.item.materials || [];
        products?.push({
          productId: undefined,
          sum: undefined,
        });
        drawerInfo.value.item.materials = products;
      };
      const deleteProduct = (i: number) => {
        if (drawerInfo.value.item.materials?.length) {
          const products = [...drawerInfo.value.item.materials];
          products.splice(i, 1);
          drawerInfo.value.item.materials = products;
        }
      };
      const addStoreIn = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'add';
        drawerInfo.value.title = '新增入库';
        drawerInfo.value.item.materials = [
          {
            id: undefined,
            amount: undefined,
          },
        ];
      };
      const editStoreIn = (item: any) => {
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑入库';
        drawerInfo.value.visible = true;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
        if (item.inDate) {
          drawerInfo.value.item.inDate = dayjs(item.inDate, 'YYYY-MM-DD');
        }
        if (item.validity) {
          drawerInfo.value.item.validity = dayjs(item.validity, 'YYYY-MM-DD');
        }
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = undefined;
        });
      };
      const deleteIn = (item: MaterialsInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该入库',
            async onOk() {
              const res = await deleteMaterialsIn(item.id as number);
              if (res) {
                message.success('删除入库成功');
                pInListReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      const submit = async () => {
        inFormRef.value?.validate().then(async () => {
          let res;
          if (drawerInfo.value.type === 'add') {
            res = await saveMaterialsIn({ ...drawerInfo.value.item });
          } else {
            res = await updateMaterialsIn({ ...drawerInfo.value.item });
          }
          if (res) {
            message.success(drawerInfo.value.type === 'add' ? '新增入库成功' : '修改入库成功');
            pInListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
            drawerOnClose();
          }
        });
      };

      return {
        columns,
        resetAction,
        searchAction,
        pagination,
        pageInfo,
        drawerInfo,
        searchInfo,
        addStoreIn,
        editStoreIn,
        // scanStoreIn,
        drawerOnClose,
        deleteIn,
        submit,
        pDataSource,
        addProduct,
        deleteProduct,
        // validateInfos,
        authShow,
        inFormRef,
      };
    },
  });
</script>
<style lang="less" scoped></style>
