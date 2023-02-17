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
    

    function sendToServer(blob){

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
        setTimeout(()=>mediaRecorder.stop(),5000)

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
  initToServer()
   setInterval(()=>{
   // https://f6p70odi12.execute-api.ap-south-1.amazonaws.com
    startRecordingWithMeta(stream)
    
    },1500)

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

    socket.on('connect',(id)=>{
        console.log(`connection established ${id}`)
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





