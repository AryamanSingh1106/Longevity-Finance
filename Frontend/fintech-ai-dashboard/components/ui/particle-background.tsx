"use client"

import { useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { loadStarShape } from "@tsparticles/shape-star"
import type { ISourceOptions } from "@tsparticles/engine"

const particleOptions: ISourceOptions = {
  fullScreen: false,
  background: {
    color: { value: "transparent" },
  },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "attract",
      },
      onClick: {
        enable: true,
        mode: "push",
      },
      resize: true,
    },
    modes: {
      attract: {
        distance: 120,
        duration: 0.4,
        factor: 1.4,
        speed: 1.5,
        maxSpeed: 30,
      },
      push: {
        quantity: 4,
      },
    },
  },
  particles: {
    color: {
      value: [
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#c084fc",
        "#ec4899",
        "#06b6d4",
        "#0ea5e9",
        "#e0e7ff",
      ],
    },
    links: {
      color: { value: "random" },
      distance: 140,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      straight: false,
      outModes: { default: "out" },
    },
    number: {
      value: 100,
      density: {
        enable: true,
        width: 1920,
        height: 1080,
        area: 650,
      },
    },
    opacity: {
      value: { min: 0.2, max: 0.6 },
    },
    shape: {
      type: ["circle", "star"],
      options: {
        star: {
          sides: 5,
          inset: 2,
        },
      },
    },
    size: {
      value: { min: 0.4, max: 4 },
    },
  },
  detectRetina: true,
}

export default function ParticleBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
      await loadStarShape(engine)
    }).then(() => setInit(true))
  }, [])

  if (!init) return null

  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden
    >
      <Particles
        id="login-particles"
        options={particleOptions}
        className="h-full w-full"
        style={{ position: "absolute", inset: 0 }}
      />
    </div>
  )
}
