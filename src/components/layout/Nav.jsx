import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import '../layout/styles/Nav.css'
import navLogo from "../../assets/eliiotGlobalLogo.png"

const NAV_LINKS = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/services', label: 'Services' },
]

// ── Hamburger icon ─────────────────────────────────────────────────────────────
function HamburgerIcon({ open }) {
    return (
        <div className={`nav__hamburger-icon ${open ? 'nav__hamburger-icon--open' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
        </div>
    )
}

// ── Main Nav ───────────────────────────────────────────────────────────────────
export default function Nav() {
    const [solid, setSolid] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [heroPage, setHeroPage] = useState(false)
    const location = useLocation()
    const sentinelRef = useRef(null)
    useEffect(() => {
        const isHome = location.pathname === '/'
        setHeroPage(isHome)
        setMenuOpen(false)
        if (!isHome) setSolid(true)
    }, [location.pathname])

    useEffect(() => {
        if (!heroPage) return

        // Reset on home page load
        setSolid(false)

        const sentinel = document.getElementById('hero-sentinel')
        if (!sentinel) {
            // Fallback: scroll-based
            const onScroll = () => setSolid(window.scrollY > 60)
            window.addEventListener('scroll', onScroll, { passive: true })
            return () => window.removeEventListener('scroll', onScroll)
        }

        const observer = new IntersectionObserver(
            ([entry]) => setSolid(!entry.isIntersecting),
            { threshold: 0, rootMargin: '0px' }
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [heroPage])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [menuOpen])

    const isSolid = solid || !heroPage

    return (
        <>
            <header
                className={[
                    'nav',
                    isSolid ? 'nav--solid' : 'nav--transparent',
                    menuOpen ? 'nav--menu-open' : '',
                ].join(' ')}
                role="banner"
            >
                <div className="nav__inner container">

                    {/* ── Logo ─────────────────────────────────────────────── */}
                    <NavLink to="/" className="nav__logo" aria-label="Elliot Global — Home">
                        <img src={navLogo} alt="" className='nav__logo-img'/>
                    </NavLink>

                    {/* ── Desktop links ─────────────────────────────────────── */}
                    <nav className="nav__links" aria-label="Primary navigation">
                        {NAV_LINKS.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={to === '/'}
                                className={({ isActive }) =>
                                    ['nav__link', isActive ? 'nav__link--active' : ''].join(' ')
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* ── CTA ───────────────────────────────────────────────── */}
                    <div className="nav__right">
                        <NavLink to="/contact" className="nav__cta">
                            <span className="nav__cta-text">Contact Us</span>
                            <span className="nav__cta-dot" aria-hidden="true" />
                        </NavLink>

                        {/* ── Hamburger ──────────────────────────────────────── */}
                        <button
                            className="nav__hamburger"
                            onClick={() => setMenuOpen(o => !o)}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-menu"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <HamburgerIcon open={menuOpen} />
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile overlay menu ──────────────────────────────────────────────── */}
            <div
                id="mobile-menu"
                className={`nav__mobile-overlay ${menuOpen ? 'nav__mobile-overlay--open' : ''}`}
                aria-hidden={!menuOpen}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Background fill */}
                <div className="nav__mobile-bg" />

                <nav className="nav__mobile-links" aria-label="Mobile navigation">
                    {[...NAV_LINKS, { to: '/contact', label: 'Contact' }].map(({ to, label }, i) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) =>
                                ['nav__mobile-link', isActive ? 'nav__mobile-link--active' : ''].join(' ')
                            }
                            style={{ transitionDelay: menuOpen ? `${i * 60 + 80}ms` : '0ms' }}
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className="nav__mobile-link-index" aria-hidden="true">
                                0{i + 1}
                            </span>
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Backdrop — closes menu on click */}
            {menuOpen && (
                <div
                    className="nav__backdrop"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </>
    )
}