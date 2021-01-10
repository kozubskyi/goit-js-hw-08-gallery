// Создай галерею с возможностью клика по ее элементам и просмотра полноразмерного изображения в модальном окне.

//todo 1. Создание и рендер разметки по массиву данных и предоставленному шаблону.
//todo 2. Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
//todo 3. Открытие модального окна по клику на элементе галереи.
//todo 4. Подмена значения атрибута src элемента img.lightbox__image.
//todo 5. Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
//todo 6. Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

import galleryItems from '../gallery-items.js';

const refs = {
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
    changeModalImgSrc(bigImgUrl);
    changeModalImgAlt(ImgDesc);
    openModal();
  }
}

// 3. Открытие модального окна по клику на элементе галереи.

function openModal() {
  refs.modal.classList.add('is-open');
}

// 4. Подмена значения атрибута src элемента img.lightbox__image.

function changeModalImgSrc(url) {
  refs.modalImg.src = url;
}

function changeModalImgAlt(desc) {
  refs.modalImg.alt = desc;
}

// 5. Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].

refs.closeBtn.addEventListener('click', onCloseBtnClick);

function onCloseBtnClick() {
  cleanModalImgSrc();
  cleanModalImgAlt();
  closeModal();
}

function closeModal() {
  refs.modal.classList.remove('is-open');
}

// 6. Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

function cleanModalImgSrc() {
  refs.modalImg.src = '';
}

function cleanModalImgAlt() {
  refs.modalImg.alt = '';
}

// 7. Закрытие модального окна по клику на div.lightbox__overlay.

refs.lightboxOverlay.addEventListener('click', onCloseBtnClick);

// 8. Закрытие модального окна по нажатию клавиши ESC.

// 9. Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".