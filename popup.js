// 현재 활성화된 탭을 추적하기 위한 변수
let activeTab = "front";
let activeAccount = "front1";
let activeAccountBack = "back1";

$(document).ready(function () {

  // 선택된 Tab Button 함수 등록
  $('.tab').click(function () {
    // 색 변경
    $('.tab').removeClass('selected');
    $(this).addClass('selected');

    // 마지막 선택 저장
    let lastTab = $(this).attr('id').split('_')[1];
    chrome.storage.sync.set({ lastTab });
  });


  // 선택된 ID Box 함수 등록
  // Front
  $('.account').click(function () {
    // 색 변경
    $('.account').removeClass('selected');
    $(this).addClass('selected');

    // 마지막 선택 저장
    let lastAccount = $(this).attr('id').split('_')[1];
    chrome.storage.sync.set({ lastAccount });
  });
  // Back
  $('.account_back').click(function () {
    // 색 변경
    $('.account_back').removeClass('selected');
    $(this).addClass('selected');

    // 마지막 선택 저장
    let lastAccountBack = $(this).attr('id').split('_')[1];
    chrome.storage.sync.set({ lastAccountBack });
  });

  // Login - Save 버튼 함수 등록
  $('#process_save').click(function () {
    let selectedTabId = $('.tab.selected').attr('id');
    let selectedAccount;

    if (selectedTabId && selectedTabId.includes('front')) {
      // Front
      selectedAccount = $('.account.selected').attr('id').split('_')[1];
    } else {
      // Back
      selectedAccount = $('.account_back.selected').attr('id').split('_')[1];
    }

    let selectedId = $('#id_' + selectedAccount).val();
    let selectedPassword = $('#password_' + selectedAccount).val();
    let selectedRole = $('#role_' + selectedAccount).val();

    let dynamicId = {};
    dynamicId[`id_${selectedAccount}`] = selectedId;
    dynamicId[`password_${selectedAccount}`] = selectedPassword;
    dynamicId[`role_${selectedAccount}`] = selectedRole;

    chrome.storage.sync.set(dynamicId);

    // 2초 동안 'Saved!' 표시
    $('#rightText').html('Saved!');
    setTimeout(function() {
      $('#rightText').html('&nbsp');
    }, 1000);
  });


  // Login 버튼 함수 등록
  $('#process_login').click(function () {
    let selectedTabId = $('.tab.selected').attr('id');
    let selectedAccount;
    let position;
    let mainURL;

    if (selectedTabId && selectedTabId.includes('front')) {
      // Front
      selectedAccount = $('.account.selected').attr('id').split('_')[1];
      position = 'front';
      mainURL = $('#front_mainURL').val();
    } else {
      // Back
      selectedAccount = $('.account_back.selected').attr('id').split('_')[1];
      position = 'back';
      mainURL = $('#back_mainURL').val();
    }

    let selectedId = $('#id_' + selectedAccount).val();
    let selectedPassword = $('#password_' + selectedAccount).val();
    let selectedRole = $('#role_' + selectedAccount).val();

    let login = {id: selectedId, password: selectedPassword,
      role: selectedRole, position: position, url: mainURL};

    // content.js로 ID & PW 전송
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { type: 'LOGIN', payload: login }, function(response) {
        if (response && response.status === 'success') {
          // 2초 동안 'Saved!' 표시2
          $('#rightText').html(selectedId + ' Login!');
        } else {
          $('#rightText').html('Login Failed!');
        }
        setTimeout(function() {
          $('#rightText').html('&nbsp');
        }, 1000);
      });
    });

  });

  // Main URL Edit & Save & Navigate
  // Edit
  $('#front_mainURL_edit').click(function () {
    $('#front_mainURL_edit').css("display", "none");
    $('#front_mainURL_save').css("display", "");
    $('.front_editURL').css("display", "");
    $('#front_mainURL').prop('disabled', false);
    $("#front_button_select").trigger("change");
  });
  $('#back_mainURL_edit').click(function () {
    $('#back_mainURL_edit').css("display", "none");
    $('#back_mainURL_save').css("display", "");
    $('.back_editURL').css("display", "");
    $('#back_mainURL').prop('disabled', false);
    $("#back_button_select").trigger("change");
  });

  // Save
  // Front
  $('#front_mainURL_save').click(function () {
    $('#front_mainURL_save').css("display", "none");
    $('#front_mainURL_edit').css("display", "");
    $('.front_editURL').css("display", "none");
    $('#front_mainURL').prop('disabled', true);

    // URL Button 값 저장
    let buttonValues = $('#front_button_select').val(); // ex. front_button_select1
    let name = $('#front_editURL_name').val();
    let url = $('#front_editURL_url').val();

    let tmpObj = {};
    tmpObj[buttonValues] = {name: name, url: url};
    chrome.storage.local.set(tmpObj);
    let buttonID = 'front_URLButton_' + buttonValues.replace(/\D/g, '');

    if(name.trim() !== '' && url.trim() !== '') {
      $("#"+buttonID).text(name);
      $("#"+buttonID).val(url);
    } else {
      $("#"+buttonID).text('EMPTY');
      $("#"+buttonID).val('&nbsp');
    }

    // Main URL 값 저장
    chrome.storage.local.set({front_mainURL: $('#front_mainURL').val()});

    // 2초 동안 'Saved!' 표시
    $('#rightText').html('Saved!');
    setTimeout(function() {
      $('#rightText').html('&nbsp');
    }, 1000);
  });
  // Back
  $('#back_mainURL_save').click(function () {
    $('#back_mainURL_save').css("display", "none");
    $('#back_mainURL_edit').css("display", "");
    $('.back_editURL').css("display", "none");
    $('#back_mainURL').prop('disabled', true);

    // URL Button 값 저장
    let buttonValues = $('#back_button_select').val(); // ex. front_button_select1
    let name = $('#back_editURL_name').val();
    let url = $('#back_editURL_url').val();

    let tmpObj = {};
    tmpObj[buttonValues] = {name: name, url: url};
    chrome.storage.local.set(tmpObj);
    let buttonID = 'back_URLButton_' + buttonValues.replace(/\D/g, '');

    if(name.trim() !== '' && url.trim() !== '') {
      $("#"+buttonID).text(name);
      $("#"+buttonID).val(url);
    } else {
      $("#"+buttonID).text('EMPTY');
      $("#"+buttonID).val('');
    }

    // Main URL 값 저장
    chrome.storage.local.set({back_mainURL: $('#back_mainURL').val()});

    // 2초 동안 'Saved!' 표시
    $('#rightText').html('Saved!');
    setTimeout(function() {
      $('#rightText').html('&nbsp');
    }, 1000);
  });

  // Navigate
  $('#front_mainURL_navigate').click(function () {
    Navigate($('#front_mainURL').val());
  });
  $('#back_mainURL_navigate').click(function () {
    Navigate($('#back_mainURL').val());
  });

  // 저장된 ID & PW 가져오기
  chrome.storage.sync.get(['id_front1', 'password_front1', 'role_front1',
    'id_front2', 'password_front2', 'role_front2',
    'id_back1', 'password_back1', 'role_back1',
    'id_back2', 'password_back2', 'role_back2'
  ], (result) => {
    // console.log('Retrieved data:', result);

    $('#id_front1').val(result.id_front1);
    $('#password_front1').val(result.password_front1);
    $('#role_front1').val(result.role_front1);

    $('#id_front2').val(result.id_front2);
    $('#password_front2').val(result.password_front2);
    $('#role_front2').val(result.role_front2);

    $('#id_back1').val(result.id_back1);
    $('#password_back1').val(result.password_back1);
    $('#role_back1').val(result.role_back1);

    $('#id_back2').val(result.id_back2);
    $('#password_back2').val(result.password_back2);
    $('#role_back2').val(result.role_back2);
  });


  // 저장된 커서 위치 항목 가져오기
  chrome.storage.sync.get(['lastTab'], function (result) {
    activeTab = result.lastTab ? result.lastTab : activeTab;
    $('#tab_' + activeTab).click();
  });

  chrome.storage.sync.get(['lastAccount'], function (result) {
    activeAccount = result.lastAccount ? result.lastAccount : activeAccount;
    $('#account_' + activeAccount).addClass('selected');
  });
  chrome.storage.sync.get(['lastAccountBack'], function (result) {
    activeAccountBack = result.lastAccountBack ? result.lastAccountBack : activeAccountBack;
    $('#account_' + activeAccountBack).addClass('selected');
  });

  // 입력창 비활성화
  $('#front_mainURL').prop('disabled', true);
  $('#back_mainURL').prop('disabled', true);


  // 입력창 값 가져오기
  chrome.storage.local.get("front_mainURL", function(result) {
    $('#front_mainURL').val(result.front_mainURL);
  })
  chrome.storage.local.get("back_mainURL", function(result) {
    $('#back_mainURL').val(result.back_mainURL);
  })

  // URL Buttons
  // Front
  for (let i=1; i<=6; i++) {
    // 이름 변경
    let optionID = 'front_button_select' + i;
    let buttonID = 'front_URLButton_' + i;

    chrome.storage.local.get(optionID, function(result) {
      if(result[optionID] && result[optionID].name !== '') {
        $("#"+buttonID).text(result[optionID]?.name);
        $("#"+buttonID).val(result[optionID]?.url);
      }
    })

    // 버튼 클릭 함수
    $('#' + buttonID).click(function() {
      let mainURL = $('#front_mainURL').val();
      let url = $('#' + buttonID).val();

      if(mainURL.trim() !== '' && url.trim() !== '') {
        Navigate(mainURL, url);
      } else {
        alert('Main URL or Button Value is Empty!');
      }
    })
  }
  // Back
  for (let i=1; i<=6; i++) {
    // 이름 변경
    let optionID = 'back_button_select' + i;
    let buttonID = 'back_URLButton_' + i;

    chrome.storage.local.get(optionID, function(result) {
      if(result[optionID] && result[optionID].name !== '') {
        $("#"+buttonID).text(result[optionID]?.name);
        $("#"+buttonID).val(result[optionID]?.url);
      }
    })

    // 버튼 클릭 함수
    $('#' + buttonID).click(function() {
      let mainURL = $('#back_mainURL').val();
      let url = $('#' + buttonID).val();

      if(mainURL.trim() !== '' && url.trim() !== '') {
        Navigate(mainURL, url);
      } else {
        alert('Main URL or Button Value is Empty!');
      }
    })
  }

  keyEvents();
  enableNumberTyping();
});

// 각 탭에 호출 함수 연결
$('.tab').each(function () {
  // _front, _back, _frontPages, _backPages
  let id = '_' + $(this).attr('id').split('_')[1];
  $('#tab' + id).on('click', function () {
    openTab(id);
  });
});


// 탭을 클릭할 때 호출되는 함수
function openTab(newTab) {
  $('.content').css("display", "none");
  $('.loginBtn').css("display", "none");

  // 로그인 탭 일 때
  if(newTab === '_front' || newTab === '_back') {
    $('#content' + newTab).css("display", "block");
    $('.loginBtn').css("display", "");
  }

  // Pages 탭 일 때
  // Navigate, Edit || Save
  if(newTab === '_frontPages') {
    $('#pages_front').css("display", "block");
    $('#front_mainURL_edit').css("display", "");
    $('#front_mainURL_save').css("display", "none");
    $('.front_editURL').css("display", "none");
    $('#front_mainURL').prop('disabled', true);
  }
  if(newTab === '_backPages') {
    $('#pages_back').css("display", "block");
    $('#back_mainURL_edit').css("display", "");
    $('#back_mainURL_save').css("display", "none");
    $('.back_editURL').css("display", "none");
    $('#back_mainURL').prop('disabled', true);
  }

  // 활성화된 탭 업데이트
  activeTab = newTab;
}


// Navigate 함수
function Navigate(mainURL, destination="") {
  if (mainURL.trim() === '') {
    alert('Main URL is Empty!');
    return;
  }
  // content.js로 URL 전송
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id,
        { type: 'NAVIGATE',
          payload: mainURL+destination });
  });
}


// URL Button Select 변경 시 실행되는 함수
// Front
$('#front_button_select').change(function () {
  const selected = $(this).val(); // ex. front_button_select1
  changeEditURL(selected, 'front');
});
// Back
$('#back_button_select').change(function () {
  const selected = $(this).val(); // ex. front_button_select1
  changeEditURL(selected, 'back');
});


// URL Button 이름 변경 함수
function changeEditURL(optionID, position) {
  if(position === 'front') {
    chrome.storage.local.get(optionID, function(result) {
      $('#front_editURL_name').val(result[optionID]?.name);
      $('#front_editURL_url').val(result[optionID]?.url);
    });
  } else {
    chrome.storage.local.get(optionID, function(result) {
      $('#back_editURL_name').val(result[optionID]?.name);
      $('#back_editURL_url').val(result[optionID]?.url);
    })
  }
}

// Keyboard 숫자 클릭시 탭 이동 함수
function keyEvents() {
  $(document).keydown(function (event) {
    if($('#typing').val() === 'false') {
      switch(event.key) {
        case '1':
          $("#tab_front").click();
          break;
        case '2':
          $("#tab_frontPages").click();
          break;
        case '3':
          $("#tab_back").click();
          break;
        case '4':
          $("#tab_backPages").click();
          break;
        default:
          break;
      }
    }
  });
}

// Enable Number Typing
function enableNumberTyping() {
  $('#toggle-button').change(function() {
    if (this.checked) {
      $('#typing').val(true);
      console.log("The button is ON", $('#typing').val());
    } else {
      $('#typing').val(false);
      console.log("The button is OFF", $('#typing').val());
    }
  });
}