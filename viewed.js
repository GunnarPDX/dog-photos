window.onload = function() {
  loadViewdImages();

};

function loadViewdImages() {

  const imgList = getViewedImages().reverse();

  let container = document.createElement('div');

  imgList.map(imgSrc => container.appendChild(createNewImage(imgSrc)));

  console.log(container);

  document.getElementById('ImageList').appendChild(container);

}

function createNewImage(imgSrc) {
  let img = document.createElement('img');
  img.src = imgSrc;

  return img;
}

function getViewedImages() {
  const imgListStr = localStorage.getItem('viewed');
  if(imgListStr) {
    return JSON.parse(imgListStr);
  } else return [];
}