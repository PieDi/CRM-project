<template>
  <div>
    <p>病史记录</p>
    <Table :columns="columns" :dataSource="customerMHList" :bordered="true" :pagination="false">
      <template #bodyCell="{ column, _text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <Button
            type="link"
            @click="
              () => {
                lookMedicalHistory(record);
              }
            "
            >查看</Button
          >
        </template>
      </template>
    </Table>
    <medical-history-look
      v-if="recordTab.diseaseId"
      :diseaseId="recordTab.diseaseId"
      :visible="recordTab.visible"
      @confirm="onModalConfirm"
      @cancel="onModalCancel"
    />
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref } from 'vue';
  import { Table, Button } from 'ant-design-vue';
  import MedicalHistoryLook from './medical-history-look.vue';
  import { getCustomerMHList } from '/@/api/demo/customer';
  import { CustomerMHInfo } from '/@/api/demo/model/customer';
  import { type ColumnsType } from 'ant-design-vue/lib/table';

  export default defineComponent({
    components: {
      Table,
      Button,
      MedicalHistoryLook,
    },
    props: {
      customerId: {
        type: Number,
        required: true,
      },
    },
    setup(props) {
      const customerMHList = ref<Array<CustomerMHInfo>>([]);
      const customerMHListReq = async () => {
        const res = await getCustomerMHList(props.customerId);
        if (res) customerMHList.value = res;
      };
      onMounted(() => {
        customerMHListReq();
      });
      const columns: ColumnsType<CustomerMHInfo> = [
        {
          title: '医院名称',
          dataIndex: 'hospitalName',
        },
        {
          title: '科室',
          dataIndex: 'departmentName',
        },
        {
          title: '疾病名称',
          dataIndex: 'diseaseName',
        },
        {
          title: '操作',
          dataIndex: 'operation',
        },
      ];

      const recordTab = ref<{ visible: boolean, diseaseId: number | undefined }>({
        visible: false,
        diseaseId: undefined
      });
      // const visible = ref(false);
      const lookMedicalHistory = (o: CustomerMHInfo) => {
        recordTab.value.visible = true
        recordTab.value.diseaseId = o.id
      };

      const onModalConfirm = () => {
        recordTab.value.visible = false
        recordTab.value.diseaseId = undefined
      };

      const onModalCancel = () => {
        recordTab.value.visible = false
        recordTab.value.diseaseId = undefined
      };

      return {
        columns,
        recordTab,
        customerMHList,
        lookMedicalHistory,
        onModalConfirm,
        onModalCancel,
        customerId: props.customerId,
      };
    },
  });
</script>

<style lang="less" scoped></style>
