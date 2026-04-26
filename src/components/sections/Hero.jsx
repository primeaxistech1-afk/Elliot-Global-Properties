import { useEffect, useRef, useState, useCallback } from 'react'
import '../sections/styles/Hero.css'
import heroImg from "../../assets/heroPage.jpg"

// ─── Cycling words for headline ───────────────────────────────────────────────
const CYCLE_WORDS = ['Elevated.', 'Redefined.', 'Curated.', 'Yours.']
const CYCLE_INTERVAL = 2800
const CYCLE_FADE_MS = 380

/
// ─── Scroll indicator ─────────────────────────────────────────────────────────
function ScrollIndicator() {
    return (
        <div className="hero__scroll-indicator" aria-hidden="true">
            <svg width="1" height="56" viewBox="0 0 1 56" fill="none">
                <line
                    x1="0.5" y1="0" x2="0.5" y2="56"
                    stroke="rgba(248,247,245,0.18)"
                    strokeWidth="1"
                />
                <line
                    className="hero__scroll-line"
                    x1="0.5" y1="0" x2="0.5" y2="56"
                    stroke="#C0001A"
                    strokeWidth="1"
                    strokeDasharray="56"
                    strokeDashoffset="56"
                />
            </svg>
            <span className="hero__scroll-label">SCROLL</span>
        </div>
    )
}

// ─── Decorative corner marks ──────────────────────────────────────────────────
function CornerMark({ position }) {
    return (
        <div className={`hero__corner hero__corner--${position}`} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {position === 'tl' && <>
                    <line x1="0" y1="0" x2="14" y2="0" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                    <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                </>}
                {position === 'tr' && <>
                    <line x1="20" y1="0" x2="6" y2="0" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                    <line x1="20" y1="0" x2="20" y2="14" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                </>}
                {position === 'bl' && <>
                    <line x1="0" y1="20" x2="14" y2="20" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                    <line x1="0" y1="20" x2="0" y2="6" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                </>}
                {position === 'br' && <>
                    <line x1="20" y1="20" x2="6" y2="20" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                    <line x1="20" y1="20" x2="20" y2="6" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                </>}
            </svg>
        </div>
    )
}

// ─── Main Hero Component ──────────────────────────────────────────────────────
export default function Hero() {
    // ── State
    const [mounted, setMounted] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const [wordIndex, setWordIndex] = useState(0)
    const [wordPhase, setWordPhase] = useState('visible') // 'visible' | 'fading' | 'hidden'

    // ── Refs
    const sectionRef = useRef(null)
    const rafRef = useRef(null)
    const scrollRef = useRef(0)
    const cycleRef = useRef(null)
    const isMobileRef = useRef(false)
    const isReducedRef = useRef(false)

    // ── Mount animation trigger
    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80)
        return () => clearTimeout(t)
    }, [])

    // ── Detect environment capabilities
    useEffect(() => {
        isMobileRef.current = window.matchMedia('(pointer: coarse)').matches
        isReducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])

    // ── Parallax scroll (rAF-based for smoothness)
    const handleScroll = useCallback(() => {
        scrollRef.current = window.scrollY
    }, [])

    useEffect(() => {
        if (isMobileRef.current || isReducedRef.current) return

        const tick = () => {
            setScrollY(scrollRef.current)
            rafRef.current = requestAnimationFrame(tick)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        rafRef.current = requestAnimationFrame(tick)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            cancelAnimationFrame(rafRef.current)
        }
    }, [handleScroll])

    // ── Cycling word
    useEffect(() => {
        if (isReducedRef.current) return

        cycleRef.current = setInterval(() => {
            // 1. Start fade out
            setWordPhase('fading')

            // 2. At mid-fade, swap word (invisible)
            setTimeout(() => {
                setWordPhase('hidden')
                setWordIndex(i => (i + 1) % CYCLE_WORDS.length)
            }, CYCLE_FADE_MS / 2)

            // 3. Fade in new word
            setTimeout(() => {
                setWordPhase('visible')
            }, CYCLE_FADE_MS)

        }, CYCLE_INTERVAL)

        return () => clearInterval(cycleRef.current)
    }, [])

    // ── Parallax values
    const bgY = scrollY * 0.35   // bg photo moves slowest
    const gridY = scrollY * 0.55   // grid mid-speed
    const contentY = scrollY * 0.18   // content barely moves

    return (
        <section className="hero" ref={sectionRef} aria-label="Hero">

            {/* ── Layer 0: Background image ──────────────────────────────────── */}
            <div
                className="hero__bg"
                style={{ transform: `translate3d(0, ${bgY}px, 0)` }}
            >
             
            <img src={heroImg} alt="" />
                <div className="hero__bg-gradient" aria-hidden="true" />
            </div>


            {/* ── Corner marks (survey scope frame) ─────────────────────────── */}
            <CornerMark position="tl" />
            <CornerMark position="tr" />
            <CornerMark position="bl" />
            <CornerMark position="br" />

            {/* ── Layer 2: Content ───────────────────────────────────────────── */}
            <div
                className="hero__content"
                style={{ transform: `translate3d(0, ${contentY}px, 0)` }}
            >

                {/* Property count badge — top right */}
                <div className={`hero__badge ${mounted ? 'hero__badge--visible' : ''}`}>
                    <span className="hero__badge-number">500+</span>
                    <span className="hero__badge-label">Properties</span>
                </div>

                {/* ── Main headline block ───────────────────────────────────────── */}
                <div className="hero__headline-block">

                    {/* H1 */}
                    <h1 className="hero__h1">
                        Find your  
                        <span
                            
                        >
                        Perfect  Property
                        </span>
                        with  Elliot Global Properties
                    </h1>

                    {/* Sub-tagline */}
                    <p className={`hero__tagline ${mounted ? 'hero__tagline--visible' : ''}`}>
                       Find your perfect property  with confidence with verified listings, expert guidance, and a smooth buying experience designed  to help you make the right choice effectively.
                    </p>

                    {/* CTA group */}
                    <div className={`hero__cta-group ${mounted ? 'hero__cta-group--visible' : ''}`}>
                        <a href="/properties" className="hero__btn hero__btn--primary">
                            <span className="hero__btn-text">Explore Properties</span>
                            <span className="hero__btn-fill" aria-hidden="true" />
                        </a>
                        <a href="/about" className="hero__btn hero__btn--ghost">
                            <span className="hero__btn-text">Our Story</span>
                            <svg className="hero__btn-arrow" width="16" height="10" viewBox="0 0 16 10" fill="none">
                                <path d="M0 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                            </svg>
                        </a>
                    </div>
                </div>
                </div>
        </section>
    )
}