<template>
  <!-- 基本信息 -->
  <div>
    <div style="display: flex;">
      <div>
        <span>患者姓名:</span>
        <span>张三</span>
      </div>
      <div style="margin-left: 20px;">
        <span>联系电话:</span>
        <span>188-3819-7439</span>
      </div>
      <div style="margin-left: 20px;">
        <span>患者来源:</span>
        <span>急诊</span>
      </div>
      <div style="margin-left: 20px;">
        <span>疾病种类:</span>
        <span>种类1</span>
      </div>
      <div style="margin-left: 20px;">
        <span>回访方案:</span>
        <span>方案1</span>
      </div>
      <div style="margin-left: 20px;">
        <span>回访进度:</span>
        <span>0/1</span>
      </div>
    </div>
    <div style="display: flex;">
      <div>
        <span>回访标题:</span>
        <span>回访标题</span>
      </div>
      <div style="margin-left: 20px;">
        <span>执行人员:</span>
        <span>执行人员</span>
      </div>
      <div style="margin-left: 20px;">
        <span>回访类型:</span>
        <span>类型1</span>
      </div>
    </div>
    <div>
      <span>回访内容:</span>
      <span>回访内容</span>
    </div>
    <div>
      <span>回访说明:</span>
      <span>无</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {
      
    }
  }
})
</script>

<style lang="less" scoped>

</style>