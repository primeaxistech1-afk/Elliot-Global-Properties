import { useEffect, useRef, useState } from 'react'
import './Styles/Servicesection.css'

import service1 from "../../assets/service1.jpeg"
import service2 from "../../assets/service2.jpeg"
import service3 from "../../assets/service3.jpeg"
import service4 from "../../assets/service4.jpeg"

function useInView(threshold = 0.15) {
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

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function IconRealEstate() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 13L14 4L25 13V25H17V18H11V25H3V13Z"
                stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <rect x="11" y="18" width="6" height="7" stroke="currentColor" strokeWidth="1.2" />
        </svg>
    )
}

function IconConstruction() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="20" width="22" height="5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <rect x="7" y="14" width="14" height="6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <rect x="11" y="8" width="6" height="6" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <line x1="14" y1="3" x2="14" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    )
}

function IconManagement() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14 3v3M14 22v3M3 14h3M22 14h3M6.22 6.22l2.12 2.12M19.66 19.66l2.12 2.12M19.66 6.22l-2.12 2.12M6.22 19.66l2.12 2.12"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    )
}

function IconAdvisory() {
    return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.2" />
            <line x1="14" y1="4" x2="14" y2="24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="4" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
            <line x1="14" y1="4" x2="24" y2="14" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
        </svg>
    )
}

// ─── Services data ────────────────────────────────────────────────────────────
const SERVICES = [
    {
        number: '01',
        tag: 'Residential',
        title: 'Real Estate',
        body: 'We connect buyers, sellers, and renters with the right properties across Nigeria\'s most sought-after neighbourhoods. From first homes to high-value portfolios, we bring deep market knowledge and personal attention to every mandate.',
        icon: <IconRealEstate />,
        image: service1,
        href: '/services#real-estate',
        imagePos: 'left',
    },
    {
        number: '02',
        tag: 'Residential',
        title: 'Building & Construction',
        body: 'We provide professional building and construction services, turning your ideas into quality, lasting spaces. From planning to completion, we focus on precision, durability, and timely delivery for both residential and commercial projects.',
        icon: <IconConstruction />,
        image: service2,
        href: '/services#construction',
        imagePos: 'right',
    },
    {
        number: '03',
        tag: 'Management',
        title: 'Estate Management & Service',
        body: 'We offer reliable estate management services to keep your property running smoothly. From maintenance and tenant coordination to security and facility oversight, we ensure your estate remains efficient at all times.',
        icon: <IconManagement />,
        image: service3,
        href: '/services#management',
        imagePos: 'left',
    },
    {
        number: '04',
        tag: 'Advisory',
        title: 'Real Estate & Advisory',
        body: 'Strategic property advisory for investors, developers, and institutions. We provide market entry analysis, portfolio structuring, valuation, and investment road-mapping — giving you the intelligence to act with confidence.',
        icon: <IconAdvisory />,
        image:service4,
        href: '/services#advisory',
        imagePos: 'right',
    },
]

// ─── Single service row ───────────────────────────────────────────────────────
function ServiceRow({ service, index }) {
    const [ref, visible] = useInView(0.15)
    const isLeft = service.imagePos === 'left'

    return (
        <div
            ref={ref}
            className={`ss__row ${isLeft ? 'ss__row--img-left' : 'ss__row--img-right'} ${visible ? 'ss__row--visible' : ''}`}
        >
            {/* ── Image ────────────────────────────────────────────────────── */}
            <div className="ss__image-wrap">
                <div
                    className="ss__image"
                    role="img"
                    aria-label={service.title}
                    style={{
                        backgroundImage: `url(${service.image})`,
                    }}
                />
                <div className="ss__image-fade" aria-hidden="true" />
            </div>

            {/* ── Number node ───────────────────────────────────────────────── */}
            <div className="ss__node" aria-hidden="true">
                <div className="ss__node-ring">
                    <span className="ss__node-num">{service.number}</span>
                </div>
            </div>

            {/* ── Text ──────────────────────────────────────────────────────── */}
            <div className="ss__text">
                <div className="ss__icon" aria-hidden="true">
                    {service.icon}
                </div>

                {/* data-num drives the mobile ::before badge via CSS content: attr(data-num) */}
                <span className="ss__tag" data-num={service.number}>{service.tag}</span>

                <h3 className="ss__title">{service.title}</h3>

                <p className="ss__body-text">{service.body}</p>


                <a href={service.href} className="ss__link">
                    Learn more
                    <svg
                        className="ss__link-arrow"
                        width="20"
                        height="8"
                        viewBox="0 0 20 8"
                        fill="none"
                        aria-hidden="true"
                    >
                        <path d="M0 4h17M13 1l3 3-3 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </a>
            </div>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ServicesSection() {
    const [headerRef, headerVisible] = useInView(0.4)

    return (
        <section className="ss" aria-label="Our Services">
            <div className="container">

                {/* ── Header ─────────────────────────────────────────────────── */}
                <div
                    className={`ss__header ${headerVisible ? 'ss__header--visible' : ''}`}
                    ref={headerRef}
                >
                    <span className="ss__eyebrow">What We Offer</span>
                    <h2 className="ss__headline">Services built for every stage</h2>
                    <p className="ss__subline">
                        From first inquiry to final handover — we are with you throughout.
                    </p>
                </div>

                {/* ── Rows + vertical spine ──────────────────────────────────── */}
                <div className="ss__rows">
                    <div className="ss__spine" aria-hidden="true" />

                    {SERVICES.map((service, i) => (
                        <ServiceRow key={service.number} service={service} index={i} />
                    ))}
                </div>

            </div>
        </section>
    )
}