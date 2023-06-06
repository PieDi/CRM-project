<template>
   <div class="info-board">
      <div class="info-protial">
        <img src="@/assets/images/portail.png" alt="">
      </div>
      <div class="info-content">
        <div class="disease">
            <span>{{diseaseObject?.name}}</span>
        </div>
        <div class="order">  
            <span>{{sex}}</span>
        </div>
      </div>
    </div>
    <div class="content">
        <FormItem label="生日">
          <Input 
            :value="diseaseObject?.birth"
            :disabled="true"
            :style="{ width:'100%'}"
          />
        </FormItem>
    </div>
    <div class="content">
        <FormItem label="电话">
          <Input 
            :value="diseaseObject?.mobile"
            :disabled="true"
            :style="{ width:'100%'}"
          />
        </FormItem>
    </div>
    <div class="content">
        <FormItem label="地址">
          <Input 
            :value="diseaseObject?.contactAddress"
            :disabled="true"
            :style="{ width:'100%',height:'auto'}"
          />
        </FormItem>
    </div>

    <div class="content">
        <FormItem label="身份证">
          <Input 
            :value="diseaseObject?.documentNumber"
            :disabled="true"
            :style="{ width:'100%'}"
          />
        </FormItem>
    </div>
   

</template>

<script lang="ts">
   import { defineComponent, PropType } from 'vue';
   import dayjs from 'dayjs';
   import {  Form, Input, } from 'ant-design-vue';
   import {
    CustomerInfo,
  } from '/@/api/demo/model/customer';

  const FormItem = Form.Item;


  export default defineComponent({
    components: {
      FormItem,
      Input
    },
    props: {
      disease: {
        type: Object as PropType<CustomerInfo>,
      },
    },
    setup(props) {
      return {
        diseaseObject: props.disease,
        sex:props.disease?.sex != 1 ? "女" : "男",
        dayjs,
      };
    },
  });

</script>
<style lang="less" scoped>
   .info-board {
    margin-left:10px;
    margin-top: 30px;
    height: 60px;
    display: flex;
    .info-protial {
      background: #fff;
      width: 20%;
    }
    .info-content {
      margin-left: 1px;
      flex: 1;
      .disease {
        margin-left: 10px;
        width: 60%;
        height: 40%;        
      }
      .order {
        margin-left: 10px;
        width: 60%;
        height: 40%;
      }
    }
    // 添加测试信息
    .content {
       padding-left: 10px;
       padding-right: 10px;
    }
  }
</style>