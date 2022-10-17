console.log("КАШКА ВКШКА ТУТ");
var AccessToken = "3ea2b2dd3ea2b2dd3ea2b2dde23ed914ef33ea23ea2b2dd5c9af9e9b88b0d57a9a9213f"
var TimerId
var ArkhCities = []
var UsersDataIds = []

// Загрузка строк
function loadRows(callBackFunc) {
  if($(".ui_load_more_btn").is(":visible")){
      $(".ui_load_more_btn").click();
      $("#save_req_btn").text("Сохранить запрос/"+ $("[data-id]").length)
      $.notify('Загружаю... ' +$("[data-id]").length + " записей", { className:"info", position:"top left" });
  } else{
    if (typeof(callBackFunc) != "undefined"){
      callBackFunc()
    }
    $.notify('Готово', { className:"success", position:"top left" });
    clearInterval(TimerId);
    $("#save_req_btn").text("Сохранить запрос/"+ $("[data-id]").length+"/ОК")
  }
}

// Загрузка городов из файла
function loadArkhCities() {
  // Загрузка городов области
  var fileName = chrome.runtime.getURL('assets/vk_city.json')
  $.getJSON(fileName, function(data) {
      ArkhCities = data.response.items
  });
  $.notify('Список городов загружен...', { className:"success", position:"top left" });
}


function SetUsersIds() {
    UsersDataIds = []
    $("[data-id]").each(function( index ) {
        UsersDataIds.push($(this).data("id"));
    })
    $(".friends_user_row").each(function( index ) {
      UsersDataIds.push($(this).attr('id').substr(16));
    })
}

var WaitSelector = function(selector, callback) {
  if (jQuery(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      WaitSelector(selector, callback);
    }, 100);
  }
};