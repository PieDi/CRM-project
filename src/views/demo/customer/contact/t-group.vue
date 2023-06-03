<template>
  <PageWrapper :title="route.query.name as string || '文件夹'">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"></div>
      <Upload
        :max-count="1"
        :before-upload="
          (file) => {
            beforeUpload(file);
            return false;
          }
        "
        v-if="authShow"
      >
        <Button>模板上传</Button>
      </Upload>
    </div>

    <div class="file-content">
      <div v-for="(item, i) in fileList" :key="i" class="file-item">
        <div class="file-item-border">
          <p>{{ item }}</p>
          <div class="btn"
            ><Button
              type="link"
              @click="
                () => {
                  downloadFile(item);
                }
              "
              >下载</Button
            >
            <Button
              type="link"
              @click="
                () => {
                  previewFile(item);
                }
              "
              >预览</Button
            >
            <Button
              type="link"
              @click="
                () => {
                  deleteFile(item);
                }
              "
              >删除</Button
            ></div
          >
        </div>
      </div>
    </div>
  </PageWrapper>
  <!-- <Modal
    v-model:visible="pdfShow"
    title="预览"
    width="100%"
    wrap-class-name="full-modal"
    :footer="null"
  >
    <div id="pdf-content"></div>
  </Modal> -->
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, toRaw, computed, createVNode } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Button, Upload, message, Modal } from 'ant-design-vue';
  import { useRoute } from 'vue-router';
  import { uploadTemplate, previewTemplate,getTemplateList, deleteTemplate } from '/@/api/demo/contact';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  // import pdfPreview from './pdfobject.js';

  export default defineComponent({
    components: {
      PageWrapper,
      Button,
      Upload,
      Modal,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const authShow = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER, RoleEnum.ADMIN].includes(role));
      });
      const route = useRoute();
      const fileList = ref([]);
      const tGroupReq = async () => {
        const res = await getTemplateList(`/${route.query.name as string}`);
        if (res) fileList.value = res;
      };
      onMounted(() => {
        tGroupReq();
      });

      const downloadFile = (item) => {
        window.open(
          `http://129.204.202.223:8001/basic-api/contract/template/download?path=/${
            route.query.name as string
          }/${item}`,
        );
      };
      const pdfShow = ref(false);
      const previewFile = async (item) => {
        const res = await previewTemplate(`/${route.query.name as string}/${item}`)
        if (res) window.open(res)
      
        // pdfShow.value = true;
        // setTimeout(() => {
        //   pdfPreview.embed(`http://129.204.202.223:8001/contract/template/download?path=/${
        //     route.query.name as string
        //   }/${item}`, '#pdf-content');
        // }, 200);
      };
      const deleteFile = (item) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该文件',
            async onOk() {
              const res = await deleteTemplate({ path: `/${route.query.name as string}/${item}` });
              if (res) {
                message.success('删除文件');
                tGroupReq();
              }
            },
          }),
        );
      };
      const beforeUpload = async (file: any) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', `/${route.query.name as string}`);
        const res = await uploadTemplate(formData);
        if (res) {
          message.success('上传成功');
          tGroupReq();
        }
      };
      return {
        route,
        fileList,
        beforeUpload,
        downloadFile,
        previewFile,
        deleteFile,
        authShow,
        pdfShow,
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
      padding: 5px;
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
<style scoped>
  /* 根据你的需要设置PDFObject样式，比如高度等 */
  .pdfobject-container {
    height: 680px;
    border: 1rem solid rgba(0, 0, 0, 0.1);
  }
</style>
<style lang="less">
  .ant-upload-list {
    display: none;
  }
  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }
    .ant-modal-body {
      flex: 1;
    }
  }
</style>
