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
    canvas.style.filter = filter;
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
   // if(canvas == null)
   //       return;

     selectedImg = selectedImg.target;
     let img = new Image();
     img.src = selectedImg.src;

     if(img.src == null)
        return;
   // // console.log(img);
   // // console.log(selectedImg);
   const context = canvas.getContext('2d');

   context.globalOperation = "source-over";
  let saved_img = context.drawImage(img, 0, 0, width,height);
 

   var button = document.getElementById('save');
   button.addEventListener('click', function (e) {

    var dataURL = canvas.toDataURL(saved_img);
  //  button.href = saved_img;
 
});
}

function to_image(){
                var canvas = document.getElementById("canvas");
                document.getElementById("photos").src = canvas.toDataURL();
                Canvas2Image.saveAsPNG(canvas);
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
//=========================================================================
// var current_page = 1;
// var records_per_page = 2;


// var objJson = [
//     { adName: "AdName 1"},
//     { adName: "AdName 2"},
//     { adName: "AdName 3"},
//     { adName: "AdName 4"},
//     { adName: "AdName 5"},
//     { adName: "AdName 6"},
//     { adName: "AdName 7"},
//     { adName: "AdName 8"},
//     { adName: "AdName 9"},
//     { adName: "AdName 10"}
// ]; // Can be obtained from another source, such as your objJson variable

//  // Can be obtained from another source, such as your objJson variable

// function prevPage()
// {
//     if (current_page > 1) {
//         current_page--;
//         changePage(current_page);
//     }
// }

// function nextPage()
// {
//     if (current_page < numPages()) {
//         current_page++;
//         changePage(current_page);
//     }
// }
    
// function changePage(page)
// {
//     var btn_next = document.getElementById("btn_next");
//     var btn_prev = document.getElementById("btn_prev");
//     var listing_table = document.getElementById("listingTable");
//     var page_span = document.getElementById("page");
 
//     // Validate page
//     if (page < 1) page = 1;
//     if (page > numPages()) page = numPages();
//     listing_table.innerHTML = "";

//     for (var i = (page-1) * records_per_page; i < (page * records_per_page); i++) {
//         listing_table.innerHTML += objJson[i].adName + "<br>";
//     }
//     page_span.innerHTML = page;

//     if (page == 1) {
//         btn_prev.style.visibility = "hidden";
//     } else {
//         btn_prev.style.visibility = "visible";
//     }

//     if (page == numPages()) {
//         btn_next.style.visibility = "hidden";
//     } else {
//         btn_next.style.visibility = "visible";
//         }
// }

// function numPages()
// {
//     return Math.ceil(objJson.length / records_per_page);
// }

// window.onload = function() {
//     changePage(1);
// };

// var ran = ("#save").on("click",function() {
//     var canvas = document.getElementById("canvas");
//     var image = canvas.toDataURL();
//     var aLink = document.createElement('a');
//     var evt = document.createEvent("HTMLEvents");
//     evt.initEvent("click");
//     aLink.download = 'image.png';
//     aLink.href = image;
//     aLink.dispatchEvent(evt);
//   });
// //=======================================================================
// // Get the modal
// var modal = document.getElementById("myModal");

// // Get the image and insert it inside the modal - use its "alt" text as a caption
// var img = document.getElementById("myImg");
// var modalImg = document.getElementById("img01");
// var captionText = document.getElementById("caption");
// img.onclick = function(){
//   modal.style.display = "block";
//   modalImg.src = this.src;
//   captionText.innerHTML = this.alt;
// }

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() { 
//   modal.style.display = "none";
// }

// const button = document.getElementById('like');
// button.addEventListener('click', function(e) {
//   console.log('button was clicked');
// });

// console.log('Client-side code running');

// const button = document.getElementById('like');
// button.addEventListener('click', function(e) {
//   console.log('button was clicked');

//   fetch('/clicked', {method: 'POST'})
//     .then(function(response) {
//       if(response.ok) {
//         console.log('Click was recorded');
//         return;
//       }
//       throw new Error('Request failed.');
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// });

// setInterval(function() {
//   fetch('/clicks', {method: 'GET'})
//     .then(function(response) {
//       if(response.ok) return response.json();
//       throw new Error('Request failed.');
//     })
//     .then(function(data) {
//       document.getElementById('counter').innerHTML = `Button was clicked ${data.length} times`;
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// }, 1000);

// $('#demo').pagination({
//     dataSource: [1, 2, 3, 4, 5, 6, 7, ... , 35],
//     pageSize: 5,
//     autoHidePrevious: true,
//     autoHideNext: true,
//     callback: function(data, pagination) {
//         // template method of yourself
//         var html = template(data);
//         dataContainer.html(html);
//     }