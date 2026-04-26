import { useEffect, useRef, useState } from 'react'
import './styles/Stats.css'

// ─── Odometer hook (self-contained) ───────────────────────────────────────────
function useOdometer(target, triggered, duration = 900) {
    const [val, setVal] = useState(0)
    const raf = useRef(null)

    useEffect(() => {
        if (!triggered) return
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setVal(target)
            return
        }

        let start = null
        const animate = (ts) => {
            if (!start) start = ts
            const p = Math.min((ts - start) / duration, 1)
            // Expo-out easing
            const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
            setVal(Math.floor(eased * target))
            if (p < 1) raf.current = requestAnimationFrame(animate)
        }
        raf.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(raf.current)
    }, [triggered, target, duration])

    return val
}

// ─── Stats data ────────────────────────────────────────────────────────────────
const STATS = [
    {
        coordinate: '6.5°N',
        prefix: '',
        value: 50,
        suffix: '+',
        unit: '',
        label: 'Clients Served',
        sublabel: 'Across Nigeria',
    },
    {
        coordinate: '3.3°E',
        prefix: '',
        value: 20,
        suffix: '+',
        unit: 'Project',
        label: 'Across Lagos',

    },
    {
        coordinate: '——',
        prefix: '',
        value: 10,
        suffix: '',
        unit: 'YRS',
        label: 'Market Authority',
        sublabel:'Years of industry Excellence'
    },
    {
        coordinate: '——',
        prefix: '',
        value: 6,
        suffix: '',
        unit: 'CITIES',
        label: 'Active Markets',
        sublabel: 'Lagos · Edo · Delta · Ibadan . Uyo . Ogun',
    },
]

// ─── Single stat cell ──────────────────────────────────────────────────────────
function StatCell({ stat, index, triggered }) {
    const count = useOdometer(stat.value, triggered, 900 + index * 80)

    return (
        <div
            className="stats__cell"
            style={{
                transitionDelay: triggered ? `${index * 80}ms` : '0ms',
            }}
        >
            {/* Coordinate tag */}
            <span className="stats__coordinate" aria-hidden="true">
                {stat.coordinate}
            </span>

            {/* Main number */}
            <div className="stats__number" aria-label={`${stat.value}${stat.suffix} ${stat.label}`}>
                {stat.prefix && (
                    <span className="stats__number-prefix">{stat.prefix}</span>
                )}
                <span className="stats__number-count">{count}</span>
                {stat.suffix && (
                    <span className="stats__number-suffix">{stat.suffix}</span>
                )}
                {stat.unit && (
                    <span className="stats__number-unit">{stat.unit}</span>
                )}
            </div>

            {/* Divider line */}
            <div className="stats__cell-line" aria-hidden="true" />

            {/* Label */}
            <p className="stats__label">{stat.label}</p>
            <p className="stats__sublabel">{stat.sublabel}</p>
        </div>
    )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function StatsBand() {
    const [triggered, setTriggered] = useState(false)
    const sectionRef = useRef(null)

    useEffect(() => {
        const el = sectionRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTriggered(true)
                    observer.unobserve(el)
                }
            },
            { threshold: 0.25 }
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={sectionRef}
            className={`stats ${triggered ? 'stats--visible' : ''}`}
            aria-label="Company statistics"
        >
            {/* Background texture */}
            <div className="stats__grain" aria-hidden="true" />

            {/* Top micro label */}
            <div className="stats__header">
                <span className="stats__header-label">By The Numbers</span>
                <div className="stats__header-line" aria-hidden="true" />
            </div>

            {/* Grid */}
            <div className="container">
                <div className="stats__grid">
                    {STATS.map((stat, i) => (
                        <StatCell
                            key={stat.label}
                            stat={stat}
                            index={i}
                            triggered={triggered}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom coordinate strip */}
            <div className="stats__footer" aria-hidden="true">
                <span className="stats__footer-text">
                    ELLIOT GLOBAL PROPERTIES · LAGOS, NIGERIA · 6.5244°N 3.3792°E
                </span>
            </div>
        </section>
    )
}