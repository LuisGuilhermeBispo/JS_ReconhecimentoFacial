const cam = document.getElementById('cam')

const startVideo = () => {
    //navigator.getUserMedia({ video = true})
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            if (Array.isArray(devices)) {
                //tem dispositivo
                devices.forEach(device => {
                    if (device.kind === 'videoinput') {
                        //é uma camera
                        console.log(device)
                        if (device.label.includes('')) {
                            navigator.getUserMedia({
                                    video: {
                                        deviceId: device.deviceId
                                    }
                                },
                                stream => cam.srcObject = stream,
                                error => console.error(error)
                            )
                        }
                    }
                })
            }
        })
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/assets/lib/face-api/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/assets/lib/face-api/models')
]).then(startVideo)

cam.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(cam)
    canvasSize = {
        width: cam.width,
        height: cam.height
    }
    faceapi.matchDimensions(canvas, canvasSize)
    document.body.appendChild(canvas)
    setInterval(async () => {
       const detections = await faceapi.detectAllFaces(cam, new faceapi.TinyFaceDetectorOptions())
       const resizedDetections = faceapi.resizeResults(detections, canvasSize)
       canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height)
       faceapi.draw.drawDetections(canvas, resizedDetections)
    }, 100)
})