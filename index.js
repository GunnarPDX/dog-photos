
window.onload = function() {
  loadDogPhotos();
  loadBreeds();

  document.getElementById("NextPhotoButton").addEventListener("click", incrementImageIndex);
  document.getElementById("PrevPhotoButton").addEventListener("click", decrementImageIndex);
  document.getElementById("BreedSelect").addEventListener("change", changeDogBreed);

};

function loadDogPhotos() {
  const breed = getDogBreed();

  const cachedPhotos = localStorage.getItem(`${getDogBreed()}-photos`);

  if(cachedPhotos) {
    const photos = JSON.parse(cachedPhotos);
    updateDogPhoto(photos, getImageIndex(photos.length), breed);
  } else getDogPhotos(breed);
}

function getDogPhotos(breed) {
  const url = 'https://dog.ceo/api/breed/' + breed +'/images';

  fetch(url)
    .then(response => response.json())
    .then(data => data.message && updateDogPhoto(data.message, 0, breed));
}

function updateDogPhoto(photos, i, breed) {
  const baseUrl = getUrlBase();
  const url = baseUrl + '&' + breed + '&' + i;
  setUrl(url);

  localStorage.setItem(`${breed}-photos`, JSON.stringify(photos));
  //localStorage.setItem('image-index', `${i}`);
  document.getElementById('DogPhoto').src = photos[i];

  if(breed === 'shiba') addViewedImages(photos[i]);
}

function getUrl() {
  return window.location.href;
}

function getUrlBase() {
  return getUrl().split('&')[0];
}

function setUrl(newUrl) {
  history.pushState({}, null, newUrl);
}

function setDogBreedTitle(breed) {
  document.getElementById('BreedTitle').innerText = breed;
}

function getImageIndex(iMax) {
  const iStr = getUrl().split('&')[2];
  if(iStr){
    const i = parseIndex(iStr);
    if (i && i >= 0 && i < iMax) {
      return i;
    }
  }
  return 0;
}

function incrementImageIndex() {
  const breed = getDogBreed();
  const photos = JSON.parse(localStorage.getItem(`${breed}-photos`));
  const index = getImageIndex(photos.length) + 1;

  if (index >= 0 && index < photos.length) {
    updateDogPhoto(photos, index, breed)
  } else updateDogPhoto(photos, 0, breed);
}

function decrementImageIndex() {
  const breed = getDogBreed();
  const photos = JSON.parse(localStorage.getItem(`${breed}-photos`));
  const index = getImageIndex(photos.length) - 1;

  if (index >= 0 && index < photos.length) {
    updateDogPhoto(photos, index, breed)
  } else updateDogPhoto(photos, photos.length - 1, breed);
}

function parseIndex(indexData) {
  if(indexData){
    const index = parseInt(indexData);
    if(Number.isInteger(index)) {
      return index;
    }
  } else return 0;
}

function getDogBreed() {
  const breed = getUrl().split('&')[1];

  if(breed){
    return breed;
  } else return 'shiba';
}

function loadBreeds() {
  const cachedBreeds = localStorage.getItem('breeds-list');

  if(cachedBreeds){
    const breeds = JSON.parse(cachedBreeds);
    setBreedSelectionValues(breeds);
  } else {
    getAvailableBreeds();
  }
}

function getAvailableBreeds() {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then(response => response.json())
    .then(data => buildBreedsList(data.message));
}

function buildBreedsList(breedsObj) {
  // doesnt include sub breeds
  const breeds = Object.keys(breedsObj);
  const breedsJson = JSON.stringify(breeds);
  localStorage.setItem('breeds-list', breedsJson);

  setBreedSelectionValues(breeds);
}

function setBreedSelectionValues(breeds) {
  const currentBreed = getDogBreed();

  let select = document.getElementById("BreedSelect");

  breeds.forEach(breed => select.appendChild(createNewOption(breed)));

  select.value = currentBreed;
}

function createNewOption(breed) {
  let el = document.createElement("option");
  el.text = breed;
  el.value = breed;

  return el;
}

function changeDogBreed() {
  const selection = document.getElementById('BreedSelect').value;
  const cachedPhotos = localStorage.getItem(`${selection}-photos`);

  console.log('here');

  //TODO: event listener triggering ???

  if(cachedPhotos) {
    const photos = JSON.parse(cachedPhotos);
    updateDogPhoto(photos, 0, selection);
  } else getDogPhotos(selection);
}

function addViewedImages(imgUrl) {
  let viewedImages = getViewedImages();
  if(viewedImages.indexOf(imgUrl) === -1) {
    viewedImages.push(imgUrl);
    const updatedViewedImages = JSON.stringify(viewedImages);
    localStorage.setItem('viewed', updatedViewedImages);
  }
}

function getViewedImages() {
  const imgListStr = localStorage.getItem('viewed');
  if(imgListStr) {
    return JSON.parse(imgListStr);
  } else return [];
}