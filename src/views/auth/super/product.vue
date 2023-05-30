<template>
  <PageWrapper title="产品信息管理">
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
      <Button type="primary" style="margin-left: 10px" @click="addProduct">新增产品</Button>
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
                scanProduct(record);
              }
            "
            >查看</Button
          >
          <!-- <Button
            type="link"
            @click="
              () => {
                deleteCServe(record);
              }
            "
            >删除</Button
          > -->
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
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="editProduct"
          >编辑</Button
        >
        <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="产品名称">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="产品编号">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.number"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
    

        <FormItem label="产品类型">
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

      
        <FormItem label="产品描述">
          <TextArea
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.introduction"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
      </Form>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, onMounted,createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, Select,message } from 'ant-design-vue';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { getProductPage, saveProduct, updateProduct, removalProduct } from '/@/api/demo/product';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { ProductInfo } from '/@/api/demo/model/product';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;
const productTypeMap: Record<number, string> = {
  1: '标准产品',
  2: '非标准产品',
  3:'其他产品'
}
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
      SelectOption
    },
    setup() {
      const drawerInfo = ref<DrawerItemType<ProductInfo>>({
        visible: false,
        title: '',
        item: {
          number: undefined,
          introduction: undefined,
          name: undefined,
          type: undefined,
          id: undefined,
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
        onChange: (page: number) => {},
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const searchInfo = ref({
        name: undefined,
        number: undefined
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
        searchInfo.value.name = undefined
        searchInfo.value.number = undefined
        productListReq(1);
      }
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
        },
        {
          title: '产品编号',
          dataIndex: 'number',
        },
        {
          title: '产品类型',
          dataIndex: 'type',
          customRender:(state) => (productTypeMap[state.record.type as number])
        },
        {
          title: '产品描述',
          dataIndex: 'introduction',
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

        drawerInfo.value.item.id = item.id;
        drawerInfo.value.item.name = item.name;
        drawerInfo.value.item.number = item.number;
        drawerInfo.value.item.type = item.type;
        drawerInfo.value.item.introduction = item.introduction;
      };
      const editProduct = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑产品';
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

        drawerInfo.value.item.id = undefined;
        drawerInfo.value.item.name = undefined;
        drawerInfo.value.item.type = undefined;
        drawerInfo.value.item.number = undefined;
        drawerInfo.value.item.introduction = undefined;
      };
      const submit = async () => {
        let res 
        if (drawerInfo.value.type === 'add') {
          // 新增客服
          res = await saveProduct({...drawerInfo.value.item})
        } else {
          res = await updateProduct({...drawerInfo.value.item})
        }
        if (res) { 
          message.success(drawerInfo.value.type === 'add' ? '新增客服成功' : '修改客服成功')
          productListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose()
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
      };
    },
  });
</script>
<style lang="less" scoped></style>
