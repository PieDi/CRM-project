<template>
  <div class="aaa">
    <div class="info-content">
      <span class="a">{{ diseaseObject?.surName || 'z' }}</span>
      <span>{{ diseaseObject?.name }}</span>
      <span v-if="diseaseObject?.type === 1" class="b">{{ diseaseObject?.age }}</span>
      <span v-if="diseaseObject?.type === 1" class="b">{{ sex }}</span>
      <Button type="link" size="small" @click="drawerEdit"> 编辑 </Button>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%', marginTop: '16px' }">
        <img src="/src/assets/images/info-birth.png" />
        <div class="right">
          <div>生日:</div>
          <div class="label">{{ diseaseObject?.type === 1 ? diseaseObject?.birth : '' }}</div>
        </div>
      </div>
      <div class="content" :style="{ width: '50%', marginTop: '16px' }">
        <img src="/src/assets/images/info-mobile.png" />
        <div class="right">
          <div>电话:</div>
          <div class="label">{{
            diseaseObject?.type === 1 ? diseaseObject?.mobile : diseaseObject?.contactMobile
          }}</div>
        </div>
      </div>
    </div>

    <div class="content">
      <img src="/src/assets/images/info-address.png" />
      <div class="right">
        <div>地址:</div>
        <div class="label">{{ diseaseObject?.contactAddress }}</div>
      </div>
    </div>
    <div class="content">
      <img src="/src/assets/images/info-card.png" />
      <div class="right">
        <div>证件类型:</div>
        <div class="label">{{
          diseaseObject?.type === 1 ? docTypeMap[diseaseObject?.documentType as number] : '企业用户'
        }}</div>
      </div>
    </div>
    <div class="content">
      <img src="/src/assets/images/info-cardNo.png" />
      <div class="right">
        <div>证件号码:</div>
        <div class="label">{{
          diseaseObject?.type === 1 ? diseaseObject?.documentNumber : diseaseObject?.uscc
        }}</div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-level.png" />
        <div class="right">
          <div>客户等级:</div>
          <div class="label">{{ diseaseObject?.levelName }}</div>
        </div>
      </div>

      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-source.png" />
        <div class="right">
          <div>客户来源:</div>
          <div class="label">{{ source }}</div>
        </div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-group.png" />
        <div class="right">
          <div>所属分组:</div>
          <div class="label">{{ groupStr }}</div>
        </div>
      </div>
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-tag.png" />
        <div class="right">
          <div>客服:</div>
          <div class="label">{{ diseaseObject?.agent }}</div>
        </div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-tag.png" />
        <div class="right">
          <div>备注:</div>
          <div class="label">{{ diseaseObject?.remark }}</div>
        </div>
      </div>
    </div>

    <GRCustomer
      v-if="grDrawerInfo.id"
      :customer-id="grDrawerInfo.id"
      :gr-drawer-info="grDrawerInfo"
      @drawerOnClose="grOnClose"
      @submit="grSubmit"
    ></GRCustomer>
    <QYCustomer
      v-if="qyDrawerInfo.id"
      :customer-id="qyDrawerInfo.id"
      :qy-drawer-info="qyDrawerInfo"
      @drawerOnClose="qyOnClose"
      @submit="qySubmit"
    ></QYCustomer>
    
  </div>
</template>

<script lang="ts">
  import { Button } from 'ant-design-vue';
  import { defineComponent, PropType, ref, reactive, watch, onBeforeMount } from 'vue';
import GRCustomer from './gr-customer.vue';
  import QYCustomer from './qy-customer.vue';
  import { getCustomerGList, getCustomerSList } from '/@/api/demo/customer';
  const docTypeMap: Record<number, string> = {
    1: '身份证',
    2: '护照',
    3: '军官证',
    4: '港澳通行证',
    5: '台湾通行证',
  };

  export default defineComponent({
    props: {
      disease: {
        type: Object as PropType<any>,
        required: true,
      },
      callback: Function,
    },
    components: {
      Button,
      GRCustomer,
      QYCustomer
    },
    setup(props) {
      const groupStr = ref<string>('');
      const getCustomerG = async () => {
        const res = await getCustomerGList();
        if (res) {
          groupStr.value = res.find((o) => o.id === props?.disease?.groupId)?.name || '';
        }
      };
      const source = ref<string>('');

      const getCustomerS = async () => {
        const res = await getCustomerSList();
        if (res) {
          source.value = res.find((o) => o.id === props?.disease?.sourceId)?.name || '';
        }
      };

      onBeforeMount(() => {
        getCustomerG();
        getCustomerS();
      });
      const grDrawerInfo = reactive({
        visible: false,
        id: undefined,
      });
      const qyDrawerInfo = reactive({
        visible: false,
        id: undefined,
      });
      const drawerEdit = async () => {
        if (props?.disease?.type === 1) {
          // 个人用户
          grDrawerInfo.visible = true;
          grDrawerInfo.id = props.disease.id;
        } else {
          // 企业用户
          qyDrawerInfo.visible = true;
          qyDrawerInfo.id = props.disease.id;
        }
      };
      const grOnClose = () => {
        grDrawerInfo.visible = false;
        grDrawerInfo.id = undefined;
      };
      const grSubmit = () => {
        grOnClose()
        if (props.callback) props.callback();
      };
      const qyOnClose = () => {
        qyDrawerInfo.visible = false;
        qyDrawerInfo.id = undefined;
      };
      const qySubmit = () => {
        qyOnClose()
        if (props.callback) props.callback();
      };
      const diseaseObject = ref();
      watch(
        () => props.disease,
        () => {
          diseaseObject.value = props.disease;
        },
        { immediate: true },
      );
      return {
        diseaseObject,
        sex: props.disease?.sex != 1 ? '女' : '男',
        docTypeMap,
        groupStr,
        source,
        drawerEdit,
        grDrawerInfo,
        grOnClose,
        grSubmit,
        qyDrawerInfo,
        qyOnClose,
        qySubmit,
      };
    },
  });
</script>
<style lang="less" scoped>
  .aaa {
    .info-content {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #ebebeb;
      span {
        display: inline-block;
        margin-right: 16px;
      }

      span + span {
        height: 22px;
        font-size: 16px;
        color: #ff2d70;
        line-height: 22px;
      }

      .a {
        width: 48px;
        height: 48px;
        background: #99a8bf;
        border-radius: 8px;
        color: #fff;
        font-size: 28px;
        text-align: center;
      }

      .b {
        width: 22px;
        background: rgba(255, 45, 112, 0.1);
        text-align: center;
        border-radius: 4px;
      }
    }

    // 添加测试信息
    .content {
      display: flex;
      margin-top: 26px;

      img {
        width: 16px;
        height: 16px;
        margin-top: 4px;
        margin-right: 5px;
      }

      .label {
        color: #2e354f;
      }
    }
  }
</style>
