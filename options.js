const form = document.getElementById('form');

chrome.storage.local.get('company', function ({ company }) {
  form.elements.company.value = company;
});

form.addEventListener('submit', function (e) {
  e.preventDefault()
  chrome.storage.local.set({ company: form.elements.company.value }, function (value) {
    console.log('Value is set to ' + form.elements.company.value);
  });
})