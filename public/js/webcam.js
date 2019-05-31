// Global Vars
let width = 500,
height = 0,
filter = 'none',
streaming = false;

// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoButton = document.getElementById('photo-button');
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');
let imgUrl = null;

// Get media stream
navigator.mediaDevices.getUserMedia({video: true, audio: false})
.then(function(stream) {
    // Link to the video source
    video.srcObject = stream;
    // Play video
    video.play();
})
.catch(function(err) {
  console.log(`Error: ${err}`);
});

  // Play when ready
  video.addEventListener('canplay', function(e) {
    if(!streaming) {
      // Set video / canvas height
      height = video.videoHeight / (video.videoWidth / width);

      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);

      streaming = true;
  }
}, false);

  // Photo button event
  photoButton.addEventListener('click', function(e) {
    takePicture();

    e.preventDefault();
}, false);

  // Filter event
  photoFilter.addEventListener('change', function(e) {
    // Set filter to chosen option
    filter = e.target.value;
    // Set filter to video
    video.style.filter = filter;

    e.preventDefault(); 
});

  // Clear event
  clearButton.addEventListener('click', function(e) {
    // Clear photos
    photos.innerHTML = '';
    // Change filter back to none
    filter = 'none';
    // Set video filter
    video.style.filter = filter;
    // Reset select list
    photoFilter.selectedIndex = 0;
});

  // Take picture from canvas
  function takePicture() {
    // Create canvas
    const context = canvas.getContext('2d');
    if(width && height) {
      // set canvas props
      canvas.width = width;
      canvas.height = height;
      // Draw an image of the video on the canvas
      context.drawImage(video, 0, 0, width, height);

      // Create image from the canvas
      imgUrl = canvas.toDataURL('image/png');
   //   console.log(imgUrl);

      // Create img element
      const img = document.createElement('img');
      img.setAttribute('id', 'canvasImage');

      // // // Set img src
      img.setAttribute('src', imgUrl);

      // // // Set image filter
      img.style.filter = filter;

      // // Add image to photos
      // photos.appendChild(img);
  }
}
function overLay(selectedImg){
   //  if(imgUrl == null)
     //    return;

     selectedImg = selectedImg.target;
     let img = new Image();
     img.src = selectedImg.src;
   // // console.log(img);
   // // console.log(selectedImg);
   const context = canvas.getContext('2d');

   context.globalOperation = "source-over";
  let saved_img = context.drawImage(img, 0, 0, width,height);
   //  if(width && height) {
   //    // set canvas props
       // canvas.width = width;
       // canvas.height = height;

   //    // Draw an image of the video on the canvas

   var button = document.getElementById('save');
   button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL();
    button.href = saved_img;
});
}

document.getElementById('file').onchange = function(e) {
  var img = new Image();
  img.onload = draw;
  img.onerror = failed;
  img.src = URL.createObjectURL(this.files[0]);
};
function draw() {
  var canvas = document.getElementById('canvas');
  canvas.width = this.width;
  canvas.height = this.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(this, 0,0);
}
function failed() {
  console.error("The provided file couldn't be loaded as an Image media");
}

var button = document.getElementById('save');
button.addEventListener('click', function (e) {
    var dataURL = canvas.toDataURL('image/png');
    button.href = dataURL;
});


//=======================================================================
