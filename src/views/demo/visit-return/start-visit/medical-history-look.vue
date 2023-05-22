<template>
  <Modal
    :visible="visible"
    width="50%"
    centered
    :closable="false"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="onModalOk"
    @cancel="onModalCancel"
  >
    <div style="overflow-y: hidden;padding: 20px;height: 500px;">
      <Tabs centered>
        <TabPane key="1" tab="用药记录">用药记录</TabPane>
        <TabPane key="2" tab="检验记录">检验记录</TabPane>
        <TabPane key="3" tab="影像记录">影像记录</TabPane>
        <TabPane key="4" tab="就诊记录">就诊记录</TabPane>
      </Tabs>
    </div>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { propTypes } from '/@/utils/propTypes'
import { Modal, Tabs } from 'ant-design-vue'

export default defineComponent({
  components: {
    Modal,
    Tabs,
    TabPane: Tabs.TabPane
  },
  props: {
    visible: propTypes.bool
  },
  setup(props, { emit }) {
    const onModalOk = () => {
      emit('confirm')
    }
    const onModalCancel = () => {
      emit('cancel')
    }
    return {
      onModalOk,
      onModalCancel
    }
  }
})
</script>

<style lang="less" scoped>
</style>