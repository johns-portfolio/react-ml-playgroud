import React, { useLayoutEffect, useRef, useState } from 'react'

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isPainting, setIsPainting] = useState(false)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useLayoutEffect(() => {
    console.log(canvasRef.current)
    const ctx = canvasRef.current?.getContext('2d')!
    const { width, height } = canvasRef.current!
    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 100, 100)

    ctx.fillStyle = 'blue'
    ctx.fillRect(150, 0, 100, 100)

    ctx.strokeStyle = 'orange'
    ctx.lineWidth = 3
    ctx.strokeRect(300, 0, 100, 100)

    ctx.strokeStyle = 'green'
    ctx.beginPath()
    ctx.moveTo(0, 150)
    ctx.lineTo(150, 150)
    ctx.lineTo(150, 200)
    ctx.lineTo(100, 250)
    ctx.closePath()
    ctx.stroke()

    setCtx(ctx)
  }, [canvasRef])

  return (
    <>
      <div className="">
        <canvas
          className="border-gray-400 border-2"
          width={700}
          height={500}
          ref={canvasRef}
          onMouseDown={(e) => {
            ctx!.moveTo(e.clientX, e.clientY)
            setIsPainting(true)
          }}
          onMouseUp={() => setIsPainting(false)}
          onMouseMove={(e) => {
            if (isPainting) {
              ctx!.lineWidth = 2
              ctx!.lineCap = 'round'
              ctx!.lineTo(e.clientX, e.clientY)
              ctx!.stroke()
            }
          }}
        ></canvas>
      </div>
    </>
  )
}

export default Canvas
