<template>
  <Modal
    :mask-closable="false"
    :destroy-on-close="true"
    title="NK"
    @cancel="drawerOnClose"
    @ok="submit"
    :visible="drawerInfo.visible"
    :width="860"
  >
    <div class="msc-nk">
      <div class="block">
        <h3>血常规</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of xcgColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="xcgData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>凝血功能</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of nxColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="nxData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>血糖</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of xtColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="xtData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>肝肾功能</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of gsColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="gsData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>血脂</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of xzColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="xzData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>尿常规</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of ncgColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="ncgData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>淋巴细胞免疫表型</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of lbxbmybxColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input
              :disabled="drawerInfo.type === 'scan'"
              v-model:value="lbxbmybxData[item.value]"
            />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>甲状腺功能</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of jzxColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="jzxData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>心脏功能</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of xzgnColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="xzgnData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>传染性疾病功能</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of crxjbColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="crxjbData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>呼吸道IgM抗体5联</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of hxdColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="hxdData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
      <div class="block">
        <h3>流感病毒IgM抗体5联</h3>
        <div class="item">
          <div class="label">名称</div>
          <div class="value">结果</div>
          <div class="ckValue">参考区间</div>
          <div class="unit">单位</div>
        </div>
        <div v-for="item of lgbdColumn" class="item">
          <div class="label">{{ item.label }}</div>

          <div class="value">
            <Input :disabled="drawerInfo.type === 'scan'" v-model:value="lgbdData[item.value]" />
          </div>
          <div class="ckValue">{{ item.ckValue }}</div>
          <div class="unit">{{ item.unit }}</div>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
  import { defineComponent, reactive, PropType, computed, onBeforeMount } from 'vue';
  import { Input, Button, Modal, message } from 'ant-design-vue';
  import { saveDataReport } from '/@/api/demo/customer';

  export default defineComponent({
    components: {
      Input,
      Button,
      Modal,
    },
    props: {
      customerId: {
        type: Number,
        required: true,
      },
      drawerInfo: {
        type: Object as PropType<any>,
        required: true,
      },
    },
    setup(props, { emit }) {
      const drawerOnClose = () => {
        emit('drawerOnClose');
      };
      const submit = async () => {
        if (props.drawerInfo.type === 'sacn') {
          emit('drawerOnClose');
          return;
        }
        const res = await saveDataReport({
          name: 'nk',
          customerId: props.customerId,
          item: {
            cbc: { ...xcgData },
            inr: { ...nxData },
            glu: { ...xtData },
            lkf: { ...gsData },
            bl: { ...xzData },
            ua: { ...ncgData },
            lym: { ...lbxbmybxData },
            tf: { ...jzxData },
            cf: { ...xzgnData },
            std: { ...crxjbData },
            rt: { ...hxdData },
            iv: { ...lgbdData },
          },
        });
        if (res) {
          message.success('更新信息成功');
          emit('submit');
        }
      };
      //血常规
      const xcgColumn = computed(() => {
        return [
          {
            label: 'C反应蛋白',
            value: 'cbc1',
            ckValue: '<10',
            unit: 'mg/L',
          },
          {
            label: '白细胞计数',
            value: 'cbc2',
            ckValue: '3.50~9.50',
            unit: '10^9/L',
          },
          {
            label: '红细胞计数',
            value: 'cbc3',
            ckValue: '4.30~5.80',
            unit: '10^12/L',
          },
          {
            label: '血红蛋白',
            value: 'cbc4',
            ckValue: '130~175',
            unit: 'G/L',
          },
          {
            label: '血小板计数',
            value: 'cbc5',
            ckValue: '125~350',
            unit: '10^9/L',
          },
          {
            label: '中性粒细胞%',
            value: 'cbc6',
            ckValue: '40.0~75.0',
            unit: '%',
          },
          {
            label: '淋巴细胞%',
            value: 'cbc7',
            ckValue: '20.0~50.0',
            unit: '%',
          },
          {
            label: '单核细胞%',
            value: 'cbc8',
            ckValue: '3.0~10.0',
            unit: '%',
          },
          {
            label: '嗜酸细胞%',
            value: 'cbc9',
            ckValue: '0.4~8.0',
            unit: '%',
          },
          {
            label: '嗜碱细胞%',
            value: 'cbc10',
            ckValue: '0~1.0',
            unit: '%',
          },
          {
            label: '中性粒细胞绝对值',
            value: 'cbc11',
            ckValue: '1.80~6.30',
            unit: '10^9/L',
          },
          {
            label: '淋巴细胞绝对值',
            value: 'cbc12',
            ckValue: '1.10~3.20',
            unit: '10^9/L',
          },
          {
            label: '单核细胞绝对值',
            value: 'cbc13',
            ckValue: '0~1.0',
            unit: '10^9/L',
          },
          {
            label: '嗜酸细胞绝对值',
            value: 'cbc14',
            ckValue: '0.02~0.52',
            unit: '10^9/L',
          },
          {
            label: '嗜碱细胞绝对值',
            value: 'cbc15',
            ckValue: '0~0.06',
            unit: '10^9/L',
          },
          {
            label: '红细胞压积',
            value: 'cbc16',
            ckValue: '40~50',
            unit: '%',
          },
          {
            label: '平均红细胞体积',
            value: 'cbc17',
            ckValue: '82.0~100.0',
            unit: 'FL',
          },
          {
            label: '平均血红蛋白含量',
            value: 'cbc18',
            ckValue: '27.0~34.0',
            unit: 'PG',
          },
          {
            label: '平均血红蛋白浓度',
            value: 'cbc19',
            ckValue: '316~354',
            unit: 'g/L',
          },
          {
            label: '血小板比积',
            value: 'cbc20',
            ckValue: '0.108~0.0272',
            unit: 'FL',
          },
          {
            label: '平均血小板体积',
            value: 'cbc21',
            ckValue: '9.4~12.5',
            unit: 'FL',
          },
          {
            label: '血小板分布宽度',
            value: 'cbc22',
            ckValue: '',
            unit: '%',
          },
          {
            label: '红细胞分布宽度CV',
            value: 'cbc23',
            ckValue: '',
            unit: '%',
          },
          {
            label: '红细胞分布宽度SD',
            value: 'cbc24',
            ckValue: '',
            unit: '%',
          },
          {
            label: '大型血小板比例',
            value: 'cbc25',
            ckValue: '',
            unit: '%',
          },
        ];
      });
      const xcgData = reactive({
        cbc1: undefined,
        cbc2: undefined,
        cbc3: undefined,
        cbc4: undefined,
        cbc5: undefined,
        cbc6: undefined,
        cbc7: undefined,
        cbc8: undefined,
        cbc9: undefined,
        cbc10: undefined,
        cbc11: undefined,
        cbc12: undefined,
        cbc13: undefined,
        cbc14: undefined,
        cbc15: undefined,
        cbc16: undefined,
        cbc17: undefined,
        cbc18: undefined,
        cbc19: undefined,
        cbc20: undefined,
        cbc21: undefined,
        cbc22: undefined,
        cbc23: undefined,
        cbc24: undefined,
        cbc25: undefined,
      });

      //凝血功能
      const nxColumn = computed(() => {
        return [
          {
            label: 'D-二聚体（金标斑点法）',
            value: 'inr1',
            ckValue: '0~0.30',
            unit: 'mg/L',
          },
        ];
      });
      const nxData = reactive({
        inr1: undefined,
      });

      //血糖
      const xtColumn = computed(() => {
        return [
          {
            label: '糖化血红蛋白',
            value: 'glu1',
            ckValue: '4.0~6.0',
            unit: '%',
          },
          {
            label: '胰岛素',
            value: 'glu2',
            ckValue: '空腹13~161',
            unit: 'pmol/',
          },
        ];
      });
      const xtData = reactive({
        glu1: undefined,
        glu2: undefined,
      });

      //肝肾
      const gsColumn = computed(() => {
        return [
          {
            label: '总蛋白',
            value: 'lkf1',
            ckValue: '65~88',
            unit: 'g/L',
          },
          {
            label: '白蛋白',
            value: 'lkf2',
            ckValue: '40~55',
            unit: 'g/L',
          },
          {
            label: '球蛋白',
            value: 'lkf3',
            ckValue: '20~40',
            unit: 'g/L',
          },
          {
            label: '白球比例',
            value: 'lkf4',
            ckValue: '1.2~2.5',
            unit: '',
          },
          {
            label: '前白蛋白',
            value: 'lkf5',
            ckValue: '250~400',
            unit: 'mg/L',
          },
          {
            label: '总胆红素',
            value: 'lkf6',
            ckValue: '0~23',
            unit: 'umol/L',
          },
          {
            label: '直接胆红素',
            value: 'lkf7',
            ckValue: '0~4.0',
            unit: 'umol/L',
          },
          {
            label: '间接胆红素',
            value: 'lkf8',
            ckValue: '<12',
            unit: 'umol/L',
          },
          {
            label: '总胆汁酸',
            value: 'lkf9',
            ckValue: '0.1~10.0',
            unit: 'umol/L',
          },
          {
            label: '谷丙转氨酶',
            value: 'lkf10',
            ckValue: '7~45',
            unit: 'U/L',
          },
          {
            label: '谷草转氨酶',
            value: 'lkf11',
            ckValue: '13~40',
            unit: 'U/L',
          },
          {
            label: '谷氨酸转肽酶',
            value: 'lkf12',
            ckValue: '7~45',
            unit: 'U/L',
          },
          {
            label: '碱性磷酸酶',
            value: 'lkf13',
            ckValue: '35~135',
            unit: 'U/L',
          },
          {
            label: '葡萄糖',
            value: 'lkf14',
            ckValue: '4.10~5.90',
            unit: 'mmol/L',
          },
          {
            label: '尿素氮',
            value: 'lkf15',
            ckValue: '2.60~8.80',
            unit: 'mmol/L',
          },
          {
            label: '肌酐',
            value: 'lkf16',
            ckValue: '35~80',
            unit: 'umol/L',
          },
          {
            label: '尿酸',
            value: 'lkf17',
            ckValue: '155~357',
            unit: 'umol/L',
          },
          {
            label: '估算肾小球滤过率',
            value: 'lkf18',
            ckValue: '90~120ml/min/1.73m^2',
            unit: '',
          },
          {
            label: '总胆固醇',
            value: 'lkf19',
            ckValue: '0.10~5.18',
            unit: 'mmol/L',
          },
        ];
      });
      const gsData = reactive({
        lkf1: undefined,
        lkf2: undefined,
        lkf3: undefined,
        lkf4: undefined,
        lkf5: undefined,
        lkf6: undefined,
        lkf7: undefined,
        lkf8: undefined,
        lkf9: undefined,
        lkf10: undefined,
        lkf11: undefined,
        lkf12: undefined,
        lkf13: undefined,
        lkf14: undefined,
        lkf15: undefined,
        lkf16: undefined,
        lkf17: undefined,
        lkf18: undefined,
        lkf19: undefined,
      });

      //血脂
      const xzColumn = computed(() => {
        return [
          {
            label: '甘油三酯',
            value: 'bl1',
            ckValue: '0.10~1.70',
            unit: 'mmol/L',
          },
          {
            label: '高密度脂蛋白胆固醇',
            value: 'bl2',
            ckValue: '1.29~1.55',
            unit: 'mmol/L',
          },
          {
            label: '低密度脂蛋白胆固醇',
            value: 'bl3',
            ckValue: '0.10~3.37',
            unit: 'mmol/L',
          },
        ];
      });
      const xzData = reactive({
        bl1: undefined,
        bl2: undefined,
        bl3: undefined,
      });
      //尿常规
      const ncgColumn = computed(() => {
        return [
          {
            label: '<有效成分定量>',
            value: 'ua1',
            ckValue: '',
            unit: '',
          },
          {
            label: '比重',
            value: 'ua2',
            ckValue: '1.003~1.030',
            unit: '',
          },
          {
            label: 'PH',
            value: 'ua3',
            ckValue: '4.5~8.0',
            unit: '',
          },
          {
            label: '白细胞脂酶',
            value: 'ua4',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '亚硝酸盐',
            value: 'ua5',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '蛋白质%',
            value: 'ua6',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '葡萄糖',
            value: 'ua7',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '酮体',
            value: 'ua8',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '尿胆原',
            value: 'ua9',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '胆红素',
            value: 'ua10',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '隐血',
            value: 'ua11',
            ckValue: '',
            unit: '',
          },
          {
            label: '颜色',
            value: 'ua12',
            ckValue: '',
            unit: '',
          },
          {
            label: '透明度',
            value: 'ua13',
            ckValue: '',
            unit: '',
          },
          {
            label: '上皮细胞',
            value: 'ua14',
            ckValue: '0~8.00',
            unit: '/ul',
          },
          {
            label: '白细胞',
            value: 'ua15',
            ckValue: '0~23.0',
            unit: '/ul',
          },
          {
            label: '红细胞',
            value: 'ua16',
            ckValue: '0~15.0',
            unit: '/ul',
          },
          {
            label: '管型',
            value: 'ua17',
            ckValue: '82.0~100.0',
            unit: '0~1.00',
          },
          {
            label: '细菌',
            value: 'ua18',
            ckValue: '3.00~385.00',
            unit: '/ul',
          },
          {
            label: '酵母样细胞',
            value: 'ua19',
            ckValue: '316~354',
            unit: '阴性-或阳性+',
          },
          {
            label: '结晶',
            value: 'ua20',
            ckValue: '0.108~0.0272',
            unit: '阴性-或阳性+',
          },
          {
            label: '红细胞信息',
            value: 'ua21',
            ckValue: '9.4~12.5',
            unit: '阴性-或阳性+',
          },
        ];
      });
      const ncgData = reactive({
        ua1: undefined,
        ua2: undefined,
        ua3: undefined,
        ua4: undefined,
        ua5: undefined,
        ua6: undefined,
        ua7: undefined,
        ua8: undefined,
        ua9: undefined,
        ua10: undefined,
        ua11: undefined,
        ua12: undefined,
        ua13: undefined,
        ua14: undefined,
        ua15: undefined,
        ua16: undefined,
        ua17: undefined,
        ua18: undefined,
        ua19: undefined,
        ua20: undefined,
        ua21: undefined,
      });
      //淋巴细胞免疫表性
      const lbxbmybxColumn = computed(() => {
        return [
          {
            label: 'CD3+ T细胞/淋巴细胞',
            value: 'lym1',
            ckValue: '50.00~84.00',
            unit: '%',
          },
          {
            label: 'CD3+CD4+ T细胞/淋巴细胞',
            value: 'lym2',
            ckValue: '27.00~51.00',
            unit: '%',
          },
          {
            label: 'CD3+CD8+ T细胞/淋巴细胞',
            value: 'lym3',
            ckValue: '15.00~44.00',
            unit: 'U/ml',
          },
          {
            label: 'CD3+CD4+ T细胞/CD3+CD8+ T细胞',
            value: 'lym4',
            ckValue: '0.71~2.78',
            unit: '',
          },
          {
            label: 'B细胞/淋巴细胞',
            value: 'lym5',
            ckValue: '5.00~18.00',
            unit: '%',
          },
          {
            label: 'NK细胞/淋巴细胞',
            value: 'lym6',
            ckValue: '7.00~40.00',
            unit: '%',
          },
        ];
      });
      const lbxbmybxData = reactive({
        lym1: undefined,
        lym2: undefined,
        lym3: undefined,
        lym4: undefined,
        lym5: undefined,
        lym6: undefined,
      });
      //甲状腺
      const jzxColumn = computed(() => {
        return [
          {
            label: '促甲状腺激素（TSH)',
            value: 'tf1',
            ckValue: '0.28~4.3',
            unit: 'mIU/L',
          },
          {
            label: '游离三碘甲状腺原氨酸(FT3)',
            value: 'tf2',
            ckValue: '2.69~5.85',
            unit: 'pmol/L',
          },
          {
            label: '游离甲状腺素（FT4)',
            value: 'tf3',
            ckValue: '9.14~19.31',
            unit: 'pmol/L',
          },
          {
            label: '三碘甲状腺原氨酸（TT3)',
            value: 'tf4',
            ckValue: '0.77~2.41',
            unit: 'nmol/L',
          },
          {
            label: '甲状腺素（TT4）',
            value: 'tf5',
            ckValue: '62.29~150.84',
            unit: 'nmol/L',
          },
        ];
      });
      const jzxData = reactive({
        tf1: undefined,
        tf2: undefined,
        tf3: undefined,
        tf4: undefined,
        tf5: undefined,
      });
      //心脏功能
      const xzgnColumn = computed(() => {
        return [
          {
            label: '肌钙蛋白T',
            value: 'cf',
            ckValue: '0.-0.014ng/ml',
            unit: 'ng/ml',
          },
        ];
      });
      const xzgnData = reactive({
        cf: undefined,
      });
      //传染性疾病
      const crxjbColumn = computed(() => {
        return [
          {
            label: '乙肝标面抗原',
            value: 'std1',
            ckValue: '＜0.05 IU/ml',
            unit: 'IU/ml',
          },
          {
            label: '丙肝标面抗体',
            value: 'std2',
            ckValue: '＜1.00 S/CO',
            unit: 'S/CO',
          },
          {
            label: 'TPPA',
            value: 'std3',
            ckValue: '＜1为非反应性；≥1为反应性',
            unit: '',
          },
          {
            label: 'RPR',
            value: 'std4',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: 'HIV',
            value: 'std5',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
        ];
      });
      const crxjbData = reactive({
        std1: undefined,
        std2: undefined,
        std3: undefined,
        std4: undefined,
        std5: undefined,
      });
      //呼吸道IgM抗体5联
      const hxdColumn = computed(() => {
        return [
          {
            label: '肺炎衣原体IgM抗体',
            value: 'rt1',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '腺病毒IgM抗体',
            value: 'rt2',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '柯萨奇B组IgM抗体',
            value: 'rt3',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '合胞病毒IgM抗体',
            value: 'rt4',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '肺炎支原体IgM抗体',
            value: 'rt5',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
        ];
      });
      const hxdData = reactive({
        rt1: undefined,
        rt2: undefined,
        rt3: undefined,
        rt4: undefined,
        rt5: undefined,
      });
      //流感病毒IgM抗体5联
      const lgbdColumn = computed(() => {
        return [
          {
            label: '副流感病毒IgM抗体',
            value: 'iv1',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '乙型流感病毒IgM抗体',
            value: 'iv2',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
          {
            label: '甲型流感病毒IgM抗体',
            value: 'iv3',
            ckValue: '阴性-或阳性+',
            unit: '',
          },
        ];
      });
      const lgbdData = reactive({
        iv1: undefined,
        iv2: undefined,
        iv3: undefined,
      });

      onBeforeMount(() => {
        Object.keys(xcgData).forEach((key) => {
          xcgData[key] = props.drawerInfo.item?.cbc[key];
        });
        Object.keys(nxData).forEach((key) => {
          nxData[key] = props.drawerInfo.item?.inr[key];
        });

        Object.keys(xtData).forEach((key) => {
          xtData[key] = props.drawerInfo.item?.glu[key];
        });

        Object.keys(gsData).forEach((key) => {
          gsData[key] = props.drawerInfo.item?.lkf[key];
        });

        Object.keys(xzData).forEach((key) => {
          xzData[key] = props.drawerInfo.item?.bl[key];
        });

        Object.keys(ncgData).forEach((key) => {
          ncgData[key] = props.drawerInfo.item?.ua[key];
        });

        Object.keys(lbxbmybxData).forEach((key) => {
          lbxbmybxData[key] = props.drawerInfo.item?.lym[key];
        });

        Object.keys(jzxData).forEach((key) => {
          jzxData[key] = props.drawerInfo.item?.tf[key];
        });

        Object.keys(xzgnData).forEach((key) => {
          xzgnData[key] = props.drawerInfo.item?.cf[key];
        });

        Object.keys(crxjbData).forEach((key) => {
          crxjbData[key] = props.drawerInfo.item?.std[key];
        });

        Object.keys(hxdData).forEach((key) => {
          hxdData[key] = props.drawerInfo.item?.rt[key];
        });

        Object.keys(lgbdData).forEach((key) => {
          lgbdData[key] = props.drawerInfo.item?.iv[key];
        });
      });
      return {
        drawerInfo: props.drawerInfo,
        drawerOnClose,
        submit,

        xcgColumn,
        xcgData,

        nxColumn,
        nxData,

        xtColumn,
        xtData,

        gsColumn,
        gsData,

        xzColumn,
        xzData,

        ncgColumn,
        ncgData,

        lbxbmybxColumn,
        lbxbmybxData,

        jzxColumn,
        jzxData,

        xzgnColumn,
        xzgnData,

        crxjbColumn,
        crxjbData,

        hxdColumn,
        hxdData,

        lgbdColumn,
        lgbdData,
      };
    },
  });
</script>
<style lang="less" scoped>
  .msc-nk {
    height: 600px;
    overflow-y: auto;
    .block {
      .item {
        display: flex;
        align-items: center;
        .label {
          width: 200px;
        }
        .value {
          width: 200px;
          .ant-input {
            padding: 0;
          }
        }
        .ckValue {
          width: 200px;
        }
        .unit {
          width: 200px;
        }
      }
    }
  }
</style>
