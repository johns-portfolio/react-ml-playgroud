import React, { useLayoutEffect, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import * as handpose from '@tensorflow-models/handpose'
import { Coords3D } from '@tensorflow-models/handpose/dist/pipeline'
import '@tensorflow/tfjs-backend-webgl'
import * as fp from 'fingerpose'

const fingerPaths = [
  [0, 1, 2, 3, 4],
  [0, 5, 6, 7, 8],
  [0, 9, 10, 11, 12],
  [0, 13, 14, 15, 16],
  [0, 17, 18, 19, 20]
]

const HandDetector = () => {
  const webcamRef = useRef<Webcam | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [handMeaning, setHandMeaning] = useState('Loading...')
  const [fingers, setFingers] = useState<string[][]>([])

  const setFrameSize = () => {
    const video = webcamRef.current!.video!
    const { videoWidth: w, videoHeight: h } = video
    webcamRef.current!.video!.width = w
    webcamRef.current!.video!.height = h
    canvasRef.current!.width = w
    canvasRef.current!.height = h
  }

  const drawHand = (ctx: CanvasRenderingContext2D, landmarks: Coords3D) => {
    // Fill Finger
    for (let i = 0; i < landmarks.length; i++) {
      const [x, y] = landmarks[i]
      ctx.fillText(`${i}`, x, y)
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, 3 * Math.PI)
      ctx.fillStyle = 'aqua'
      ctx.fill()
    }

    // Fill Finger Path
    ctx.beginPath()
    for (const path of fingerPaths) {
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i]
        const to = path[i + 1]
        const [x1, y1] = landmarks[from]
        const [x2, y2] = landmarks[to]

        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = 'plum'
        ctx.lineWidth = 4
        ctx.stroke()
      }
    }
  }

  const detectHand = async (net: handpose.HandPose) => {
    setHandMeaning('Loading...')

    // Set Video and canvas size
    setFrameSize()

    const video = webcamRef.current!.video!
    const hands = await net.estimateHands(video)
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)

    if (hands.length > 0) {
      for (const hand of hands) {
        const landmarks = hand.landmarks
        drawHand(ctx, landmarks)

        // Gesture
        const GE = new fp.GestureEstimator([
          fp.Gestures.VictoryGesture,
          fp.Gestures.ThumbsUpGesture
        ])
        const gestures: {
          gestures: { name: string; score: number }[]
          poseData: string[][]
        } = await GE.estimate(landmarks, 8.5)
        setFingers(gestures.poseData)
        if (gestures.gestures[0]) {
          setHandMeaning(gestures.gestures[0]?.name)
        }
      }
    }
  }

  useLayoutEffect(() => {
    handpose.load().then((net) => {
      console.log('🔥 handpose loaded!', net)

      if (webcamRef.current && canvasRef.current) {
        setInterval(async () => {
          await detectHand(net)
        }, 1)
      }
    })
  }, [])

  return (
    <div>
      <h1 className="text-3xl text-blue-600">{handMeaning}</h1>
      <div className="relative h-[500px]">
        <Webcam className="absolute top-0 left-0" ref={webcamRef}></Webcam>
        <canvas className="absolute top-0 left-0" ref={canvasRef}></canvas>
      </div>
      {fingers.length > 0 && (
        <>
          <div>โป้ง {fingers[0].join(' > ')}</div>
          <div>ชี้ {fingers[1].join(' > ')}</div>
          <div>กลาง {fingers[2].join(' > ')}</div>
          <div>นาง {fingers[3].join(' > ')}</div>
          <div>ก้อย {fingers[4].join(' > ')}</div>
        </>
      )}
    </div>
  )
}

export default HandDetector
