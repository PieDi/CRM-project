<template>
  <div class="aaa">
    <div class="info-content">
      <span class="a">{{ diseaseObject?.surName || 'z' }}</span>
      <span>{{ diseaseObject?.name }}</span>
      <span class="b">{{ diseaseObject?.age }}</span>
      <span class="b">{{ sex }}</span>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-birth.png" />
        <div class="right">
          <div>生日:</div>
          <div class="label">{{ diseaseObject?.birth }}</div>
        </div>
      </div>
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-mobile.png" />
        <div class="right">
          <div>电话:</div>
          <div class="label">{{ diseaseObject?.mobile }}</div>
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
        <div class="label">{{ docTypeMap[diseaseObject?.documentType as number] }}</div>
      </div>
    </div>
    <div class="content">
      <img src="/src/assets/images/info-cardNo.png" />
      <div class="right">
        <div>证件号码:</div>
        <div class="label">{{ diseaseObject?.documentNumber }}</div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-level.png" />
        <div class="right">
          <div>客户等级:</div>
          <div class="label">{{ diseaseObject?.level }}</div>
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
        <img src="/src/assets/images/info-cAddress.png" />
        <div class="right">
          <div>联系地址:</div>
          <div class="label">脉仕希</div>
        </div>
      </div>

      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-group.png" />
        <div class="right">
          <div>所属分组:</div>
          <div class="label">{{ groupStr }}</div>
        </div>
      </div>
    </div>

    <div :style="{ display: 'flex' }">
      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-tag.png" />
        <div class="right">
          <div>客户标签:</div>
          <div class="label">{{ diseaseObject?.tag }}</div>
        </div>
      </div>

      <div class="content" :style="{ width: '50%' }">
        <img src="/src/assets/images/info-tag.png" />
        <div class="right">
          <div>备注:</div>
          <div class="label">{{ diseaseObject?.remark }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted } from 'vue';
import dayjs from 'dayjs';
import { CustomerInfo } from '/@/api/demo/model/customer';
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
      type: Object as PropType<CustomerInfo>,
      required: true,
    },
  },
  components: {},
  setup(props) {
    const groupStr = ref<string>('');
    const getCustomerG = async () => {
      const res = await getCustomerGList();
      if (res) groupStr.value = res.find((o) => o.id === props?.disease?.groupId)?.name || '';
    };
    const source = ref<string>('');
    const getCustomerS = async () => {
      const res = await getCustomerSList();
      if (res) source.value = res.find((o) => o.id === props?.disease?.sourceId)?.name || '';
    };
    onMounted(() => {
      getCustomerG();
      getCustomerS();
    });
    return {
      diseaseObject: props.disease,
      sex: props.disease?.sex != 1 ? '女' : '男',
      dayjs,
      docTypeMap,
      groupStr,
      source,
    };
  },
});
</script>
<style lang="less" scoped>
.info-content {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebebeb;
  span {
    display: inline-block;
    margin-right: 16px;
  }

  span+span {
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
    width: 32px;
    background: rgba(255, 45, 112, 0.1);
    text-align: center;
    border-radius: 4px;
  }
}

// 添加测试信息
.content {
  display: flex;
  margin-top: 16px;

  img {
    width: 16px;
    height: 16px;
    margin-top: 4px;
    margin-right: 5px;
  }

  .label {
    color: #2E354F
  }
}
</style>
<style lang="less">
.ant-table {
  background: rgba(255, 255, 255, 0.2);
}
</style>
