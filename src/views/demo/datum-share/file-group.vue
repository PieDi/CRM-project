<template>
  <PageWrapper title="资料分类">
    <div class="file-content">
      <div v-for="(item, i) in fileList" :key="i" class="file-item">
        <div class="file-item-border">
          <p>{{ item.title }}</p>
          <div class="btn"
            ><Button type="link" @click="downloadFile">下载</Button>
            <Button type="link" @click="deleteFile">删除</Button></div
          >
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Button } from 'ant-design-vue';

  export default defineComponent({
    components: {
      PageWrapper,
      Button,
    },
    setup() {
      const fileList = ref([
        { id: 1, title: '1', des: '1', files: [] },
        { id: 2, title: '2', des: '2', files: [] },
        { id: 3, title: '3', des: '3', files: [] },
      ]);

      const downloadFile = (item) => {};
      const deleteFile = (item) => {};

      return {
        fileList,
        downloadFile,
        deleteFile,
      };
    },
  });
</script>
<style lang="less" scoped>
  .file-content {
    display: flex;
    width: auto;
    min-height: calc(100vh - 226px);
    background: #fff;
    .file-item {
      width: 200px;
      height: 200px;
      padding: 10px;
      .file-item-border {
        width: auto;
        height: 100%;
        border: 1px solid #eee;
        p {
          width: 100%;
          margin-top: 20px;
          text-align: center;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .btn {
          display: none;
          padding: 0 29px;
        }
      }
      .file-item-border:hover {
        .btn {
          display: block;
        }
      }
    }
  }
</style>
