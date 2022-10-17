save_req_btn = $("<button id='save_req_btn' class='flat_button button_small button_wide search_sub_button'>Сохранить запрос</button>")

$(".page_block.ui_rmenu.ui_rmenu_pr").after($("<a id='download_link' style='display:none'></a>"))
$(".page_block.ui_rmenu.ui_rmenu_pr").after(save_req_btn)

save_req_btn.on('click', () =>{
  var profiles = [];
  var link = window.location.href

  var requestType = "unknown"

  if (link.substring(0,21) == "https://vk.com/friend") {
      requestType = "friends"
  }

  if (link.substring(0,21) == "https://vk.com/groups") {
      requestType = "groups"
  }

  $(".search_row[data-id]").each(function( index ) {

    var vkClub = "";
    var clubElement = $( this ).find(".info .labeled a.group_link");
    if (clubElement.length == 1) {
      vkClub = clubElement.attr('mention_id')
    }


    vkimg = $( this ).find(".img img").attr('src')
    p1 = vkimg.lastIndexOf("/")+1
    p2 = vkimg.lastIndexOf(".jpg")
    if (p2 ==-1) {
      vkimg == ""
    } else {
      vkimg = vkimg.substring(p1, p2)
    }

    username =  $( this ).find(".info .labeled:first a").attr('href').substring(1)
    name = $( this ).find(".info .labeled:first a").text()

    const members = ["друг", "участник", "участников", "участника", "подписчик", "подписчика", "подписчиков"];
    label = $( this ).find(".info .labeled").eq(1).text()
    wind = label.lastIndexOf(" ")+1;
    if (members.includes(label.substring(wind))==true) {
      label = ""
    }
    label2 =  $( this ).find(".info .labeled").eq(2).text()
    wind = label2.lastIndexOf(" ")+1;
    if (members.includes(label2.substring(wind))==false) {
      label = label + label2
    }

    var obj = {
        id: $( this ).data("id"),
        username: username,
        name: name,
        img: vkimg,
        club: vkClub,
        label: label,
        opened: $( this ).find(".info .friends_user_info_actions a").length
    }
    profiles.push(obj)
  });


  var req = {
    type: requestType,
    link: link,
    profiles: profiles
  }

  var fileName = prompt('Введите имя файла', $("#download_link").text());
  if (fileName) {
    textToWrite = JSON.stringify(req);
    textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    downloadLink = $('#download_link')[0];
    downloadLink.download = fileName;
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    downloadLink.click();
  }
});
