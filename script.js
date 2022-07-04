let video = document.querySelector('video')
        let mediaRecorder
        let recordBtn = document.querySelector('#record')
        let recDev = recordBtn.querySelector('div')
        // let stopBtn = document.querySelector('#stopBtn')
        let capBtn = document.querySelector('#capture')
        let capDev = document.querySelector('div')
        // let body = document.querySelector('body')
        let appliedFilter
        let chunks = []
        let minzoom = 1
        let maxzoom = 3
        let currzoom = 1

        let zoominBtn = document.querySelector('.zoom-in')
        let zoomoutBtn = document.querySelector('.zoom-out')

        let isRecording = false

        let gallaryBtn = document.querySelector('#gallary')

        gallaryBtn.addEventListener('click',function(){
            location.assign('gallary.html')
            //this will change the domain name and take me to gallary.html file
        })





        zoominBtn.addEventListener('click',function(){
            if(currzoom < maxzoom){
                currzoom = currzoom + 0.1
            }
            video.style.transform=`scale(${currzoom})`
        })

        zoomoutBtn.addEventListener('click',function(){
            if(currzoom > minzoom){
                currzoom = currzoom - 0.1
            }
            video.style.transform=`scale(${currzoom})`
        })

        let filters = document.querySelectorAll('.filter')
        for(let i = 0 ; i<filters.length ; i++){
            filters[i].addEventListener('click',function(e){
                removeFilter()
                 appliedFilter = e.currentTarget.style.backgroundColor
                let div = document.createElement('div')
                div.style.backgroundColor = appliedFilter
                div.classList.add('filter-div')
                body.append(div)
            })
        }

        // startBtn.addEventListener('click',function(){
        //     //video recording start krni hai
        //     mediaRecorder.start()
        // })

        // stopBtn.addEventListener('click',function(){
        //     //video stop krke download krni hai
        //     mediaRecorder.stop()
        // })

        recordBtn.addEventListener('click',function(e){
            if(!isRecording){
                mediaRecorder.start()
                appliedFilter = ''
                removeFilter()
                isRecording = true
                recDev.classList.add('record-animation')
                // e.currentTarget.innerText = "recording"
            }else{
                mediaRecorder.stop()
                isRecording = false
                recDev.classList.remove('record-animation')
                // e.currentTarget.innerText = "Start"
            }
        })

        capBtn.addEventListener('click',function(){
            //jobhi image screen pr dikha rha hai vo save krna hai

            if(isRecording){
                return
            }

            let canvas = document.createElement("canvas")
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            let tool = canvas.getContext('2d')


            //origin shift krna hai
            tool.translate(canvas.width/2,canvas.height/2)

            tool.scale(currzoom,currzoom)

            tool.translate(-canvas.width/2,-canvas.height/2)

            tool.drawImage(video,0,0)

            if(appliedFilter){
                tool.fillStyle = appliedFilter
                tool.fillRect(0,0,canvas.width,canvas.height)
            }

            //for image we ll save data url in db
            let link = canvas.toDataURL()
            addMedia(link,'image')
            // let a = document.createElement('a')
            // a.href = link
            // a.download = 'img.png'
            // a.click()
            // a.remove()

        })

        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(function (mediastream) {
            
            mediaRecorder = new MediaRecorder(mediastream)
            //mediarecorder object me mediastream object (jisme video aur audio hai)
            //ye video aur audio small parts called chunks me divide hoti hai jisko 
            //data bolte hai

            mediaRecorder.addEventListener('dataavailable',function(e){
                chunks.push(e.data)
            })

            mediaRecorder.addEventListener('stop',function(e){
                let blob = new Blob(chunks,{type:'video/mp4'})

                //blob is a large binary data file which is used to store and combine all the chunks array of video collected from 
                //mediastream

                chunks = []
                addMedia(blob,'video')
                // let a = document.createElement('a')
                // let url = window.URL.createObjectURL(blob)
                // a.href = url
                // a.download = 'video/mp4'
                // a.click()
                // a.remove();
            })
            
            video.srcObject = mediastream
        }).catch(function(err){
            alert("permission not granted")
        })


        function removeFilter(){
            let Filter = document.querySelector('.filter-div')
            if(Filter) Filter.remove()
        }