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
      <FormItem label="用药记录">
        <Input placeholder="请输入" allowClear :value="mInfo.name" />
      </FormItem>
      <FormItem label="用药时间">
        <DatePicker />
      </FormItem>

      <FormItem label="药物名称">
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
  import {
    Table,
    Form,
    Input,
    Button,
    Drawer,
    Select,
    InputNumber,
    DatePicker,
  } from 'ant-design-vue';
  import dayjs, { Dayjs } from 'dayjs';
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
      DatePicker,
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
        drawerOnClose,
        submit,
      };
    },
  });
</script>
<style lang="less" scoped></style>
