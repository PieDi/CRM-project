<template>
  <Modal
    :visible="visible"
    width="50%"
    centered
    :closable="false"
    :maskClosable="false"
    @cancel="onModalCancel"
    @ok="onModalOk"
  >
    <div style="overflow-y: scroll;padding: 20px;height: 500px;">
      <!-- 患者基本信息 -->
      <base-info />
      <!-- 患者病史列表 -->
      <medical-history-list />
      <!-- 回访结果 -->
      <div style="margin-top: 20px;">
        <p>回访结果</p>
        <Form>
          <div style="display: flex;">
            <FormItem label="回访结果" required>
              <Select placeholder="请选择" style="width: 150px;">
                <SelectOption key="1">回访结果1</SelectOption>
                <SelectOption key="2">回访结果2</SelectOption>
              </Select>
            </FormItem>
            <FormItem label="回访方式" required style="margin-left: 50px;">
              <Select placeholder="请选择" style="width: 150px;">
                <SelectOption key="1">回访方式1</SelectOption>
                <SelectOption key="2">回访方式2</SelectOption>
              </Select>
            </FormItem>
          </div>
          <FormItem label="结果补充">
            <TextArea placeholder="填写回访结果补充" />
          </FormItem>
          <FormItem label="上传附件">
            <Select placeholder="请选择" style="width: 150px;margin-right: 10px;">
              <SelectOption key="1">文档</SelectOption>
              <SelectOption key="2">图片</SelectOption>
            </Select>
            <Button type="primary">上传文件</Button>
          </FormItem>
        </Form>
      </div>
      <!-- 近期回访列表 -->
      <recent-vist-list />
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { propTypes } from '/@/utils/propTypes'
import { Modal, Form, Input, Select, Button } from 'ant-design-vue'
import BaseInfo from './base-info.vue'
import MedicalHistoryList from './medical-history-list.vue'
import RecentVistList from './recent-vist-list.vue'

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
    RecentVistList
  },
  props: {
    visible: propTypes.bool
  },
  setup(props, { emit }) {
    const onModalCancel = () => {
      emit('cancel')
    }

    const onModalOk = () => {
      emit('confirm')
    }
    return {
      onModalCancel,
      onModalOk
    }
  }
})
</script>

<style lang="less" scoped>
</style>