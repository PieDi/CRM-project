<template>
  <PageWrapper title="合同模板">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"></div>
      <Upload {...props} v-if="uploadAuth">
        <Button>模板上传</Button>
      </Upload>
    </div>
    <div class="contact-content">
      <div v-for="(item, i) in contactList" :key="i" class="contact-item">
        <div class="contact-item-border">
          <p>{{ item.title }}</p>
          <div class="btn"
            ><Button type="link" @click="editContact">下载</Button>
            <Button
              type="link"
              @click="
                () => {
                  previewContact(item);
                }
              "
              >预览</Button
            >
            <Button type="link" @click="deleteContact">删除</Button>
          </div>
        </div>
      </div>
    </div>
    <Modal
      v-model:visible="pdfModal"
      title="预览"
      width="100%"
      wrap-class-name="pdf-modal"
      :footer="null"
    >
      <div id="mypdf"></div>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, toRaw, computed } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Upload, Button, Modal } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import PDFObject from './pdfobject';

  export default defineComponent({
    components: {
      PageWrapper,
      UploadOutlined,
      Upload,
      Button,
      Modal,
    },
    setup() {
      const userStore = useUserStore();
      const roleList = toRaw(userStore.getRoleList) || [];
      const uploadAuth = computed(() => {
        return roleList.some((role) => [RoleEnum.SUPER, RoleEnum.ADMIN].includes(role));
      });
      const contactList = ref([{ title: '1' }, { title: '2' }, { title: '3' }, { title: '4' }]);
      const editContact = () => {};
      const deleteContact = () => {};
      const pdfModal = ref(false);
      const previewContact = (item) => {
        pdfModal.value = true;
        setTimeout(() => {
          PDFObject.embed('https://soft.xiaoz.org/office/hee%20hee.pdf', '#mypdf');
        }, 200);
      };

      return {
        contactList,
        editContact,
        deleteContact,
        previewContact,
        uploadAuth,
        pdfModal,
      };
    },
  });
</script>
<style lang="less" scoped>
  .contact-content {
    display: flex;
    width: auto;
    min-height: calc(100vh - 226px);
    background: #fff;
    .contact-item {
      width: 200px;
      height: 200px;
      padding: 10px;
      .contact-item-border {
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
          padding: 0 15px;
          button {
            width: 40px;
          }
        }
      }
      .contact-item-border:hover {
        .btn {
          display: block;
        }
      }
    }
  }
</style>
<style lang="less">
  .pdf-modal {
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
  .pdfobject-container {
    height: 100%;
    border: 1rem solid rgba(0, 0, 0, 0.1);
  }
</style>
