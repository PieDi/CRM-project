<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="客户等级"
    @cancel="drawerOnClose"
    @ok="submit"
    width="50%"
    :visible="visible"
  >
    <Form :labelCol="{ span: 4 }">
      <Form :labelCol="{ span: 4 }">
        <FormItem label="客户等级">
          <Select placeholder="请选择" v-model:value="drawerInfo.level">
            <SelectOption v-for="item in customerLevelList" :key="item.id">{{
              item.name
            }}</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </Form>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, ref, onBeforeMount, reactive } from 'vue';
  import { Form, Modal, Select, message } from 'ant-design-vue';
import { getCustomerLList, updateCustomerLevel } from '/@/api/demo/customer';
  
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
      levelModal: {
        type: Object as PropType<{ visible: boolean; id: any; level: any }>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const drawerInfo = reactive<{ level: number | undefined; id: number | undefined }>({
        id: props.levelModal.id,
        level: props.levelModal.level,
      });

      const customerLevelList = ref<any[]>([]);
      onBeforeMount(async () => {
        const res = await getCustomerLList();
        if (res) customerLevelList.value = res;
      });

      const drawerOnClose = () => {
        emit('drawerOnClose');
        drawerInfo.level = undefined;
        drawerInfo.id = undefined;
      };

      const submit = async () => {
        const res = await updateCustomerLevel({ ...drawerInfo });
        if (res) {
          message.success('修改用户信息成功');
          drawerOnClose();
          emit('submit')
        }
      };

      return {
        visible: props?.levelModal?.visible,
        drawerInfo,
        drawerOnClose,
        submit,
        customerLevelList,
      };
    },
  });
</script>
<style lang="less" scoped></style>
