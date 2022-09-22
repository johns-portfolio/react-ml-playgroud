import React, { useEffect, useRef, useState } from 'react'
import { Sprite } from '../components/FightingGame/Sprite'

const FightingGame = () => {
  const screenRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (screenRef.current && canvasRef.current) {
      const { clientWidth, clientHeight } = screenRef.current!
      canvasRef.current.width = clientWidth
      canvasRef.current.height = clientHeight

      const ctx = canvasRef.current.getContext('2d')!
      setCtx(ctx)

      const player = new Sprite({
        position: {
          x: 0,
          y: 0
        },
        velocity: {
          x: 0,
          y: 10
        },
        size: {
          w: 50,
          h: 150
        },
        canvas: canvasRef.current
      })
      player.draw()

      const enemy = new Sprite({
        position: {
          x: 300,
          y: 10
        },
        velocity: {
          x: 0,
          y: 5
        },
        size: {
          w: 50,
          h: 150
        },
        canvas: canvasRef.current
      })
      enemy.draw()

      const animate = () => {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
        player.update()
        // enemy.update()

        requestAnimationFrame(animate)
      }
      animate()

      window.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'd':
            player.moveRight()
            break
          case 'a':
            player.moveLeft()
            break
          case 'w':
            player.jump()
            break

          default:
            break
        }
      })

      window.addEventListener('keyup', (e) => {
        switch (e.key) {
          case 'd':
          case 'a':
            player.stand()
            break

          default:
            break
        }
      })
    }
  }, [canvasRef])

  return (
    <div ref={screenRef} className="w-screen h-screen">
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default FightingGame
