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
            // dataView: { readOnly: false },
            magicType: { type: ['line', 'bar'] },
            saveAsImage: {},
          },
        },
        tooltip: {
          trigger: 'axis',
          // axisPointer: {
          //   lineStyle: {
          //     width: 1,
          //     color: '#019680',
          //   },
          // },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: val.map((n) => n.date),
          axisLabel: {
            lineStyle: {
              color: '#333',
            },
          },
        },
        yAxis: {
          type: 'value',
          splitNumber: 4,
        },
        series: [
          {
            data: val.map((n) => n.count),
            type: 'line',
            itemStyle: {
              normal: {
                color: '#ff0000',
                lineStyle: {
                  color: '#ff0000',
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
