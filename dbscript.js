let req = indexedDB.open('gallaryDB', 1)
let db
let body = document.querySelector('body')

req.addEventListener('success', function () {
    db = req.result
    // alert('db opened')
})

req.addEventListener('upgradeneeded', function () {
    let accessToCameraDB = req.result
    accessToCameraDB.createObjectStore('Gallary', { keyPath: 'mId' })

})

req.addEventListener('error', function () {
    alert('error')
})

function addMedia(media, type) {
    if (!db) {
        return
    }

    let obj = { mId: Date.now(), media, type }

    let tx = db.transaction("Gallary", 'readwrite')
    let gallary = tx.objectStore('Gallary')
    gallary.add(obj)
}

function deleteMedia(id) {
    if (!db) return;

    let tx = db.transaction("Gallary", "readwrite");
    let gallery = tx.objectStore("Gallary");
    //when we set id as an attribute to delete btn it becomes a string but we have stored the id as a number in db so we have to typecast.
    gallery.delete(Number(id));
}

function viewMedia() {
    let tx = db.transaction("Gallary", 'readonly')
    let gallary = tx.objectStore('Gallary')
    let cReq = gallary.openCursor();

    cReq.addEventListener('success', function () {
        let cursor = cReq.result
        if (cursor) {
            // console.log(cursor)
            let mo = cursor.value
            let linkfordownloadBtn =''
            //dom ke thru media container bnao
            let div = document.createElement('div')
            div.classList.add('media-container')


            if (mo.type == "video") {
                let url = window.URL.createObjectURL(cursor.value.media);
                linkForDownloadBtn = url;
                div.innerHTML = `<div class="media">
                  <video src="${url}" autoplay loop controls muted></video>
              </div>
              <button class="download">Download</button>
              <button class="delete" data-id="${mo.mId}" >Delete</button>`;
                //I have to render a video tag
              } else {
                linkForDownloadBtn = cursor.value.media;
                div.innerHTML = `<div class="media">
                  <img src="${cursor.value.media}"/>
              </div>
              <button class="download">Download</button>
              <button class="delete" data-id="${mo.mId}">Delete</button>`;
                //I have to render a image tag
              }


            let downloadBtn = div.querySelector('.download')
            downloadBtn.addEventListener('click', function () {
                let a = document.createElement('a')
                a.href = linkfordownloadBtn

                if (mo.type == 'video') {
                    a.download = 'video.mp4'
                } else {
                    a.download = 'img.png'
                }


                a.click()
                a.remove()
            })

            let deleteBtn = div.querySelector(".delete")
            deleteBtn.addEventListener("click", function (e) {
                //removing from db
                let id = e.currentTarget.getAttribute("data-id")
                deleteMedia(id)

                //removing from ui
                e.currentTarget.parentElement.remove()
            })


            body.append(div)
            cursor.continue()
        }
    })

}