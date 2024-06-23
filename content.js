console.log('content.js loaded');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'LOGIN') {
        // // Login 정보 입력
        // if(message.payload.role !== undefined) {
        //     document.getElementById(message.payload.role)?.click();
        // }
        // document.getElementById('hiddenAccntId').value = message.payload.id;
        // document.getElementById('hiddenAccntPw').value = message.payload.password;
        //
        // // Login Button Click
        // document.getElementsByClassName('btClassLogin')[0]?.click();
        console.log(message.payload);
        if (!message.payload.id || !message.payload.password || !message.payload.url) {
            alert('Missing Argument!');
            return;
        }

        let formData = new FormData();
        formData.append('accntId', message.payload.id);
        formData.append('accntPw', message.payload.password);
        formData.append('selectRadio', message.payload.role === 'radio_user' ? 'U' : 'M');

        let url = message.payload.url + '/front/login/loginProc.do';

        if(sendPostRequest(url, formData)) {
            sendResponse({ status: 'success', data: {accntId: message.payload.id}});
        } else {
            sendResponse({ status: 'fail', data: {accntId: message.payload.id}});
        }
    } else if (message.type === 'NAVIGATE') {
        window.location.href = message.payload;
    }
});

function sendPostRequest(url, data) {
    fetch(url, {
        method: "POST",
        body: data
    })
        .then(response => response.json())
        .then(data => {
            // returnMst = success:Y or fail:1
            console.log("Response recieved: " + data.returnMsg);
            if(data.returnMsg === 'success:Y') {
                return true;
            } else return false;
        })
        .catch(error => {
            console.log("Error: ", error);
        });
}
