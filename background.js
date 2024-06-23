console.log('background.js loaded');

chrome.commands.onCommand.addListener(function(command) {
   if (command === "_execute_action") {
       chrome.action.openPopup();
   }
});