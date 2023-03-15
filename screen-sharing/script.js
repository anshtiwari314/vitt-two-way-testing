
let startBtn = document.getElementById('start')
let stopBtn = document.getElementById('stop')
let vid = document.getElementById('vid')

let gdmOptions= {
    video: true,
    audio: false
}
function startCapture() {
    return navigator.mediaDevices.getDisplayMedia(gdmOptions)
       .catch((err) => { console.error(`Error:${err}`); return null; });
   }

function stopCapture(evt) {
    let tracks = vid.srcObject.getTracks();
  
    tracks.forEach((track) => track.stop());
    videoElem.srcObject = null;
  }


startBtn.addEventListener('click',()=>{
   //let stream = 
   //console.log(stream);
   startCapture().then((stream)=>{
    vid.srcObject = stream

    vid.addEventListener('loadedmetadata',()=>{
        vid.play()
    })

   })
   
})
stopBtn.addEventListener('click',()=>{
    stopCapture();
})