<template>
  <Modal :visible="visible" width="70%" centered :maskClosable="false" @ok="onModalOk">
    <div style="overflow-y: scroll; padding: 20px; height: 500px">
      <div style="display: flex; margin-bottom: 10px">
        <div>
          <span>客户姓名:</span>
          <span>{{ visitCustomer.name }}</span>
        </div>
        <div style="margin-left: 20px">
          <span>联系电话:</span>
          <span>{{ visitCustomer.mobile }}</span>
        </div>
        <div style="margin-left: 20px">
          <span>年龄:</span>
          <span>{{ visitCustomer.age }}</span>
        </div>
        <div style="margin-left: 20px">
          <span>地址:</span>
          <span>{{ visitCustomer.contactAddress }}</span>
        </div>
        <div style="margin-left: 20px">
          <span>标签:</span>
          <span>{{ visitCustomer.tag }}</span>
        </div>
      </div>
      <div style="display: flex; margin-bottom: 10px">
        <div>
          <span>回访标题:</span>
          <span>{{ visitPlan.title }}</span>
        </div>
        <div style="margin-left: 20px">
          <span>回访项目:</span>
          <span>{{ visitPlan.item }}</span>
        </div>
        <div style="margin-left: 20px">
          <span>回访类型:</span>
          <span>{{ visitTypeMap[visitPlan.type as number] }}</span>
        </div>
      </div>

      <!-- 患者病史列表 -->
      <medical-history-list v-if="visitCustomer.id" :customerId="visitCustomer.id"/>
      <!-- 回访结果 -->
      <div style="margin-top: 20px">
        <p>回访结果</p>
        <Form>
          <div style="display: flex">
            <FormItem label="回访结果" required>
              <Select placeholder="请选择" style="width: 150px">
                <SelectOption key="1">回访结果1</SelectOption>
                <SelectOption key="2">回访结果2</SelectOption>
              </Select>
            </FormItem>
            <FormItem label="回访方式" required style="margin-left: 50px">
              <Select placeholder="请选择" style="width: 150px">
                <SelectOption key="1">回访方式1</SelectOption>
                <SelectOption key="2">回访方式2</SelectOption>
              </Select>
            </FormItem>
          </div>
          <FormItem label="结果补充">
            <TextArea placeholder="填写回访结果补充" />
          </FormItem>
          <FormItem label="上传附件">
            <Select placeholder="请选择" style="width: 150px; margin-right: 10px">
              <SelectOption key="1">文档</SelectOption>
              <SelectOption key="2">图片</SelectOption>
            </Select>
            <Button type="primary">上传文件</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 近期回访列表 -->
      <recent-vist-list v-if="visitCustomer.id" :customerId="visitCustomer.id" />
    </div>
  </Modal>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Modal, Form, Input, Select, Button } from 'ant-design-vue';
  import BaseInfo from './base-info.vue';
  import MedicalHistoryList from './medical-history-list.vue';
  import RecentVistList from './recent-vist-list.vue';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import { VisitReturnInfo } from '/@/api/demo/model/visit-return';

  const visitTypeMap: Record<number, string> = {
    1: '电话回访',
    2: '线下回访',
    3: '其他',
  };
  export default defineComponent({
    components: {
      Modal,
      Form,
      FormItem: Form.Item,
      Input,
      TextArea: Input.TextArea,
      Select,
      SelectOption: Select.Option,
      Button,
      BaseInfo,
      MedicalHistoryList,
      RecentVistList,
    },

    props: {
      customerInfo: {
        type: Object as PropType<CustomerInfo>,
        required: true,
      },
      visitPlan: {
        type: Object as PropType<VisitReturnInfo>,
        required: true,
      },
      visible: propTypes.bool,
    },
    setup(props, { emit }) {
      const onModalCancel = () => {
        emit('cancel');
      };

      const onModalOk = () => {
        emit('confirm');
      };
      return {
        onModalCancel,
        onModalOk,
        visitCustomer: props.customerInfo,
        visitPlan: props.visitPlan,
        visitTypeMap,
      };
    },
  });
</script>

<style lang="less" scoped></style>
