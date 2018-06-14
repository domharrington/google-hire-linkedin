

function insertNotice() {
  const container = document.createElement('div');
  container.classList.add('pv-top-card-v2-section__actions', 'mt2', 'display-flex');

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('pv-top-card-v2-section__actions');

  container.appendChild(innerContainer);

  const notice = document.createElement('h3');
  notice.innerText = 'Querying Google Hire…';
  notice.id = 'google-hire-linkedin-notice';

  innerContainer.appendChild(notice);

  document.querySelector('.pv-top-card-v2-section__info').appendChild(container);  
}

function sendMessage() {
  const message = {
    type: 'LINKEDIN',
    message: document.querySelector('.pv-top-card-section__name').innerText,
  };
  console.log('Sending message', message);

  chrome.runtime.sendMessage('biampieahnpfemalimhpckjmihkmbena', message);
}

insertNotice();
sendMessage();

  // try {
  //   const app = Ember.Namespace.NAMESPACES.find(function (namespace) {
  //     return namespace instanceof Ember.Application;
  //   });
  //   window.router = app.__container__.lookup('route:application');
  //   sendMessage();
  // } catch(e) {
  //   console.error('Could not get current ember app', e);
  // }
