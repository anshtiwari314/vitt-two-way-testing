const socket = io('/')


let colorArr = ['rgb(146, 146, 145)' ,'rgb(111, 111, 111)', 'rgb(69, 69, 69)' ,'rgb(104, 104, 104)' ,'rgb(103, 97, 97)' ,'rgb(67, 63, 63)']
let userColorArr = [
    {
    background:'rgb(255, 223, 193)',
    color: 'rgb(248, 140, 16)' 
    },
    {
    background: 'rgb(227, 255, 210)',
    color: 'rgb(86, 182, 27)'
    },
    {
    background: 'rgb(166, 164, 234)',
    color: 'rgb(83, 73, 151)'
    },
    {
    background: 'rgb(164, 206, 234)',
    color: 'rgb(4, 144, 214)' 
    },
    {
    color: 'rgb(176, 173, 4)',
    background: 'rgb(251, 241, 171)'
    },
    {
    background: 'rgb(252, 193, 193)',
    color:  'rgb(238, 56, 56)' 
    }
]
if(IS_HOST){
    let trayLayoutToggle = document.getElementById('trayLayoutToggle')
    trayLayoutToggle.style.display = 'flex'
}


fetch('/checkRoomId',{
        method:'POST',
        headers:{
           'Accept':'application.json',
           'Content-Type':'application/json'
        },
        body:JSON.stringify({roomId:ROOM_ID}),
        cache:'default',
       
}).then(res=>{
    // console.log(res.data)
    // if(res.result ==='not-ok' )
    //     window.location.pathname = '/'
    return res.json()
}).then(result=>{
    if(JSON.parse(result).authorized ==='no' ){ 
    window.location.href = '/'
    }else{
//code is inside 

let myName =''
let myColor = Math.floor(Math.random() * userColorArr.length)


if(sessionStorage.getItem('userName') != null){
    myName = sessionStorage.getItem('userName')
}else{
   
    while(myName.length<2){
    myName = prompt("Please enter your name")
    if(myName.length<2)
        alert('Name must have 2 letters long')
    }
    sessionStorage.setItem('userName',myName)
}








// basic page working setup 

let vidIcon = document.getElementById('vidIcon');
let crossVidIcon = document.getElementById('crossVidIcon');
let micIcon = document.getElementById('micIcon');
let crossMicIcon = document.getElementById('crossMicIcon');
let msgIcon = document.getElementById('msgIcon');
let usersIcon = document.getElementById('usersIcon');
let crossIcon = document.getElementById('crossIcon');
let closeSideChatIcon = document.getElementById('closeSideChatIcon')
let sendMsgIcon = document.getElementById('sendMsgIcon')

let timeElement = document.getElementById('timeElement')
let sideChat = document.getElementsByClassName('chat')
let layout = document.getElementsByClassName('layout')
let RM = document.getElementById('RM')
let msgInput = document.getElementById('msgInput')

let layoutIcon = document.getElementById('layoutIcon')
let commentIcon = document.getElementById('commentIcon')

let chatBtn = document.getElementById('chatBtn')
let usrBtn = document.getElementById('usrBtn')

let screenShareBtn = document.getElementById('screen-sharing');

let HOST_ID = ''
let peerArr = []
let peersObj = {}
let myScreenSharingStream = null; 
let currentPeer = null;
let sideWindowStatus = true
let blobsUrl = []
let myStream
let screenSharing =false
let IS_SCREEN_ZOOM = false;

let MY_SOCKET_ID 
let FIRST_TIME_CONNECT = true; 

//let url1 = `https://19vnck5aw8.execute-api.ap-south-1.amazonaws.com/Prod/save-adminaudio`
//let url1 = null 
//let url2 =null
//let url2 = 'https://f6p70odi12.execute-api.ap-south-1.amazonaws.com'
let baseNgrokUrl = `https://1abf-182-72-76-34.ngrok-free.app`
let url1 = `${baseNgrokUrl}/admin`
let url2 = `${baseNgrokUrl}/admin-client`
let url3 = `${baseNgrokUrl}/client`

let options1 ={
    host: "vitt-peerjs-server-production.up.railway.app",
    port: 443,
    path: "/myapp"
}
let options2 = {
    host: "localhost",
    port: 5009,
    path: "/myapp"
}
const peer = new Peer(myId,options1)


vidIcon.addEventListener('click',()=>{

    vidIcon.style.display = 'none'
    crossVidIcon.style.display = 'block'

    toggleVideoOnOff()
})
crossVidIcon.addEventListener('click',()=>{
    vidIcon.style.display = 'block'
    crossVidIcon.style.display = 'none'
    toggleVideoOnOff()
})
micIcon.addEventListener('click',()=>{
    micIcon.style.display = 'none'
    crossMicIcon.style.display = 'block'
    toggleMicOnOff()
})
crossMicIcon.addEventListener('click',()=>{
    micIcon.style.display = 'block'
    crossMicIcon.style.display = 'none'
    toggleMicOnOff()
})
msgIcon.addEventListener('click',()=>{
    let msgWindow = document.getElementById('messages')
    let participantsWindow = document.getElementById('participants')
    let msgFooter = document.getElementById('messages-footer')
    let headerStatus = document.getElementById('header-status')

    msgWindow.style.display = 'block'
    participantsWindow.style.display = 'none'
    msgFooter.style.display = 'flex'
    headerStatus.innerText = 'Group chat'

    if(sideWindowStatus == false){
        sideWindowStatus =true
        openSideWindow()
    }
})
usersIcon.addEventListener('click',()=>{
    let msgWindow = document.getElementById('messages')
    let participantsWindow = document.getElementById('participants')
    let msgFooter = document.getElementById('messages-footer')
    let headerStatus = document.getElementById('header-status')

    msgWindow.style.display = 'none'
    participantsWindow.style.display = 'block'
    msgFooter.style.display = 'none'
    headerStatus.innerText = 'Guests'

    if(sideWindowStatus == false){
        sideWindowStatus =true
        openSideWindow()
    }
})
closeSideChatIcon.addEventListener('click',()=>{
    sideWindowStatus = false 
    closeSideWindow()
})

sendMsgIcon.addEventListener('click',()=>{
    
    if(msgInput.value != ''){
    let msg = msgInput.value
    msgInput.value = ''
    
    addNewMessage(msg,false,'')
    
    socket.emit('send-msg',msg,name)
    }
})
msgInput.addEventListener('keyup',(e)=>{
    if(e.key==='Enter' && msgInput.value != ''){

    let msg = msgInput.value
    msgInput.value = ''
    addNewMessage(msg,false,'')
    socket.emit('send-msg',msg,name)

    }
})
crossIcon.addEventListener('click',()=>{
    console.log('cross icon clicked')
    window.open('', '_self', '');

    window.close()
})

chatBtn.addEventListener('click',()=>{
    chatBtn.classList.add('button-active')
    usrBtn.classList.remove('button-active')


    let msgWindow = document.getElementById('messages')
    let participantsWindow = document.getElementById('participants')
    let msgFooter = document.getElementById('messages-footer')
    let headerStatus = document.getElementById('header-status')

    msgWindow.style.display = 'block'
    participantsWindow.style.display = 'none'
    msgFooter.style.display = 'flex'
    headerStatus.innerText = 'Group chat'

    if(sideWindowStatus == false){
        sideWindowStatus =true
        openSideWindow()
    }

})
usrBtn.addEventListener('click',()=>{
    chatBtn.classList.remove('button-active')
    usrBtn.classList.add('button-active')

    let msgWindow = document.getElementById('messages')
    let participantsWindow = document.getElementById('participants')
    let msgFooter = document.getElementById('messages-footer')
    let headerStatus = document.getElementById('header-status')

    msgWindow.style.display = 'none'
    participantsWindow.style.display = 'block'
    msgFooter.style.display = 'none'
    headerStatus.innerText = 'Guests'

    if(sideWindowStatus == false){
        sideWindowStatus =true
        openSideWindow()
    }

})

layoutIcon.addEventListener('click',()=>{
    RM.style.display= 'none'
    layout[0].style.display = 'flex'
    layoutIcon.style.display = 'none'
    commentIcon.style.display = 'block'
})

commentIcon.addEventListener('click',()=>{
    RM.style.display= 'block'
    layout[0].style.display = 'none'
    layoutIcon.style.display = 'block'
    commentIcon.style.display = 'none'
})



screenShareBtn.addEventListener('click',()=>{
   
    if(screenSharing===true){
        screenSharing=false
        screenShareBtn.style.color = 'white'
        console.log('screen sharing',screenSharing)

        let videoTrack = myStream.getVideoTracks()[0]

        let senders = currentPeer.peerConnection.getSenders().find((s)=>{
            return s.track.kind === videoTrack.kind
        })
        console.log('senders',senders)
        senders.replaceTrack(videoTrack)
        
    }

    if(screenSharing ===false){
        console.log('screen sharing',screenSharing)
        navigator.mediaDevices.getDisplayMedia({
            video:{
                frameRate:{
                    ideal:60
                }
            }
        })
    .then((stream)=>{
        console.log(stream);
       
        screenSharing = true;
        console.log('after screen share',screenSharing)
        screenShareBtn.style.color = 'red'

        let videoTrack = stream.getVideoTracks()[0]
        
            let senders = currentPeer.peerConnection.getSenders().find((s)=>{
                return s.track.kind === videoTrack.kind
            })
            console.log('senders',senders)
            senders.replaceTrack(videoTrack)
        
            
    })
    }

 })
 
function openSideWindow(){
    sideChat[0].style.display = "block"
    layout[0].style.width = "75vw"
}
function closeSideWindow(){
    
    sideChat[0].style.display = "none"
    layout[0].style.width = "100vw"
}

socket.on('receive-msg',(msg,userName)=>{
    addNewMessage(msg,true,userName)
})

socket.on('user-camera-toggle',(userId,state)=>{
    console.log('user-camera-toggle')
    let user = document.getElementById(userId)

    if(user.children[0].children[0].style.display != 'none'){
        user.children[0].children[0].style.display='none'
        user.children[0].children[1].style.display='flex'
        //console.log(user.children[0].children[1].style.display)
    }else{
        user.children[0].children[0].style.display='block'
        user.children[0].children[1].style.display='none'
        //console.log(user.children[0].children[1].style.display)
    }
    
    
})

function addNewMessage(msg,isAnotherUser,userName){
    let scrollable = document.getElementsByClassName('scrollable')[0]

    if(isAnotherUser){
        let incoming = document.createElement('div')
        incoming.classList.add('incoming')
        incoming.innerHTML = `<div class="img-wrapper">
                                    <i class="fa-solid fa-user-large img"></i>
                                    </div>
                                    
                                    <div class="client">
                                    <p class="user">${userName}</p>
                                    <div class="msg"> 
                                        <p>${msg}</p>
                                    </div>
                            </div>`
        scrollable.appendChild(incoming)
    }else{
    let outgoing = document.createElement('div')
    outgoing.classList.add('outgoing')

    outgoing.innerHTML =   `<div class="sender"> 
                                <p class="user">You</p>
                                <div class="msg">
                                    <p>${msg} </p>
                                </div>
                            </div>`
    scrollable.appendChild(outgoing) 
    }
}
function toggleVideoOnOff(){
    
    let user = document.getElementById(myId)
    let videoChild = user.querySelector('video')
    let nameChild = user.querySelector('.name')

    if(videoChild.style.display != 'none'){
        videoChild.style.display='none' //video
        nameChild.style.display='flex' //parent of p
        
    }else{
        videoChild.style.display='block'
        nameChild.style.display='none'
        
    }


    let enabled = myStream.getVideoTracks()[0].enabled
    if(enabled){
        myStream.getVideoTracks()[0].enabled = false;
        socket.emit("camera-toggle",ROOM_ID,myId,false)

        
    } else{
        myStream.getVideoTracks()[0].enabled = true;
        socket.emit("camera-toggle",ROOM_ID,myId,true)
    }
}



function toggleMicOnOff(){
    let enabled = myStream.getAudioTracks()[0].enabled
    if(enabled){
        myStream.getAudioTracks()[0].enabled = false
    } else{
        myStream.getAudioTracks()[0].enabled = true;
    }
}



function zoomOnClick(id){
    // let clickedElement = document.getElementById(id)
    // clickedElement.height = '90vh'
    // clickedElement.width = '75vw'
    
    let layout= document.getElementsByClassName('layout')[0]
    

    //converting collection to array
    let childrenArr= Array.prototype.slice.call(layout.children,0)

    

    //un zoom
    
    if(document.getElementById(id).getAttribute('zoom') ==='true'){
        
        childrenArr.forEach(e => {
            
            if(e.id === id){
                let vid= e.getElementsByTagName('video')[0]
                e.setAttribute('zoom','false')
                // vid.style.width = '70vw'
                vid.style.height = '200px'
            }else{
                e.style.display = 'flex'
            }
        });
        IS_SCREEN_ZOOM = true;
    }else{
        
            //zoom
        childrenArr.forEach(e => {
            if(e.id === id){
                // e.height = '90vh'
                // e.width = '75vw'
                let vid= e.getElementsByTagName('video')[0]
                e.setAttribute('zoom','true')
                // vid.style.width = '70vw'
                vid.style.height = '80vh'
            }else{
                e.style.display = 'none'
            }
        });
        IS_SCREEN_ZOOM = true;
    }

    
   
    
}
// if(localStorage.getItem('userId')==null){
//     localStorage.setItem('userId',uuidv4())
// }else{
//     userId = uuidv4();
// }
// console.log(`userId is`,userId)

//video setup


let displayMediaOptions = {
    video:true,
}

function startScreenCapture(){
    return navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
    .catch((err)=>{console.log(err); return null})
}
function stopScreenCapture(evt) {
    let tracks = vid.srcObject.getTracks();
  
    tracks.forEach((track) => track.stop());
    videoElem.srcObject = null;
}



peer.on('open',myId=>{
    //console.log(`peer open`,MY_SOCKET_ID)
    setTimeout(()=>{
        console.log(`peer open after 2s`,MY_SOCKET_ID)
    //    socket.emit('join-room',ROOM_ID,myId,MY_SOCKET_ID)
        socket.emit('join-room',ROOM_ID,myId)
        FIRST_TIME_CONNECT=false;
    },2000)
      
})

peer.on('disconnected',()=>{ 
    console.log(`disconnected from peer network`)
})    
 
socket.on('connect',(id)=>{
    MY_SOCKET_ID = socket.id
    console.log('socket connect first time',FIRST_TIME_CONNECT)
    if(FIRST_TIME_CONNECT ===false){
        console.log('inside join room',MY_SOCKET_ID)

        socket.emit('join-room',ROOM_ID,myId,MY_SOCKET_ID)
        
    } 
    
    console.log(`connection established socket-id,${socket.id}`)
    
})


socket.on('disconnect',()=>{
    console.log(`socket disconnect`)
})  

navigator.mediaDevices.getUserMedia({
    video:{
        frameRate:{
            ideal:60,
            min:10
        }
    },
    audio:true
}).then(stream=>{
    myStream=stream
    

    setInterval(()=>{
        // url1 
         
        if(url1 && IS_HOST===true)
            adminRecordingWithMeta(stream,true,url1,4000)
    },4000)


    let myVideo = document.createElement('video')
    myVideo.muted = true 
    addVideoStream(myVideo,myId,stream,myName,()=>{})
    let tempObj

    console.log('navigator devices',myId)
    addParticipants(myName,IS_HOST,myId,myColor)

    peer.on('call',call=>{
        call.answer(stream)
        console.log('call.peer',call.peer)
        peersObj[call.peer] = call
        currentPeer = call
        let tempObj;
        //let intervalId;
        call.on('stream',(oldUserVideoStream)=>{
           // console.log('i am stream',streamToPass)
           
          let intervalId = setInterval(()=>{
                //if(!oldUserVideoStream)
                  //  clearInterval(oldUserVideoStream)
            console.log(`set interval triggred 1`,oldUserVideoStream)
                // url1 

                if(url2 && IS_HOST===true)
                adminRecordingWithMeta(oldUserVideoStream,false,url2,4000)
           },4000) 

            if(!peerArr.includes(call.peer)){
                peerArr.push(call.peer)

                let video = document.createElement('video')
                addVideoStream(video,call.peer,oldUserVideoStream,undefined,()=>{ 
                    
                    console.log('video cb 2')
                    //changeLogoName(tempObj.name,tempObj.id)
                                    
                })
            }

            call.on('close',()=>{
                console.log('user leaved 1')
               //removeVideo(call.peer)
               //removeParticipants(call.peer)
               
                console.log(`interval id`,intervalId)
                window.clearInterval(intervalId)
               // if the element that disconnected is already zoom
               if(document.getElementById(call.peer).getAttribute('zoom')==='true'){
                console.log(document.getElementById(call.peer).getAttribute('zoom'))    
                zoomOnClick(call.peer)
               }
               removeParticipantsAndVideo(call.peer)
            })

        })

        

    })
    
    peer.on('connection',(conn)=>{

        conn.on('open', function() {
            // Receive messages
            conn.on('data', (obj)=> {
                console.log('1st receiver',obj,conn.peer)
                tempObj=obj
              if(obj.host ===true)
              HOST_ID = obj.id

              addParticipants(obj.name,obj.host,conn.peer,obj.color)
              changeLogoName(obj.name,obj.id)
            });
            // Send messages
            conn.send({name:myName,host:IS_HOST,id:myId,color:myColor});
          });

        conn.on('close',()=>{
           // console.log('1st remove conn.peer ',conn.peer)
            
        })

     })

    socket.on('user-connected',(newUserId)=>{
        console.log('new user ',newUserId)

        connectToNewUser(newUserId,myStream)
        
})

    socket.on('user-disconnected',(userId)=>{
        console.log('disconnect user id',userId)
        if(peersObj[userId]){
            peersObj[userId].close()
        }
    })
})




function changeLogoName(name,id){
    //console.log(document.getElementById(id).querySelector('p'))
   document.getElementById(id).querySelector('p').innerText = name.toUpperCase().substring(0,2);
    
}
function removeParticipants(id){
    let element = document.getElementsByClassName(id)[0]
    element.remove()
}
function addParticipants(name,host,id,color){
    console.log(host,id,host=== true ?'block':'none')
    let participants  =  document.getElementById('participants')
    let div = document.createElement('div')
    div.classList.add('user')
    div.setAttribute('tempId',id)
    
    div.innerHTML = `<div class="icon">
                        <div style="background:${userColorArr[color].background}">
                            <p style="color:${userColorArr[color].color}">${name.substring(0,2).toUpperCase()}</p>
                        </div>
                    </div>
                    <div class="name">
                        <p >${name}</p>
                        <p class="host" style="display:${host=== true ?'block':'none'}">Meeting host</p>
                    </div>
                    <div class="pins">
                        <i class="fa-solid fa-thumbtack pin"></i>
                    </div>`
    
    participants.appendChild(div)                 
                    
}

function connectToNewUser(newUserId,stream){
    //i m calling
    const call = peer.call(newUserId,stream)
    let tempObj
    //let intervalId;
    currentPeer =call
    // i am receiving
    call.on('stream',(userVideoStream) =>{
        let intervalId=setInterval(()=>{
            // url1
            console.log(`set interval triggred 2`,userVideoStream)
            
            if(url2 && IS_HOST===true) 
            adminRecordingWithMeta(userVideoStream,false,url2,4000)
       },4000) 
        //console.log('i am stream',streamToPass)
        if(!peerArr.includes(call.peer)){
            peerArr.push(call.peer)
            let video = document.createElement('video')
            addVideoStream(video,call.peer,userVideoStream,undefined,()=>{
                    console.log('video cb 1')
                    //changeLogoName(tempObj.name,tempObj.id)
                
            })
        }
        call.on('close',()=>{
            console.log('user leaved ')
            //removeVideo(newUserId)
            //removeParticipants(newUserId)
            console.log(`i am intervalId`,intervalId)
            window.clearInterval(intervalId)
            // if the element that disconnected is already zoom
            if(document.getElementById(newUserId).getAttribute('zoom')==='true'){
             console.log(document.getElementById(newUserId).getAttribute('zoom'))
             zoomOnClick(call.peer)   
            }
                
            removeParticipantsAndVideo(newUserId)
        })

    })

    
    peersObj[newUserId] =call



        //for data connection 
        const conn = peer.connect(newUserId)
            
        conn.on('open', function() {
            // Receive messages
            conn.on('data', (obj)=> {
                //console.log('2nd receiver',obj)
                tempObj=obj
                if(obj.host ===true)
                HOST_ID = obj.id
                addParticipants(obj.name,obj.host,newUserId,obj.color)  
                changeLogoName(obj.name,obj.id)              
            });

            // Send messages
            conn.send({name:myName,host:IS_HOST,id:myId,color:myColor});
        });

        conn.on('close',()=>{
            console.log('2nd remove ',newUserId)
            
        })
}

function removeVideo(id){
   let usrWrapper = document.getElementById(id)
   usrWrapper.remove()
}
function removeParticipantsAndVideo(id){
    console.log('remove video triggered');
    let usrWrapper = document.getElementById(id)
    usrWrapper?.remove()

    let element =document.querySelector(`[tempId="${id}"]`);
    console.log('remove participants triggered',element);
    element?.remove();
}
function addVideoStream(video,id,stream,name='NA',cb){
    console.log('add video stream',id)
    let layout = document.getElementById('layout')

    let usrWrapper = document.createElement('div')
    let usr = document.createElement('div')
    
    let nameDiv = document.createElement('div')
    let p = document.createElement('p')
    
    usrWrapper.classList.add('user-wrapper')
    usrWrapper.id = id
    usr.classList.add('user')
    nameDiv.classList.add('name')
    p.innerText = name.toUpperCase().substring(0,2);

    nameDiv.style.display = 'none'
    usrWrapper.style.backgroundColor =colorArr[Math.floor(Math.random()*colorArr.length)]
    usrWrapper.setAttribute('zoom','false')

    //video.style.height = "200px"
    video.srcObject = stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    
    usr.appendChild(video)
    nameDiv.appendChild(p)
    usr.appendChild(nameDiv)
    usrWrapper.appendChild(usr)

    usrWrapper.addEventListener('click',()=>zoomOnClick(id))
    layout.appendChild(usrWrapper)
   // console.log(VideoGrid) 
  // VideoGrid.append(video)

    setTimeout(()=>cb(),5000)
}
function sendToServer(blob,url){

    //chunksWithMeta.splice(0,1)
    // chunks.splice(0,1)
    
    //chunksWithMeta=[]
    //chunks = []
    console.log(`sending`)
    let reader = new FileReader();
    reader.onloadend = ()=>{
        let base64data = reader.result;
       // console.log(base64data)

        //https://f6p70odi12.execute-api.ap-south-1.amazonaws.com
        //http://localhost:5002/base64
        let date = new Date()
        console.log({
            audiomessage:base64data.split(',')[1],
            uid:myId,
            adminid:HOST_ID,
            roomid:ROOM_ID,
            isadmin:IS_HOST, 
            mob:CUST_MOB,
            timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}`
        });

        fetch(url,{
            method:'POST',
            headers:{
               'Accept':'application.json',
               'Content-Type':'application/json'
            },
            body:JSON.stringify({
                audiomessage:base64data.split(',')[1],
                uid:myId,
                adminid:HOST_ID,
                roomid:ROOM_ID,
                isadmin:IS_HOST, 
                mob:CUST_MOB,
                timeStamp:`${date.toLocaleDateString()} ${date.toLocaleTimeString()}:${date.getMilliseconds()}` 
            }),
            cache:'default',}).then(res=>{
               // console.log("res from audio server",res)
            })
        
    }
    reader.readAsDataURL(blob)
}

function adminRecordingWithMeta(stream,isadmin,url,recordingTime){

    console.log('audio stream', stream.getAudioTracks()[0]);
    const tempMedisStream =new MediaStream()
    tempMedisStream.addTrack(stream.getAudioTracks()[0])
    try{
    let arrayofChunks = []
    let mediaRecorder = new MediaRecorder(tempMedisStream,{
        audioBitsPerSecond:32000
    })
    mediaRecorder.ondataavailable = (e)=>{
        
        arrayofChunks.push(e.data)
    }
    mediaRecorder.onstop = ()=>{
        
        
        // if(audioBlobsWithMeta.length<2)
        //     return 
       //console.log(chunksWithMeta.length,chunks.length)
        
      sendToServer( new Blob(arrayofChunks,{type:'audio/wav'}),url ) 
       arrayofChunks = []
        // ConcatenateBlobs([audioBlobsWithMeta[0],audioBlobs[1]],'audio/webm',(resultBlob)=>{
            
        //    console.log(audioBlobs.length,audioBlobsWithMeta.length)
        //    sendToServer(resultBlob)
        // })
    }
    setTimeout(()=>mediaRecorder.stop(),recordingTime)
    
    mediaRecorder.start()
    }catch(e){
        console.log(e)
        return;
    }
}

function startRecordingWithMeta(stream,isadmin,url,recordingTime){
    try{
    let arrayofChunks = []
    let mediaRecorder = new MediaRecorder(stream,{
        audioBitsPerSecond:32000
    })
    mediaRecorder.ondataavailable = (e)=>{
        
        arrayofChunks.push(e.data)
    }
    mediaRecorder.onstop = ()=>{
        
        
        // if(audioBlobsWithMeta.length<2)
        //     return 
       //console.log(chunksWithMeta.length,chunks.length)
        
      sendToServer( new Blob(arrayofChunks,{type:'audio/wav'}),url ) 
       arrayofChunks = []
        // ConcatenateBlobs([audioBlobsWithMeta[0],audioBlobs[1]],'audio/webm',(resultBlob)=>{
            
        //    console.log(audioBlobs.length,audioBlobsWithMeta.length)
        //    sendToServer(resultBlob)
        // })
    }
    setTimeout(()=>mediaRecorder.stop(),recordingTime)
    
    mediaRecorder.start()
    }catch(e){
        console.log(e)
        return;
    }
}

//setting timer
function timer(hour,min,sec,d){
    let date2= new Date()
    var diff = date2.getTime() - d.getTime();

    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;

    if(hh<=0)
    timeElement.innerText = `${mm}:${ss}`
    else 
    timeElement.innerText = `${hh}:${mm}:${ss}`


}

    //code for timer
    let d = new Date()
    
    setInterval(()=>{
        timer(d.getHours(),d.getMinutes(),d.getSeconds(),d)
    },1000)
    


//code to send record data


const soc = io('vitt-ai-request-broadcaster-production.up.railway.app')



function enumIcons(color){
    if(color==='red')
        return '<i class="fa-solid fa-clipboard-question" style="color:#D60000;"></i>'
    else if(color === 'green')
        return '<i class="fa-solid fa-exclamation" style="color:green;"></i>';
    else if(color === 'yellow')
        return '<i class="fa-solid fa-forward-fast" style="color:yellow;"></i>';
    else if(color === 'blue')
        return '<i class="fa-solid fa-circle-question" style="color:#7D11E9;"></i>'
    else if(color==='pink')
        return '<i class="fa-regular fa-pen-to-square" style="color:#D60067;"></i>'
}

let concatenate = document.getElementById('concatenate-btn')
navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
    

   
   

    
    
   function initToServer(){
    fetch('https://f6p70odi12.execute-api.ap-south-1.amazonaws.com',{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    uid:myId,
                    adminid:HOST_ID,
                    roomId:ROOM_ID,
                    init: true,
                    cass:true,
                    isadmin:IS_HOST,
                    
                }),
                cache:'default',}).then(res=>{
                    console.log("first res from audio server",res)
                })
   }
   

   // startRecordingWithMeta(stream)
    

    function addImageMsg(data){

                    
        // <div class="image-msg">
        //     <img src="./image-card.png" onclick="fullSizeImage(this)"/>
        //     <div class="image-text">
        //         <p>Sure ma’am give us a moment
        //             we’ll be extremely happy to help
        //         </p>
        //     </div>

        //     <div class="suggestions">
        //         <button>Death only</button>
        //         <button>Critical illness</button>
        //         <button>Money back</button>
        //     </div>
        // </div>
        
        let wrapBox = document.createElement('div')
        wrapBox.classList.add('wrap-box');

        let resInput = document.createElement('INPUT');
        resInput.classList.add('response-radio')
        resInput.setAttribute('type','radio');
        resInput.style.accentColor = data.color

        let msg = document.createElement('div');
        msg.classList.add('msg');
        msg.style.borderColor = data.color 

        let firstElement =null,rest=null

        if(data.content?.length>0){
             [firstElement,...rest] = data.content
        }

        msg.innerHTML =
        `
        <div class="image-msg">
            <img src=${data.imageurl} onclick="fullSizeImage(this)"/>
            <div class="image-text">
                <p>${firstElement ? firstElement:'' }
                </p>
            </div>
            
        </div>
        `
        wrapBox.innerHTML = enumIcons(data.iconColor)
        wrapBox.appendChild(msg);
        wrapBox.appendChild(resInput);
        document.querySelector('.box').appendChild(wrapBox)
        

        if(data.replies?.length>0){
            let suggestions = document.createElement('div')
            suggestions.classList.add('suggestions')
            data.replies.map((e,i)=>{
                let button = document.createElement('button')
                button.innerText =e 
                button.addEventListener('click',()=>{
                    submitData(button,{suggestions:true})  
                })
                suggestions.appendChild(button)
            })
            msg.querySelector('.image-msg').appendChild(suggestions)
        }
        
        addTextMsg({sessionid:data.sessionid ,content:rest?[...rest]:null,color:data.color})
    }
    function addInputForm(data){

                // <div class="msg">
                //     <h1 class="form-header">Types of Insurance Plans</h1>
                //     <div class="form-input">
                //         <input type="text" placeholder="please enter"/>
                //     </div>
                //     <div class="icon-wrapper">
                //         <button>
                //             <i class="fa-regular fa-paper-plane"></i>
                //         </button>
                //     </div>
                // </div>

        toggleFooter(false)

        let wrapBox = document.createElement('div')
        wrapBox.classList.add('wrap-box');

        let resInput = document.createElement('INPUT');
        resInput.classList.add('response-radio')
        resInput.setAttribute('type','radio');
        resInput.style.accentColor = data.color

        let msg = document.createElement('div')
        msg.classList.add('msg')
        msg.style.borderColor = data.color;
    
        msg.innerHTML =  
                `
                <div class="form-input">
                    <h1 class="form-header">${data.label}</h1>
                    <input type="text" placeholder="${data.value}"/>
                </div>
                <div class="icon-wrapper">
                    <button onclick="submitData(this,{input:true,label:'${data.label}'})">
                        <i class="fa-regular fa-paper-plane"></i>
                    </button>
                </div>`
        
        wrapBox.innerHTML = enumIcons(data.iconColor); 

        wrapBox.appendChild(msg)
        wrapBox.appendChild(resInput)
        document.querySelector('.box').appendChild(wrapBox)
    }
    function addRadioForm(data){
        toggleFooter(false)

        let wrapBox = document.createElement('div');
        wrapBox.classList.add('wrap-box');

        let resInput = document.createElement('INPUT');
        resInput.classList.add('response-radio')
        resInput.setAttribute('type','radio');
        resInput.style.accentColor = data.color

        let msg = document.createElement('form')
            msg.onsubmit = (e)=>{
                e.preventDefault()
                let radioBtns = msg.querySelectorAll('input[type="radio"]')
                
                for(let radioBtn of radioBtns){
                    if(radioBtn.checked){
                        submitData(radioBtn,{radio:true,label:data.label})
                        return ;
                    }

                } 
            }
            msg.classList.add('msg')
            msg.style.borderColor = data.color ;
        
        let radioMsg = document.createElement('div')
            radioMsg.classList.add('radio-msg') 

        let formHeader = document.createElement('div')
            formHeader.innerText = data.label 
            formHeader.classList.add('form-header')
        
        let formRadio = document.createElement('div')
            formRadio.classList.add('form-radio')
        
        data.radio?.map((e,i)=>{
            let tempId = uuidv4()
            let radio = document.createElement('div')
            radio.classList.add('radio')
            radio.innerHTML = `
                                <input type="radio" id="${tempId}" name="data" value="${e}"/>
                                <div class="label-wrapper">
                                    <label for="${tempId}">${e}</label>
                                </div> `

            formRadio.appendChild(radio)
        })

        let iconWrapper = document.createElement('div')
        iconWrapper.classList.add('icon-wrapper')
        iconWrapper.innerHTML = `
                        <button type="submit">
                            <i class="fa-regular fa-paper-plane"></i>
                        </button>
        `
        radioMsg.appendChild(formHeader)
        radioMsg.appendChild(formRadio)
        //msg.appendChild(formHeader)
        //msg.appendChild(formRadio)
        msg.appendChild(radioMsg)
        msg.appendChild(iconWrapper)

        wrapBox.innerHTML = enumIcons(data.iconColor)
        wrapBox.appendChild(msg)
        wrapBox.appendChild(resInput);
        document.querySelector('.box').appendChild(wrapBox)
    }
    function addTextMsg(data){
        
        if(data.content===null || data.content?.length==0)
        return;
         
        let contentLength = data.content.length
        let lastMsg = data.content[contentLength-1]
        let restMsg = data.content.splice(0,contentLength-1)

        restMsg.map((e,i)=>{
            let wrapBox = document.createElement('div')
            wrapBox.classList.add('wrap-box')

            let resInput = document.createElement('INPUT');
            resInput.classList.add('response-radio')
            resInput.setAttribute('type','radio');
            resInput.style.accentColor = data.color

            let msg = document.createElement('div')
            msg.classList.add('msg')
            msg.style.borderColor = data.color 

            msg.innerHTML = 
            `
            <div class="text-msg">  
                <div class="msg-wrapper">
                    <p>${e}</p>
                </div>
            </div>
                `
            wrapBox.innerHTML = enumIcons(data.iconColor)
            wrapBox.appendChild(msg)
            wrapBox.appendChild(resInput)
            document.querySelector('.box').appendChild(wrapBox)
        })
        if(data.replies?.length===0)
            return ;
        //toggleFooter(false) 
        console.log('replies runned')
        let wrapBox = document.createElement('div');
        wrapBox.classList.add('wrap-box');

        let resInput = document.createElement('INPUT');
        resInput.classList.add('response-radio')
        resInput.setAttribute('type','radio');
        resInput.style.accentColor = data.color

        let msg = document.createElement('div');
            msg.classList.add('msg')

            let textMsg = document.createElement('div')
            textMsg.classList.add('text-msg')

            textMsg.innerHTML = `
                <div class="msg-wrapper">
                    <p>${lastMsg}</p>
                </div>
                `
            
            let suggestions = document.createElement('div')
                suggestions.classList.add('suggestions')
            

                data.replies?.map((e,i)=>{
                    let button = document.createElement('button')
                    button.innerText = e
                    
                    suggestions.appendChild(button)
                    button.addEventListener('click',()=>{
                        submitData(button,{suggestions:true})  
                    })
                })
                textMsg.appendChild(suggestions)
                msg.appendChild(textMsg)
                msg.style.borderColor = data.color

                wrapBox.innerHTML = enumIcons(data.iconColor)
                wrapBox.appendChild(msg)
                wrapBox.appendChild(resInput)

                document.querySelector('.box').appendChild(wrapBox) 
        
    }

    function addOnlySuggestiveMsg(data){
        let wrapBox = document.createElement('div')
        wrapBox.classList.add('wrap-box');

        let resInput = document.createElement('INPUT');
        resInput.classList.add('response-radio')
        resInput.setAttribute('type','radio');
        resInput.style.accentColor = data.color

        let msg = document.createElement('div')
        msg.classList.add('msg')
        msg.style.borderColor = data.color;

        let suggestions = document.createElement('div')
        suggestions.classList.add('suggestions')

        data.replies?.map((e,i)=>{
            let button = document.createElement('button')
            button.innerText =e 
            button.addEventListener('click',()=>{
                submitData(button,{suggestions:true})  
            })
            suggestions.appendChild(button)
        })

        msg.appendChild(suggestions)

        wrapBox.innerHTML = enumIcons(data.iconColor);
        wrapBox.appendChild(msg);
        wrapBox.appendChild(resInput)
        document.querySelector('.box').appendChild(wrapBox)
    }

    
    soc.on('connect',(id)=>{
        initToServer()
        setInterval(()=>{
    
        if(url3 && IS_HOST===false)
            startRecordingWithMeta(stream,false,url3,3000)
        },1500)
    })

    soc.on('receive-data',(data)=>{
       console.log('receive from node',data)

       if(data.imageurl){

        addImageMsg(data)
        }else if(data.value){

        addInputForm(data)
        }else if(data.radio){

        addRadioForm(data)
        }else if(data.content){
        addTextMsg(data)
        }else{
            addOnlySuggestiveMsg(data)
        }
       
    })

})

    
}
}).catch(e=>console.log(e))
