const { ipcRenderer } = require('electron');

function collectValues() {
  const values = {};
  for (const input of document.querySelectorAll('input[name]')) {
    values[input.name] = input.value;
  }
  return values;
}

window.addEventListener('DOMContentLoaded', () => {
  for (const button of document.querySelectorAll('[data-action]')) {
    button.addEventListener('click', () => {
      ipcRenderer.send('dialog-action', button.dataset.action, collectValues());
    });
  }

  for (const input of document.querySelectorAll('input[data-output]')) {
    const target = document.getElementById(input.dataset.output);
    input.addEventListener('input', () => {
      if (target) target.textContent = input.value;
    });
  }
});