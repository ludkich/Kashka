function analizeRows(req) {
  console.log(req);
  $("#download_link").text(req.fileName)
  $(".search_row[data-id]").each(function( index ) {
     vkProfile = $( this )
     vkid = vkProfile.data("id")

     vkUsername = vkProfile.find(".info .labeled:first a").attr('href').substring(1)
     vkName = vkProfile.find(".info .labeled:first a").text()

     const members = ["друг", "участник", "участников", "участника", "подписчик", "подписчика", "подписчиков"];
     vkLabel= vkProfile.find(".info .labeled").eq(1).text()
     wind = vkLabel.lastIndexOf(" ")+1;
     if (members.includes(vkLabel.substring(wind))==true) {
       vkLabel = ""
     }

     vkLabel2= vkProfile.find(".info .labeled").eq(2).text()
     wind = vkLabel2.lastIndexOf(" ")+1;
     if (members.includes(vkLabel2.substring(wind))==false) {
       vkLabel = vkLabel + vkLabel2
     }

     vkimg = vkProfile.find(".img img").attr('src')
     p1 = vkimg.lastIndexOf("/")+1
     p2 = vkimg.lastIndexOf(".jpg")
     if (p2 ==-1) {
       vkimg == ""
     } else {
       vkimg = vkimg.substring(p1, p2)
     }

     var vkClub = ""
     var clubElement = vkProfile.find(".info .labeled a.group_link")
     if (clubElement.length == 1) {
       vkClub = clubElement.attr('mention_id')
     }
     vkOpened = vkProfile.find(".info .friends_user_info_actions a").length

     $.each(req.profiles, function( index, reqProfile ) {
       if (reqProfile.id == vkid){
         changed = false
         console.log("---------- vkid="+vkid)
         if (vkUsername !== reqProfile.username) {
            changed = true
            vkProfile.find(".info .labeled.name a").css( "color", "red" );
            vkProfile.find(".info .labeled.title a").css( "color", "red" );
            console.log("username="+vkUsername+" // "+reqProfile.username)
         }
         if (vkName !== reqProfile.name ) {
            changed = true
            vkProfile.find(".info .labeled.name a").css( "color", "red" );
            vkProfile.find(".info .labeled.title a").css( "color", "red" );
            console.log("name="+vkName+" // "+reqProfile.name)
         }
         if (vkimg !== reqProfile.img ) {
            changed = true
            vkProfile.find(".img img").css( "border", "3px solid red" );
            console.log("img="+vkimg+" // "+reqProfile.img)
         }
         if (vkClub !== reqProfile.club) {
            changed = true
            vkProfile.find(".info .labeled:not(.name) a").css( "color", "red" );
            console.log("club="+vkClub+" // "+reqProfile.club)
         }
         if (vkLabel !== reqProfile.label) {
            changed = true
            vkProfile.find(".info .labeled:not(.name)").css( "color", "red" );
            vkProfile.find(".info .labeled:not(.title)").css( "color", "red" );
            console.log("label="+vkLabel+" // "+reqProfile.label)
         }

         if (vkOpened !== reqProfile.opened) {
            changed = true
            if (vkOpened === 0){
              vkProfile.find(".info .friends_user_info_actions").append($("<span>Не написать</span>"))
            }

            vkProfile.find(".info .friends_user_info_actions a").css( "color", "red" );
            vkProfile.find(".info .friends_user_info_actions span").css( "color", "red" );

            console.log("opened="+vkOpened+" // "+reqProfile.opened)
         }

          // сравнение->подсветка changed
          if (changed == false) {vkProfile.hide()}
          return false;
       }
     });
  });
}

chrome.storage.local.get(['requests'], function(result) {
  if (typeof result.requests === 'undefined') {
    console.log("Вкашка requests NO")
  } else {
    console.log("Вкашка requests YES "+result.requests.length)
      requests = result.requests
      chrome.storage.local.remove(["requests"])
      function callbackLoadRows(){
        analizeRows(requests.shift())
        if (requests.length > 0){
          chrome.storage.local.set({requests: requests});
          window.open(requests[0].link, '_blank');
        } else{
          alert("OK!")
        }
      }
      TimerId = setInterval(loadRows, 300, callbackLoadRows);
  }
});
