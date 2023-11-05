<template>
  <div class="eee">
    <div class="1 block">
      <div class="header">
        <div
          ><img src="/src/assets/images/report1.png" /><span
            :style="{ color: '#2E354F', fontSize: '16px' }"
            >原始报告</span
          ><span :style="{ fontSize: '12px' }">（体检报告、住院小结等）</span></div
        >
        <div style="display: flex"
          ><img
            @click="
              () => {
                uploadAction(9);
              }
            "
            src="/src/assets/images/report-upload.png" /><img
            @click="
              () => {
                scanFJAction(9);
              }
            "
            src="/src/assets/images/report-more.png"
        /></div>
      </div>
      <div class="content">
        <div class="item" v-for="item of diseaseObject.originalDataReports">
          <span>{{ item.fileName }}</span>
          <div
            ><Button
              type="link"
              @click="
                () => {
                  handlePreView(item.id);
                }
              "
              >查看</Button
            ><Button
              type="link"
              @click="
                () => {
                  handleDownload(item.id);
                }
              "
              >下载</Button
            ><Button
              type="link"
              danger
              @click="
                () => {
                  deleteFile(item.id);
                }
              "
              >删除</Button
            ></div
          >
        </div>
      </div>
    </div>
    <div class="2 block">
      <div class="header">
        <div
          ><img src="/src/assets/images/report2.png" /><span
            :style="{ color: '#2E354F', fontSize: '16px' }"
            >其他文件</span
          ><span :style="{ fontSize: '12px' }">（同意函、知情书、授权书等）</span></div
        >
        <div style="display: flex"
          ><img
            @click="
              () => {
                uploadAction(10);
              }
            "
            src="/src/assets/images/report-upload.png" /><img
            @click="
              () => {
                scanFJAction(10);
              }
            "
            src="/src/assets/images/report-more.png"
        /></div>
      </div>
      <div class="content">
        <div class="item" v-for="item of diseaseObject.otherDataReports">
          <span>{{ item.fileName }}</span>
          <div
            ><Button
              type="link"
              @click="
                () => {
                  handlePreView(item.id);
                }
              "
              >查看</Button
            ><Button
              type="link"
              @click="
                () => {
                  handleDownload(item.id);
                }
              "
              >下载</Button
            ><Button
              type="link"
              danger
              @click="
                () => {
                  deleteFile(item.id);
                }
              "
              >删除</Button
            ></div
          >
        </div>
      </div>
    </div>
    <div class="3 block">
      <div class="header">
        <div
          ><img src="/src/assets/images/report3.png" /><span
            :style="{ color: '#2E354F', fontSize: '16px' }"
            >数据分析</span
          ><span :style="{ fontSize: '12px' }">（指标）</span>
        </div>
        <div style="display: flex">
          <Popover trigger="click">
            <template #content>
              <Button type="link" @click="MSCAction">msc</Button>
              <br />
              <Button type="link" @click="NKAction">nk</Button>
            </template>
            <Button type="link">编辑</Button>
          </Popover>
          <Popover trigger="click">
            <template #content>
              <Button type="link" @click="MSCScan">msc</Button>
              <br />
              <Button type="link" @click="NKScan">nk</Button>
            </template>
            <Button type="link">查看</Button>
          </Popover>
          <Button type="link" @click="dataReportDownload">下载</Button>
          <Popover trigger="click">
            <template #content>
              <Button type="link" @click="MSCDelete">msc</Button>
              <br />
              <Button type="link" @click="NKDelete">nk</Button>
            </template>
            <Button type="link" danger>删除</Button>
          </Popover>
        </div>
      </div>
    </div>
    <!-- 文件上传 -->
    <UploadModal
      v-if="uploadDrawerInfo.id"
      :drawer-info="uploadDrawerInfo"
      @drawerOnClose="uploadClose"
      @submit="uploadSubmit"
    ></UploadModal>
    <!-- 查看全部附件 -->
    <MoreFj
      v-if="moreFJDrawerInfo.id"
      :drawer-info="moreFJDrawerInfo"
      @drawerOnClose="moreFJClose"
      @submit="moreFJSubmit"
    ></MoreFj>
    <!-- MSC -->
    <MscModal
      v-if="MSCDrawerInfo.visible"
      :customer-id="MSCDrawerInfo.customerId"
      :drawer-info="MSCDrawerInfo"
      @drawerOnClose="MSCClose"
      @submit="MSCSubmit"
    ></MscModal>
     <!-- NK -->
     <NkModal
      v-if="NKDrawerInfo.visible"
      :customer-id="MSCDrawerInfo.customerId"
      :drawer-info="NKDrawerInfo"
      @drawerOnClose="NKClose"
      @submit="NKSubmit"
    ></NkModal>
  </div>
</template>

<script lang="ts">
  import { Popover, Button, message } from 'ant-design-vue';
  import { defineComponent, PropType, ref, reactive, watch, onBeforeMount, createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import UploadModal from './upload-modal.vue';
  import MoreFj, { UploadAA } from './more-fj.vue';
import MscModal from './msc-modal.vue';
  import NkModal from './nk-modal.vue';
  import { getCustomerFileView, getCustomerFileRemove } from '/@/api/demo/customer';
import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { deleteDataReport } from '/@/api/demo/customer';
  export default defineComponent({
    props: {
      customerId: {
        type: Number,
        required: true,
      },
      disease: {
        type: Object as PropType<any>,
        required: true,
      },
      callback: Function,
    },
    components: {
      Button,
      Popover,
      UploadModal,
      MoreFj,
      MscModal,
      NkModal
    },
    setup(props, { emit }) {
      onBeforeMount(() => {});
      // 更多附件
      const moreFJDrawerInfo = reactive<UploadAA>({
        visible: false,
        id: undefined,
        type: undefined,
      });
      const scanFJAction = (type: number) => {
        moreFJDrawerInfo.visible = true;
        moreFJDrawerInfo.type = type;
        moreFJDrawerInfo.id = props.customerId;
      };
      const moreFJClose = () => {
        moreFJDrawerInfo.visible = false;
        moreFJDrawerInfo.type = undefined;
        moreFJDrawerInfo.id = undefined;
      };
      const moreFJSubmit = () => {
        // moreFJClose();
        emit('submit');
      };
      // 附件上传
      const uploadDrawerInfo = reactive<UploadAA>({
        visible: false,
        id: undefined,
        type: undefined,
      });
      const uploadAction = (type: number) => {
        uploadDrawerInfo.visible = true;
        uploadDrawerInfo.type = type;
        uploadDrawerInfo.id = props.customerId;
      };
      const uploadClose = () => {
        uploadDrawerInfo.visible = false;
        uploadDrawerInfo.type = undefined;
        uploadDrawerInfo.id = undefined;
      };
      const uploadSubmit = () => {
        uploadClose();
        emit('submit');
      };
      const diseaseObject = ref();
      watch(
        () => props.disease,
        () => {
          diseaseObject.value = props.disease;
        },
        { immediate: true },
      );
      // 报告查看、下载、删除
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
      // MSC
      const MSCDrawerInfo =ref({
        visible: false,
        type: undefined,
        customerId: props.customerId,
        item: undefined,
      });
      const MSCAction = () => {
        MSCDrawerInfo.value.visible = true;
        //@ts-ignore
        MSCDrawerInfo.value.type = 'edit';
        MSCDrawerInfo.value.item = props.disease.mscData.item;
      };
      const MSCScan  = () => {
        MSCDrawerInfo.value.visible = true;
        //@ts-ignore
        MSCDrawerInfo.value.type = 'scan';
        MSCDrawerInfo.value.item = props.disease.mscData.item;
      }
      const MSCClose = () => {
        MSCDrawerInfo.value.visible = false;
        MSCDrawerInfo.value.item = undefined;
      };
      const MSCDelete = () => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除msc项',
            async onOk() {
              const res = await deleteDataReport({name: 'msc', customerId: props.customerId});
              if (res) {
                message.success('删除msc项成功');
                emit('submit');
              }
            },
          }),
        );
       }
      const MSCSubmit = () => {
        MSCClose();
        emit('submit');
      };
      // NK
      const NKDrawerInfo = ref({
        visible: false,
        type: undefined,
        customerId: props.customerId,
        item: undefined,
      });
      const NKAction = () => {
        NKDrawerInfo.value.visible = true;
        //@ts-ignore
        NKDrawerInfo.value.type = 'edit';
        NKDrawerInfo.value.item = props.disease.nkData.item;
      };
      const NKScan  = () => {
        NKDrawerInfo.value.visible = true;
        //@ts-ignore
        NKDrawerInfo.value.type = 'scan';
        NKDrawerInfo.value.item = props.disease.nkData.item;
      };
      const NKClose = () => {
        NKDrawerInfo.value.visible = false;
        NKDrawerInfo.value.item = undefined;
      };
      const NKDelete = () => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除nk项',
            async onOk() {
              const res = await deleteDataReport({name: 'nk', customerId: props.customerId});
              if (res) {
                message.success('删除nk项成功');
                emit('submit');
              }
            },
          }),
        );
       }
      const NKSubmit = () => {
        NKClose();
        emit('submit');
      };

      // 数据下载
      const dataReportDownload =() => {
        window.open(`http://129.204.202.223:8001/basic-api/customer/dataReport/export?customerId=${props.customerId}`); 
      };
      return {
        diseaseObject,
        // 查看附件
        moreFJDrawerInfo,
        scanFJAction,
        moreFJClose,
        moreFJSubmit,
        // 附件上传
        uploadDrawerInfo,
        uploadAction,
        uploadClose,
        uploadSubmit,
        // 附件操作
        handlePreView,
        handleDownload,
        deleteFile,
        //msc
        MSCDrawerInfo,
        MSCAction,
        MSCScan,
        MSCClose,
        MSCDelete,
        MSCSubmit,
        //nk
        NKDrawerInfo,
        NKAction,
        NKScan,
        NKClose,
        NKDelete,
        NKSubmit,
        dataReportDownload
      };
    },
  });
</script>
<style lang="less" scoped>
  .eee {
    .block {
      border-bottom: 1px solid #ebebeb;
      margin-top: 16px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
          margin-top: -4px;
          height: 20px;
          width: 20px;
        }

        img + img {
          margin-left: 5px;
        }

        span {
          display: inline-block;
          height: 20px;
          line-height: 20px;
        }

        .ant-btn {
          padding: 0 5px;
        }
      }

      .content {
        margin-bottom: 16px;
        height: 178px;
        overflow: hidden;

        .item {
          height: 54px;
          margin-top: 8px;
          background: #f8f9fa;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>
