<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    :title="title"
    @cancel="hfDrawerOnClose"
    @ok="hfSubmit"
    width="60%"
    :visible="visible"
  >
    <Form :labelCol="{ span: 4 }" ref="formRef" :model="hfDrawerInfo">
      <FormItem
        label="回访时间"
        name="visitTime"
        :rules="{
          required: true,
          message: '请选择回访时间',
          trigger: 'change',
        }"
      >
        <DatePicker
          :disabled="type === 'scan'"
          allow-clear
          placeholder="请选择"
          v-model:value="hfDrawerInfo.visitTime"
        />
      </FormItem>

      <FormItem
        label="回访类型"
        name="type"
        :rules="{
          required: true,
          message: '请选择回访类型',
          trigger: 'change',
        }"
      >
        <Select
          :disabled="type === 'scan'"
          placeholder="请选择"
          allow-clear
          v-model:value="hfDrawerInfo.type"
        >
          <SelectOption :value="1">电话回访</SelectOption>
          <SelectOption :value="2">线下回访</SelectOption>
          <SelectOption :value="3">其他</SelectOption>
        </Select>
      </FormItem>

      <FormItem
        label="标题"
        name="title"
        :rules="{
          required: true,
          message: '请输入回访标题',
          trigger: 'change',
        }"
      >
        <Input
          :disabled="type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="hfDrawerInfo.title"
        />
      </FormItem>

      <FormItem
        label="内容简述"
        name="visitContent"
        :rules="{
          required: true,
          message: '内容简述',
          trigger: 'change',
        }"
      >
        <TextArea
          :disabled="type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="hfDrawerInfo.visitContent"
        />
      </FormItem>

      <FormItem label="备注">
        <TextArea
          :disabled="type === 'scan'"
          placeholder="请输入"
          allowClear
          v-model:value="hfDrawerInfo.remark"
        />
      </FormItem>
    </Form>
  </Modal>
</template>

<script lang="ts">
  import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
  import { Form, FormItem, Input, Button, Table, Modal, DatePicker, Select, message } from 'ant-design-vue';
  import { type DrawerItemType } from '/@/views/type';
  import { saveVisit, updateVisit } from '/@/api/demo/visit-return';
  import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
  import type { FormInstance } from 'ant-design-vue';
  const TextArea = Input.TextArea;
  export default defineComponent({
    components: {
      Form,
      FormItem,
      Input,
      Button,
      Table,
      Modal,
      DatePicker,
      Select,
      SelectOption: Select.Option,
      TextArea,
    },
    props: {
      customerId: {
        type: Number,
        required: true,
      },
      productType: {
        type: Number,
      },
      drawerInfo: {
        type: Object as PropType<DrawerItemType<VisitReturnInfo>>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const formRef = ref<FormInstance>();
      const hfDrawerInfo = reactive<VisitReturnInfo>({
        id: props.drawerInfo?.item?.id,
        customerId: props.drawerInfo?.item?.customerId,
        item: props.drawerInfo?.item?.item,
        nextPlan: props.drawerInfo?.item?.nextPlan,
        remark: props.drawerInfo?.item?.remark,
        title: props.drawerInfo?.item?.title,
        type: props.drawerInfo?.item?.type,
        visitContent: props.drawerInfo?.item?.visitContent,
        visitTime: props.drawerInfo?.item?.visitTime,
      });
      onBeforeMount(() => {});
      const hfSubmit = async () => {
        formRef.value?.validate().then(async () => {
          let res;
          if (props.drawerInfo.type === 'add') {
            res = await saveVisit({
              ...hfDrawerInfo,
              visitTime: hfDrawerInfo.visitTime
                ? hfDrawerInfo.visitTime.format('YYYY-MM-DD')
                : undefined,
            });
          } else {
            res = await updateVisit({
              ...hfDrawerInfo,
              visitTime: hfDrawerInfo.visitTime
                ? hfDrawerInfo.visitTime.format('YYYY-MM-DD')
                : undefined,
            });
          }
          if (res) {
            message.success(
              props.drawerInfo.type === 'add' ? '新增回访计划成功' : '修改回访计划成功',
            );
            emit('submit')
          }
        });
      };
      const hfDrawerOnClose = () => {
        emit('drawerOnClose');
        // Object.keys(orderDrawerInfo).forEach((key) => {
        //   orderDrawerInfo[key] = undefined;
        // });
      };
      return {
        visible: props?.drawerInfo?.visible,
        title: props?.drawerInfo?.title,
        type: props?.drawerInfo?.type,
        formRef,
        // 抽屉
        hfDrawerInfo,
        hfDrawerOnClose,
        hfSubmit,
      };
    },
  });
</script>

<style lang="less" scoped></style>
