<template>
  <Drawer
    :mask-closable="false"
    :destroy-on-close="true"
    :title="drawerInfo.title"
    placement="right"
    @close="drawerOnClose"
    :visible="drawerInfo.visible"
  >
    <template #extra>
      <Button v-if="drawerInfo.type === 'scan'" type="link" @click="edit">编辑</Button>
      <Button v-if="drawerInfo.type !== 'scan'" type="link" @click="add">新增</Button>
      <Button v-if="drawerInfo.type !== 'scan'" type="primary" @click="submit">提交</Button>
    </template>
    <template v-if="listInfo.length === 0">
      <div>{{ `暂时没有相关记录${editAble ? '' : '，请点击编辑后开始新增'}` }} </div>
    </template>
    <template v-else>
      <Form :labelCol="{ span: 6 }">
        <template v-for="(item, i) in listInfo">
          <div>
            <FormItem label="用药记录">
              <Input placeholder="请输入" allowClear :value="item.name" />
            </FormItem>
            <FormItem label="用药时间">
              <DatePicker :show-time="true" />
            </FormItem>

            <FormItem label="药物名称">
              <Input placeholder="请输入" allowClear :value="item.name" />
            </FormItem>

            <FormItem label="附件">
              <Input placeholder="请输入" allowClear :value="item.name" />
            </FormItem>
            <template v-if="i !== 0">
              <Button
                type="link"
                @click="
                  () => {
                    deleteRecord(i);
                  }
                "
              >
                <template #icon><DeleteOutlined /></template
              ></Button>
            </template>
          </div>
        </template>
      </Form>
    </template>
  </Drawer>
</template>
<script lang="ts">
  import { defineComponent, ref, PropType } from 'vue';
  import { Table, Form, Input, Button, Drawer, DatePicker } from 'ant-design-vue';
  import { DeleteOutlined } from '@ant-design/icons-vue';
  import dayjs, { Dayjs } from 'dayjs';
  import { DrawerItemType } from '/@/views/type';

  const FormItem = Form.Item;

  export default defineComponent({
    components: {
      Table,
      Form,
      FormItem,
      Input,
      Button,
      Drawer,
      DatePicker,
      DeleteOutlined,
    },
    props: {
      drawerInfo: {
        type: Object as PropType<DrawerItemType>,
        default: () => ({ visible: false, title: '' }),
      },
    },
    setup(props, { emit }) {
      const listInfo = ref<Array<{ name: string; id?: number | string; des: string }>>([]);
      const editAble = ref(false);
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = () => {
        emit('submit', listInfo.value);
      };
      const edit = () => {
        editAble.value = true;
        emit('edit');
      };
      const add = () => {
        listInfo.value.push({
          name: '',
          id: undefined,
          des: '',
        });
      };
      const deleteRecord = (i: number) => {
        listInfo.value.splice(i, 1);
      };
      return {
        editAble,
        drawerInfo: props.drawerInfo,
        listInfo,
        drawerOnClose,
        submit,
        edit,
        add,
        deleteRecord,
      };
    },
  });
</script>
<style lang="less" scoped></style>
