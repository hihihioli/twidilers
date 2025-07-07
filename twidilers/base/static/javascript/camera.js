// Webcam and file uploading logic //
let videoElement, canvasElement, photoElement, startButton, captureButton, closeButton, cameraButton, modalContent, modalShell;
let stream;
let isOn = false;
window.onload = function () {
    videoElement = document.getElementById('videoElement');
    canvasElement = document.getElementById('canvasElement');
    photoElement = document.getElementById('photoElement');
    startButton = document.getElementById('startButton');
    captureButton = document.getElementById('captureButton');
    closeButton = document.getElementById('close');
    modalShell = document.getElementById('modal');
    modalContent = document.getElementById('modal-content');
    cameraButton = document.getElementById('camera');
    startButton.addEventListener('click', toggleWebcam);
    captureButton.addEventListener('click', capturePhoto);

    closeButton.addEventListener('click', function () {
        modalContent.style.transition = 'all 0.5s ease'
        modalContent.style.transform = 'translateY(-700px)';
        setTimeout(function() {
            modalShell.style.display = 'none';
            if (isOn) {
                stopWebcam()
            }
            modalContent.style.transform = 'translateY(-470px)';
            modalContent.style.transition = 'all 0.75s ease'
        }, 500);
    });
    cameraButton.addEventListener('click', function () {
        modalShell.style.display = 'block';
        setTimeout(function() {modalContent.style.transform = 'translateY(0px)';}, 0);
    });
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
}

function toggleWebcam() {
    if (!isOn) {
        startWebcam();
    } else {
        stopWebcam();
    }
    isOn = !isOn
};

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}
async function startWebcam() {
    try {
        startButton.innerHTML = 'Starting Webcam...'
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        captureButton.disabled = false;
        captureButton.style.display = "block"
        videoElement.style.display = 'block'
        startButton.innerHTML = 'Stop Camera'
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}
function stopWebcam() {
    stream.getTracks().forEach(track => track.stop());
    videoElement.srcObject = null;
    captureButton.style.display = "none"
    captureButton.disabled = true;
    startButton.innerHTML = 'Start Camera'
}
function capturePhoto() {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    canvasElement.getContext('2d').drawImage(videoElement, 0, 0);
    const photoDataUrl = canvasElement.toDataURL('image/png');
    photoElement.src = photoDataUrl;
    const imageBlob = dataURLtoBlob(photoDataUrl);

    // Create a File object
    const imageFile = new File([imageBlob], "captured.ong", { type: "image/png" });

    // Create FormData and submit
    const formData = new FormData();
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