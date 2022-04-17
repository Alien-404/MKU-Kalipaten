var filter_daily = document.getElementById('daily');
var filter_weakly = document.getElementById('weakly');
var chartDom = document.getElementById('chart');
var btn_filter = document.getElementsByClassName('btn_filter');

$(document).ready(function() {
  $('.filter-groups').on('click', '.btn', function() {
    $(this).addClass('btn-filter-active').siblings().removeClass('btn-filter-active');
  })
});

// chart init
var homeChart = echarts.init(chartDom);
var option;

var data = {
  PM10: {
    name: 'PM10',
    type: 'line',
    data: [<%= data_chart.daily_mean_data_sensors.PM10 %>],
    smooth: true
  },
  CO2: {
    name: 'CO2',
    type: 'line',
    data: [<%= data_chart.daily_mean_data_sensors.CO2 %>],
    smooth: true
  },
  Temperature: {
    name: 'Temperature',
    type: 'line',
    data: [<%= data_chart.daily_mean_data_sensors.Temperature %>],
    smooth: true
  },
  Humidity: {
    name: 'Humidity',
    type: 'line',
    data: [<%= data_chart.daily_mean_data_sensors.Humidity %>],
    smooth: true
  },
}

// event click for daily
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
      data: ['<%= data_chart.daily_date_info[0] %>', '<%= data_chart.daily_date_info[1] %>', '<%= data_chart.daily_date_info[2] %>'],
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
            data: [<%= data_chart.daily_mean_data_sensors.PM10 %>],
            smooth: true
        },
        {
            name: 'CO2',
            type: 'line',
            data: [<%= data_chart.daily_mean_data_sensors.CO2 %>],
            smooth: true
        },
        {
            name: 'Temperature',
            type: 'line',
            data: [<%= data_chart.daily_mean_data_sensors.Temperature %>],
            smooth: true
        },
        {
            name: 'Humidity',
            type: 'line',
            data: [<%= data_chart.daily_mean_data_sensors.Humidity %>],
            smooth: true
        },
    ]
  };
  option && homeChart.setOption(option);
})

// event click for weekly
filter_weakly.addEventListener('click', () => {
  var data_weakly = {...data};
  data_weakly.PM10.data = [<%= data_chart.weekly_mean_data_sensors.PM10 %>];
  data_weakly.CO2.data = [<%= data_chart.weekly_mean_data_sensors.CO2 %>];
  data_weakly.Temperature.data = [<%= data_chart.weekly_mean_data_sensors.Temperature %>];
  data_weakly.Humidity.data = [<%= data_chart.weekly_mean_data_sensors.Humidity %>];
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
      data: ['<%= data_chart.weekly_date_info[0] %>', '<%= data_chart.weekly_date_info[1] %>', '<%= data_chart.weekly_date_info[2] %>'],
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
    data: ['<%= data_chart.daily_date_info[0] %>', '<%= data_chart.daily_date_info[1] %>', '<%= data_chart.daily_date_info[2] %>'],
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