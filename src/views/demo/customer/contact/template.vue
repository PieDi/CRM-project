<template>
  <PageWrapper title="合同模板">
    <div :style="{ display: 'flex', justifyContent: 'space-between' }">
      <div :style="{ display: 'flex' }"></div>
      <Upload {...props}>
        <Button>模板上传</Button>
      </Upload>
    </div>
    <div class="contact-content">
      <div v-for="(item, i) in contactList" :key="i" class="contact-item">
        <div class="contact-item-border">
          <p>{{ item.title }}</p>
          <div class="btn"
            ><Button type="link" @click="editContact">下载</Button>
            <Button type="link" @click="deleteContact">删除</Button>
          </div>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Upload, Button, message } from 'ant-design-vue';
  import { UploadOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    components: {
      PageWrapper,
      UploadOutlined,
      Upload,
      Button,
    },
    setup() {
      const contactList = ref([{ title: '1' }, { title: '2' }, { title: '3' }, { title: '4' }]);
      const editContact = () => {};
      const deleteContact = () => {};
      return {
        contactList,
        editContact,
        deleteContact,
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
          padding: 0 29px;
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
