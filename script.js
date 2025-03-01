// Open the Modal
function openModal() {
  document.getElementById('movieModal').classList.remove('hidden');
}

// Close the Modal
function closeModal() {
  document.getElementById('movieModal').classList.add('hidden');
}

// Close modal when clicking outside the content
window.onclick = function (event) {
  let modal = document.getElementById('movieModal');
  if (event.target === modal) {
    closeModal();
  }
};
