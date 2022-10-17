let open_req_btn = $('#open_req_btn');
let load_more_btn = $('#load_more_btn');
let city_btn = $('#city_btn');
let friends_btn = $('#friends_btn');

let request
// Выбор файла - загрузка
open_req_btn.on("click", () => {
    $('#file_input').trigger('click');
});

$('#file_input').on('change' , function(){
  rFiles = event.target.files
  rFileIndex = 0

  requests=[]
  reader = new FileReader();
  // tab = chrome.tabs.query({ active: true, currentWindow: true });
  reader.onload = function() {
    request = JSON.parse(event.target.result);
    request.fileName = rFiles[rFileIndex].name
    requests.push(request);
    rFileIndex = rFileIndex + 1
    if (rFileIndex == rFiles.length){
      chrome.storage.local.set({requests: requests});
      chrome.tabs.create({url: requests[0].link})
    } else{
      reader.readAsText(rFiles[rFileIndex]);
    }
  };
  reader.readAsText(rFiles[rFileIndex]);
});


// Пролистать
load_more_btn.on("click", async () => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "loadMore"}, function(count) {
        load_more_btn.text("ПРОЛИСТАТЬ +")
    });
  });
});

// города на лайках/списках
city_btn.on("click", async () =>  {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "likeCityLoad"}, function(count) {
      city_btn.text("МЕСТНЫЕ КРУГЛЯШКИ +")
    });
  });
});


// Архангельские друзья
friends_btn.on("click", async () =>  {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "arhFriendsLoad"}, function(count) {
      friends_btn.text("МЕСТНЫЕ ДРУЗЬЯ +")
    });
  });
});

// Поиск id пользователя в группах
$('#in_groups_btn').on("click", async () =>  {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "findIdInGroups"}, function(count) {
      friends_btn.text("ПОИСК В ГРУППАХ +")
    });
  });
});
