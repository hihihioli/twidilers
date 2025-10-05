// Webcam and file uploading logic //
let videoElement, canvasElement, startButton, closeButton, cameraButton, fileButton, modalContent, modalShell;
let stream, picTaken, vidWidth, state;
let isOn = false;
window.onload = function () {
    let imageBlob;
    videoShell = document.getElementById('videoShell');
    startButton = document.getElementById('startButton');
    videoElement = document.getElementById('videoElement');
    canvasElement = document.getElementById('canvasElement');
    fileButton = document.getElementById('computerUpload');
    closeButton = document.getElementById('close');
    modalShell = document.getElementById('modal');
    modalContent = document.getElementById('modal-content');
    cameraButton = document.getElementById('camera');
    cameraControls = document.getElementById('cameraControls');
    startButton.addEventListener('click', alternator);
    closeButton.addEventListener('click', stopWebService);
    state = 0
}  

function alternator() {
    if (state == 0) {
        startWebcam()
        state = 1
    } else if (state == 1) {
        capturePhoto()
        startButton.innerHTML = "Retake"
        state = 2
        setUpload(1);
    } else if (state == 2) {
       state=1;
       picTaken = true;
       startButton.innerHTML = "Take Photo"
       setUpload(0);
       togglePhoto();
    } else if (state == 3) {
            
    }
}

function toggleWebcam() {
    if (isOn) {
        stopWebcam();
    } else {
        startWebcam()
    }
}

function togglePhoto() {
    if (!picTaken) {
        videoElement.style.display = 'none';
        canvasElement.style.display = 'block';
        picTaken = true;
    } else {
        videoElement.style.display = 'block';
        canvasElement.style.display = 'none';    
        picTaken = false;
    }
}

function setUpload(stat) {
    if (stat == 0) {
        fileButton.htmlFor = "file";
        fileButton.innerHTML = "Upload from device";
        fileButton.removeEventListener('click', uploadPhoto)
    } else if (stat == 1) {
        fileButton.htmlFor = "null";
        fileButton.innerHTML = "Use This Photo";
        fileButton.addEventListener('click', uploadPhoto)
    }
}

function startWebService() {
    modalShell.style.display = 'block'
    modalContent.style.transition = 'all 3s ease'
    modalContent.style.transform = 'translateY(0px)';
    
    userMenu.style.display = 'none';
    notifMenu.style.display = 'none';
}

function stopWebService() {
     modalContent.style.transition = 'all 0.5s ease'
        modalContent.style.transform = 'translateY(-100dvh)';
        modalShell.style.backgroundColor = 'transparent'
        setTimeout(function() {
            modalShell.style.display = 'none';
            if (isOn) {
                stopWebcam()
            }
            modalContent.style.transform = 'translateY(-50dvh)';
            modalShell.style.backgroundColor = 'rgb(0,0,0)';
            modalShell.style.backgroundColor = 'rgba(0,0,0,0.5)'
            picTaken = true;
            togglePhoto();
        }, 500);
}

async function startWebcam() {
    try {
        isOn = true;
        startButton.innerHTML = 'Starting Camera...'
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        videoShell.style.width = toString(videoShell.clientHeight)
        videoElement.style.display = 'block'
        startButton.innerHTML = 'Take Photo'
        cameraControls.style.display = 'flex'
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

function stopWebcam() {
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
    cameraControls.style.display = 'none'
    startButton.innerHTML = 'Start Camera'
    isOn = false;
}

function capturePhoto() {
    canvasElement.width = videoElement.videoWidth
    canvasElement.height = videoElement.videoHeight;
    canvasElement.getContext('2d').drawImage(videoElement, 0, 0);
    const photoDataUrl = canvasElement.toDataURL('image/png');
    imageBlob = dataURLtoBlob(photoDataUrl);
    togglePhoto();
}

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}

function uploadPhoto() {
    imageFile = new File([imageBlob], "captured.ong", { type: "image/png" });
    formData = new FormData();
    formData.append("file", imageFile);

    fetch("/settings", {
        method: "POST",
        body: formData,
        credentials: "include",
    }).then(response => {
        if (response.ok) {
            if (response.redirected) {
                window.location.href = response.url;
            } else {
                location.reload();
            }
        } else {
            console.log("Upload failed.");
        }
    }).catch(err => {
        console.error("Upload error:", err);
    });
    
}