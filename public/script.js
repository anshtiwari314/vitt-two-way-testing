
if(pinata){
navigator.mediaDevices.getUserMedia({
    video:false,
    audio:true
}).then(audioStream=>{
    let time1 = new Date()
    let flag = false
    let audioChunks = []
    let audioBlobs = []
    function sendToServer(blob){
        audioBlobs.splice(0,1)
        let reader = new FileReader();
        reader.onloadend = ()=>{
            let base64data = reader.result;
            //console.log(base64data)

            //https://f6p70odi12.execute-api.ap-south-1.amazonaws.com
            //http://localhost:5000/checkRoomId

            fetch('http://localhost:5002/base64',{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    audiomessage:base64data.split(',')[1],
                    //uid:myId,
                    isadmin:IS_HOST
                }),
                cache:'default',}).then(res=>{
                    console.log("res from audio server",res)
                })
            
        }

        reader.readAsDataURL(blob)

    }

    function recordAudio(stream,d){
        console.log(`record audio triggerd`)
        let mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (e)=> {
            audioChunks.push(e.data)
            audioBlobs.push(new Blob(audioChunks,{'type':'audio/wav'} ));
            audioChunks = []
        }
        mediaRecorder.onstop = ()=>{
            
            if(flag===false){
                flag= true
                return
            }    
            //console.log(audioChunks.length,typeof audioChunks[0])
            ConcatenateBlobs(audioBlobs,'audio/wav',(resultBlob)=>{
                sendToServer(resultBlob)
            })
            
            
        };
        setTimeout(()=>{ mediaRecorder.stop()},2000)
        mediaRecorder.start()

    }
    
    if(IS_HOST){
        setInterval(()=>recordAudio(audioStream),2000)
        
        // setInterval(()=>{
        //     console.log('size of audio chunks :',audioChunks.length)
        //     sendToServer(new Blob(audioChunks,{'type':'audio/wav'} ))
        //     },2000)
    }
})

}

ConcatenateBlobs(audioBlobs,'audio/wav',(resultBlob)=>{
    sendToServer(resultBlob)
})