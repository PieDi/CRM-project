<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="销售委派"
    @cancel="drawerOnClose"
    @ok="submit"
    width="50%"
    :visible="visible"
  >
    <Form :labelCol="{ span: 4 }">
      <FormItem label="委派客服">
        <Select placeholder="请选择" v-model:value="drawerInfo.saleId">
          <SelectOption v-for="item in staffSourceData" :key="item.sale">{{
            item.realName
          }}</SelectOption>
        </Select>
      </FormItem>
    </Form>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
  import { Form, Modal, Select, message } from 'ant-design-vue';
  import { getUserList } from '/@/api/sys/user';
  import { UserInfo } from '/#/store';
  import { assignSale } from '/@/api/demo/customer';

  const FormItem = Form.Item;
  const SelectOption = Select.Option;
  export default defineComponent({
    components: {
      Form,
      FormItem,
      Modal,
      Select,
      SelectOption,
    },
    props: {
      xsModal: {
        type: Object as PropType<{ visible: boolean; id: any; saleId: any }>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const drawerInfo = reactive<{ saleId: number | undefined; id: number | undefined }>({
        id: props.xsModal.id,
        saleId: undefined
      });
      const staffSourceData = ref<UserInfo[]>([]);
      onBeforeMount(async () => {
        const res = await getUserList({ sale: 1 });
        if (res) staffSourceData.value = res;
      });

      const drawerOnClose = () => {
        emit('drawerOnClose');
        drawerInfo.saleId = undefined;
        drawerInfo.id = undefined;
      };

      const submit = async () => {
        const res = await assignSale({ ...drawerInfo });
        if (res) {
          message.success('委派销售成功');
          drawerOnClose();
          emit('submit')
        }
      };

      return {
        visible: props?.xsModal?.visible,
        drawerInfo,
        drawerOnClose,
        submit,
        staffSourceData,
      };
    },
  });
</script>
<style lang="less" scoped></style>
