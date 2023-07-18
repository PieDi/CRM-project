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
      <medical-history-list v-if="visitCustomer.id" :customerId="visitCustomer.id" />
      <!-- 回访结果 -->
      <div style="margin-top: 20px">
        <p>回访结果</p>
        <Form>
          <div style="display: flex;">
            <FormItem label="回访方式">
            <Select placeholder="请选择" style="width: 150px" v-model:value="formState.way">
              <SelectOption :value="1">电话回访</SelectOption>
              <SelectOption :value="2">线下回访</SelectOption>
              <SelectOption :value="3">其他</SelectOption>
            </Select>
          </FormItem>
          <FormItem label="回访结果" style="margin-left: 20px">
            <Select placeholder="请选择" style="width: 150px" v-model:value="formState.result">
              <SelectOption :value="1">超过预期</SelectOption>
              <SelectOption :value="2">达到预期</SelectOption>
              <SelectOption :value="3">结果一般</SelectOption>
            </Select>
          </FormItem>
          </div>

          <FormItem label="关联人">
            <Input placeholder="填写关联人" v-model:value="formState.relatedPerson" />
          </FormItem>
          <FormItem label="地址">
            <Input placeholder="填写地址" v-model:value="formState.address" />
          </FormItem>
          <FormItem label="服务类别">
            <Input placeholder="填写服务类别" v-model:value="formState.serviceCategory" />
          </FormItem>
          <FormItem label="具体项目">
            <Input placeholder="填写具体项目" v-model:value="formState.specialItem" />
          </FormItem>
          <FormItem label="相关资料">
            <TextArea placeholder="填写相关资料" v-model:value="formState.relatedMaterial" />
          </FormItem>
          <FormItem label="下一步计划">
            <TextArea placeholder="填写下一步计划" v-model:value="formState.nextPlan" />
          </FormItem>
          <FormItem label="结果补充">
            <TextArea placeholder="填写回访结果补充" v-model:value="formState.supplement" />
          </FormItem>
          <FormItem label="备注">
            <TextArea placeholder="填写备注" v-model:value="formState.remark" />
          </FormItem>
        </Form>
      </div>
      <!-- 近期回访列表 -->
      <recent-vist-list v-if="visitCustomer.id" :customerId="visitCustomer.id" />
    </div>
  </Modal>
</template>

<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import { propTypes } from '/@/utils/propTypes';
  import { Modal, Form, Input, Select, Button } from 'ant-design-vue';
  import BaseInfo from './base-info.vue';
  import MedicalHistoryList from './medical-history-list.vue';
  import RecentVistList from './recent-vist-list.vue';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import { VisitReturnInfo } from '/@/api/demo/model/visit-return';
  import { startVisit } from '/@/api/demo/visit-return';

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
      const formState = reactive({
        visitId: props.visitPlan.id,
        relatedPerson: undefined,
        serviceCategory: undefined,
        specialItem: undefined,
        address: undefined,
        nextPlan: undefined,
        relatedMaterial: undefined,
        remark: undefined,
        remindTime: undefined,
        way: undefined,
        result: undefined,
        supplement: undefined,
      });
      const onModalCancel = () => {
        emit('cancel');
      };

      const onModalOk = async () => {
        const res = await startVisit({ ...formState });
        if (res) {
        }
        emit('confirm');
      };
      return {
        formState,
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
