<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts" setup>
  import { ref, Ref, watch } from 'vue';
  import { useECharts } from '/@/hooks/web/useECharts';

  const props = defineProps({
    dataSource: {
      type: Object as PropType<Array<{ date: string; count: number }>>,
      default: () => [],
    },
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    height: {
      type: String as PropType<string>,
      default: '280px',
    },
  });

  const chartRef = ref<HTMLDivElement | null>(null);
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  watch(
    () => props.dataSource,
    (val) => {
      setOptions({
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: 'none',
            },
            magicType: { type: ['line', 'bar'] },
            saveAsImage: {},
          },
        },
        legend: {
          data: ['所有订单数', '已完成订单数', '所有订单金额', '已完成订单金额'],
          textStyle: {
            color: '#333',
          },
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: val.map((n) => n.time),
          axisLabel: {
            lineStyle: {
              color: '#333',
            },
          },
        },
        yAxis: [
          {
            name: '订单数(笔)',
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#333',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#333',
                fontSize: '12',
              },
            },
          },
          {
            name: '总金额(元)',
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#333',
              },
            },
            axisLabel: {
              textStyle: {
                color: '#333',
                fontSize: '12',
              },
            },
          },
        ],
        series: [
          {
            name: '所有订单数',
            type: 'line',
            data: val.map((n) => n.allOrderNum),
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: '#ff0000',
                lineStyle: {
                  color: '#ff0000',
                },
              },
            },
          },
          {
            name: '已完成订单数',
            type: 'line',
            data: val.map((n) => n.finishOrderNum),
            yAxisIndex: 0,
            itemStyle: {
              normal: {
                color: '#00ff00',
                lineStyle: {
                  color: '#00ff00',
                },
              },
            },
          },
          {
            name: '所有订单金额',
            type: 'line',
            data: val.map((n) => n.allOrderSale),
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#0000FF',
                lineStyle: {
                  color: '#0000FF',
                },
              },
            },
          },
          {
            name: '已完成订单金额',
            type: 'line',
            data: val.map((n) => n.finishOrderSale),
            yAxisIndex: 1,
            itemStyle: {
              normal: {
                color: '#ffff00',
                lineStyle: {
                  color: '#ffff00',
                },
              },
            },
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
