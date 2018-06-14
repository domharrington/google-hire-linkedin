console.log('linkedin-notice.js');
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  document.getElementById('google-hire-linkedin-notice').innerText = message;
});
