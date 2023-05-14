<template>
  <Drawer
    :mask-closable="false"
    :destroy-on-close="true"
    :title="drawerInfo.title"
    placement="right"
    @close="drawerOnClose"
    :visible="drawerInfo.visible"
  >
    <template #extra>
      <Button type="primary" @click="submit">提交</Button>
    </template>

    <Form :labelCol="{ span: 6 }">
      <FormItem label="客户姓名">
        <Input placeholder="请输入" allowClear :value="mInfo.name" />
      </FormItem>
      <FormItem label="性别">
        <Select placeholder="请选择">
          <SelectOption key="1">男</SelectOption>
          <SelectOption key="2">女</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="证件类型">
        <Select placeholder="请选择">
          <SelectOption key="1">身份证</SelectOption>
          <SelectOption key="2">护照</SelectOption>
          <SelectOption key="3">军官证</SelectOption>
          <SelectOption key="4">港澳通行证</SelectOption>
          <SelectOption key="5">台湾通行证</SelectOption>
        </Select>
      </FormItem>

      <FormItem label="证件号码">
        <Input placeholder="请输入" allowClear :value="mInfo.name" />
      </FormItem>

      <FormItem label="就诊医院">
        <Input placeholder="请输入" allowClear :value="mInfo.name" />
      </FormItem>
      <FormItem label="科室">
        <InputNumber placeholder="请输入" allowClear min="1" :precision="0" />
      </FormItem>
      <FormItem label="疾病名称">
        <Input placeholder="请输入" allowClear :value="mInfo.name" />
      </FormItem>
      <FormItem label="附件">
        <Input placeholder="请输入" allowClear :value="mInfo.name" />
      </FormItem>
    </Form>
  </Drawer>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';
  import { Table, Form, Input, Button, Drawer, Select, InputNumber } from 'ant-design-vue';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  export default defineComponent({
    components: {
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      Select,
      SelectOption,
      InputNumber,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<{ visible: boolean; title: string; item?: any }>,
        default: () => ({ visible: false, title: '' }),
      },
    },
    setup(props, { emit }) {
      // const drawerInfo = ref({ visible: false, title: '' });
      const mInfo = ref<{ name: string; id?: number | string; des: string }>({
        name: '',
        id: undefined,
        des: '',
      });
      const loading = ref(false);

      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = () => {
        emit('submit', mInfo.value);
      };

      return {
        loading,
        drawerInfo: props.drawerInfo,
        mInfo,
        // addCustomer,
        // editCustomer,
        // deleteCustomer,
        drawerOnClose,
        submit,
      };
    },
  });
</script>
<style lang="less" scoped></style>
