import type { Options } from 'highcharts';

const lightTheme = {
  colors: ['#2f7a88', '#c45c26', '#4a7c59', '#8b6914'],
  chart: {
    backgroundColor: '#ffffff',
    style: { fontFamily: 'DM Sans, sans-serif' },
  },
  title: {
    style: { color: '#1a2428', fontWeight: '600' },
  },
  xAxis: {
    gridLineColor: '#e6f3f5',
    lineColor: '#c5d5da',
    tickColor: '#c5d5da',
    labels: { style: { color: '#5a6b72' } },
  },
  yAxis: {
    gridLineColor: '#e6f3f5',
    labels: { style: { color: '#5a6b72' } },
    title: { style: { color: '#1a2428' } },
  },
  legend: {
    itemStyle: { color: '#1a2428' },
  },
  tooltip: {
    backgroundColor: '#ffffff',
    borderColor: '#c5d5da',
    style: { color: '#1a2428' },
  },
  accessibility: {
    enabled: true,
  },
  exporting: {
    enabled: true,
    buttons: {
      contextButton: {
        menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG', 'downloadCSV'],
      },
    },
  },
};

export function applyLightTheme(Highcharts: { setOptions: (o: Options) => void }) {
  Highcharts.setOptions(lightTheme as Options);
}

export function baseChartOptions(yTitle: string, height = 420): Options {
  return {
    chart: {
      zooming: { type: 'xy' },
      height,
      backgroundColor: '#ffffff',
    },
    credits: { enabled: false },
    title: {
      text: 'Select a species to begin',
      useHTML: true,
      style: { fontSize: '1.15rem', color: '#1a2428' },
    },
    tooltip: { valueDecimals: 2 },
    accessibility: {
      enabled: true,
      description:
        'Running mean abundance with error bars as the number of sampled quadrats increases.',
    },
    exporting: {
      enabled: true,
      filename: 'vrssu-sampling-effort',
      buttons: {
        contextButton: {
          menuItems: ['downloadPNG', 'downloadJPEG', 'downloadSVG', 'downloadCSV'],
        },
      },
    },
    xAxis: {
      title: { text: 'Number of quadrats', style: { fontSize: '1rem' } },
      labels: { style: { fontSize: '0.9rem' } },
      allowDecimals: false,
    },
    yAxis: {
      minorTickInterval: 'auto',
      title: { text: yTitle, style: { fontSize: '1rem' } },
      labels: { style: { fontSize: '0.9rem' } },
    },
    series: [
      {
        name: 'Mean',
        type: 'line',
        data: [],
        showInLegend: false,
        pointStart: 1,
        color: '#2f7a88',
      },
      {
        name: 'Error',
        type: 'errorbar',
        data: [],
        pointStart: 1,
        color: '#2f7a88',
      },
    ],
  };
}
