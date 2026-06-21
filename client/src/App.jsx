import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronUp,
  Coffee,
  Crown,
  Download,
  Film,
  GraduationCap,
  Heart,
  Home,
  Image,
  Instagram,
  Layers3,
  LayoutGrid,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Palette,
  PenTool,
  Phone,
  Play,
  Rocket,
  Send,
  Sparkles,
  Star,
  Trophy,
  X,
} from 'lucide-react'
import canvaIcon from './assets/canva-icon.webp'
import capcutIcon from './assets/capcut-icon.webp'
import digiskillsLogo from './assets/digiskills-logo.svg'
import figmaIcon from './assets/figma-icon.webp'
import filmoraIcon from './assets/filmora-icon.webp'
import heroSectionImage from './assets/hero-section-image.webp'
import idmPakistanLogo from './assets/idm-pakistan-logo.svg'
import illustratorIcon from './assets/illustrator-icon.svg'
import inshotIcon from './assets/inshot-icon.jpg'
import microsoftLogo from './assets/microsoft-wordmark.svg'
import msOfficeIcon from './assets/ms-office-icon.webp'
import photoshopIcon from './assets/photoshop-icon.svg'
import workspacePhoto from './assets/workspace-photo-optimized.jpg'

const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Me' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const tools = [
  { logo: photoshopIcon, logoAlt: 'Photoshop icon', name: 'Photoshop', slug: 'photoshop' },
  { logo: illustratorIcon, logoAlt: 'Illustrator icon', name: 'Illustrator', slug: 'illustrator' },
  { logo: figmaIcon, logoAlt: 'Figma icon', name: 'Figma', slug: 'figma' },
  {
    logo: msOfficeIcon,
    logoAlt: 'Microsoft Office icon',
    name: 'MS Office',
    note: 'Word, Excel, PowerPoint',
    slug: 'ms-office',
  },
  { logo: canvaIcon, logoAlt: 'Canva icon', name: 'Canva', slug: 'canva' },
  { logo: inshotIcon, logoAlt: 'InShot icon', name: 'InShot', slug: 'inshot' },
  { logo: filmoraIcon, logoAlt: 'Filmora icon', name: 'Filmora', slug: 'filmora' },
  { logo: capcutIcon, logoAlt: 'CapCut icon', name: 'CapCut', slug: 'capcut' },
]

const services = [
  { label: 'Typography Design', icon: PenTool },
  { label: 'Logo Designer', icon: Sparkles },
  { label: 'Banner & Flyer Designer', icon: Layers3 },
  { label: 'Thumbnail Designer', icon: Play },
  { label: 'GIF Designer', icon: Film },
  { label: 'Caricature Designer', icon: Heart },
  { label: 'UI/UX & Prototyping', icon: Palette },
  { label: 'Video Editing (CapCut)', icon: Film },
]

const projects = [
  {
    title: 'Bloom Beauty Branding',
    type: 'Branding',
    caption: 'Identity system, packaging and launch visuals',
    color: 'rose',
    tag: 'Brand Identity',
    icon: Heart,
  },
  {
    title: 'Cedar Cafe Campaign',
    type: 'Digital',
    caption: 'Social media rollout for a warm cafe brand',
    color: 'peach',
    tag: 'Social Media',
    icon: Coffee,
  },
  {
    title: 'Studio Grid Web Design',
    type: 'UI/UX',
    caption: 'Prototype system for a modern studio website',
    color: 'lavender',
    tag: 'Prototype',
    icon: LayoutGrid,
  },
  {
    title: 'EduSpark Launch',
    type: 'Digital',
    caption: 'Campaign assets crafted for an education launch',
    color: 'mint',
    tag: 'Campaign',
    icon: Rocket,
  },
  {
    title: 'Aster Event Suite',
    type: 'Print',
    caption: 'Printed invitations and event collateral suite',
    color: 'berry',
    tag: 'Print Design',
    icon: CalendarDays,
  },
  {
    title: 'Creator Dashboard',
    type: 'UI/UX',
    caption: 'Analytics dashboard prototype for creators',
    color: 'blue',
    tag: 'UI/UX',
    icon: BriefcaseBusiness,
  },
  {
    title: 'MetaForge Logo Design',
    type: 'Branding',
    caption: 'Logo concept with clean geometry and balance',
    color: 'peach',
    tag: 'Logo Design',
    icon: PenTool,
  },
  {
    title: 'Portrait Retouching',
    type: 'Design',
    caption: 'High-end photo cleanup and presentation polish',
    color: 'rose',
    tag: 'Photo Editing',
    icon: Image,
  },
  {
    title: 'Brand Visual System',
    type: 'Design',
    caption: 'Graphic asset kit built for consistent use',
    color: 'blue',
    tag: 'Graphic Design',
    icon: Palette,
  },
  {
    title: 'Newsletter Template',
    type: 'Digital',
    caption: 'Email design with a clean readable structure',
    color: 'lavender',
    tag: 'Email Design',
    icon: Mail,
  },
]

const certificates = [
  { logo: microsoftLogo, logoAlt: 'Microsoft logo', provider: 'Microsoft', title: 'MS Offices', note: 'Word, Excel, PowerPoint' },
  { logo: idmPakistanLogo, logoAlt: 'IDM Pakistan logo', provider: 'IDM Pakistan', title: 'Graphic Designing', note: 'Creative foundations' },
  { logo: idmPakistanLogo, logoAlt: 'IDM Pakistan logo', provider: 'IDM Pakistan', title: 'Digital Marketing', note: 'Campaign strategy and online growth' },
  { logo: idmPakistanLogo, logoAlt: 'IDM Pakistan logo', provider: 'IDM Pakistan', title: 'E-Commerce', note: 'Store setup and online selling' },
  { logo: digiskillsLogo, logoAlt: 'DigiSkills.pk logo', provider: 'DigiSkills.pk', title: 'Graphic Designing', note: 'Visual communication' },
  { logo: digiskillsLogo, logoAlt: 'DigiSkills.pk logo', provider: 'DigiSkills.pk', title: 'Freelancing', note: 'Client and project skills' },
  { logo: digiskillsLogo, logoAlt: 'DigiSkills.pk logo', provider: 'DigiSkills.pk', title: 'Data Analytics', note: 'Business intelligence' },
]

const education = [
  ['2021', 'Matric', "Old Ravian's Public School"],
  ['2023', 'Inter ICS', 'Punjab College'],
  ['2024 - Current', 'BFA (Graphic Designing)', 'Education University Lahore'],
]

const stats = [
  ['3+', 'Years Experience'],
  ['100+', 'Projects Completed'],
  ['50+', 'Happy Clients'],
  ['100%', 'Client Satisfaction'],
]

const portfolioFilters = ['All', 'Branding', 'Digital', 'Design', 'UI/UX', 'Print']

const footerServices = [
  'Logo Design',
  'Banner & Flyer Design',
  'Thumbnail Design',
  'Typography Design',
  'UI/UX & Prototyping',
  'Caricature Design',
  'GIF Animation',
  'Video Editing',
]

const heroButterflies = [
  { x: '10px', y: '520px', endX: '208px', endY: '344px', size: '26px', delay: '0s', duration: '10.5s', wingA: '#ff78ba', wingB: '#b987ff', glow: 'rgba(255, 120, 186, 0.32)' },
  { x: '34px', y: '566px', endX: '240px', endY: '388px', size: '18px', delay: '-0.8s', duration: '11.7s', wingA: '#ff9a80', wingB: '#ffc46c', glow: 'rgba(255, 169, 110, 0.28)' },
  { x: '58px', y: '548px', endX: '258px', endY: '392px', size: '20px', delay: '-1.8s', duration: '11.4s', wingA: '#7ce6d4', wingB: '#83b8ff', glow: 'rgba(124, 230, 212, 0.28)' },
  { x: '82px', y: '594px', endX: '288px', endY: '430px', size: '17px', delay: '-2.7s', duration: '12.1s', wingA: '#c49bff', wingB: '#ff9bd6', glow: 'rgba(196, 155, 255, 0.26)' },
  { x: '106px', y: '578px', endX: '322px', endY: '418px', size: '22px', delay: '-3.4s', duration: '10.8s', wingA: '#ffd56b', wingB: '#ff9d7b', glow: 'rgba(255, 213, 107, 0.28)' },
  { x: '132px', y: '618px', endX: '352px', endY: '460px', size: '24px', delay: '-0.9s', duration: '9.8s', wingA: '#ff83b9', wingB: '#ffa1ef', glow: 'rgba(255, 131, 185, 0.3)' },
  { x: '156px', y: '560px', endX: '380px', endY: '392px', size: '19px', delay: '-4.8s', duration: '11.6s', wingA: '#7fd4ff', wingB: '#b996ff', glow: 'rgba(127, 212, 255, 0.28)' },
  { x: '182px', y: '574px', endX: '398px', endY: '404px', size: '22px', delay: '-4.1s', duration: '11.1s', wingA: '#ffa0a0', wingB: '#ffde89', glow: 'rgba(255, 160, 160, 0.28)' },
  { x: '206px', y: '612px', endX: '426px', endY: '450px', size: '16px', delay: '-5.3s', duration: '12.8s', wingA: '#8cf0ce', wingB: '#6fd2ff', glow: 'rgba(140, 240, 206, 0.24)' },
  { x: '228px', y: '530px', endX: '454px', endY: '330px', size: '19px', delay: '-2.4s', duration: '10.9s', wingA: '#d8a6ff', wingB: '#ff8ecb', glow: 'rgba(216, 166, 255, 0.3)' },
  { x: '252px', y: '600px', endX: '488px', endY: '426px', size: '17px', delay: '-6.1s', duration: '12.6s', wingA: '#ffcb6f', wingB: '#ff8d8d', glow: 'rgba(255, 203, 111, 0.26)' },
  { x: '276px', y: '548px', endX: '518px', endY: '354px', size: '23px', delay: '-1.2s', duration: '10.2s', wingA: '#8be0ff', wingB: '#9d9dff', glow: 'rgba(139, 224, 255, 0.28)' },
  { x: '304px', y: '622px', endX: '548px', endY: '462px', size: '21px', delay: '-3.9s', duration: '11.8s', wingA: '#ff93c8', wingB: '#cf9cff', glow: 'rgba(255, 147, 200, 0.3)' },
  { x: '330px', y: '586px', endX: '572px', endY: '404px', size: '18px', delay: '-2.1s', duration: '10.7s', wingA: '#88f0ba', wingB: '#a0d6ff', glow: 'rgba(136, 240, 186, 0.24)' },
  { x: '358px', y: '632px', endX: '596px', endY: '452px', size: '20px', delay: '-4.6s', duration: '11.9s', wingA: '#ffb169', wingB: '#ff7fa7', glow: 'rgba(255, 177, 105, 0.28)' },
  { x: '382px', y: '570px', endX: '612px', endY: '366px', size: '17px', delay: '-5.8s', duration: '12.3s', wingA: '#a998ff', wingB: '#7fe6ff', glow: 'rgba(169, 152, 255, 0.26)' },
  { x: '18px', y: '606px', endX: '196px', endY: '420px', size: '15px', delay: '-6.4s', duration: '12.9s', wingA: '#ff8bb9', wingB: '#ffd07b', glow: 'rgba(255, 139, 185, 0.24)' },
  { x: '48px', y: '640px', endX: '232px', endY: '470px', size: '16px', delay: '-7.1s', duration: '13.3s', wingA: '#7bd8ff', wingB: '#8dffca', glow: 'rgba(123, 216, 255, 0.22)' },
  { x: '118px', y: '646px', endX: '318px', endY: '490px', size: '18px', delay: '-2.9s', duration: '12.5s', wingA: '#d0a2ff', wingB: '#ff95d2', glow: 'rgba(208, 162, 255, 0.24)' },
  { x: '168px', y: '644px', endX: '374px', endY: '480px', size: '15px', delay: '-5.5s', duration: '13.1s', wingA: '#ffb36d', wingB: '#ffd96f', glow: 'rgba(255, 179, 109, 0.22)' },
  { x: '214px', y: '654px', endX: '438px', endY: '496px', size: '17px', delay: '-3.7s', duration: '12.7s', wingA: '#87f1d7', wingB: '#9db8ff', glow: 'rgba(135, 241, 215, 0.22)' },
  { x: '262px', y: '648px', endX: '494px', endY: '488px', size: '16px', delay: '-7.8s', duration: '13.5s', wingA: '#ff92ad', wingB: '#c49fff', glow: 'rgba(255, 146, 173, 0.22)' },
  { x: '318px', y: '662px', endX: '554px', endY: '508px', size: '18px', delay: '-4.9s', duration: '12.4s', wingA: '#ffd26d', wingB: '#ff8b8b', glow: 'rgba(255, 210, 109, 0.22)' },
  { x: '372px', y: '654px', endX: '612px', endY: '496px', size: '15px', delay: '-6.9s', duration: '13.2s', wingA: '#95d7ff', wingB: '#b38fff', glow: 'rgba(149, 215, 255, 0.22)' },
]

const visibleHeroButterflies = heroButterflies.slice(0, 12)
const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')
const contactDeliveryMode = String(import.meta.env.VITE_CONTACT_DELIVERY || 'api').trim().toLowerCase()
const useMailtoOnlyContact = contactDeliveryMode === 'mailto'
const contactApiUrl = apiBaseUrl ? `${apiBaseUrl}/api/contact` : '/api/contact'
const resumeHref = `${import.meta.env.BASE_URL}azan-resume.pdf`
const portfolioDriveHref = 'https://drive.google.com/drive/folders/15IQtowQuQqzZyGBiHqMmIXp21TyGHtFY?usp=drive_link'
const fallbackContactEmail = 'azanabidkhawaja@gmail.com'
const contactPhoneDisplay = '03354414787'
const contactPhoneHref = 'tel:+923354414787'
const contactLocationDisplay = 'Lahore, Pakistan'
const contactLocationHref = 'https://www.google.com/maps/search/?api=1&query=Lahore%2C+Pakistan'

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

async function readApiResponse(response) {
  const payload = await response.text()

  if (!payload) {
    return { message: response.ok ? 'Your request completed.' : 'The server returned an empty response.' }
  }

  try {
    return JSON.parse(payload)
  } catch {
    if (payload.trim().startsWith('<')) {
      return {
        message: response.ok
          ? 'Your request completed.'
          : 'The contact server did not return a valid response. Make sure the backend is running.',
      }
    }

    return { message: payload }
  }
}

function buildMailtoHref(values, to = fallbackContactEmail) {
  const subject = String(values.subject || '').trim() || 'Portfolio inquiry'
  const body = [
    `Name: ${String(values.name || '').trim()}`,
    `Email: ${String(values.email || '').trim()}`,
    '',
    String(values.message || '').trim(),
  ].join('\n')

  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(`Portfolio inquiry: ${subject}`)}&body=${encodeURIComponent(body)}`
}

const quickContactMailtoHref = buildMailtoHref({
  subject: 'Design project inquiry',
  message: [
    'Hello Azan Abid,',
    '',
    'I would like to discuss a design/prototyping project with you.',
    '',
    'Project details:',
    'Timeline:',
    'Budget:',
    '',
    'Thank you.',
  ].join('\n'),
})

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const [contactOpen, setContactOpen] = useState(false)
  const [activeProject, setActiveProject] = useState(null)
  const [sending, setSending] = useState(false)
  const [notice, setNotice] = useState(null)

  const visibleProjects = useMemo(
    () => (filter === 'All' ? projects : projects.filter((project) => project.type === filter)),
    [filter],
  )

  useEffect(() => {
    if (!contactOpen && !activeProject) return undefined

    const originalOverflow = document.body.style.overflow
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setContactOpen(false)
      setActiveProject(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeProject, contactOpen])

  function openContact() {
    setMenuOpen(false)
    setActiveProject(null)
    setContactOpen(true)
    setNotice(null)
  }

  function handleNav(link) {
    setMenuOpen(false)
    scrollToSection(link.id)
  }

  function handleBrandClick(event) {
    event.preventDefault()
    setMenuOpen(false)
    scrollToSection('home')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const submission = Object.fromEntries(formData)

    if (useMailtoOnlyContact) {
      setNotice({
        type: 'info',
        text: 'This production site opens your email app directly for contact submissions.',
        actionHref: buildMailtoHref(submission),
        actionLabel: 'Open Email App',
      })
      return
    }

    setSending(true)
    setNotice(null)
    try {
      const response = await fetch(contactApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      })
      const result = await readApiResponse(response)
      if (!response.ok) throw new Error(result.message || 'Could not send your message.')
      if (result.delivery === 'fallback') {
        setNotice({
          type: 'info',
          text: result.message,
          actionHref: result.fallbackMailto || buildMailtoHref(submission),
          actionLabel: 'Open Email App',
        })
      } else {
        setNotice({ type: 'success', text: result.message })
        form.reset()
      }
    } catch (error) {
      if (error instanceof TypeError) {
        setNotice({
          type: 'info',
          text: 'The contact server is not reachable right now. Use the email fallback button below.',
          actionHref: buildMailtoHref(submission),
          actionLabel: 'Open Email App',
        })
      } else {
        const text = error.message || 'Could not send your message.'
        setNotice({ type: 'error', text })
      }
    } finally {
      setSending(false)
    }
  }

  return (
      <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Azan home" onClick={handleBrandClick}>
          <span className="brand-mark">A<Crown size={16} /></span>
          <span><strong>AZAN</strong><small>Graphic Designer</small></span>
        </a>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">
          {navLinks.map((link) => (
            <button
              type="button"
              className={`nav-link${link.label === 'Home' ? ' active' : ''}`}
              key={link.id}
              onClick={() => handleNav(link)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <button type="button" className="btn primary header-cta" onClick={openContact}>
          Hire Me <Send size={16} />
        </button>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section id="home" className="hero section-shell">
          <div className="hero-copy">
            <p className="script">Hello, I&apos;m <Heart size={22} /></p>
            <h1 className="hero-name">Azan</h1>
            <h2>
              The Graphic Designer &<br />
              <span>Prototyping Expert</span>
            </h2>
            <div className="hero-divider">
              <span />
              <Heart size={14} fill="currentColor" />
              <span />
            </div>
            <p className="hero-quote">
              I design with <em>passion</em>,<br />
              you grow with <em>impression.</em>
            </p>
            <div className="remote-pill">
              <Home size={22} />
              <span>
                Interested work from home
                <b>No physical meetings</b>
              </span>
            </div>
            <div className="hero-actions">
              <a
                className="btn primary"
                href={portfolioDriveHref}
                target="_blank"
                rel="noreferrer"
              >
                View My Work <ArrowRight size={17} />
              </a>
              <a className="btn outline" href={resumeHref} download="Azan-Resume.pdf">
                Download CV <Download size={16} />
              </a>
              <a className="btn outline" href={quickContactMailtoHref} aria-label="Email Azan Abid about a project">
                Contact Me <Send size={16} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-stage">
              <div className="hero-ambient ambient-one" />
              <div className="hero-ambient ambient-two" />
              <div className="hero-ambient ambient-three" />
              <div className="hero-trail trail-one" />
              <div className="hero-trail trail-two" />
              <div className="hero-glitter glitter-one">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="hero-glitter glitter-two">
                <span />
                <span />
                <span />
              </div>
              <div className="hero-glitter glitter-three">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="hero-glass glass-one" />
              <div className="hero-glass glass-two" />
              <div className="hero-glass glass-three" />
              <div className="hero-glass glass-four" />
              <div className="hero-butterfly-swarm" aria-hidden="true">
                {visibleHeroButterflies.map((butterfly, index) => (
                  <div
                    key={`${butterfly.x}-${butterfly.y}`}
                    className="hero-butterfly mini-butterfly"
                    style={{
                      '--start-x': butterfly.x,
                      '--start-y': butterfly.y,
                      '--end-x': butterfly.endX,
                      '--end-y': butterfly.endY,
                      '--butterfly-size': butterfly.size,
                      '--swarm-delay': butterfly.delay,
                      '--swarm-duration': butterfly.duration,
                      '--swarm-opacity': index % 3 === 0 ? '.9' : '.72',
                      '--butterfly-color-a': butterfly.wingA,
                      '--butterfly-color-b': butterfly.wingB,
                      '--butterfly-glow': butterfly.glow,
                    }}
                  >
                    <span />
                  </div>
                ))}
              </div>
              <div className="hero-butterfly butterfly-one"><span /></div>
              <div className="hero-butterfly butterfly-two"><span /></div>
              <div className="hero-butterfly butterfly-three"><span /></div>
              <span className="hero-orbit orbit-one" />
              <span className="hero-orbit orbit-two" />
              <Sparkles className="sparkle one" />
              <Sparkles className="sparkle two" />
              <Crown className="hero-crown" size={34} />
              <div className="hero-branch branch-left">
                <span />
                <span />
                <span />
              </div>
              <div className="hero-branch branch-right">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="portrait-wrap">
                <img
                  src={heroSectionImage}
                  alt="Hero portrait"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes="(max-width: 560px) 252px, (max-width: 780px) 320px, (max-width: 1120px) 390px, 520px"
                />
              </div>
              <div className="quality-badge">
                Creative
                <br />
                Minimal
                <br />
                Impactful
                <br />
                Designs
                <Heart size={15} fill="currentColor" />
              </div>
            </div>
          </div>
        </section>

        <section className="intro-grid section-shell deferred-section">
          <article className="card tools-card">
            <SectionTitle icon={BriefcaseBusiness} title="Tools I work with" />
            <div className="tools-grid">
              {tools.map((tool) => (
                <div className={`tool tool-${tool.slug}`} key={tool.name}>
                  <div className="tool-icon-shell">
                    <span className="tool-icon">
                      <img
                        src={tool.logo}
                        alt={tool.logoAlt}
                        className={`tool-logo tool-logo-${tool.slug}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                  </div>
                  <div className="tool-meta">
                    <strong>{tool.name}</strong>
                    {tool.note && <small>{tool.note}</small>}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article id="about" className="card about-card">
            <SectionTitle icon={Heart} title="About me" />
            <p>
              I&apos;m Azan, a passionate graphic designer and prototyping expert. I turn ideas into
              beautiful, functional and impactful visual experiences.
            </p>
            <p>My goal is to create designs that not only look amazing but also deliver real results.</p>
            <span className="signature">Azan</span>
          </article>
        </section>

        <section id="services" className="section-shell services-shell deferred-section">
          <div className="services-heading">
            <p>My skills & services</p>
            <Heart size={14} fill="currentColor" />
          </div>
          <div className="card services-ribbon">
            {services.map(({ label, icon: Icon }) => (
              <article className="service-item" key={label}>
                <Icon size={34} strokeWidth={1.5} />
                <h3>{label}</h3>
              </article>
            ))}
          </div>
        </section>

        <section id="portfolio" className="section-shell portfolio-shell deferred-section">
          <div className="portfolio-heading">
            <div className="portfolio-heading-row">
              <Sparkles size={20} />
              <h2>A Closer Look at My Portfolio</h2>
              <Sparkles size={20} />
            </div>
            <p>
              A curated selection of identity, digital, and prototype work
              <br />
              crafted with <span>purpose</span> and <span>creativity</span>.
            </p>
          </div>

          <div className="portfolio-filters page-filters">
            {portfolioFilters.map((label) => (
              <button
                type="button"
                className={filter === label ? 'filter active' : 'filter'}
                onClick={() => setFilter(label)}
                key={label}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="portfolio-grid-page">
            {visibleProjects.map((project) => {
              const Icon = project.icon
              return (
                <button
                  type="button"
                  className={`portfolio-card ${project.color}`}
                  onClick={() => setActiveProject(project)}
                  key={project.title}
                >
                  <span className="portfolio-card-no">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
                  <span className="portfolio-card-star"><Star size={18} /></span>
                  <span className="portfolio-card-icon">
                    <Icon size={40} strokeWidth={1.8} />
                  </span>
                  <small>{project.tag}</small>
                  <strong>{project.title}</strong>
                  <em>View Case Study <ArrowRight size={15} /></em>
                </button>
              )
            })}
          </div>
        </section>

        <section className="section-shell records-shell deferred-section">
          <div className="records-grid">
            <article id="certifications" className="card certificate-card">
              <SectionTitle icon={Trophy} title="Certifications" />
              <div className="certificate-list">
                {certificates.map((item) => (
                  <div className="certificate-row" key={`${item.provider}-${item.title}`}>
                    <span className="certificate-logo-wrap">
                      <img src={item.logo} alt={item.logoAlt} className="certificate-logo" loading="lazy" decoding="async" />
                    </span>
                    <div className="certificate-copy">
                      <strong>{item.provider}</strong>
                      <span>{item.title}</span>
                      <small>{item.note}</small>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article id="education" className="card education-card">
              <SectionTitle icon={GraduationCap} title="Education" />
              <div className="education-layout">
                <div className="education-track">
                  <div className="education-lead">
                    <span className="education-kicker">Learning journey</span>
                    <p>From academic foundations to a current design degree focused on visual communication and practical design work.</p>
                  </div>

                  <div className="timeline">
                    {education.map(([year, title, school]) => (
                      <div className="timeline-row" key={year}>
                        <span className="timeline-dot">
                          <GraduationCap size={16} />
                        </span>
                        <div className="timeline-card">
                          <b>{year}</b>
                          <strong>{title}</strong>
                          <small>{school}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="workspace-panel">
                  <p>
                    Work From Home
                    <br />
                    Create From
                    <br />
                    Anywhere
                  </p>
                  <Heart size={16} fill="currentColor" />
                  <div className="workspace-scene workspace-photo-frame">
                    <img
                      src={workspacePhoto}
                      alt="Pink workspace with flowers, mug and laptop"
                      className="workspace-photo"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      sizes="(max-width: 560px) 100vw, (max-width: 1120px) 420px, 360px"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div className="stats-strip">
            {stats.map(([number, label]) => (
              <div key={label}>
                <strong>{number}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="section-shell contact-band-shell deferred-section">
          <div className="card contact-band">
            <article className="inspo-block">
              <div className="inspo-scene inspo-photo-frame">
                <img
                  src={workspacePhoto}
                  alt="Pink creative desk with flowers, frame and mug"
                  className="inspo-photo"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  sizes="(max-width: 560px) 100vw, (max-width: 1120px) 420px, 360px"
                />
              </div>
            </article>

            <article className="connect-block">
              <h2>LET&apos;S WORK TOGETHER!</h2>
              <p>I&apos;m always open to discussing new projects and opportunities.</p>
              <div className="contact-lines">
                <a href={`mailto:${fallbackContactEmail}`} aria-label="Send email to Azan Abid">
                  <Mail size={17} /> {fallbackContactEmail}
                </a>
                <a href={contactPhoneHref} aria-label="Call Azan Abid">
                  <Phone size={17} /> {contactPhoneDisplay}
                </a>
                <a href={contactLocationHref} target="_blank" rel="noopener noreferrer" aria-label="Open Lahore Pakistan in maps">
                  <MapPin size={17} /> {contactLocationDisplay}
                </a>
              </div>
              <button type="button" className="btn primary" onClick={openContact}>
                Start a Project <ArrowRight size={16} />
              </button>
            </article>

            <article className="remote-block">
              <div className="remote-icon">
                <Home size={28} />
              </div>
              <h3>Interested work from home<br />No physical meetings</h3>
              <p>I prefer to work from home and believe in delivering quality work virtually with full dedication.</p>
            </article>
          </div>
        </section>
      </main>

      <footer className="site-footer deferred-section">
        <div className="section-shell footer-grid">
          <div className="footer-brand">
            <a className="brand footer-brand-link" href="#home" onClick={handleBrandClick}>
              <span className="brand-mark">A<Crown size={16} /></span>
              <span><strong>AZAN</strong><small>Graphic Designer</small></span>
            </a>
            <p>
              Creative graphic designer and prototyping expert delivering modern, impactful and
              result-driven designs.
            </p>
            <div className="socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={17} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
              <a href="mailto:azanabidkhawaja@gmail.com" aria-label="Email"><Mail size={17} /></a>
              <button type="button" aria-label="Open contact" onClick={openContact}><Send size={17} /></button>
            </div>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <div className="footer-links">
              {navLinks.map((link) => (
                <button type="button" key={link.id} className="footer-link-button" onClick={() => handleNav(link)}>
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <div className="footer-list">
              {footerServices.map((service) => (
                <span key={service}>{service}</span>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <h3>Stay Connected</h3>
            <p>Feel free to reach out anytime!</p>
            <div className="footer-contact">
              <a href={`mailto:${fallbackContactEmail}`} aria-label="Send email to Azan Abid">
                <Mail size={15} /> {fallbackContactEmail}
              </a>
              <a href={contactPhoneHref} aria-label="Call Azan Abid">
                <Phone size={15} /> {contactPhoneDisplay}
              </a>
              <a href={contactLocationHref} target="_blank" rel="noopener noreferrer" aria-label="Open Lahore Pakistan in maps">
                <MapPin size={15} /> {contactLocationDisplay}
              </a>
            </div>
          </div>
        </div>
        <div className="copyright">Copyright 2026 Azan. All rights reserved. <Heart size={13} fill="currentColor" /></div>
      </footer>

      {contactOpen && (
        <div className="overlay" onMouseDown={() => setContactOpen(false)}>
          <article className="overlay-card contact-modal" onMouseDown={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setContactOpen(false)}
              aria-label="Close contact form"
            >
              <X />
            </button>
            <div className="modal-header">
              <p>Start a project</p>
              <h2>Send your project brief</h2>
              <span>Share the project scope, style direction and timeline. I will get back to you soon.</span>
            </div>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-trap" aria-hidden="true">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Your name
                  <input name="name" required minLength="2" maxLength="80" placeholder="Your full name" autoComplete="name" />
                </label>
                <label>
                  Email address
                  <input name="email" required type="email" maxLength="120" placeholder="hello@example.com" autoComplete="email" inputMode="email" />
                </label>
              </div>
              <label>
                Subject
                <input name="subject" required minLength="3" maxLength="140" placeholder="What would you like to create?" />
              </label>
              <label>
                Message
                <textarea name="message" required minLength="10" maxLength="2000" rows="5" placeholder="Tell me about your project..." />
              </label>
              {notice && (
                <div className={`notice ${notice.type}`}>
                  <p>{notice.text}</p>
                  {notice.actionHref && (
                    <a className="notice-action" href={notice.actionHref}>
                      {notice.actionLabel || 'Open Email'}
                    </a>
                  )}
                </div>
              )}
              <button className="btn primary" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'} <Send size={16} />
              </button>
            </form>
          </article>
        </div>
      )}

      {activeProject && (
        <div className="overlay" onMouseDown={() => setActiveProject(null)}>
          <article className={`overlay-card project-detail ${activeProject.color}`} onMouseDown={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setActiveProject(null)}
              aria-label="Close project"
            >
              <X />
            </button>
            <div className="project-detail-art">
              <Sparkles size={48} />
            </div>
            <small>{activeProject.tag}</small>
            <h2>{activeProject.title}</h2>
            <p>
              {activeProject.caption}. This concept combines a clear visual hierarchy, a modern feminine
              palette and polished assets designed for real client delivery.
            </p>
          </article>
        </div>
      )}

      <button type="button" className="to-top" onClick={() => scrollToSection('home')} aria-label="Back to top">
        <ChevronUp />
      </button>
    </>
  )
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h2 className="section-title">
      <Icon size={18} />
      {title}
    </h2>
  )
}

export default App
