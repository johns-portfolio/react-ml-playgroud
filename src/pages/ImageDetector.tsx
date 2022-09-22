import React, { useRef } from 'react'
import Webcam from 'react-webcam'

const ImageDetector = () => {
  const webcamRef = useRef<Webcam | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  return (
    <div>
      <div className="relative h-[500px]">
        <Webcam className="absolute top-0 left-0" ref={webcamRef}></Webcam>
        <canvas className="absolute top-0 left-0" ref={canvasRef}></canvas>
      </div>
    </div>
  )
}

export default ImageDetector
