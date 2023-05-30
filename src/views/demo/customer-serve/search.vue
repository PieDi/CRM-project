<template>
  <PageWrapper title="客服信息管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="客服名称">
          <Input
            placeholder="请输入"
            allowClear
            :style="{ width: '150px' }"
            v-model:value="searchInfo.name"
          />
        </FormItem>
        <!-- <FormItem label="创建时间" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" />
        </FormItem> -->
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addCustomerServe">新增客服</Button>
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
                scanCustomerServe(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteCServe(record);
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
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="editCustomerServe"
          >编辑</Button
        >
        <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="客服名称">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="手机号码">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.mobile"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>
        <FormItem label="传真">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.fax"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="email">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.email"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="联系地址">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.contactAddress"
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
  import { defineComponent, ref, computed, onMounted,createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, message } from 'ant-design-vue';
  import { DrawerItemType, PageListInfo } from '/@/views/type';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import { getCustomerServePage, saveCustomerServe,updateCustomerServe, deleteCustomerServe } from '/@/api/demo/customer-serve';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CServeInfo } from '/@/api/demo/model/customer-serve';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;

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
    },
    setup() {
      const drawerInfo = ref<DrawerItemType<CServeInfo>>({
        visible: false,
        title: '',
        item: {
          contactAddress: undefined,
          email: undefined,
          fax: undefined,
          mobile: undefined,
          name: undefined,
          remark: undefined,
          id: undefined,
        },
      });
  
      const pageInfo = ref<PageListInfo<CServeInfo>>({
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
      const cServiceListReq = async (pageNum: number) => {
        const res = await getCustomerServePage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const searchAction = () => {
        cServiceListReq(1);
      };
      onMounted(() => {
        cServiceListReq(1);
      });

      const columns: ColumnsType<CServeInfo> = [
        {
          title: '客服名称',
          dataIndex: 'name',
        },
        {
          title: '手机号码',
          dataIndex: 'mobile',
        },
        {
          title: '传真',
          dataIndex: 'fax',
        },
        {
          title: 'email',
          dataIndex: 'email',
        },
        {
          title: '联系地址',
          dataIndex: 'contactAddress',
        },
        {
          title: '其他',
          dataIndex: 'remark',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addCustomerServe = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增客服';
        drawerInfo.value.type = 'add';
      };
      const scanCustomerServe = (item: CServeInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'scan';
        drawerInfo.value.title = '查看客服';

        drawerInfo.value.item.id = item.id;
        drawerInfo.value.item.name = item.name;
        drawerInfo.value.item.email = item.email;
        drawerInfo.value.item.mobile = item.mobile;
        drawerInfo.value.item.fax = item.fax;
        drawerInfo.value.item.contactAddress = item.contactAddress;
        drawerInfo.value.item.remark = item.remark;
      };
      const editCustomerServe = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.type = 'edit';
        drawerInfo.value.title = '编辑客服';
      };
      const deleteCServe = (item: CServeInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该客服',
            async onOk() {
              const res = await deleteCustomerServe(item.id as number);
              if (res) {
                message.success('删除客服成功');
                cServiceListReq(pageInfo.value.current);
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
        drawerInfo.value.item.email = undefined;
        drawerInfo.value.item.mobile = undefined;
        drawerInfo.value.item.fax = undefined;
        drawerInfo.value.item.contactAddress = undefined;
        drawerInfo.value.item.remark = undefined;
      };
      const submit = async () => {
        let res 
        if (drawerInfo.value.type === 'add') {
          // 新增客服
          res = await saveCustomerServe({...drawerInfo.value.item})
        } else {
          res = await updateCustomerServe({...drawerInfo.value.item})
        }
        if (res) { 
          message.success(drawerInfo.value.type === 'add' ? '新增客服成功' : '修改客服成功')
          cServiceListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose()
        }
      };
      return {
        columns,
        pagination,
        drawerInfo,
        pageInfo,
        addCustomerServe,
        scanCustomerServe,
        editCustomerServe,
        deleteCServe,
        drawerOnClose,
        submit,
        searchAction,
        searchInfo,
      };
    },
  });
</script>
<style lang="less" scoped></style>
