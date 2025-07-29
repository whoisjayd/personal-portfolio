"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Anchor from "@/app/(home)/anchor"

const FruitNinjaGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameOver, setGameOver] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [highScore, setHighScore] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("fruitNinjaHighScore") || "0", 10)
    }
    return 0
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let displayWidth = canvas.clientWidth
    let displayHeight = canvas.clientHeight

    const resizeCanvas = () => {
      displayWidth = canvas.clientWidth
      displayHeight = canvas.clientHeight
      const dpr = window.devicePixelRatio
      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const fruits: any[] = []
    const particles: any[] = []
    const fruitTypes = ["🍎", "🍊", "🍉", "🍇", "🍌", "🥝"]
    let animationId: number
    let currentScore = 0
    let isSlicing = false
    let slicePoints: { x: number; y: number }[] = []
    let gameTime = 30

    const getThemeColor = (variable: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
    }

    const playSliceSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
      } catch (e) {}
    }

    const createFruit = () => {
      const fruitRadius = displayWidth * 0.05 // Scale with canvas width
      const speed = Math.min(1 + (30 - gameTime) * 0.05, 2)
      return {
        x: Math.random() * (displayWidth - 2 * fruitRadius) + fruitRadius,
        y: displayHeight + fruitRadius,
        radius: fruitRadius,
        emoji: fruitTypes[Math.floor(Math.random() * fruitTypes.length)],
        vx: (Math.random() - 0.5) * 3 * (displayWidth / 320) * speed,
        vy: -(Math.random() * 6 + 6) * (displayWidth / 320) * speed,
        gravity: 0.15 * (displayWidth / 320),
      }
    }

    const createParticle = (x: number, y: number) => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      radius: Math.random() * (displayWidth * 0.01) + (displayWidth * 0.005), // Scale particles
      life: 30,
      color: `hsl(${getThemeColor('--foreground')})`,
    })

    const addFruit = () => {
      if (!gameStarted || gameOver) return
      const maxFruits = Math.min(6, 3 + Math.floor((30 - gameTime) / 5))
      if (fruits.length < maxFruits) fruits.push(createFruit())
    }

    const handleInputStart = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect()
      const canvasX = x - rect.left
      const canvasY = y - rect.top
      if (canvasX >= 0 && canvasX <= displayWidth && canvasY >= 0 && canvasY <= displayHeight) {
        isSlicing = true
        slicePoints = [{ x: canvasX, y: canvasY }]
        if (!gameStarted || gameOver) {
          startGame()
        }
      }
    }

    const handleInputMove = (x: number, y: number) => {
      if (!isSlicing) return
      const rect = canvas.getBoundingClientRect()
      const canvasX = x - rect.left
      const canvasY = y - rect.top
      if (canvasX >= 0 && canvasX <= displayWidth && canvasY >= 0 && canvasY <= displayHeight) {
        slicePoints.push({ x: canvasX, y: canvasY })
        if (slicePoints.length > 15) slicePoints.shift()
      } else {
        isSlicing = false
        slicePoints = []
      }
    }

    const handleInputEnd = () => {
      isSlicing = false
      slicePoints = []
    }

    const handleMouseDown = (e: MouseEvent) => {
      handleInputStart(e.clientX, e.clientY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleInputMove(e.clientX, e.clientY)
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleInputStart(touch.clientX, touch.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleInputMove(touch.clientX, touch.clientY)
    }

    const checkCollision = (fruit: any, point: { x: number; y: number }) => {
      const dx = fruit.x - point.x
      const dy = fruit.y - point.y
      return Math.sqrt(dx * dx + dy * dy) < fruit.radius
    }

    const drawFruit = (fruit: any) => {
      ctx.font = `${displayWidth * 0.06}px monospace` // Scale font
      ctx.fillStyle = `hsl(${getThemeColor('--foreground')})`
      ctx.textAlign = "center"
      ctx.fillText(fruit.emoji, fruit.x, fruit.y + displayWidth * 0.02)
    }

    const drawParticles = () => {
      particles.forEach((p, i) => {
        p.life--
        if (p.life <= 0) {
          particles.splice(i, 1)
          return
        }
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${getThemeColor('--foreground')} / ${p.life / 30})`
        ctx.fill()
      })
    }

    const drawSliceTrail = () => {
      if (slicePoints.length < 2 || !isSlicing) return
      ctx.beginPath()
      ctx.strokeStyle = `hsl(${getThemeColor('--foreground')} / 0.8)`
      ctx.lineWidth = displayWidth * 0.008 // Scale line width
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.moveTo(slicePoints[0].x, slicePoints[0].y)
      for (let i = 1; i < slicePoints.length; i++) {
        ctx.lineTo(slicePoints[i].x, slicePoints[i].y)
      }
      ctx.stroke()
    }

    const drawStartScreen = () => {
      ctx.fillStyle = `hsl(${getThemeColor('--background')} / 0.8)`
      ctx.fillRect(0, 0, displayWidth, displayHeight)
      ctx.font = `${displayWidth * 0.08}px monospace` // Scale font
      ctx.fillStyle = `hsl(${getThemeColor('--foreground')})`
      ctx.textAlign = "center"
      ctx.fillText("🥷 Fruit Ninja", displayWidth / 2, displayHeight / 2 - displayWidth * 0.08)
      ctx.font = `${displayWidth * 0.04}px monospace`
      ctx.fillText("Swipe to slice fruits!", displayWidth / 2, displayHeight / 2 - displayWidth * 0.02)
      ctx.fillText("30 seconds to get high score", displayWidth / 2, displayHeight / 2 + displayWidth * 0.03)
      ctx.font = `${displayWidth * 0.035}px monospace`
      ctx.fillStyle = `hsl(${getThemeColor('--muted-foreground')})`
      ctx.fillText("Click or tap to start", displayWidth / 2, displayHeight / 2 + displayWidth * 0.12)
    }

    const drawGameOver = () => {
      ctx.fillStyle = `hsl(${getThemeColor('--background')} / 0.9)`
      ctx.fillRect(0, 0, displayWidth, displayHeight)
      ctx.font = `${displayWidth * 0.07}px monospace` // Scale font
      ctx.fillStyle = `hsl(${getThemeColor('--foreground')})`
      ctx.textAlign = "center"
      ctx.fillText("Game Over!", displayWidth / 2, displayHeight / 2 - displayWidth * 0.08)
      if (currentScore > highScore) {
        ctx.font = `${displayWidth * 0.035}px monospace`
        ctx.fillStyle = `hsl(${getThemeColor('--foreground')})`
        ctx.fillText("🎉 New High Score! 🎉", displayWidth / 2, displayHeight / 2 - displayWidth * 0.04)
      }
      ctx.font = `${displayWidth * 0.045}px monospace`
      ctx.fillStyle = `hsl(${getThemeColor('--foreground')})`
      ctx.fillText(`Final Score: ${currentScore}`, displayWidth / 2, displayHeight / 2)
      ctx.font = `${displayWidth * 0.035}px monospace`
      ctx.fillStyle = `hsl(${getThemeColor('--muted-foreground')})`
      ctx.fillText("Click or tap to play again", displayWidth / 2, displayHeight / 2 + displayWidth * 0.08)
    }

    const update = () => {
      ctx.fillStyle = `hsl(${getThemeColor('--background')})`
      ctx.fillRect(0, 0, displayWidth, displayHeight)

      if (!gameStarted) {
        drawStartScreen()
        animationId = requestAnimationFrame(update)
        return
      }

      if (gameOver) {
        drawGameOver()
        animationId = requestAnimationFrame(update)
        return
      }

      fruits.forEach((fruit, index) => {
        fruit.x += fruit.vx
        fruit.y += fruit.vy
        fruit.vy += fruit.gravity

        if (isSlicing && slicePoints.some((point) => checkCollision(fruit, point))) {
          fruits.splice(index, 1)
          currentScore++
          setScore(currentScore)
          playSliceSound()
          for (let i = 0; i < 8; i++) {
            particles.push(createParticle(fruit.x, fruit.y))
          }
        }

        if (
          fruit.y > displayHeight + fruit.radius ||
          fruit.x < -fruit.radius ||
          fruit.x > displayWidth + fruit.radius
        ) {
          fruits.splice(index, 1)
        }
      })

      drawParticles()
      drawSliceTrail()
      fruits.forEach(drawFruit)

      animationId = requestAnimationFrame(update)
    }

    const handleGameOver = () => {
      setGameOver(true)
      setGameStarted(false)
      if (currentScore > highScore) {
        setHighScore(currentScore)
        localStorage.setItem("fruitNinjaHighScore", currentScore.toString())
      }
    }

    const startGame = () => {
      setGameOver(false)
      setGameStarted(true)
      setTimeLeft(30)
      currentScore = 0
      gameTime = 30
      setScore(0)
      fruits.length = 0
      particles.length = 0
      slicePoints = []
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleInputEnd)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchend", handleInputEnd)
    canvas.addEventListener("mouseleave", handleInputEnd)

    update()

    let gameTimer: NodeJS.Timeout
    let fruitInterval: NodeJS.Timeout

    if (gameStarted && !gameOver) {
      gameTimer = setInterval(() => {
        gameTime--
        setTimeLeft(gameTime)
        if (gameTime <= 0) {
          handleGameOver()
          clearInterval(fruitInterval)
        }
      }, 1000)

      fruitInterval = setInterval(addFruit, 800)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleInputEnd)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleInputEnd)
      canvas.removeEventListener("mouseleave", handleInputEnd)
      cancelAnimationFrame(animationId)
      clearInterval(gameTimer)
      clearInterval(fruitInterval)
    }
  }, [gameStarted, gameOver, highScore])

  return (
    <div className="w-full flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="w-full aspect-square max-h-[80vh] sm:max-h-[70vh] mx-auto my-2 border border-border rounded-lg bg-background cursor-pointer touch-none"
        tabIndex={0}
      />
      <div className="flex justify-between w-full max-w-[480px] px-2 sm:px-4 text-xs sm:text-sm font-mono text-foreground">
        <span>Score: {score}</span>
        <span>High: {highScore}</span>
        <span
          className={
            timeLeft <= 10
              ? "text-destructive"
              : timeLeft <= 20
              ? "text-foreground/70"
              : "text-foreground"
          }
        >
          Time: {timeLeft}s
        </span>
      </div>
    </div>
  )
}
export default function NotFound() {
  return (
    <main
      id="not-found"
      className="h-screen overflow-hidden flex flex-col items-center justify-center bg-background py-6 -mt-16"
    >
      <div className="w-[90vw] max-w-[480px] text-center px-2 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-1 sm:mb-2">404</h1>
        <h2 className="text-base sm:text-lg font-medium text-foreground mb-2 sm:mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-2 sm:mb-4 text-sm sm:text-base">
          This page is lost. Slice fruits below! Swipe to cut, score high in 30 seconds.
        </p>
        <div className="overflow-hidden">
          <FruitNinjaGame />
        </div>
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
          <p className="text-muted-foreground text-xs sm:text-sm">
            Back to <Anchor href="/">home</Anchor> or read my <Anchor href="/blog">blogs</Anchor>.
          </p>
        </div>
      </div>
    </main>
  );
}

