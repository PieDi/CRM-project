<template>
  <PageWrapper title="客户分组">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="分组名称">
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
      <Button type="primary" style="margin-left: 10px" @click="addGroup">新增分组</Button>
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
                editGroup(record);
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
    <Drawer
      :title="drawerInfo.title"
      placement="right"
      @close="drawerOnClose"
      :visible="drawerInfo.visible"
    >
      <template #extra>
        <Button v-if="drawerInfo.type === 'scan'" type="link" @click="drawerEdit">编辑</Button>

        <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
      </template>
      <FormItem label="小组分类">
        <Select
          placeholder="请选择"
          v-model:value="drawerInfo.item.type"
          :disabled="drawerInfo.type === 'scan'"
        >
          <SelectOption :key="1">个人客户</SelectOption>
          <SelectOption :key="2">企业客户</SelectOption>
          <SelectOption :key="3">其他</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="分组名称">
        <Input
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.name"
          :disabled="drawerInfo.type === 'scan'"
        />
      </FormItem>

      <FormItem label="分组描述" v-if="drawerInfo.item.type">
        <TextArea
          v-if="drawerInfo.item.type === 3"
          placeholder="请输入"
          allowClear
          v-model:value="drawerInfo.item.description"
          :disabled="drawerInfo.type === 'scan'"
        />
        <Select
          v-else
          placeholder="请选择"
          v-model:value="drawerInfo.item.description"
          :disabled="drawerInfo.type === 'scan'"
        >
          <SelectOption :key="1.1" value="干细胞客户">干细胞客户</SelectOption>
          <SelectOption :key="1.2" value="免疫细胞客户">免疫细胞客户</SelectOption>
          <SelectOption :key="1.3" value="其他细胞客户">其他细胞客户</SelectOption>
          <SelectOption :key="2" value="就医服务客户">就医服务客户</SelectOption>
          <SelectOption :key="3" value="体验客户">体验客户</SelectOption>
          <SelectOption :key="4" value="其他">其他</SelectOption>
        </Select>
      </FormItem>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, createVNode, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer, Select, message } from 'ant-design-vue';
  import { type DrawerItemType, PageListInfo } from '/@/views/type';
  import {
    getCustomerGPage,
    saveCustomerG,
    updateCustomerG,
    deleteCustomerG,
  } from '/@/api/demo/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { CustomerGroupInfo } from '/@/api/demo/model/customer';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const SelectOption = Select.Option;
  const groupTypeMap: Record<number, string> = {
    1: '个人客户',
    2: '企业客户',
    3: '其他',
  };
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      FormItem,
      Input,
      Button,
      Drawer,
      TextArea,
      Select,
      SelectOption,
    },
    setup() {
      const drawerInfo = ref<DrawerItemType<CustomerGroupInfo>>({
        visible: false,
        title: '',
        item: {
          id: undefined,
          type: undefined,
          description: undefined,
          name: undefined,
        },
      });
      const groupInfo = ref<{
        name: string;
        id?: number | string;
        des: string;
        type: number | undefined;
      }>({
        type: undefined,
        name: '',
        id: undefined,
        des: '',
      });

      const searchInfo = ref({
        name: undefined,
      });
      const pageInfo = ref<PageListInfo<CustomerGroupInfo>>({
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
          customerListReq(page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      }));
      const customerListReq = async (pageNum: number) => {
        const res = await getCustomerGPage({ ...searchInfo.value, pageNum });
        if (res) {
          pageInfo.value.total = res.total;
          pageInfo.value.current = res.pageNum;
          pageInfo.value.dataSource = res.data;
        }
      };
      const resetAction = () => { 
        searchInfo.value.name = undefined
        customerListReq(1);
      }
      const searchAction = () => {
        customerListReq(1);
      };
      onMounted(() => {
        customerListReq(1);
      });

      const columns: ColumnsType<CustomerGroupInfo> = [
        {
          title: '分组名称',
          dataIndex: 'name',
        },
        {
          title: '小组分类',
          dataIndex: 'type',
          customRender: (state) => groupTypeMap[state.record.type as number],
        },
        {
          title: '分组描述',
          dataIndex: 'description',
        },
        // {
        //   title: '创建时间',
        //   width: 300,
        //   dataIndex: 'beginTime',
        // },
        // {
        //   title: '创建人',
        //   width: 150,
        //   dataIndex: 'endTime',
        // },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addGroup = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增分组';
        drawerInfo.value.type = 'add';
      };
      const editGroup = (item: CustomerGroupInfo) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '查看分组';
        drawerInfo.value.type = 'scan';

        drawerInfo.value.item.id = item.id;
        drawerInfo.value.item.type = item.type;
        drawerInfo.value.item.name = item.name;
        drawerInfo.value.item.description = item.description;
      };
      const drawerEdit = () => {
        drawerInfo.value.title = '编辑分组';
        drawerInfo.value.type = 'edit';
      };
      const submit = async () => {
        let res;
        if (drawerInfo.value.type === 'add') {
          res = await saveCustomerG({ ...drawerInfo.value.item });
        } else {
          res = await updateCustomerG({ ...drawerInfo.value.item });
        }
        if (res) {
          message.success(drawerInfo.value.type === 'add' ? '添加客户分组成功' : '修改客户分组成功');
          customerListReq(drawerInfo.value.type === 'add' ? 1 : pageInfo.value.current);
          drawerOnClose()
        }
      };

      const deleteGroup = (item: CustomerGroupInfo) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该分组',
            async onOk() {
              const res = await deleteCustomerG(item.id as number);
              if (res) {
                message.success('删除客户分组成功');
                customerListReq(pageInfo.value.current);
              }
            },
          }),
        );
      };
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
        drawerInfo.value.type = undefined;
        
        drawerInfo.value.item.id = undefined;
        drawerInfo.value.item.type = undefined;
        drawerInfo.value.item.name = undefined;
        drawerInfo.value.item.description = undefined;
      };
      return {
        columns,
        pagination,
        pageInfo,
        searchInfo,
        addGroup,
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
