<template>
  <PageWrapper title="客户分组">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }">
        <FormItem label="分组名称">
          <Input placeholder="请输入" allowClear :style="{ width: '150px' }" />
        </FormItem>
        <Button type="primary" style="margin-left: 10px">搜索</Button>
      </div>
      <Button type="primary" style="margin-left: 10px" @click="addGroup">新增分组</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="data"
      :canResize="false"
      :loading="loading"
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
        <Button type="primary">提交</Button>
      </template>
      <FormItem label="分组名称">
        <Input placeholder="请输入" allowClear :value="groupInfo.name" />
      </FormItem>
      <FormItem label="分组描述">
        <TextArea placeholder="请输入" allowClear :value="groupInfo.des" />
      </FormItem>
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Table, Form, Input, Button, Drawer } from 'ant-design-vue';
  import { getBasicData } from '../../table/tableData';

  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  export default defineComponent({
    components: {
      PageWrapper,
      Table,
      FormItem,
      Input,
      Button,
      Drawer,
      TextArea,
    },
    setup() {
      const drawerInfo = ref({ visible: false, title: '' });
      const groupInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const loading = ref(false);
      const pagination = ref({
        total: 50,
        current: 1,
        pageSize: 10,
        showTotal: (total: number) => `共${total}条`,
        onChange: (page: number) => {
          console.log(2132323, page);
        },
        showQuickJumper: false,
        showSizeChanger: false,
      });
      const columns: any = [
        {
          title: 'ID',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '分组名称',
          dataIndex: 'address',
          width: 200,
        },
        {
          title: '分组描述',
          dataIndex: 'no',
          width: 300,
        },
        {
          title: '创建时间',
          width: 300,
          dataIndex: 'beginTime',
        },
        {
          title: '创建人',
          width: 150,
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];
      const addGroup = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增分组';
      };
      const editGroup = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '编辑分组';
      };
      const deleteGroup = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
      };
      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        addGroup,
        drawerInfo,
        drawerOnClose,
        groupInfo,
        editGroup,
        deleteGroup,
      };
    },
  });
</script>
<style lang="less" scoped></style>
