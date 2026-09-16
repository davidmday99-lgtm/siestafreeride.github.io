(() => {
  const galleries = document.querySelectorAll('[data-community-gallery]');
  if (!galleries.length) return;

  const showEmpty = (gallery) => {
    const message = document.createElement('p');
    message.className = 'community-empty';
    message.textContent = gallery.dataset.emptyMessage || 'Approved customer photos will appear here.';
    gallery.appendChild(message);
  };

  fetch('community-photos.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error('Gallery unavailable');
      return response.json();
    })
    .then((data) => {
      const photos = Array.isArray(data.photos) ? data.photos.filter((photo) => photo && photo.src && photo.alt) : [];
      galleries.forEach((gallery) => {
        if (!photos.length) return showEmpty(gallery);
        photos.forEach((photo) => {
          const figure = document.createElement('figure');
          const image = document.createElement('img');
          const caption = document.createElement('figcaption');
          const title = document.createElement('strong');
          const credit = document.createElement('span');
          image.loading = 'lazy';
          image.decoding = 'async';
          image.src = photo.src;
          image.alt = photo.alt;
          title.textContent = photo.caption || 'Community favorite';
          credit.textContent = [photo.location, photo.credit].filter(Boolean).join(' • ');
          caption.append(title, credit);
          figure.append(image, caption);
          gallery.appendChild(figure);
        });
      });
    })
    .catch(() => galleries.forEach(showEmpty));
})();
