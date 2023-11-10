<template>
  <div class="ggg">
    <div class="header">
      <div class="a">名称</div>
      <div class="b">日期</div>
      <div class="c">操作</div>
    </div>
    <div class="content">
      <div class="a">名称</div>
      <div class="b">日期</div>
      <div class="c" :style="{display: 'flex'}">
        <Button type="link">查看</Button>
        <Button type="link">下载</Button>
        <Button type="link" danger>删除</Button>
      </div>
    </div>
    <div class="content">
      <div class="a">名称</div>
      <div class="b">日期</div>
      <div class="c" :style="{display: 'flex'}">
        <Button type="link">查看</Button>
        <Button type="link">下载</Button>
        <Button type="link" danger>删除</Button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, watch, ref, PropType } from 'vue';
  import { Button } from 'ant-design-vue';

  export default defineComponent({
    components: {
      Button,
    },
    props: {
      disease: {
        required: true,
        type: Object as PropType<any>,
      },
    },
    setup(props, { emit }) {
      const diseaseObject = ref();
      watch(
        () => props.disease,
        () => {},
        { immediate: true },
      );
      return {
        diseaseObject,
      };
    },
  });
</script>
<style lang="less" scoped>
  .ggg {
    padding: 0 20px;
    .header {
      height: 54px;
      background: #f5f8fc;
      border-radius: 4px;
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: #647081;
      line-height: 22px;
    }
    .content {
      margin-top: 12px;
      height: 46px;
      background: #f5f8fc;
      border-radius: 4px;
      display: flex;
      align-items: center;
    }
    .a {
      width: 160px;
      padding-left: 12px;
    }
    .b {
      width: 100px;
      border: none;
    }
  }
</style>
<style lang="less"></style>
