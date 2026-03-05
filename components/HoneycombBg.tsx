'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface HoneycombBgProps {
  threatLevel: number // 0-1, increases activity
}

export default function HoneycombBg({ threatLevel }: HoneycombBgProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const threatRef = useRef(threatLevel)

  useEffect(() => {
    threatRef.current = threatLevel
  }, [threatLevel])

  useEffect(() => {
    if (!mountRef.current) return

    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 30

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Hexagonal grid of particles
    const hexGroup = new THREE.Group()
    scene.add(hexGroup)

    const hexPositions: THREE.Vector3[] = []
    const rows = 12
    const cols = 16
    const hexSize = 3.2

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - cols / 2) * hexSize * 1.15 + (row % 2 === 0 ? 0 : hexSize * 0.575)
        const y = (row - rows / 2) * hexSize * 0.99
        hexPositions.push(new THREE.Vector3(x, y, (Math.random() - 0.5) * 4))
      }
    }

    // Hex ring geometry
    const hexRings: THREE.LineLoop[] = []
    hexPositions.forEach(pos => {
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 6; i++) {
        const angle = (Math.PI / 3) * i
        pts.push(new THREE.Vector3(
          pos.x + Math.cos(angle) * hexSize * 0.48,
          pos.y + Math.sin(angle) * hexSize * 0.48,
          pos.z
        ))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.04 + Math.random() * 0.06,
      })
      const ring = new THREE.LineLoop(geo, mat)
      hexGroup.add(ring)
      hexRings.push(ring)
    })

    // Floating dot particles
    const particleCount = 120
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xfbbf24,
      size: 0.18,
      transparent: true,
      opacity: 0.5,
    })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    // Animate
    let frame = 0
    let animId: number
    const animate = () => {
      animId = requestAnimationFrame(animate)
      frame++

      const threat = threatRef.current
      const speed = 0.0003 + threat * 0.001
      hexGroup.rotation.z += speed * 0.3

      // Pulse hex rings based on threat
      hexRings.forEach((ring, i) => {
        const mat = ring.material as THREE.LineBasicMaterial
        const pulse = Math.sin(frame * 0.015 + i * 0.4) * 0.5 + 0.5
        mat.opacity = 0.03 + pulse * (0.06 + threat * 0.14)
        if (threat > 0.5) {
          mat.color.setHex(0xef4444)
        } else if (threat > 0.25) {
          mat.color.setHex(0xf59e0b)
        } else {
          mat.color.setHex(0xf59e0b)
        }
      })

      // Drift particles
      const pos = pGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < particleCount; i++) {
        pos.array[i * 3 + 1] += 0.012 + threat * 0.04
        if ((pos.array[i * 3 + 1] as number) > 30) {
          pos.array[i * 3 + 1] = -30
        }
      }
      pos.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}
