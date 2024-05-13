// Saves options to chrome.storage
const saveOptions = () => {
  const amount = Number((<HTMLInputElement>document.getElementById('amount'))?.value) ?? 1;

  chrome.storage.sync.set({ amount: amount }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    if (status) {
      status.textContent = 'Salvestatud.';
      setTimeout(() => {
        status.textContent = '';
      }, 750);
    }
  });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  console.log('restoreOptions');
  chrome.storage.sync.get({ amount: 1 }, (items) => {
    console.log(items);
    const amount = <HTMLInputElement>document.getElementById('amount');
    if (amount) {
      amount.value = items.amount;
    }
  });
};

document.addEventListener('DOMContentLoaded', restoreOptions);

const saveButton = document.getElementById('save');
if (saveButton) {
  saveButton.addEventListener('click', saveOptions);
}
