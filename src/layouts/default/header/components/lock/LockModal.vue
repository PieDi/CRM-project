<template>
  <BasicModal
    :footer="null"
    title="修改密码"
    v-bind="$attrs"
    :class="prefixCls"
    @register="register"
  >
    <div :class="`${prefixCls}__entry`">
      <div :class="`${prefixCls}__header`">
        <!-- <img :src="avatar" :class="`${prefixCls}__header-img`" /> -->
        <p :class="`${prefixCls}__header-name`">
          {{ getRealName }}
        </p>
      </div>

      <BasicForm @register="registerForm" />

      <div :class="`${prefixCls}__footer`">
        <a-button type="primary" block class="mt-2" @click="handleLock"> 确定 </a-button>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { BasicModal, useModalInner } from '/@/components/Modal/index';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useUserStore } from '/@/store/modules/user';
  import { useLockStore } from '/@/store/modules/lock';
  import { modifyPwdApi, SHA256Encrypted } from '/@/api/sys/user';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'LockModal',
    components: { BasicModal, BasicForm },

    setup() {
      const { t } = useI18n();
      const { prefixCls } = useDesign('header-lock-modal');
      const userStore = useUserStore();
      const lockStore = useLockStore();

      const getRealName = computed(() => userStore.getUserInfo?.userName);
      const [register, { closeModal }] = useModalInner();

      const [registerForm, { validateFields, resetFields }] = useForm({
        showActionButtonGroup: false,
        schemas: [
          {
            field: 'password',
            label: '旧密码',
            labelWidth:'20%',
            colProps: {
              span: 24
            },
            component: 'InputPassword',
            required: true,
          },
          {
            field: 'newPassword',
            label: '新密码',
            labelWidth:'20%',
            colProps: {
              span: 24
            },
            component: 'InputPassword',
            required: true,
          },
          // {
          //   field: 'confirmNewPassword',
          //   label: ' 确认密码',
          //   labelWidth:'20%',
          //   colProps: {
          //     span: 24
          //   },
          //   component: 'InputPassword',
          //   required: true,
          // },
        ],
      });

      async function handleLock() {
        const values = (await validateFields()) as any;
        const password = values.password;
        const newPassword = values.newPassword;
        console.log(232323, values);
        if (password && newPassword) {
          const res = await modifyPwdApi({
            password: SHA256Encrypted(password),
            newPassword: SHA256Encrypted(newPassword),
          });
          if (res) {
            message.success('修改密码成功');
            userStore.confirmLoginOut();
            closeModal();
            await resetFields();
          }
        }
      }

      return {
        t,
        prefixCls,
        getRealName,
        register,
        registerForm,
        handleLock,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-lock-modal';

  .@{prefix-cls} {
    &__entry {
      position: relative;
      //height: 240px;
      padding: 30px;
      border-radius: 10px;
    }

    &__header {
      position: absolute;
      top: 0;
      left: calc(50% - 45px);
      width: auto;
      text-align: center;

      &-img {
        width: 70px;
        border-radius: 50%;
      }

      &-name {
        margin-top: 5px;
      }
    }

    &__footer {
      text-align: center;
    }
  }
</style>
