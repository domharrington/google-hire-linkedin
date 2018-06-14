const interval = setInterval(() => {
  if (!document.querySelector('.bb-list-table')) return

  clearInterval(interval);

  if (document.querySelector('.bb-empty__title')) {
    sendMessage({
      type: 'GOOGLEHIRE',
      message: 'Candidate not found'
    });
  } else {
    sendMessage({
      type: 'GOOGLEHIRE',
      message: 'Candidate found'
    });
  }
}, 5)

function sendMessage(message) {
  console.log('Sending message from google-hire.js', message);
  chrome.runtime.sendMessage(chrome.runtime.id, message);
  window.close();
}