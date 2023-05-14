<template>
  <PageWrapper title="出库管理">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"
        ><FormItem label="产品名称">
          <Input placeholder="请输入" allowClear />
        </FormItem>
        <!-- <FormItem label="客户标签" style="margin-left: 10px">
          <Input placeholder="请输入" allowClear />
        </FormItem> -->
        <Button type="primary" style="margin-left: 10px">搜索</Button></div
      >
      <Button type="primary" style="margin-left: 10px" @click="addStoreOut">新增出库</Button>
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
                editStoreOut(record);
              }
            "
            >编辑</Button
          >
          <Button
            type="link"
            @click="
              () => {
                deleteStoreOut(record);
              }
            "
            >删除</Button
          >
        </template>
      </template>
    </Table>
    <Drawer
      :destroy-on-close="true"
      :title="drawerInfo.title"
      placement="right"
      @close="drawerOnClose"
      :visible="drawerInfo.visible"
    >
      <template #extra>
        <Button type="primary">提交</Button>
      </template>

      <Form :labelCol="{ span: 6 }">
        <FormItem label="出库时间">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="出库批次">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="购买人员">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="产品编号">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="产品名称">
          <Input placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
        <FormItem label="其他">
          <TextArea placeholder="请输入" allowClear :value="cInfo.name" />
        </FormItem>
      </Form>
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
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      TextArea,
    },
    setup() {
      const drawerInfo = ref({ visible: false, title: '' });
      const cInfo = ref<{ name: string; id?: number | string; des: string }>({
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
          title: '出库时间',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '出库批次',
          dataIndex: 'address',
        },
        {
          title: '产品编号',
          dataIndex: 'no',
        },
        {
          title: '购买人员',
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
      const addStoreOut = () => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '新增出库';
      };
      const editStoreOut = (item) => {
        drawerInfo.value.visible = true;
        drawerInfo.value.title = '编辑出库';
      };
      const deleteStoreOut = (item) => {};
      const drawerOnClose = () => {
        drawerInfo.value.visible = false;
        drawerInfo.value.title = '';
      };
      return {
        columns,
        data: getBasicData(),
        loading,
        pagination,
        drawerInfo,
        cInfo,
        addStoreOut,
        editStoreOut,
        deleteStoreOut,
        drawerOnClose,
      };
    },
  });
</script>
<style lang="less" scoped></style>
