<template>
  <div ref="chartRef" :style="{ height, width }"></div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, Ref, watch } from 'vue';
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
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              width: 1,
              color: '#019680',
            },
          },
        },
        grid: { left: '1%', right: '1%', top: '2%', bottom: 0, containLabel: true },
        xAxis: {
          type: 'category',
          data: val.map((n) => n.date),
          axisLabel: {
            interval: 0,
          },
        },
        yAxis: {
          type: 'value',
          splitNumber: 4,
        },
        series: [
          {
            data: val.map((n) => n.count),
            type: 'bar',
            barMaxWidth: 80,
          },
        ],
      });
    },
    { immediate: true },
  );
</script>
