import { useEffect, useRef, useState } from 'react'
import './Styles/FounderQuote.css'
import founderImg from "../../assets/FounderPicture.jpeg"

function useInView(threshold = 0.2) {
    const ref = useRef(null)
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el) } },
            { threshold, rootMargin: '0px 0px -40px 0px' }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [threshold])
    return [ref, visible]
}

// Splits the quote into words so each animates in independently
function AnimatedQuote({ text, visible }) {
    const words = text.split('   ')
    return (
        <span className="fq__quote-text" aria-label={text}>
            {words.map((word, i) => (
                <span
                    key={i}
                    className={`fq__word ${visible ? 'fq__word--in' : ''}`}
                    style={{ transitionDelay: visible ? `${0.3 + i * 0.045}s` : '0s' }}
                    aria-hidden="true"
                >
                    {word}{' '}
                </span>
            ))}
        </span>
    )
}

export default function FounderQuote() {
    const [ref, visible] = useInView(0.2)

    return (
        <section className="fq" ref={ref} aria-label="Founder's vision">

            {/* ── Background ───────────────────────────────────────────────── */}
            <div className="fq__bg" aria-hidden="true">
             
                <div className="fq__portrait-placeholder" />
                <div className="fq__overlay" />
            </div>

            {/* ── Topographic SVG lines ─────────────────────────────────────── */}
            <div className="fq__topo" aria-hidden="true">
                <svg width="100%" height="100%" viewBox="0 0 1200 600"
                    preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <path d="M-100,300 Q200,240 500,310 T900,270 T1300,295"
                        fill="none" stroke="rgba(192,0,26,0.06)" strokeWidth="1" />
                    <path d="M-100,340 Q300,270 600,350 T1100,300 T1400,330"
                        fill="none" stroke="rgba(192,0,26,0.04)" strokeWidth="1" />
                    <path d="M-100,260 Q150,200 400,270 T800,230 T1300,255"
                        fill="none" stroke="rgba(209,205,198,0.04)" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="container fq__inner">

                {/* ── Left: label + decorative element ─────────────────────── */}
                <div className={`fq__left ${visible ? 'fq__left--in' : ''}`}>
                    <div className="fq__left-mark" aria-hidden="true">
                        {/* Surveyor cross */}
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <line x1="20" y1="0" x2="20" y2="16" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                            <line x1="20" y1="24" x2="20" y2="40" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                            <line x1="0" y1="20" x2="16" y2="20" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                            <line x1="24" y1="20" x2="40" y2="20" stroke="rgba(192,0,26,0.6)" strokeWidth="1" />
                            <circle cx="20" cy="20" r="2" fill="rgba(192,0,26,0.7)" />
                        </svg>
                    </div>
                    <div className="fq__left-label">
                        <img src={founderImg} alt="Omoaka Chris" className="fq__portrait" />
                        <span className="fq__label-tag">Founder's Vision</span>
                        <span className="fq__label-name">Omoaka Chris</span>
                        <span className="fq__label-title">CEO, Elliot Global Properties</span>
                    </div>
                </div>

                {/* ── Right: quote ──────────────────────────────────────────── */}
                <div className="fq__right">

                    {/* Opening quotation mark */}
                    <div
                        className={`fq__mark ${visible ? 'fq__mark--in' : ''}`}
                        aria-hidden="true"
                    >
                        "
                    </div>

                    <blockquote className="fq__quote">
                        <AnimatedQuote
                            visible={visible}
                            text="To create flexible access to luxury home ownership for both low income earners, middle income earners and the high income earners in Nigeria and Africa at large."
                        />
                    </blockquote>

                    {/* Attribution line */}
                    <div className={`fq__attr ${visible ? 'fq__attr--in' : ''}`}>
                        <span className="fq__attr-rule" aria-hidden="true" />
                        <span className="fq__attr-text">
                            Omoaka Chris &nbsp;·&nbsp; Founder &amp; CEO
                        </span>
                    </div>

                    {/* Red accent line at bottom */}
                    <div
                        className={`fq__bottom-accent ${visible ? 'fq__bottom-accent--in' : ''}`}
                        aria-hidden="true"
                    />
                </div>
            </div>

            {/* Coordinate label bottom-right */}
            <div className="fq__coordinate" aria-hidden="true">
                6.5244°N &nbsp; 3.3792°E &nbsp; · &nbsp; LAGOS, NIGERIA
            </div>

        </section>
    )
}