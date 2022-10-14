import React, { useEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'

import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
import * as cocoSsd from '@tensorflow-models/coco-ssd'

const PaperDetection = () => {
  const webcamRef = useRef<Webcam | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [handMeaning, setHandMeaning] = useState('Loading...')

  const setFrameSize = () => {
    const video = webcamRef.current!.video!
    const { videoWidth: w, videoHeight: h } = video
    webcamRef.current!.video!.width = w
    webcamRef.current!.video!.height = h
    canvasRef.current!.width = w
    canvasRef.current!.height = h
  }

  const detectObject = async (net: cocoSsd.ObjectDetection) => {
    setFrameSize()

    const video = webcamRef.current!.video!
    const objects = await net.detect(video)
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

    // Draw
    if (objects.length > 0) {
        for (const object of objects) {
            const {bbox: [x, y, w, h], class: objectName} = object
            ctx.fillStyle = 'blue';
            ctx.strokeStyle = 'red';
            ctx.rect(x, y, w, h)
            ctx.stroke();

            ctx.font = "20px serif";
            ctx.fillText(`${objectName}, x=${x.toFixed(2)}, y=${y.toFixed(2)}, w=${w.toFixed(2)}, h=${h.toFixed(2)}`, x, y)
        }
    }
  }

  useEffect(() => {
    cocoSsd.load().then((net) => {
      console.log('🔥 cocoSsd loaded!', net)
      if (webcamRef.current && canvasRef.current) {
        setInterval(async () => {
          await detectObject(net)
        }, 1)
      }
    })
  }, [])

  return (
    <div>
      <div className="relative h-[500px]">
        <Webcam className="absolute top-0 left-0" ref={webcamRef}></Webcam>
        <canvas className="absolute top-0 left-0" ref={canvasRef}></canvas>
      </div>
      <h1 className="text-3xl text-blue-600">{handMeaning}</h1>
    </div>
  )
}

export default PaperDetection
