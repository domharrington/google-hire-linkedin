chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'linkedin.com'},
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

let company;
chrome.storage.local.get('company', function (result) {
  company = result.company;
});

let linkedinTab;

chrome.runtime.onMessage.addListener(function({ type, message }, sender) {
  console.log('received message', { type, message });
  if (type === 'LINKEDIN') {
    linkedinTab = sender.tab;
    console.log('got linkedin name', message);
    queryGoogleHire(message)
  }

  if (type === 'GOOGLEHIRE') {
    console.log('response from google hire', message);
    sendToLinkedin(linkedinTab, message)
  }
});

function sendToLinkedin(tab, message) {
  console.log('sending to linkedin', tab.id);
  chrome.tabs.executeScript(tab.id, { file: 'linkedin-notice.js' }, () => {
    console.log(chrome.runtime.lastError);
    chrome.tabs.sendMessage(tab.id, message);
  })
}

let currentName;

function queryGoogleHire(name) {
  currentName = name;
  chrome.windows.getCurrent(function (originalWindow) {
    chrome.windows.create({
      url: `https://hire.withgoogle.com/t/${company}/hiring/candidates/browse/all?q=` + encodeURIComponent(`free-text == "${name}"`),
      focused: false,
      left: 0,
      top: 0,
      width: 1,
      height: 1,
      type: 'popup'
    }, function(window) {
      chrome.tabs.executeScript(window.tabs[0].id, { file: 'google-hire.js' }, () => {
        console.log('injected google-hire.js script');
      });
      chrome.windows.update(originalWindow.id, { focused: true });
    });
  });
}

chrome.webRequest.onHeadersReceived.addListener(function(details) {
  const index = details.responseHeaders.findIndex((header) => {
    return header.name === 'content-disposition';
  });
  details.responseHeaders[index].value = `attachment; filename="${currentName.trim()}.pdf"`
  return {responseHeaders: details.responseHeaders};
}, { urls: ['https://www.linkedin.com/**/profile-profilePdf/**'] }, ['blocking', 'responseHeaders']);
