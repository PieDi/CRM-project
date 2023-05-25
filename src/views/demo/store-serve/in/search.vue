<template>
  <PageWrapper title="入库管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="产品名称">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" />
        </FormItem>
        <!-- <FormItem label="客户标签" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear />
        </FormItem> -->
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
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
      <template #bodyCell="{ column, _text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                scanStoreIn(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteStoreIn(record);
              }
            "
            >删除</Button
          >
        </template>
      </template>
    </Table>
    <Drawer
      :mask-closable="false"
      :destroy-on-close="true"
      :title="drawerInfo.title"
      placement="right"
      @close="drawerOnClose"
      :visible="drawerInfo.visible"
    >
      <template #extra>
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="editStoreIn">编辑</Button>
        <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="订单产品">
          <Select
            :show-search="true"
            :disabled="drawerInfo.type !== 'add'"
            placeholder="请选择"
            :filter-option="pFilterOption"
            v-model:value="drawerInfo.item.productId"
          >
            <SelectOption
              v-for="item of pDataSource"
              :key="`${item.id}-${item.name}`"
              :value="item.id"
              >{{ item.name }}</SelectOption
            >
          </Select>
        </FormItem>

        <FormItem label="入库批次">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.batch"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="入库数量">
          <InputNumber
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.amount"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="单位">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.unit"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="其他">
          <TextArea
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.remark"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref,computed, onMounted } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, InputNumber,Select, message } from 'ant-design-vue';
  import { DrawerItemType,PageListInfo } from '/@/views/type';
  import { ProductInfo,ProductInInfo } from '/@/api/demo/model/product';
  import { getProductList,getProductInPage,updateProductIn,saveProductIn } from '/@/api/demo/product';
  import { type ColumnsType } from 'ant-design-vue/lib/table';

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
      Drawer,
      TextArea,
      Select,
      SelectOption,
      InputNumber
    },
    setup() {
      const drawerInfo = ref<
        DrawerItemType<{
          id: number | undefined;
          amount: number | undefined;
          batch: string | undefined;
          productId: number | undefined;
          unit: string | undefined;
          remark: string | undefined;
        }>
      >({
        visible: false,
        title: '',
        item: {
          id: undefined,
          amount: undefined,
          batch: undefined,
          productId: undefined,
          unit: undefined,
          remark: undefined,
        },
      });    

      const pageInfo = ref<PageListInfo<ProductInInfo>>({
        total: 0,
        current: 1,
        dataSource: [],
      });
      const pagination = computed(() => ({
        total: pageInfo.value.total,
        current: pageInfo.value.current,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {},
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const searchInfo = ref({
        name: undefined,
      });
      const pInListReq = async (pageNum: number) => {
        const res = await getProductInPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const searchAction = () => {
        pInListReq(1);
      };
      onMounted(() => {
        pInListReq(1);
      });

      const columns: ColumnsType<ProductInInfo> = [
        {
          title: '入库时间',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '入库批次',
          dataIndex: 'address',
        },
        {
          title: '产品编号',
          dataIndex: 'no',
        },
        {
          title: '产品名称',
          dataIndex: 'beginTime',
        },
        {
          title: '其他',
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const pDataSource = ref<Array<ProductInfo>>([]);
      const productReq = async () => {
        const res = await getProductList();
        if (res) {
          pDataSource.value = res;
        }
      };

      const pFilterOption = (input: string, option: any) => {
        return (
          option.key.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
          option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
        );
      };
      const addStoreIn = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'add';
        drawerInfo.value.title = '新增入库';
        productReq()
      };
      const scanStoreIn = (item:ProductInInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.item = item;
        drawerInfo.value.type = 'scan';
        drawerInfo.value.title = '查看入库';

        drawerInfo.value.item.id = item.id;
        drawerInfo.value.item.amount = item.amount;
        drawerInfo.value.item.batch = item.batch;
        drawerInfo.value.item.productId = item.productId;
        drawerInfo.value.item.unit = item.unit;
        drawerInfo.value.item.remark = item.remark;

        productReq()
      };
      const editStoreIn = () => {
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑入库';
      };
      const deleteStoreIn = (item:ProductInInfo) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';

        drawerInfo.value.item.id = undefined;
        drawerInfo.value.item.amount = undefined;
        drawerInfo.value.item.batch = undefined;
        drawerInfo.value.item.productId = undefined;
        drawerInfo.value.item.unit = undefined;
        drawerInfo.value.item.remark = undefined;
      };
      const submit =async () => {
        let res 
        if (drawerInfo.value.type === 'add') {
          // 新增客服
          res = await saveProductIn({...drawerInfo.value.item})
        } else {
          res = await updateProductIn({...drawerInfo.value.item})
        }
        if (res) { 
          message.success(drawerInfo.value.type === 'add' ? '新增客服成功' : '修改客服成功')
          pInListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose()
        }
      };
      return {
        columns,
        searchAction,
        pagination,
        pageInfo,
        drawerInfo,
        addStoreIn,
        editStoreIn,
        scanStoreIn,
        deleteStoreIn,
        drawerOnClose,
        submit,
        pDataSource,
        pFilterOption,
      };
    },
  });
</script>
<style lang="less" scoped></style>
