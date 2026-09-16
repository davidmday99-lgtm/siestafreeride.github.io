(() => {
  const form = document.querySelector('[data-photo-form]');
  if (!form) return;

  const cloudName = 'r7ir5w7l';
  const uploadPreset = 'siesta_community_pending';
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
  const fileInput = form.querySelector('[data-photo-file]');
  const fileName = form.querySelector('[data-file-name]');
  const preview = form.querySelector('[data-photo-preview]');
  const previewImage = preview?.querySelector('img');
  const error = form.querySelector('[data-photo-error]');
  const status = form.querySelector('[data-photo-status]');
  const submitButton = form.querySelector('.photo-submit-button');
  const thanks = document.querySelector('[data-photo-thanks]');
  const maxBytes = 10 * 1024 * 1024;
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/heic', 'image/heif']);
  const allowedExtensions = /\.(?:jpe?g|png|heic|heif)$/i;
  let previewUrl = '';
  let submitting = false;

  const isAllowedFile = (file) => allowedTypes.has(file.type) || allowedExtensions.test(file.name);
  const escapeContext = (value) => String(value || '').replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/=/g, '\\=');

  const showError = (message) => {
    error.textContent = message;
    error.hidden = false;
    status.hidden = true;
  };

  const showStatus = (message) => {
    status.textContent = message;
    status.hidden = false;
    error.hidden = true;
  };

  const clearMessages = () => {
    error.textContent = '';
    error.hidden = true;
    status.textContent = '';
    status.hidden = true;
  };

  fileInput.addEventListener('change', () => {
    clearMessages();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
    preview.hidden = true;
    const file = fileInput.files?.[0];
    if (!file) {
      fileName.textContent = 'No photo chosen yet';
      return;
    }
    fileName.textContent = file.name;
    if (!isAllowedFile(file)) {
      fileInput.value = '';
      fileName.textContent = 'No photo chosen yet';
      showError('Please choose an iPhone HEIC, JPEG or PNG image.');
      return;
    }
    if (file.size > maxBytes) {
      fileInput.value = '';
      fileName.textContent = 'No photo chosen yet';
      showError('That photo is larger than 10 MB. Please choose a smaller image.');
      return;
    }
    previewUrl = URL.createObjectURL(file);
    previewImage.onload = () => { preview.hidden = false; };
    previewImage.onerror = () => { preview.hidden = true; };
    previewImage.src = previewUrl;
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;
    clearMessages();

    const file = fileInput.files?.[0];
    if (!file || !isAllowedFile(file) || file.size > maxBytes) {
      showError('Choose one iPhone HEIC, JPEG or PNG image under 10 MB before submitting.');
      fileInput.focus();
      return;
    }

    submitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Uploading photo…';
    showStatus('Uploading your photo securely for private review…');

    try {
      const displayName = form.elements.display_name.value.trim();
      const showCredit = form.elements.show_credit.checked;
      const context = [
        `caption=${escapeContext(form.elements.caption.value.trim())}`,
        `location=${escapeContext(form.elements.location.value)}`,
        `credit=${escapeContext(showCredit ? displayName : '')}`,
        `show_credit=${showCredit ? 'yes' : 'no'}`,
        'permission_to_publish=yes'
      ].join('|');
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('upload_preset', uploadPreset);
      uploadData.append('tags', 'siesta-community');
      uploadData.append('context', context);

      const response = await fetch(uploadUrl, { method: 'POST', body: uploadData });
      const result = await response.json();
      if (!response.ok || !result.secure_url || !result.public_id) {
        throw new Error(result?.error?.message || 'The photo upload could not be completed.');
      }

      const addHiddenField = (name, value) => {
        const field = document.createElement('input');
        field.type = 'hidden';
        field.name = name;
        field.value = value;
        form.appendChild(field);
      };
      addHiddenField('cloudinary_review_url', result.secure_url);
      addHiddenField('cloudinary_public_id', result.public_id);
      addHiddenField('moderation_status', result.moderation?.[0]?.status || 'pending');
      fileInput.disabled = true;
      showStatus('Photo uploaded. Sending the private review notice…');
      submitButton.textContent = 'Sending for review…';
      HTMLFormElement.prototype.submit.call(form);
    } catch (uploadError) {
      submitting = false;
      submitButton.disabled = false;
      submitButton.innerHTML = 'Send for approval <span>→</span>';
      showError(uploadError.message || 'We could not upload that photo. Please try again.');
    }
  });

  const params = new URLSearchParams(window.location.search);
  if (thanks && params.get('submitted') === '1') {
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
})();
