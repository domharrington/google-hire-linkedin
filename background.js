chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'linkedin.com'},
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostContains: 'hire.withgoogle.com'},
        })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

let linkedinTab

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

function queryGoogleHire(name) {
  chrome.windows.getCurrent(function (originalWindow) {
    chrome.windows.create({
      url: 'https://hire.withgoogle.com/t/readmeio/hiring/candidates/browse/all?q=' + encodeURIComponent(`free-text == "${name}"`),
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
  
  // chrome.tabs.query({url: 'https://hire.withgoogle.com/*' }, function(tabs) {
  //   chrome.tabs.update(tabs[0].id, { url: 'https://hire.withgoogle.com/t/readmeio/hiring/candidates/browse/all?q=' + encodeURIComponent(`free-text == "${name}"`), active: true }, (updatedTab) => {
  //     chrome.tabs.executeScript(updatedTab.id, { file: 'google-hire.js' }, () => {
  //       console.log('injected google-hire.js script');
  //     })
  //   })
  // }); 
}
