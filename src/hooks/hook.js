/* ============================================================
   ELLIOT GLOBAL PROPERTIES
   CUSTOM HOOKS & UTILITIES
   ============================================================ */


// ============================================================
// hooks/useInView.js
// Scroll-triggered visibility — wraps IntersectionObserver
// ============================================================

import { useEffect, useRef, useState } from 'react'

export function useInView(options = {}) {
    const ref = useRef(null)
    const [isInView, setIsInView] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true)
                if (options.once !== false) {
                    observer.unobserve(el) // fire once by default
                }
            }
        }, {
            threshold: options.threshold ?? 0.15,
            rootMargin: options.rootMargin ?? '0px 0px -60px 0px',
        })

        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return [ref, isInView]
}


// ============================================================
// hooks/useOdometer.js
// Slot-machine digit roll — fires when triggered
// ============================================================

import { useEffect, useRef, useState } from 'react'

export function useOdometer(targetValue, isTriggered, duration = 800) {
    const [displayValue, setDisplayValue] = useState(0)
    const frameRef = useRef(null)
    const startRef = useRef(null)
    const startValRef = useRef(0)

    useEffect(() => {
        if (!isTriggered) return

        // Check for reduced motion preference
        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches
        if (prefersReduced) {
            setDisplayValue(targetValue)
            return
        }

        const animate = (timestamp) => {
            if (!startRef.current) startRef.current = timestamp
            const elapsed = timestamp - startRef.current
            const progress = Math.min(elapsed / duration, 1)

            // Ease out expo
            const eased = progress === 1
                ? 1
                : 1 - Math.pow(2, -10 * progress)

            const current = Math.floor(
                startValRef.current + (targetValue - startValRef.current) * eased
            )
            setDisplayValue(current)

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate)
            }
        }

        frameRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameRef.current)
    }, [isTriggered, targetValue, duration])

    return displayValue
}


// ============================================================
// hooks/useScrollProgress.js
// Returns 0-1 scroll progress through a ref element
// Used for the Services page left-edge progress line
// ============================================================

import { useEffect, useState, useRef } from 'react'

export function useScrollProgress(containerRef) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const el = containerRef?.current
            if (!el) return

            const rect = el.getBoundingClientRect()
            const windowHeight = window.innerHeight
            const totalScrollable = rect.height - windowHeight

            if (totalScrollable <= 0) {
                setProgress(1)
                return
            }

            const scrolled = Math.max(0, -rect.top)
            setProgress(Math.min(scrolled / totalScrollable, 1))
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [containerRef])

    return progress
}


// ============================================================
// hooks/useParallax.js
// Returns a translateY value based on scroll position
// Used for hero parallax layers
// ============================================================

import { useEffect, useState } from 'react'

export function useParallax(speed = 0.4) {
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        // Disable on touch devices (performance)
        if (window.matchMedia('(pointer: coarse)').matches) return

        // Disable on reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const handleScroll = () => {
            setOffset(window.scrollY * speed)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [speed])

    return offset
}


// ============================================================
// hooks/useCursor.js
// Custom crosshair cursor with lerp lag
// ============================================================

import { useEffect, useRef } from 'react'

export function useCursor() {
    const cursorRef = useRef(null)
    const posRef = useRef({ x: 0, y: 0 })
    const targetRef = useRef({ x: 0, y: 0 })
    const rafRef = useRef(null)
    const LERP = 0.15

    useEffect(() => {
        // Disable on touch
        if (window.matchMedia('(pointer: coarse)').matches) return

        const onMove = (e) => {
            targetRef.current = { x: e.clientX, y: e.clientY }
        }

        const onEnterInteractive = () => {
            cursorRef.current?.classList.add('eg-cursor--hover')
        }

        const onLeaveInteractive = () => {
            cursorRef.current?.classList.remove('eg-cursor--hover')
        }

        const animate = () => {
            posRef.current.x += (targetRef.current.x - posRef.current.x) * LERP
            posRef.current.y += (targetRef.current.y - posRef.current.y) * LERP

            if (cursorRef.current) {
                cursorRef.current.style.transform =
                    `translate(${posRef.current.x - 12}px, ${posRef.current.y - 12}px)`
            }

            rafRef.current = requestAnimationFrame(animate)
        }

        // Add listeners to interactive elements
        const interactives = document.querySelectorAll('a, button, [data-cursor]')
        interactives.forEach(el => {
            el.addEventListener('mouseenter', onEnterInteractive)
            el.addEventListener('mouseleave', onLeaveInteractive)
        })

        window.addEventListener('mousemove', onMove)
        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(rafRef.current)
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', onEnterInteractive)
                el.removeEventListener('mouseleave', onLeaveInteractive)
            })
        }
    }, [])

    return cursorRef
}


// ============================================================
// utils/cn.js
// className utility (clsx wrapper)
// ============================================================

import { clsx } from 'clsx'

export function cn(...inputs) {
    return clsx(...inputs)
}


// ============================================================
// utils/formatPrice.js
// Nigerian Naira price formatter
// ============================================================

export function formatPrice(value) {
    if (!value) return '—'

    if (value >= 1_000_000_000) {
        return `₦${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (value >= 1_000_000) {
        return `₦${(value / 1_000_000).toFixed(0)}M`
    }
    return `₦${value.toLocaleString('en-NG')}`
}

// Full format: ₦450,000,000
export function formatPriceFull(value) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        maximumFractionDigits: 0,
    }).format(value)
}


// ============================================================
// data/properties.js
// ============================================================

export const properties = [
    {
        id: 'EG-0001',
        title: 'Meridian Heights',
        location: 'Ikoyi, Lagos',
        price: 450000000,
        status: 'FOR SALE',
        tag: 'LUXURY',
        image: '/images/properties/meridian-heights.jpg',
        featured: true,
        large: true,
    },
    {
        id: 'EG-0002',
        title: 'The Vantage',
        location: 'Victoria Island, Lagos',
        price: 280000000,
        status: 'NEW LISTING',
        tag: 'RESIDENTIAL',
        image: '/images/properties/the-vantage.jpg',
        featured: true,
    },
    {
        id: 'EG-0003',
        title: 'Lekki Crescent',
        location: 'Lekki Phase 1, Lagos',
        price: 195000000,
        status: 'FOR SALE',
        tag: 'COMMERCIAL',
        image: '/images/properties/lekki-crescent.jpg',
        featured: true,
    },
]


// ============================================================
// data/testimonials.js
// ============================================================

export const testimonials = [
    {
        id: 1,
        quote: "Elliot Global didn't just find us a property — they understood what we were building toward. The process felt personal at every stage.",
        client: 'A. OKONKWO',
        title: 'Managing Director',
        city: 'Lagos',
    },
    {
        id: 2,
        quote: "In 12 years of property acquisition, I have never encountered a firm that combines market intelligence with genuine relationship.",
        client: 'F. ADEYEMI',
        title: 'Private Investor',
        city: 'Abuja',
    },
    {
        id: 3,
        quote: "They treated our portfolio like their own. The attention to detail in every negotiation reflected real expertise, not just salesmanship.",
        client: 'O. IBRAHIM',
        title: 'Chief Financial Officer',
        city: 'Port Harcourt',
    },
]


// ============================================================
// data/team.js
// ============================================================

export const team = [
    {
        id: 1,
        name: 'David Elliot',
        role: 'FOUNDER & CEO',
        image: '/images/team/david-elliot.jpg',
        quote: 'We place people. Property is the medium.',
    },
    {
        id: 2,
        name: 'Amara Obi',
        role: 'HEAD OF ACQUISITIONS',
        image: '/images/team/amara-obi.jpg',
    },
    {
        id: 3,
        name: 'Kemi Adeyemi',
        role: 'DIRECTOR, CLIENT RELATIONS',
        image: '/images/team/kemi-adeyemi.jpg',
    },
    {
        id: 4,
        name: 'Tunde Balogun',
        role: 'LEAD INVESTMENT CONSULTANT',
        image: '/images/team/tunde-balogun.jpg',
    },
]


// ============================================================
// data/services.js
// ============================================================

export const services = [
    {
        id: 'sales',
        name: 'Property Sales',
        watermark: 'SALES',
        tagline: 'The right property. The right moment. The right terms.',
        description: 'We represent buyers and sellers of premium residential and commercial property across Nigeria\'s key markets. Our market intelligence runs deeper than listings — we understand the trajectory of each asset, the character of each neighbourhood, and the value beneath the surface.',
        features: ['Buyer & Seller Representation', 'Off-Market Access', 'Negotiation & Due Diligence', 'Post-Sale Support'],
        icon: 'SalesIcon',
        layout: 'image-left',
    },
    {
        id: 'management',
        name: 'Property Management',
        watermark: 'MANAGEMENT',
        tagline: 'Your asset, protected and performing.',
        description: 'Full-service management for residential and commercial portfolios. We handle tenant acquisition, maintenance coordination, rental yield optimisation, and transparent financial reporting — so you own without the overhead.',
        features: ['Tenant Acquisition & Screening', 'Maintenance Coordination', 'Yield Optimisation', 'Monthly Financial Reporting'],
        icon: 'ManagementIcon',
        layout: 'image-right',
    },
    {
        id: 'consultancy',
        name: 'Investment Consultancy',
        watermark: 'CONSULTANCY',
        tagline: 'Capital placed with precision.',
        description: 'Strategic advisory for high-net-worth individuals and institutional investors entering or expanding within the Nigerian property market. From portfolio structuring to market entry analysis, we bring the data and the relationships.',
        features: ['Market Entry Analysis', 'Portfolio Structuring', 'Valuation & Risk Assessment', 'Investment Road-mapping'],
        icon: 'ConsultancyIcon',
        layout: 'image-left',
    },
]


// ============================================================
// data/timeline.js
// ============================================================

export const timeline = [
    {
        year: '2012',
        title: 'Founded in Lagos',
        description: 'Elliot Global Properties established with a focus on premium residential sales in Ikoyi and Victoria Island.',
    },
    {
        year: '2015',
        title: 'First ₦1B Transaction',
        description: 'Completed our first portfolio acquisition exceeding ₦1 billion in combined asset value.',
    },
    {
        year: '2017',
        title: 'Management Division Launched',
        description: 'Expanded into full-service property management, growing to 80+ managed units in Year 1.',
    },
    {
        year: '2019',
        title: 'Abuja & Port Harcourt Entry',
        description: 'Opened advisory operations in Nigeria\'s capital and the commercial hub of the South-South.',
    },
    {
        year: '2022',
        title: 'Investment Consultancy Division',
        description: 'Launched strategic advisory services for institutional and HNW investors.',
    },
    {
        year: '2024',
        title: '500+ Transactions',
        description: 'Surpassed 500 completed transactions, with over ₦8 billion in total value transacted.',
    },
]


// ============================================================
// data/elliotIndex.js
// ============================================================

export const marketData = {
    lastUpdated: 'APR 2025',
    indicators: [
        {
            id: 'avg-price',
            label: 'AVG PRICE / SQM',
            value: '₦285,000',
            subLabel: 'Lagos Prime',
            trend: 'up',
            delta: '+4.2%',
        },
        {
            id: 'market-trend',
            label: 'MARKET TREND',
            value: 'BULLISH',
            subLabel: 'Q2 2025',
            trend: 'up',
            delta: null,
        },
        {
            id: 'hottest-area',
            label: 'HOTTEST AREA',
            value: 'LEKKI PH1',
            subLabel: 'Demand Index: 94',
            trend: 'neutral',
            delta: null,
        },
        {
            id: 'volume',
            label: 'TRANSACTION VOLUME',
            value: '₦2.1B',
            subLabel: 'Last 90 days',
            trend: 'up',
            delta: '+11%',
        },
    ],
}