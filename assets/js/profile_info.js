//Сведения о странице / id, даты, комментарии

root_section = '#profile_redesigned .ScrollStickyWrapper'

WaitSelector(root_section, function() {
  username = window.location.pathname.substring(1);
  newSection = $("<section id='inf' class='ProfileGroup vkuiGroup vkuiGroup--sizeX-regular vkuiGroup--card vkuiGroup--padding-m'>  <div class='vkuiGroup__inner'><div class='vkuiSimpleCell vkuiSimpleCell--android vkuiSimpleCell--mult vkuiSimpleCell--sizeY-compact vkuiTappable vkuiTappable--sizeX-regular'><div class='vkuiSimpleCell__main'><div class='vkuiSimpleCell__content'><span class='vkuiHeadline--android vkuiHeadline--sizeY-compact vkuiHeadline--l-1 vkuiHeadline--w-3'>Дополнительный сведения</span></div></div><div id='inf_close' class='vkuiSimpleCell__after vkuiTappable--hasHover'><div role='presentation' class=' vkuiIcon vkuiIcon--24 vkuiIcon--w-24 vkuiIcon--h-24 vkuiIcon--dismiss_24 NewbieOnboardingSingleCard__iconDismiss' style='width: 24px; height: 24px;'><svg viewBox='0 0 24 24' width='24' height='24' style='display: block;'><use xlink:href='#dismiss_24' style='fill: currentcolor;'></use></svg></div></div><span aria-hidden='true' class='vkuiTappable__hoverShadow'></span></div></div><div class='vkuiGroup__separator vkuiSpacing' aria-hidden='true' style='height: 16px;'></div>  </section>")
  $(root_section).prepend(newSection)

  $.ajax({
    url:'https://api.vk.com/method/users.get',
    type:'POST',
    data: {
       user_ids: username,
       access_token:AccessToken,
       v: '5.131'} ,
    success: function(json){
       $(json.response).each(function( index ) {
        vk_id = $(this).attr("id")
      })

      comment_link = $("<div class='vkuiSimpleCell__content'><a id='comment_link' href='https://vk.com/feed?obj="+vk_id+"&q=&section=mentions' target='_blank'>Комментарии</a></div>")
      id_link=$("<div class='vkuiSimpleCell__content'><span>https://vk.com/id"+vk_id+"</span></div>")
      
      $("#inf .vkuiSimpleCell__main").append(id_link).append(comment_link)
    

      $.ajax({
     url:'https://vk.com/foaf.php?id='+vk_id,
     type:'GET',
     success: function(xml){
       $xml = $( xml )
       cre = $xml.find('ya\\:created').attr('dc:date')
       if (typeof(cre) != "undefined"){
         cre = cre.replace( /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+(\d{2}):(\d{2})/, "$3.$2.$1 $4:$5")
       }
       mod = $xml.find('ya\\:modified').attr('dc:date')
      if (typeof(mod) != "undefined"){
         mod = mod.replace( /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+(\d{2}):(\d{2})/, "$3.$2.$1 $4:$5")
       }
       login = $xml.find('ya\\:lastLoggedIn').attr('dc:date')
       if (typeof(login) != "undefined"){
         login = login.replace( /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\+(\d{2}):(\d{2})/, "$3.$2.$1 $4:$5")
       }

       if (login == undefined) {login = $(".profile_online_lv").text()}
	
       created_link=$("<div class='vkuiSimpleCell__content'><span>Создание: "+cre+"</span></div>")
       modify_link=$("<div class='vkuiSimpleCell__content'><span>Изменение: "+mod+"</span></div>")
       login_link=$("<div class='vkuiSimpleCell__content'><span>Вход: "+login+"</span></div>")
       onli_link = $("<div class='vkuiSimpleCell__content'><a href='https://onli-vk.ru/"+vk_id+"' target='_blank'>onli-vk.ru</a></div>")

       $("#inf .vkuiSimpleCell__main").append(created_link).append(modify_link).append(login_link).append(onli_link)

     },
     error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            console.log(msg);
        },
  });

      // "<div class='vkuiSimpleCell__content'><span class='vkuiSimpleCell__text vkuiSimpleCell__subtitle vkuiCaption vkuiCaption--l-2'>Расскажите, как прошёл день или где вы недавно побывали</span></div>"    
    },
    error: function (jqXHR, exception) {
           var msg = '';
           if (jqXHR.status === 0) {
               msg = 'Not connect.\n Verify Network.';
           } else if (jqXHR.status == 404) {
               msg = 'Requested page not found. [404]';
           } else if (jqXHR.status == 500) {
               msg = 'Internal Server Error [500].';
           } else if (exception === 'parsererror') {
               msg = 'Requested JSON parse failed.';
           } else if (exception === 'timeout') {
               msg = 'Time out error.';
           } else if (exception === 'abort') {
               msg = 'Ajax request aborted.';
           } else {
               msg = 'Uncaught Error.\n' + jqXHR.responseText;
           }
           console.log(msg);
    }
  })





  $("#inf_close").on("click", function(){$("#inf").hide()})
});
  