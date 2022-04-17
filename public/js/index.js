const list_sensors = document.getElementsByClassName('data-sensors');
const box_show = document.getElementsByClassName('box-show');


$(document).ready(function() {
  $('.data-sensors').on('click', function() {
    // $('.box-show h2').text('ok')
    const device_id = $(this).find("input[class='id_device']").val();

    console.log(device_id);
  })  
});


