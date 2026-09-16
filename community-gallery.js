(() => {
  const galleries = document.querySelectorAll('[data-community-gallery]');
  if (!galleries.length) return;

  const approvedListUrl = 'https://res.cloudinary.com/r7ir5w7l/image/list/siesta-community-approved.json';

  const showEmpty = (gallery) => {
    const message = document.createElement('p');
    message.className = 'community-empty';
    message.textContent = gallery.dataset.emptyMessage || 'Approved customer photos will appear here.';
    gallery.appendChild(message);
  };

  const cloudinaryPhoto = (resource) => {
    const context = resource.context?.custom || resource.context || {};
    const source = resource.secure_url || resource.url || '';
    return {
      src: source.replace('/upload/', '/upload/f_auto,q_auto,c_limit,w_1400/'),
      alt: context.caption ? `${context.caption}${context.location ? ` at ${context.location}` : ''}` : 'Siesta Free Ride community photo',
      caption: context.caption || 'Community favorite',
      location: context.location || '',
      credit: context.show_credit === 'yes' ? context.credit || '' : ''
    };
  };

  const loadJson = async (url) => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Gallery source unavailable');
    return response.json();
  };

  Promise.allSettled([
    loadJson('community-photos.json'),
    loadJson(approvedListUrl)
  ]).then((results) => {
    const local = results[0].status === 'fulfilled' && Array.isArray(results[0].value.photos)
      ? results[0].value.photos
      : [];
    const cloud = results[1].status === 'fulfilled' && Array.isArray(results[1].value.resources)
      ? results[1].value.resources.map(cloudinaryPhoto)
      : [];
    const photos = [...cloud, ...local].filter((photo) => photo && photo.src && photo.alt);

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
  });
})();
