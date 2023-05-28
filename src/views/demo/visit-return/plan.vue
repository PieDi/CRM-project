<template>
  <PageWrapper>
    <div style="display: flex;justify-content: space-between;">
      <div style="display: flex;">
        <FormItem label="患者姓名">
          <Input placeholder="请输入" allow-clear style="width: 150px;" />
        </FormItem>
        <FormItem label="联系电话" style="margin-left: 10px;">
          <Input placeholder="请输入" allow-clear style="width: 150px;" />
        </FormItem>
        <Button type="primary" style="margin-left: 10px;">搜索</Button>
      </div>
      <Button type="primary" @click="addReturnPlan">新建回访</Button>
    </div>

    <Table
      :columns="columns"
      :dataSource="data"
      :loading="loading"
      :bordered="true"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'operation'">
          <div style="display: flex;">
            <Button type="link" @click="editReturnPlan(record)">编辑</Button>
            <Button type="link" style="margin-left: 10px;" @click="startVisit">开始回访</Button>
          </div>
        </template>
      </template>
    </Table>

    <Drawer
      :visible="drawerInfo.visible"
      :title="drawerInfo.title"
      placement="right"
      @close="onDrawerClose"
    >
      <template #extra>
        <Button v-if="drawerInfo.type === 'add'" type="primary">提交</Button>
      </template>
      
      <Form>
        <FormItem label="患者姓名">
          <Input placeholder="请输入" v-model:value="drawerInfo.item.name" allow-clear />
        </FormItem>

        <FormItem label="患者来源">
          <Input placeholder="请输入" allow-clear />
        </FormItem>

        <FormItem label="疾病种类">
          <Input placeholder="请输入" allow-clear />
        </FormItem>

        <FormItem label="患者等级">
          <Input placeholder="请输入" allow-clear />
        </FormItem>

        <FormItem label="回访时间">
          <DatePicker />
        </FormItem>

        <FormItem label="联系电话">
          <Input placeholder="请输入" allow-clear />
        </FormItem>

        <FormItem label="回访类型">
          <Select placeholder="请选择">
            <SelectOption value="回访类型1">回访类型1</SelectOption>
            <SelectOption value="回访类型2">回访类型2</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Drawer>
    <StartVisit :visible="showModal" @confirm="onModelConfirm" @cancel="onModelCancel" />
  </PageWrapper>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { PageWrapper } from '@/components/Page'
import { Form, Input, Button, Table, Drawer, DatePicker, Select } from 'ant-design-vue'
import StartVisit from './start-visit/index.vue'
import { DrawerItemType } from '@/views/type'
import { getReturnListData } from '../table/tableData'

export default defineComponent({
  components: {
    PageWrapper,
    Form,
    FormItem: Form.Item,
    Input,
    Button,
    Table,
    Drawer,
    DatePicker,
    Select,
    SelectOption: Select.Option,
    StartVisit
  },
  setup() {
    const columns: any = ref([
      {
        title: '患者姓名',
        dataIndex: 'name'
      },
      {
        title: '患者来源',
        dataIndex: 'source'
      },
      {
        title: '疾病种类',
        dataIndex: 'kind'
      },
      {
        title: '患者等级',
        dataIndex: 'level'
      },
      {
        title: '回访时间',
        dataIndex: 'time'
      },
      {
        title: '联系电话',
        dataIndex: 'mobile'
      },
      {
        title: '回访类型',
        dataIndex: 'type'
      },
      {
        title: '回访状态',
        dataIndex: 'status'
      },
      {
        title: '操作',
        dataIndex: 'operation'
      }
    ]);
    
    const loading = ref(false)

    const current = ref(3)
    const pagination = ref({
      total: 100,
      current,
      pageSize: 10,
      showTotal: (total) => `共${total}条`,
      showQuickJumper: false,
      showSizeChanger: false,
      onChange: (page, pageSize) => {
        current.value = page
        console.log(`page is ${page}, pageSize is ${pageSize}`)
      }
    })

    const drawerInfo = ref({
      visible: false,
      title: '',
      item: {}
    })

    const addReturnPlan = () => {
      drawerInfo.value.visible = true
      drawerInfo.value.title = '新建回访'
      drawerInfo.value.type = 'add'
    }

    const editReturnPlan = (item) => {
      drawerInfo.value.visible = true
      drawerInfo.value.title = '编辑回访'
      drawerInfo.value.item.name = item.name
      drawerInfo.value.item.mobile = item.mobile
      console.log(JSON.stringify(item))
    }

    const onDrawerClose = () => {
      drawerInfo.value.visible = false
      drawerInfo.value.title = ''
      drawerInfo.value.type = 'edit'
      drawerInfo.value.item.name = ''
    }

    const showModal = ref(false)
    const startVisit = () => {
      showModal.value = true
    }
    const onModelConfirm = () => {
      showModal.value = false
    }
    const onModelCancel = () => {
      showModal.value = false
    }
    return {
      columns,
      loading,
      data: getReturnListData(),
      pagination,
      drawerInfo,
      addReturnPlan,
      editReturnPlan,
      onDrawerClose,
      showModal,
      startVisit,
      onModelConfirm,
      onModelCancel
    }
  }
})
</script>

<style lang="less" scoped>

</style>