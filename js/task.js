// Создай галерею с возможностью клика по ее элементам и просмотра полноразмерного изображения в модальном окне.

//todo 1. Создание и рендер разметки по массиву данных и предоставленному шаблону.
//todo 2. Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
//todo 3. Открытие модального окна по клику на элементе галереи.
//todo 4. Подмена значения атрибута src элемента img.lightbox__image.
//todo 5. Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
//todo 6. Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

import galleryItems from '../gallery-items.js';

const refs = {
  body: document.querySelector('body'),
  gallery: document.querySelector('.js-gallery'),
  modal: document.querySelector('.js-lightbox'),
  modalImg: document.querySelector('.lightbox__image'),
  closeBtn: document.querySelector('[data-action="close-lightbox"]'),
  lightboxOverlay: document.querySelector('.lightbox__overlay'),
};

// 1. Создание и рендер разметки по массиву данных и предоставленному шаблону.

function createGallery(array, elementRef) {
  let liArray = array.map(element => {
    let li = document.createElement('li');
    let a = document.createElement('a');
    let img = document.createElement('img');

    a.append(img);
    li.append(a);

    li.classList.add('gallery__item');
    a.classList.add('gallery__link');
    a.setAttribute('href', `${element.original}`);
    img.classList.add('gallery__image');
    img.setAttribute('src', `${element.preview}`);
    img.setAttribute('data-source', `${element.original}`);
    img.setAttribute('alt', `${element.description}`);

    return li;
  });
  elementRef.append(...liArray);
}

createGallery(galleryItems, refs.gallery);

// 2. Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.

refs.gallery.addEventListener('click', onGalleryClick);

function onGalleryClick(event) {
  event.preventDefault();

  if (event.target.nodeName === 'IMG') {
    const bigImgUrl = event.target.dataset.source;
    const ImgDesc = event.target.getAttribute('alt');

    console.log(bigImgUrl);
    openModal(bigImgUrl, ImgDesc);
  }
}

// 3. Открытие модального окна по клику на элементе галереи.

function openModal(url, desc) {
  addModalImg(url, desc);
  addClassIsOpen();
  removeBodyScroll();
}

function addClassIsOpen() {
  refs.modal.classList.toggle('is-open'); // refs.modal.classList.add('is-open');
}

function removeBodyScroll() {
  refs.body.style.overflow = 'hidden'; // отключаю скролл при открытии модального окна
}

// 4. Подмена значения атрибута src элемента img.lightbox__image.

function addModalImg(url, desc) {
  refs.modalImg.src = url;
  refs.modalImg.alt = desc;
}

// 5. Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].

refs.closeBtn.addEventListener('click', closeModal);

function closeModal() {
  removeModalImg();
  removeClassIsOpen();
  backBodyScroll();
}

function removeClassIsOpen() {
  refs.modal.classList.toggle('is-open'); // refs.modal.classList.remove('is-open');
}

function backBodyScroll() {
  refs.body.removeAttribute('style'); // возвращаю скролл при закрытии модального окна
}

// 6. Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

function removeModalImg() {
  refs.modalImg.src = '';
  refs.modalImg.alt = '';
}

// 7. Закрытие модального окна по клику на div.lightbox__overlay.

refs.lightboxOverlay.addEventListener('click', closeModal);

// 8. Закрытие модального окна по нажатию клавиши ESC.

window.addEventListener('keydown', onEscClick);

function onEscClick(event) {
  if (event.code === 'Escape' && refs.modal.classList.contains('is-open')) {
    closeModal();
  }
}

// 9. Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

// Сделал без data-index, сравнивал описание обьекта массива и альт изображения в модалке

window.addEventListener('keydown', leafModalImg);

function leafModalImg(event) {
  if (event.code === 'ArrowLeft' && refs.modal.classList.contains('is-open')) {
    for (let i = 0; i < galleryItems.length; i++) {
      if (galleryItems[i].original === refs.modalImg.src) {
        if (i === 0) {
          refs.modalImg.src = galleryItems[galleryItems.length - 1].original;
          refs.modalImg.alt = galleryItems[galleryItems.length - 1].description;
          return;
        } else {
          refs.modalImg.src = galleryItems[i - 1].original;
          refs.modalImg.alt = galleryItems[i - 1].description;
        }
      }
    }
  }
  if (event.code === 'ArrowRight' && refs.modal.classList.contains('is-open')) {
    for (let i = galleryItems.length - 1; i >= 0; i--) {
      if (galleryItems[i].original === refs.modalImg.src) {
        if (i === galleryItems.length - 1) {
          refs.modalImg.src = galleryItems[0].original;
          refs.modalImg.alt = galleryItems[0].description;
          return;
        } else {
          refs.modalImg.src = galleryItems[i + 1].original;
          refs.modalImg.alt = galleryItems[i + 1].description;
        }
      }
    }
  }
}
