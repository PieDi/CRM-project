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
          <Tooltip :title="item.fileName">
            <span class="i-span 1-1">{{ item.fileName }}</span></Tooltip
          >
          <Tooltip :title="item.createTime">
            <span class="i-span 2-2">{{ item.createTime }}</span></Tooltip
          >

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
          <Tooltip :title="item.fileName">
            <span class="i-span 1-1">{{ item.fileName }}</span></Tooltip
          >
          <Tooltip :title="item.createTime">
            <span class="i-span 2-2">{{ item.createTime }}</span></Tooltip
          >
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
          ><span :style="{ fontSize: '12px' }">（指标） </span>
          <Popover trigger="click">
            <template #content>
              <Button type="link" @click="MSCAction">msc</Button>
              <br />
              <Button type="link" @click="NKAction">nk</Button>
            </template>
            <Button type="link">新增</Button>
          </Popover>
        </div>
        <div style="display: flex"
          ><img @click="moreDRAction" src="/src/assets/images/report-more.png"
        /></div>
      </div>
      <div class="content">
        <div class="item" v-for="item of diseaseObject.dataAnalyzes">
          <span class="i-span 2-2">{{ item.itemDate }}</span>
          <span class="i-span 1-1">{{ item.name }}</span>
          <div
            ><Button
              type="link"
              @click="
                () => {
                  DREdit(item.id);
                }
              "
              >编辑</Button
            >
            <Button
              type="link"
              @click="
                () => {
                  DRScan(item.id);
                }
              "
              >查看</Button
            ><Button
              type="link"
              @click="
                () => {
                  dataReportDownload(item.id);
                }
              "
              >下载</Button
            ><Button
              type="link"
              danger
              @click="
                () => {
                  DRDelete(item.id);
                }
              "
              >删除</Button
            ></div
          >
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
    <!-- 查看全部数据 -->
    <MoreDr
      v-if="moreDRDrawerInfo.id"
      :drawer-info="moreDRDrawerInfo"
      @drawerOnClose="moreDRClose"
      @submit="moreDRSubmit"
    ></MoreDr>
  </div>
</template>

<script lang="ts">
  import { Popover, Button, Tooltip, message } from 'ant-design-vue';
  import { defineComponent, PropType, ref, reactive, watch, onBeforeMount, createVNode } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import UploadModal from './upload-modal.vue';
  import MoreFj, { UploadAA } from './more-fj.vue';
  import MscModal from './msc-modal.vue';
  import NkModal from './nk-modal.vue';
  import MoreDr from './more-dr.vue';
  import { getCustomerFileView, getCustomerFileRemove } from '/@/api/demo/customer';
  import confirm, { withConfirm } from 'ant-design-vue/es/modal/confirm';
  import { deleteDataReport, getDataReport } from '/@/api/demo/customer';
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
      Tooltip,
      UploadModal,
      MoreFj,
      MscModal,
      NkModal,
      MoreDr,
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
          window.open(
            `http://129.204.202.223:8001/basic-api/customer/file/downloadById?fileId=${id}`,
          );
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
      const MSCDrawerInfo = reactive({
        visible: false,
        type: undefined,
        itemDate: undefined,
        item: undefined,
        customerId: props.customerId,
      });
      const MSCAction = () => {
        MSCDrawerInfo.visible = true;
        //@ts-ignore
        MSCDrawerInfo.type = 'add';
        // MSCDrawerInfo.item = props.disease.mscData?.item;
      };
      const MSCClose = () => {
        MSCDrawerInfo.visible = false;
        MSCDrawerInfo.item = undefined;
        MSCDrawerInfo.itemDate = undefined;
      };
      const MSCSubmit = () => {
        MSCClose();
        emit('submit');
      };
      // NK
      const NKDrawerInfo = reactive({
        visible: false,
        type: undefined,
        itemDate: undefined,
        item: undefined,
        customerId: props.customerId,
      });
      const NKAction = () => {
        NKDrawerInfo.visible = true;
        //@ts-ignore
        NKDrawerInfo.type = 'add';
        // NKDrawerInfo.item = props.disease.nkData?.item;
      };
      const NKClose = () => {
        NKDrawerInfo.visible = false;
        NKDrawerInfo.item = undefined;
        NKDrawerInfo.itemDate = undefined;
      };
      const NKSubmit = () => {
        NKClose();
        emit('submit');
      };

      const DRDelete = (id: number) => {
        confirm(
          withConfirm({
            icon: createVNode(ExclamationCircleOutlined, { style: { color: '#faad14' } }),
            content: '确定删除msc项',
            async onOk() {
              const res = await deleteDataReport({ id });
              if (res) {
                message.success('删除msc项成功');
                emit('submit');
              }
            },
          }),
        );
      };
      const DRScan = async (id: number) => {
        const res = await getDataReport({ id });
        if (res) {
          if (res.name === 'msc') {
            MSCDrawerInfo.visible = true;
            //@ts-ignore
            MSCDrawerInfo.type = 'scan';
            MSCDrawerInfo.item = res?.item;
            MSCDrawerInfo.itemDate = res?.itemDate;
          }
        } else {
          NKDrawerInfo.visible = true;
          //@ts-ignore
          NKDrawerInfo.type = 'scan';
          NKDrawerInfo.item = res?.item;
          NKDrawerInfo.itemDate = res?.itemDate;
        }
      };
      const DREdit = async (id: number) => {
        const res = await getDataReport({ id });
        if (res) {
          if (res.name === 'msc') {
            MSCDrawerInfo.visible = true;
            //@ts-ignore
            MSCDrawerInfo.type = 'edit';
            MSCDrawerInfo.item = res?.item;
            MSCDrawerInfo.itemDate = res?.itemDate;
          }
        } else {
          NKDrawerInfo.visible = true;
          //@ts-ignore
          NKDrawerInfo.type = 'edit';
          NKDrawerInfo.item = res?.item;
          NKDrawerInfo.itemDate = res?.itemDate;
        }
      };
      const moreDRDrawerInfo = reactive({
        visible: false,
        id: props.customerId,
      });
      const moreDRAction = () => {
        moreDRDrawerInfo.visible = true;
      };
      const moreDRClose = () => {
        moreDRDrawerInfo.visible = false;
      };
      const moreDRSubmit = () => {
        emit('submit');
      };

      // 数据下载
      const dataReportDownload = (id: number) => {
        window.open(`http://129.204.202.223:8001/basic-api/customer/dataReport/export?id=${id}`);
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
        //数据分析
        DRScan,
        DREdit,
        DRDelete,
        dataReportDownload,
        moreDRDrawerInfo,
        moreDRAction,
        moreDRClose,
        moreDRSubmit,
        //msc
        MSCDrawerInfo,
        MSCAction,
        MSCClose,
        MSCSubmit,
        //nk
        NKDrawerInfo,
        NKAction,
        NKClose,
        NKSubmit,
      };
    },
  });
</script>
<style lang="less" scoped>
  .eee {
    display: flex;

    .block {
      width: 33.33%;
      padding: 0px 20px 0 0;

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
          height: auto;
        }
      }

      .content {
        margin-bottom: 16px;
        height: 153px;
        overflow: hidden;

        .item {
          height: 54px;
          margin-top: 8px;
          background: #f8f9fa;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .i-span {
            display: inline-block;
            width: 200px;
            white-space: nowrap;
            overflow: hidden;
            margin-right: 10px;
          }
        }
      }
    }
  }
</style>
