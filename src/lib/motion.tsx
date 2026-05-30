'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

// ─── Fade-up entrance (replaces initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}) ──
export function FadeUp({
  children,
  delay = 0,
  duration = 0.3,
  className = ''
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Slide entrance (replaces initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}) ──
export function SlideIn({
  children,
  direction = 1,
  delay = 0,
  duration = 0.25,
  className = ''
}: {
  children: ReactNode
  direction?: 1 | -1  // 1 = from right, -1 = from left
  delay?: number
  duration?: number
  className?: string
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : `translateX(${direction * 20}px)`,
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Pop entrance (replaces scale: 0 → 1 with spring) ──
export function Pop({
  children,
  delay = 0,
  className = ''
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay * 1000)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0)',
        transition: visible
          ? 'opacity 0.3s ease-out, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
          : 'none',
      }}
    >
      {children}
    </div>
  )
}

// ─── Animated width (replaces motion progress bars) ──
export function AnimatedWidth({
  percentage,
  duration = 0.5,
  className = ''
}: {
  percentage: number
  duration?: number
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        width: `${percentage}%`,
        transition: `width ${duration}s ease-out`,
      }}
    />
  )
}

// ─── Rotating element (replaces animate={{ rotate }}) ──
export function Rotate({
  rotated,
  children,
  duration = 0.2,
  className = ''
}: {
  rotated: boolean
  children: ReactNode
  duration?: number
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: `transform ${duration}s ease`,
      }}
    >
      {children}
    </div>
  )
}
