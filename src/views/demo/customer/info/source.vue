<template>
  <PageWrapper title="客户来源">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="来源名称">
          <Input
            placeholder="请输入"
            v-model:value="searchInfo.name"
            allowClear
            :style="{ width: '150px' }"
          />
        </FormItem>
        <Button type="primary" style="margin-left: 10px" @click="resetAction">重置</Button>
        <Button type="primary" style="margin-left: 10px" @click="searchAction">搜索</Button>
      </div>
      <Button type="primary" style="margin-left: 10px" @click="addSource">新增客户来源</Button>
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
                editGroup(record);
              }
            "
            >查看</Button
          >
          <Button
            type="link"
            @click="
              () => {
                drawerEdit(record);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteGroup(record);
              }
            "
            >删除</Button
          >
        </template></template
      >
    </Table>

    <Modal
      :mask-closable="false"
      :destroy-on-close="true"
      :title="drawerInfo.title"
      @cancel="drawerOnClose"
      @ok="submit"
      width="60%"
      :visible="drawerInfo.visible"
    >
      <Form :labelCol="{ span: 4 }">
        <FormItem label="来源名称">
          <Input
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.name"
            :disabled="drawerInfo.type === 'scan'"
          />
        </FormItem>

        <FormItem label="来源描述">
          <TextArea
            placeholder="请输入"
            allowClear
            v-model:value="drawerInfo.item.description"
            :disabled="drawerInfo.type === 'scan'"
          /> </FormItem
      ></Form>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Modal, message } from 'ant-design-vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import {
    getCustomerSPage,
    saveCustomerS,
    updateCustomerS,
    deleteCustomerS,
  } from '/@/api/demo/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerSourceInfo } from '/@/api/demo/model/customer';

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
      Modal,
      TextArea,
    },
    setup() {
      const drawerInfo = ref<DrawerItemType<CustomerSourceInfo>>({
        visible: false,
        title: '',
        item: {
          id: undefined,
          description: undefined,
          name: undefined,
        },
      });
      const groupInfo = ref<{
        name: string;
        id?: number | string;
        des: string;
      }>({
        name: '',
        id: undefined,
        des: '',
      });

      const searchInfo = ref({
        name: undefined,
      });
      const pageInfo = ref<PageListInfo<CustomerSourceInfo>>({
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
          customerSourceReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const customerSourceReq = async (pageNum: number) => {
        const res = await getCustomerSPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => {
        searchInfo.value.name = undefined;
        customerSourceReq(1);
      };
      const searchAction = () => {
        customerSourceReq(1);
      };
      onMounted(() => {
        customerSourceReq(1);
      });

      const columns: ColumnsType<CustomerSourceInfo> = [
        {
          title: '来源名称',
          dataIndex: 'name',
        },
        {
          title: '来源描述',
          dataIndex: 'description',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addSource = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增来源';
        drawerInfo.value.type = 'add';
      };
      const editGroup = (item: CustomerSourceInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看来源';
        drawerInfo.value.type = 'scan';
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
      };
      const drawerEdit = (item: CustomerSourceInfo) => {
        drawerInfo.value.title = '编辑来源';
        drawerInfo.value.type = 'edit';
        drawerInfo.value.visible = true;
        Object.keys(drawerInfo.value.item).forEach((key) => {
          drawerInfo.value.item[key] = item[key];
        });
      };
      const submit = async () => {
        let res;
        if (drawerInfo.value.type === 'add') {
          res = await saveCustomerS({ ...drawerInfo.value.item });
        } else {
          res = await updateCustomerS({ ...drawerInfo.value.item });
        }
        if (res) {
          message.success(
            drawerInfo.value.type === 'add' ? '新增客户分组成功' : '修改客户分组成功',
          );
          customerSourceReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose();
        }
      };

      const deleteGroup = (item: CustomerSourceInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该来源',
            async onOk() {
              const res = await deleteCustomerS(item.id as number);
              if (res) {
                message.success('删除客户来源成功');
                customerSourceReq(pageInfo.value.current);
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
      return {
        columns,
        pagination,
        pageInfo,
        searchInfo,
        addSource,
        drawerInfo,
        drawerEdit,
        submit,
        drawerOnClose,
        groupInfo,
        editGroup,
        deleteGroup,
        resetAction,
        searchAction,
      };
    },
  });
</script>
<style lang="less" scoped></style>
