export class Sprite {
  private ctx: CanvasRenderingContext2D
  private velocity: Velocity
  constructor(private config: SpriteConfig) {
    this.ctx = config.canvas.getContext('2d')!
    this.velocity = config.velocity
  }

  draw() {
    const {
      position: { x, y },
      size: { w, h }
    } = this.config
    this.ctx.fillStyle = 'red'
    this.ctx.fillRect(x, y, w, h)
  }

  update() {
    const {
      position,
      velocity,
      size: { w, h },
      canvas
    } = this.config

    position.y += velocity.y
    position.x += velocity.x
    const groundY = position.y + h
    if (groundY >= canvas.height) {
      velocity.y = 0
    }
    this.draw()
  }

  moveRight() {
    this.velocity.x = 2
  }

  moveLeft() {
    this.velocity.x = -2
  }

  stand() {
    this.velocity.x = 0
  }

  jump() {
    this.velocity.y = -10
  }
}

export type SpriteConfig = {
  position: Position
  velocity: Velocity
  canvas: HTMLCanvasElement
  size: SpriteSize
}

export type Position = {
  x: number
  y: number
}
export type Velocity = {
  x: number
  y: number
}

export type SpriteSize = {
  w: number
  h: number
}
