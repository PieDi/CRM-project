<template>
  <div>
    <p>病史记录</p>
    <Table
      :columns="columns"
      :dataSource="datas"
      :bordered="true"
      :pagination="false"
    >
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'operation'">
          <Button type="link" @click="lookMedicalHistory">查看</Button>
        </template>
      </template>
    </Table>
    <medical-history-look :visible="visible" @confirm="onModalConfirm" @cancel="onModalCancel" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Table, Button } from 'ant-design-vue'
import MedicalHistoryLook from './medical-history-look.vue'

export default defineComponent({
  components: {
    Table,
    Button,
    MedicalHistoryLook
  },
  setup() {
    const columns: any = ref([
      {
        title: '医院名称',
        dataIndex: 'hospital'
      },
      {
        title: '科室',
        dataIndex: 'departments'
      },
      {
        title: '疾病名称',
        dataIndex: 'illness'
      },
      {
        title: '操作',
        dataIndex: 'operation'
      }
    ])
    const getDatas = () => {
      const datas: any = []
      for (let index = 0; index < 3; index++) {
        datas.push({
          hospital: '上海虹桥医院',
          departments: '内科',
          illness: '呼吸疾病'
        })
      }
      return datas
    }

    const visible = ref(false)
    const lookMedicalHistory = () => {
      visible.value = true
    }

    const onModalConfirm = () => {
      visible.value = false
    }

    const onModalCancel = () => {
      visible.value = false
    }

    return {
      columns,
      datas: getDatas(),
      visible,
      lookMedicalHistory,
      onModalConfirm,
      onModalCancel
    }
  }
})
</script>

<style lang="less" scoped>

</style>