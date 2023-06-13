<template>
  <div class="info-content">{{ diseaseObject?.name }}</div>

  <div class="content">
    <UserOutlined />
    <span class="label">性别:</span>
    <span>{{ sex }}</span>
  </div>
  <div class="content">
    <CalendarOutlined />
    <span class="label">生日:</span>
    <span>{{ diseaseObject?.birth }}</span>
  </div>
  <div class="content">
    <PhoneOutlined />
    <span class="label">电话:</span>
    <span>{{ diseaseObject?.mobile }}</span>
  </div>
  <div class="content">
    <EnvironmentOutlined />
    <span class="label">地址:</span>
    <span>{{ diseaseObject?.contactAddress }}</span>
  </div>
  <div class="content">
    <CreditCardOutlined />
    <span class="label">证件类型:</span>
    <span>{{ docTypeMap[diseaseObject?.documentType as number] }}</span>
  </div>
  <div class="content">
    <IdcardOutlined />
    <span class="label">证件号码:</span>
    <span>{{ diseaseObject?.documentNumber }}</span>
  </div>

  <div class="content">
    <AuditOutlined />
    <span class="label">年龄:</span>
    <span>{{ diseaseObject?.age }}</span>
  </div>

  <div class="content">
    <CrownOutlined />
    <span class="label">客户等级:</span>
    <span>{{ diseaseObject?.level }}</span>
  </div>

  <div class="content">
    <EyeOutlined />
    <span class="label">客户来源:</span>
    <span>{{ source }}</span>
  </div>

  <div class="content">
    <ContactsOutlined />
    <span class="label">联系地址:</span>
    <span>{{ diseaseObject?.contactAddress }}</span>
  </div>

  <div class="content">
    <TeamOutlined />
    <span class="label">所属分组:</span>
    <span>{{ groupStr }}</span>
  </div>

  <div class="content">
    <BellOutlined />
    <span class="label">客户标签:</span>
    <span>{{ diseaseObject?.tag }}</span>
  </div>

  <div class="content">
    <PushpinOutlined />
    <span class="label">备注:</span>
    <span>{{ diseaseObject?.remark }}</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType, ref, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { CustomerInfo } from '/@/api/demo/model/customer';
  import { getCustomerGList, getCustomerSList } from '/@/api/demo/customer';
  import {
    CalendarOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    IdcardOutlined,
    CreditCardOutlined,
    UserOutlined,
    AuditOutlined,
    ContactsOutlined,
    BellOutlined,
    CrownOutlined,
    EyeOutlined,
    PushpinOutlined,
    TeamOutlined,
  } from '@ant-design/icons-vue';

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
    components: {
      CalendarOutlined,
      PhoneOutlined,
      EnvironmentOutlined,
      IdcardOutlined,
      CreditCardOutlined,
      UserOutlined,
      AuditOutlined,
      ContactsOutlined,
      BellOutlined,
      CrownOutlined,
      EyeOutlined,
      PushpinOutlined,
      TeamOutlined,
    },
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
    font-size: 20px;
    font-weight: 600;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  }
  // 添加测试信息
  .content {
    margin: 10px 0;
    padding-right: 10px;
    display: flex;
    align-items: center;
    .label {
      margin-left: 5px;
      display: inline-block;
      width: 80px;
    }
  }
  .content + .content {
    margin-top: 20px;
  }
</style>
<style lang="less">
  .ant-table {
    background: rgba(255, 255, 255, 0.2);
  }
</style>
