(() => {
  const form = document.querySelector('[data-photo-form]');
  if (!form) return;

  const fileInput = form.querySelector('[data-photo-file]');
  const fileName = form.querySelector('[data-file-name]');
  const preview = form.querySelector('[data-photo-preview]');
  const previewImage = preview?.querySelector('img');
  const error = form.querySelector('[data-photo-error]');
  const submitButton = form.querySelector('.photo-submit-button');
  const thanks = document.querySelector('[data-photo-thanks]');
  const maxBytes = 10 * 1024 * 1024;
  const allowedTypes = new Set(['image/jpeg', 'image/png']);
  let previewUrl = '';

  const showError = (message) => {
    error.textContent = message;
    error.hidden = false;
  };

  const clearError = () => {
    error.textContent = '';
    error.hidden = true;
  };

  fileInput.addEventListener('change', () => {
    clearError();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
    preview.hidden = true;
    const file = fileInput.files?.[0];
    if (!file) {
      fileName.textContent = 'No photo chosen yet';
      return;
    }
    fileName.textContent = file.name;
    if (!allowedTypes.has(file.type)) {
      fileInput.value = '';
      fileName.textContent = 'No photo chosen yet';
      showError('Please choose a JPEG or PNG image.');
      return;
    }
    if (file.size > maxBytes) {
      fileInput.value = '';
      fileName.textContent = 'No photo chosen yet';
      showError('That photo is larger than 10 MB. Please choose a smaller image.');
      return;
    }
    previewUrl = URL.createObjectURL(file);
    previewImage.src = previewUrl;
    preview.hidden = false;
  });

  form.addEventListener('submit', (event) => {
    clearError();
    const file = fileInput.files?.[0];
    if (!file || !allowedTypes.has(file.type) || file.size > maxBytes) {
      event.preventDefault();
      showError('Choose one JPEG or PNG image under 10 MB before submitting.');
      fileInput.focus();
      return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Sending photo…';
  });

  const params = new URLSearchParams(window.location.search);
  if (thanks && params.get('submitted') === '1') {
    thanks.hidden = false;
  }
})();
