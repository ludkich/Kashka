chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {

      switch(message.type) {
          case "loadMore":
              TimerId = setInterval(loadRows, 350);
              sendResponse(1);
              break;
          case "likeCityLoad":
              var idsLoadedCount = 0
              loadArkhCities();
              function checkUsersCities(){
                  var max
                  var ids = ""
                  if (UsersDataIds.length - idsLoadedCount>1000) {
                    max = 1000
                  } else {
                    max = UsersDataIds.length - idsLoadedCount
                  }

                  for (i = idsLoadedCount; i<idsLoadedCount+max;i++){
                    if (ids == "") {
                      ids = UsersDataIds[i]
                    } else {
                      ids = ids+","+UsersDataIds[i]
                    }
                  }
                  console.log("UsersDataIds")
                  console.log(UsersDataIds)
                  console.log("max")
                  console.log(max)
                  $.ajax({
                   url:'https://api.vk.com/method/users.get',
                   type:'POST',
                   data: {
                      user_ids: ids,
                      fields: 'city',
                      access_token:AccessToken,
                      v: '5.131'} ,
                   success: function(json){
                     console.log("json.response")
                      console.log(json.response)
                      $(json.response).each(function( index ) {
                       id = $(this).attr("id")
                       city = $(this).attr("city")
                       if (typeof(city) != "undefined"){
                          var flag = false
                          for (i = 0; i < ArkhCities.length; i++) {
                            if (ArkhCities[i].id == city.id) {
                              flag = true;
                              break;
                            }
                          }
                          if(flag == true) {
                            $('[data-id="'+id+'"]').find(".fans_fan_name").append("<br>"+city.title)
                          } else {
                            $('[data-id="'+id+'"]').hide();
                          }
                        } else{
                          $('[data-id="'+id+'"]').hide();
                        }
                     })
                     idsLoadedCount = idsLoadedCount+max
                     console.log("idsLoadedCount")
                     console.log(idsLoadedCount)
                     if (idsLoadedCount<UsersDataIds.length){
                        checkUsersCities()
                     }
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
                          alert(msg);
                      },
                });
              }
              TimerId = setInterval(loadRows, 350, function(){SetUsersIds();  checkUsersCities(0)});
              sendResponse(1);
              break;
          case "arhFriendsLoad":
            loadArkhCities();

            TimerId = setInterval(loadRows, 350, function(){SetUsersIds();  checkUser(0)});

            function checkUser(userIdx) {
              nextIdx = userIdx+1

              //друзья пользователя
              var userFriends = []

              // Загрузка друзей
              function getFriends(idx){
                $.ajax({
                 url:'https://api.vk.com/method/friends.get',
                 type:'POST',
                 data: {
                    user_id: UsersDataIds[idx],
                    fields: 'city',
                    access_token:AccessToken,
                    offset: userFriends.length,
                    v: '5.131'} ,
                 success: function(json){
                   toNext = false
                   if (typeof(json.error) != "undefined"){
                     $.notify( nextIdx + "/" +UsersDataIds.length + " - " + UsersDataIds[userIdx] + " - friends = "+$(json.error).attr("error_msg"), { className:"warning", position:"top left" });
                     toNext = true
                   }
                   else {
                     $(json.response.items).each(function( index ) {
                       userFriends.push($(this)[0]);
                     })
                     $.notify( nextIdx + "/" +UsersDataIds.length + " - " + UsersDataIds[userIdx] + " - friends = "+userFriends.length, { className:"info", position:"top left" });
                     if ($(json.response.items).length == 5000){
                       getFriends(idx);
                     } else {
                       toNext = true
                     }
                   }

                   if (toNext == true) {
                     analizeUser()
                   }
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
                        alert(msg);
                    },
                  });
              }

              //Сверка городов - вывод рез-в
              function analizeUser(){
                var arhFriendCount = 0
                userFriends.every(item => {
                  if (typeof(item.city) != "undefined"){
                      ArkhCities.every(city => {
                        if (item.city.id==city.id){
                          arhFriendCount = arhFriendCount + 1
                          return false
                        }
                      return true;
                      })
                  }
                   return true;
                });

                $.notify(nextIdx + "/" +UsersDataIds.length + " - " + UsersDataIds[userIdx] + ': Готово', { className:"success", position:"top left" });
                if(arhFriendCount>0) {
                  $('[data-id="'+UsersDataIds[userIdx]+'"]').find(".labeled.name").append("<br>"+arhFriendCount + " / " +userFriends.length)
                  $('#friends_user_row'+UsersDataIds[userIdx]).append("<br>"+arhFriendCount + " / " +userFriends.length)
                } else {
                  $('[data-id="'+UsersDataIds[userIdx]+'"]').hide();
                  $('#friends_user_row'+UsersDataIds[userIdx]).hide();
                }

                if (nextIdx < UsersDataIds.length ) {
                  setTimeout(checkUser, 350, nextIdx);
                } else {
                  $.notify('Готово!!!', { className:"success", position:"top left" });
                }
              }

              getFriends(userIdx)

            }

            sendResponse(1);
            break;
          case "findIdInGroups":
            var groupsIds = []
            var fileName = prompt('Введите Id пользователя для поиска в группах', 'id123456');
            TimerId = setInterval(loadRows, 350,setGroupsIds);

            function setGroupsIds() {
                $("#results [data-id]").each(function( index ) {
                  groupsIds.push($(this).data("id"));
                })
                checkGroup(0)
            }

            function checkGroup(groupIdx) {console.log(groupsIds);
                // nextIdx = groupIdx+1
                // var usersInGroup = []

                // function getUsersInGroup(idx){
                //   $.ajax({
                //    url:'https://api.vk.com/method/friends.get?user_id='+usersIds[idx]+'&fields=city&access_token='+AccessToken+'&v=5.131&offset='+userFriends.length,
                //    type:'GET',
                //    success: function(json){
                //      toNext = false
                //      if (typeof(json.error) != "undefined"){
                //        $.notify( nextIdx + "/" +usersIds.length + " - " + usersIds[userIdx] + " - friends = "+$(json.error).attr("error_msg"), { className:"warning", position:"top left" });
                //        toNext = true
                //      }
                //      else {
                //        $(json.response.items).each(function( index ) {
                //          userFriends.push($(this)[0]);
                //        })
                //        $.notify( nextIdx + "/" +usersIds.length + " - " + usersIds[userIdx] + " - friends = "+userFriends.length, { className:"info", position:"top left" });
                //        if ($(json.response.items).length == 5000){
                //          getFriends(idx);
                //        } else {
                //          toNext = true
                //        }
                //      }
                //
                //      if (toNext == true) {
                //        analizeUser()
                //      }
                //    },
                //    error: function (jqXHR, exception) {
                //           var msg = '';
                //           if (jqXHR.status === 0) {
                //               msg = 'Not connect.\n Verify Network.';
                //           } else if (jqXHR.status == 404) {
                //               msg = 'Requested page not found. [404]';
                //           } else if (jqXHR.status == 500) {
                //               msg = 'Internal Server Error [500].';
                //           } else if (exception === 'parsererror') {
                //               msg = 'Requested JSON parse failed.';
                //           } else if (exception === 'timeout') {
                //               msg = 'Time out error.';
                //           } else if (exception === 'abort') {
                //               msg = 'Ajax request aborted.';
                //           } else {
                //               msg = 'Uncaught Error.\n' + jqXHR.responseText;
                //           }
                //           alert(msg);
                //       },
                //     });
                // }
                //
                // function analizeGroup(){
                //   var arhFriendCount = 0
                //   userFriends.every(item => {
                //     if (typeof(item.city) != "undefined"){
                //         ArkhCities.every(city => {
                //           if (item.city.id==city.id){
                //             arhFriendCount = arhFriendCount + 1
                //             return false
                //           }
                //         return true;
                //         })
                //     }
                //      return true;
                //   });
                // getUsers(groupIdx)
            }
            sendResponse(1);
            break;
          default:
              console.error("Unrecognised message: ", message);
        }
    }
);
