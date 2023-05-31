<template>
  <div class="return-list__filter-wrapper">
    <FormItem label="患者姓名" style="margin-left: 10px;">
      <Input v-model:value="name" placeholder="患者姓名" :style="{ width: '150px' }" />
    </FormItem>
    
    <!-- <FormItem label="联系电话" style="margin-left: 10px;">
      <Input v-model:value="mobile" placeholder="请输入" :maxlength="11" style="width: 150px;" />
    </FormItem>
    
    <FormItem label="执行人员" style="margin-left: 10px;">
      <Input v-model:value="staff" placeholder="请输入" style="width: 100px;" />
    </FormItem>

    <FormItem label="日期" style="margin-left: 10px;">
      <DateRangePicker v-model:value="date" />
    </FormItem> -->

    <!-- <FormItem label="患者等级" style="margin-left: 10px;">
      <Select placeholder="请选择" style="width: 100px;">
        <SelectOption key="1">Level 1</SelectOption>
        <SelectOption key="2">Level 2</SelectOption>
      </Select>
    </FormItem> -->

    <!-- <FormItem label="患者来源" style="margin-left: 10px;">
      <Select placeholder="请选择" style="width: 100px;">
        <SelectOption key="1">市区</SelectOption>
        <SelectOption key="2">农村</SelectOption>
      </Select>
    </FormItem> -->

    <FormItem label="回访类型" style="margin-left: 10px;">
      <Select placeholder="请选择" :style="{ width: '150px' }">
        <SelectOption key="1">回访类型1</SelectOption>
        <SelectOption key="2">回访类型2</SelectOption>
      </Select>
    </FormItem>
    
    <!-- <FormItem label="标签" style="margin-left: 10px;">
      <Select placeholder="请选择">
        <SelectOption key="1">标签1</SelectOption>
        <SelectOption key="2">标签2</SelectOption>
      </Select>
    </FormItem>

    <FormItem label="疾病种类" style="margin-left: 10px;">
      <Select placeholder="请选择" style="width: 120px;">
        <SelectOption key="1">疾病种类1</SelectOption>
        <SelectOption key="2">疾病种类2</SelectOption>
      </Select>
    </FormItem> -->
    <Button type="primary" style="margin-left: 10px" @click="reset">重置</Button>
    <Button type="primary" style="margin-left: 10px;" @click="search">搜索</Button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, unref } from 'vue'
import { Form, Input, Select, DatePicker, Button } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
type RangeValue = [Dayjs, Dayjs]

const DateRangePicker = DatePicker.RangePicker
const FormItem = Form.Item
const SelectOption = Select.Option
export default defineComponent({
  components: {
    FormItem,
    Input,
    DateRangePicker,
    Select,
    SelectOption,
    Button
  },
  setup(props, { emit }) {
    const name = ref<string>('')
    const mobile = ref<string>('')
    const staff = ref<string>()
    const date = ref<RangeValue>()
    const search = () => {
      console.log(`name is ${unref(name)}`)
      console.log(`mobile is ${unref(mobile)}`)
      console.log(`staff is ${unref(staff)}`)
      console.log(JSON.stringify(unref(date)))
      emit('search')
    }
    const reset = () => { 
      emit('search')
    }
    return {
      name,
      mobile,
      staff,
      date,
      search,
      reset
    }
  }
})
</script>

<style lang="less" scoped>
.return-list__filter-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>