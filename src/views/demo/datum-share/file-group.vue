<template>
  <PageWrapper :title="route.query.name as string || '文件夹'">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"></div>
      <Upload
        :max-count="1"
        :before-upload="
          () => {
            return false;
          }
        "
        v-if="authShow"
      >
        <Button>资料上传</Button>
      </Upload>
    </div>
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
  import { defineComponent, ref, onMounted, toRaw, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Button, Upload } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { getShareList } from '/@/api/demo/datum-share';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';

  export default defineComponent({
    components: {
      PageWrapper,
      Button,
      Upload,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER, RoleEnum.ADMIN].includes(role));
      });
      const route = useRoute();
      const datumListReq = async (path?: string) => {
        const res = await getShareList(path);
        if (res) fileList.value = res;
      };

      onMounted(() => {
        datumListReq((route.query.name as string) || '');
      });
      const fileList = ref([
        { id: 1, title: '1', des: '1', files: [] },
        { id: 2, title: '2', des: '2', files: [] },
        { id: 3, title: '3', des: '3', files: [] },
      ]);

      const downloadFile = (item) => {};
      const deleteFile = (item) => {};
      const beforeUpload = () => {};
      return {
        route,
        fileList,
        beforeUpload,
        downloadFile,
        deleteFile,
        authShow,
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
<style lang="less">
  .ant-upload-list {
    display: none;
  }
</style>
