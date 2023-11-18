<template>
  <PageWrapper title="库存出库">
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
        <!-- <FormItem label="产品编号" style="margin-left: 10px">
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
      <Button type="primary" style="margin-left: 10px" @click="addStoreOut">新增出库</Button>
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
          <!-- <Button
            type="link"
            @click="
              () => {
                scanStoreOut(record);
              }
            "
            >查看</Button
          > -->
          <Button
            type="link"
            @click="
              () => {
                editStoreOut(record);
              }
            "
            >编辑</Button
          >
          <!-- <Button v-if="authShow" type="link" danger @click="() => {}">删除</Button> -->
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
      <Form :labelCol="{ span: 4 }" ref="outFormRef" :model="drawerInfo.item">
        <FormItem label="代理商名称">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.agentName"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem
          label="出库日期"
          name="outDate"
          :rules="{
            required: true,
            message: '请选择出库日期',
            trigger: 'change',
          }"
        >
          <DatePicker
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.outDate"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="出库材料" style="margin-bottom: 0">
          <Button
            v-if="drawerInfo.type === 'add'"
            style="float: right"
            type="link"
            @click="addProduct"
            >新增</Button
          >
          <div v-for="(p, i) of drawerInfo.item.materials">
            <Space align="start">
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
                <template #icon>
                  <DeleteOutlined /> </template
              ></Button>
            </Space>
            <Space align="start">
              <FormItem label="生产批号">
                <Input
                  placeholder="请输入"
                  allowClear
                  v-model:value="p.batchNumber"
                  :disabled="drawerInfo.type === 'scan'"
                />
              </FormItem>

              <FormItem label="货架号">
                <Input
                  placeholder="请输入"
                  allowClear
                  v-model:value="p.racksNumber"
                  :disabled="drawerInfo.type === 'scan'"
                />
              </FormItem>
            </Space>
            <Space align="start">
              <FormItem label="有效期">
                <DatePicker
                  placeholder="请输入"
                  allowClear
                  v-model:value="p.validity"
                  :disabled="drawerInfo.type === 'scan'"
                />
              </FormItem>
            </Space>
          </div>
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
  import { defineComponent, ref, computed, onBeforeMount, reactive, toRaw } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Table,
    Form,
    Input,
    Button,
    Modal,
    InputNumber,
    Select,
    DatePicker,
    Space,
    message,
  } from 'ant-design-vue';
  import { PageListInfo } from '/@/views/type';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import {
    type MaterialsInfo,
    getMaterialsList,
    getMaterialsOutPage,
    saveMaterialsOut,
    updateMaterialsOut,
  } from '/@/api/demo/materials';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import type { FormInstance } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import { DeleteOutlined } from '@ant-design/icons-vue';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;

  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Modal,
      TextArea,
      Select,
      SelectOption,
      InputNumber,
      DeleteOutlined,
      DatePicker,
      Space,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER].includes(role));
      });
      const outFormRef = ref<FormInstance>();
      const drawerInfo = ref<any>({
        visible: false,
        title: '',
        item: {
          id: undefined,
          agentName: undefined,
          outDate: undefined,
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
          pOutListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const searchInfo = reactive({
        materialsName: undefined,
      });
      const pOutListReq = async (pageNum: number) => {
        const res = await getMaterialsOutPage({ ...searchInfo, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.materialsName = undefined;
        pOutListReq(1);
      };
      const searchAction = () => {
        pOutListReq(1);
      };
      onBeforeMount(() => {
        pOutListReq(1);
        productReq();
      });

      const columns: ColumnsType<MaterialsInfo> = [
        {
          title: '出库日期',
          dataIndex: 'outDate',
          width: 200,
        },
        {
          title: '代理商名称',
          dataIndex: 'agentName',
          width: 200,
        },
        {
          title: '备注',
          dataIndex: 'remark',
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
          batchNumber: undefined,
          validity: undefined,
          racksNumber: undefined,
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

      const addStoreOut = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'add';
        drawerInfo.value.title = '新增出库';
        drawerInfo.value.item.materials = [
          {
            id: undefined,
            amount: undefined,
            batchNumber: undefined,
            validity: undefined,
            racksNumber: undefined,
          },
        ];
      };

      const editStoreOut = (item: any) => {
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑出库';
        drawerInfo.value.visible = true;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
        if (item.outDate) {
          drawerInfo.value.item.outDate = dayjs(item.outDate, 'YYYY-MM-DD');
        }
        drawerInfo.value.item.materials = item?.materials?.map((m) => ({
          ...m,
          validity: m.validity ? dayjs(m.validity, 'YYYY-MM-DD') : undefined,
        }));
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
        outFormRef.value?.validate().then(async () => {
          const params = {
            ...drawerInfo.value.item,
            inDate: drawerInfo.value.item.inDate?.format('YYYY-MM-DD'),
            materials: drawerInfo.value.item?.materials?.map((m) => ({
              ...m,
              validity: m.validity?.format('YYYY-MM-DD'),
            })),
          };
          let res;
          if (drawerInfo.value.type === 'add') {
            res = await saveMaterialsOut(params);
          } else {
            res = await updateMaterialsOut(params);
          }
          if (res) {
            message.success(drawerInfo.value.type === 'add' ? '新增出库成功' : '修改出库成功');
            pOutListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
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
        addStoreOut,
        // scanStoreOut,
        editStoreOut,
        drawerOnClose,
        submit,
        // 产品
        pDataSource,
        authShow,
        outFormRef,
        addProduct,
        deleteProduct,
      };
    },
  });
</script>
<style lang="less" scoped></style>
