// req package
var echarts = require('echarts');

// get element
var filter_daily = document.getElementById('daily');
var filter_weakly = document.getElementById('weakly');
var chartDom = document.getElementById('chart');
var btn_filter = document.getElementsByClassName('btn_filter');


$(document).ready(function() {
  $('.filter-groups').on('click', '.btn', function() {
    $(this).addClass('btn-filter-active').siblings().removeClass('btn-filter-active');
  })
})


// chart init
var homeChart = echarts.init(chartDom);
var option;

var data = {
  PM10: {
    name: 'PM10',
    type: 'line',
    data: [185, 80, 155, 18, 55, 100],
    smooth: true
  },
  CO2: {
    name: 'CO2',
    type: 'line',
    data: [175, 70, 121, 29, 25, 190],
    smooth: true
  },
  Temperature: {
    name: 'Temperature',
    type: 'line',
    data: [26, 20, 21, 24, 26, 21],
    smooth: true
  },
  Humidity: {
    name: 'Humidity',
    type: 'line',
    data: [80, 70, 91, 80, 85, 90],
    smooth: true
  },
}

filter_daily.addEventListener('click', () => {
  option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    legend: {
      data: ['PM10', 'CO2', 'Temperature', 'Humidity'],
      left: 0,
      icon: 'none',
      textStyle: {
        color: 'black',
        fontFamily: 'modern sans',
        fontSize: 16
      },
      selected: {
        'CO2': false,
        'Temperature': false,
        'Humidity': false,
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Wed, 02 March', 'Fri, 04 March', 'Sun, 06 March', 'Tue, 08 March', 'Thue, 10 March', 'Sat, 12 March'],
      axisLabel: {
        fontFamily: 'modern sans'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'PM10',
        type: 'line',
        data: [185, 80, 155, 18, 55, 100],
        smooth: true
      },
      {
        name: 'CO2',
        type: 'line',
        data: [175, 70, 121, 29, 25, 190],
        smooth: true
      },
      {
        name: 'Temperature',
        type: 'line',
        data: [26, 20, 21, 24, 26, 21],
        smooth: true
      },
      {
        name: 'Humidity',
        type: 'line',
        data: [80, 70, 91, 80, 85, 90],
        smooth: true
      },
    ]
  };
  option && homeChart.setOption(option);
})

filter_weakly.addEventListener('click', () => {
  var data_weakly = {...data};
  data_weakly.PM10.data = [155, 70, 95, 38, 25, 120]
  data_weakly.CO2.data = [185, 80, 155, 18, 55, 100]
  data_weakly.Temperature.data = [17, 18, 15, 18, 20, 12]
  data_weakly.Humidity.data = [85, 80, 95, 98, 95, 90]
  option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    legend: {
      data: ['PM10', 'CO2', 'Temperature', 'Humidity'],
      left: 0,
      icon: 'none',
      textStyle: {
        color: 'black',
        fontFamily: 'modern sans',
        fontSize: 16
      },
      selected: {
        'CO2': false,
        'Temperature': false,
        'Humidity': false,
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['02 March', '09 March', '16 March', '23 March', '30 March', '6 April'],
      axisLabel: {
        fontFamily: 'modern sans'
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      data_weakly.PM10,
      data_weakly.CO2,
      data_weakly.Temperature,
      data_weakly.Humidity,
    ]
  };
  option && homeChart.setOption(option);
})

option = {
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  legend: {
    data: ['PM10', 'CO2', 'Temperature', 'Humidity'],
    left: 0,
    icon: 'none',
    textStyle: {
      color: 'black',
      fontFamily: 'modern sans',
      fontSize: 16
    },
    selected: {
      'CO2': false,
      'Temperature': false,
      'Humidity': false,
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Wed, 02 March', 'Fri, 04 March', 'Sun, 06 March', 'Tue, 08 March', 'Thue, 10 March', 'Sat, 12 March'],
    axisLabel: {
      fontFamily: 'modern sans'
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    data.PM10,
    data.CO2,
    data.Temperature,
    data.Humidity,
  ]
};


option && homeChart.setOption(option);
