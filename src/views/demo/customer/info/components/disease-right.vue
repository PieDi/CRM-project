<template>
  <div class="ggg">
    <div class="header">
      <div class="a">名称</div>
      <div class="b">日期</div>
      <div class="c">操作</div>
    </div>
    <div class="content" v-for="item of diseaseObject">
      <div class="a">{{ item.fileName }}</div>
      <div class="b">{{ item.createTime }}</div>
      <div class="c" :style="{ display: 'flex' }">
        <Button type="link" @click="()=>{handlePreView(item.id)}">查看</Button>
        <Button type="link" @click="()=>{handleDownload(item.id)}">下载</Button>
        <Button type="link" danger @click="()=>{deleteFile(item.id)}">删除</Button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, watch, ref, PropType, createVNode } from 'vue';
  import { Button, message } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { getCustomerFileView, getCustomerFileRemove } from '/@/api/demo/customer';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';

  export default defineComponent({
    components: {
      Button,
    },
    props: {
      disease: {
        required: true,
        type: Object as PropType<any>,
      },
      customerId: {
        type: Number,
        required: true,
      },
    },
    setup(props, { emit }) {
      const diseaseObject = ref();
      watch(
        () => props.disease,
        () => {
          if (props.disease) diseaseObject.value = props.disease[0]?.diseaseBasic?.files;
        },
        { immediate: true },
      );

      const handlePreView = async (id: number) => {
        const res = await getCustomerFileView(id);
        if (res) {
          window.open(res);
        }
      };
      const handleDownload = async (id: number) => {
        if (id)
          window.open(`http://129.204.202.223:8001/basic-api/customer/file/downloadById?fileId=${id}`);
      };
      const deleteFile = (id: number) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除该文件',
            async onOk() {
              const res = await getCustomerFileRemove(id);
              if (res) {
                message.success('删除文件');
                emit('submit');
              }
            },
          }),
        );
      };

      return {
        diseaseObject,
        handlePreView,
        handleDownload,
        deleteFile
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
      overflow: hidden;
      white-space:nowrap;
    }

    .b {
      width: 100px;
      border: none;
      overflow: hidden;
      white-space:nowrap;
    }
    .c {
      .ant-btn {
        padding: 0 5px;
      }
    }
  }
</style>
<style lang="less"></style>
