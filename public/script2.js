const socket = io('https://vitt-jarvis-backend.herokuapp.com');

let concatenate = document.getElementById('concatenate-btn')
navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
    

    function sendToServer(blob){

        //chunksWithMeta.splice(0,1)
        // chunks.splice(0,1)
        
        //chunksWithMeta=[]
        //chunks = []
        console.log(`sending`)
        let reader = new FileReader();
        reader.onloadend = ()=>{
            let base64data = reader.result;
            //console.log(base64data)

            //https://f6p70odi12.execute-api.ap-south-1.amazonaws.com
            //http://localhost:5002/base64

            fetch('https://f6p70odi12.execute-api.ap-south-1.amazonaws.com',{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    audiomessage:base64data.split(',')[1],
                    uid:uuid,
                   // isadmin:IS_HOST
                }),
                cache:'default',}).then(res=>{
                   // console.log("res from audio server",res)
                })
            
        }
        reader.readAsDataURL(blob)
    }
    
    function startRecordingWithMeta(stream){
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
            
           sendToServer( new Blob(arrayofChunks,{type:'audio/wav'}) ) 
           arrayofChunks = []
            // ConcatenateBlobs([audioBlobsWithMeta[0],audioBlobs[1]],'audio/webm',(resultBlob)=>{
                
            //    console.log(audioBlobs.length,audioBlobsWithMeta.length)
            //    sendToServer(resultBlob)
            // })
        }
        setTimeout(()=>mediaRecorder.stop(),3000)

        mediaRecorder.start()
    }
   

    
    
   function initToServer(){
    fetch('https://f6p70odi12.execute-api.ap-south-1.amazonaws.com',{
                method:'POST',
                headers:{
                   'Accept':'application.json',
                   'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    uid:uuid,
                    init: true,
                    cass:true
                   // isadmin:IS_HOST
                }),
                cache:'default',}).then(res=>{
                    console.log("first res from audio server",res)
                })
   }
   console.log(!IS_HOST)
  initToServer()
   setInterval(()=>{
    
        //startRecordingWithMeta(stream)
    
    },1500)

   
    

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



        let msg = document.createElement('div')
        msg.classList.add('msg')
        
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
        document.querySelector('.box').appendChild(msg)

        
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
        
        addTextMsg({sessionid:data.sessionid ,content:rest?[...rest]:null})
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
        let msg = document.createElement('div')
        msg.classList.add('msg')
        msg.innerHTML =  
                `<h1 class="form-header">${data.label}</h1>
                <div class="form-input">
                    <input type="text" placeholder="${data.value}"/>
                </div>
                <div class="icon-wrapper">
                    <button onclick="submitData(this,{input:true})">
                        <i class="fa-regular fa-paper-plane"></i>
                    </button>
                </div>`
        
        document.querySelector('.box').appendChild(msg)
    }
    function addRadioForm(data){
        toggleFooter(false)
        let msg = document.createElement('form')
            msg.onsubmit = (e)=>{
                e.preventDefault()
                let radioBtns = msg.querySelectorAll('input[type="radio"]')
                
                for(let radioBtn of radioBtns){
                    if(radioBtn.checked){
                        submitData(radioBtn,{radio:true})
                        return ;
                    }

                } 
            }
            msg.classList.add('msg')

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
        msg.appendChild(formHeader)
        msg.appendChild(formRadio)
        msg.appendChild(iconWrapper)

        document.querySelector('.box').appendChild(msg)
    }
    function addTextMsg(data){
        
        if(data.content===null || data.content?.length==0)
        return;
         
        let contentLength = data.content.length
        let lastMsg = data.content[contentLength-1]
        let restMsg = data.content.splice(0,contentLength-1)

        restMsg.map((e,i)=>{
            let msg = document.createElement('div')
            msg.classList.add('msg')

            let textMsg = document.createElement('div')
            textMsg.classList.add('text-msg')

            textMsg.innerHTML = `
                <div class="msg-wrapper">
                    <p>${e}</p>
                </div>
                `
            msg.appendChild(textMsg)
            document.querySelector('.box').appendChild(msg)
        })
        if(data.replies?.length===0)
            return ;
        //toggleFooter(false) 
        let msg = document.createElement('div')
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
                document.querySelector('.box').appendChild(msg) 
        
    }

    function addOnlySuggestiveMsg(data){
        let msg = document.createElement('div')
        msg.classList.add('msg')

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
        document.querySelector('.box').appendChild(msg)
    }
    socket.on('receive-data',(data)=>{
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





