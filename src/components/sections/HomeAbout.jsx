import { useEffect, useRef, useState } from 'react'
import './Styles/HomeAbout.css'

function useInView(threshold = 0.15) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
            { threshold, rootMargin: '0px 0px -60px 0px' }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return [ref, visible]
}

const PILLARS = [
    {
        number: '01',
        title: 'Rooted in Lagos,\nreaching beyond.',
        body: 'Since 2012, we have operated at the intersection of market intelligence and personal relationships — placing clients in properties that perform and spaces they are proud to call home.',
    },
    {
        number: '02',
        title: 'Every income bracket,\none standard of care.',
        body: 'Whether a first home or a portfolio acquisition, our approach never changes. Every client receives the same rigorous counsel, the same attention, the same commitment to outcome.',
    },
    {
        number: '03',
        title: 'Precision over\nvolume. Always.',
        body: 'We take on fewer mandates than our competitors — by design. It means we know every property we present, every neighbourhood we recommend, and every deal we negotiate inside out.',
    },
]


export default function HomeAbout() {
    const [headerRef, headerVisible] = useInView(0.3)
    const [pillarsRef, pillarsVisible] = useInView(0.1)
    const [figuresRef, figuresVisible] = useInView(0.25)

    // ── Mobile scroll-dot tracking ─────────────────────────────────────────
    const [activeDot, setActiveDot] = useState(0)
    const pillarsScrollRef = useRef(null)

    useEffect(() => {
        const el = pillarsScrollRef.current
        if (!el) return
        const onScroll = () => {
            const { scrollLeft, scrollWidth, clientWidth } = el
            const maxScroll = scrollWidth - clientWidth
            if (maxScroll <= 0) return
            const idx = Math.round((scrollLeft / maxScroll) * (PILLARS.length - 1))
            setActiveDot(idx)
        }
        el.addEventListener('scroll', onScroll, { passive: true })
        return () => el.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <section className="ha" aria-label="About Elliot Global Properties">

            {/* ── Header ───────────────────────────────────────────────────── */}
            <div className="ha__header" ref={headerRef}>
                <div className="container ha__header-inner">

                    {/* Left: eyebrow + headline */}
                    <div className={`ha__header-copy ${headerVisible ? 'ha--in' : ''}`}>
                        <span className="ha__eyebrow">
                            <span className="ha__eyebrow-rule" aria-hidden="true" />
                            Who We Are
                        </span>
                        <h2 className="ha__headline">
                            Nigeria's most trusted
                            <br />property partner.
                        </h2>
                    </div>

                    {/* Right: lead paragraph + CTA */}
                    <div
                        className={`ha__header-right ${headerVisible ? 'ha--in' : ''}`}
                        style={{ transitionDelay: '0.18s' }}
                    >
                        <p className="ha__lead">
                            Elliot Global Properties was built on a single conviction — that the right
                            property in the right hands creates generational value. From first-time buyers
                            to seasoned investors, we bring the same depth of expertise to every mandate.
                        </p>
                        <a href="/about" className="ha__cta">
                            <span className="ha__cta-text">Our full story</span>
                            <span className="ha__cta-arrow" aria-hidden="true">
                                <svg width="28" height="10" viewBox="0 0 28 10" fill="none">
                                    <path d="M0 5h25M20 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>

                {/* Full-width gradient rule separating header from pillars */}
                <div className="ha__header-rule" aria-hidden="true" />
            </div>

            {/* ── Three pillars ─────────────────────────────────────────────── */}
            <div className="container">
                {/*
                  pillarsScrollRef drives the mobile scroll-dot indicator.
                  pillarsRef drives the IntersectionObserver reveal.
                  Both point at the same element via a callback ref merge.
                */}
                <div
                    className="ha__pillars"
                    ref={(el) => {
                        pillarsRef.current = el
                        pillarsScrollRef.current = el
                    }}
                >
                    {PILLARS.map((p, i) => (
                        <div
                            key={p.number}
                            className={`ha__pillar ${pillarsVisible ? 'ha--in' : ''}`}
                            style={{ transitionDelay: pillarsVisible ? `${i * 110}ms` : '0ms' }}
                        >
                            <span className="ha__pillar-num" aria-hidden="true">{p.number}</span>
                            <div className="ha__pillar-rule" aria-hidden="true" />
                            <h3 className="ha__pillar-title">
                                {p.title.split('\n').map((line, j) => (
                                    <span key={j}>{line}<br /></span>
                                ))}
                            </h3>
                            <p className="ha__pillar-body">{p.body}</p>
                        </div>
                    ))}
                </div>

                {/* Mobile scroll-dot indicators — CSS shows these only on ≤768px */}
                <div className="ha__pillars-dots" aria-hidden="true">
                    {PILLARS.map((_, i) => (
                        <span
                            key={i}
                            className={`ha__pillars-dot ${i === activeDot ? 'ha__pillars-dot--active' : ''}`}
                        />
                    ))}
                </div>
            </div>

        </section>
    )
}