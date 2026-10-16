import { useEffect, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowUpRight,
  CircuitBoard,
  Code2,
  Cpu,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Mail,
  Menu,
  Microchip,
  Moon,
  Phone,
  Radio,
  Send,
  Sparkles,
  Sun,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import darkLogo from "@/assets/nk-logo-dark.png.asset.json";
import lightLogo from "@/assets/nk-logo-light.png.asset.json";
import profilePhoto from "@/assets/naveen-profile-photo.png.asset.json";
import powerBoardRender from "@/assets/power-supply-3d-board.jpg.asset.json";
import powerBoardLayout from "@/assets/power-supply-pcb-layout.jpg.asset.json";
import powerSupplySchematic from "@/assets/power-supply-schematic.jpg.asset.json";
import { contactFormSchema } from "@/lib/contact-validation";
import { supabase } from "@/integrations/supabase/client";

const EMAILJS_PUBLIC_KEY = "eI-5_jMmssO9YMy8Z";
const EMAILJS_TEMPLATE_ID = "template_qua3pco";
const EMAILJS_SERVICE_ID = "service_5ckhbrv";

const navItems = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Education", id: "education" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Experience", id: "experience" },
  { label: "Contact", id: "contact" },
];

const technicalTopics = ["PCB DESIGN", "VERILOG HDL", "EMBEDDED SYSTEMS", "VLSI", "AI + ELECTRONICS"];

const skills = [
  {
    number: "01",
    icon: Code2,
    title: "Programming & computing",
    description: "Writing code, testing logic, and exploring software-driven engineering solutions.",
    tags: ["C programming", "MATLAB", "Python projects", "Arduino IDE"],
  },
  {
    number: "02",
    icon: Radio,
    title: "Embedded systems",
    description: "Exploring microcontrollers, hardware interfacing, and practical embedded applications.",
    tags: ["Arduino Uno", "ESP8266", "ESP32", "8051", "Sensors", "Automation"],
  },
  {
    number: "03",
    icon: Cpu,
    title: "Digital electronics & VLSI",
    description: "Building a foundation in digital design, hardware description languages, and VLSI concepts.",
    tags: ["Digital electronics", "Verilog HDL", "Logic design", "VLSI fundamentals"],
  },
  {
    number: "04",
    icon: CircuitBoard,
    title: "PCB design & emerging tech",
    description: "Designing circuit boards and exploring intelligent systems that connect hardware and software.",
    tags: ["EasyEDA", "PCB design", "Circuit design", "Drones", "AI + electronics"],
  },
];

const projects = [
  {
    number: "01",
    kind: "PCB DESIGN / POWER ELECTRONICS",
    title: "AC-to-DC 5V power supply PCB",
    description:
      "Designed a power supply PCB in EasyEDA, exploring circuit design, board layout, and the fundamentals of power conversion.",
    tags: ["EasyEDA", "PCB design", "Power supply", "Electronics"],
    highlights: ["AC-to-DC power conversion", "5V power supply design", "Circuit layout explored in EasyEDA"],
    art: "power",
  },
  {
    number: "02",
    kind: "EMBEDDED SYSTEMS / AUTOMATION",
    title: "Smart door lock system",
    description:
      "Built a PIN-based smart door lock in the Wokwi simulator using Arduino, exploring embedded logic and hardware interaction.",
    tags: ["Arduino", "Wokwi", "Embedded systems", "Automation"],
    highlights: ["PIN-based access control", "Arduino embedded logic", "Hardware interaction in Wokwi"],
    art: "lock",
  },
  {
    number: "03",
    kind: "DRONE SIMULATION / PROGRAMMING",
    title: "Python-based drone control",
    description:
      "A Python project using PySimVerse to explore software-driven control, simulation, and the interaction between code and drone behavior.",
    tags: ["Python", "PySimVerse", "Drones", "Simulation"],
    highlights: ["Python-based control", "Drone behavior in simulation", "Exploration with PySimVerse"],
    art: "drone",
  },
  {
    number: "04",
    kind: "DIGITAL ELECTRONICS / HDL DESIGN",
    title: "Digital clock in Verilog HDL",
    description:
      "Designed a digital clock in Verilog HDL, exploring sequential logic, counters, timing concepts, and digital system design.",
    tags: ["Verilog HDL", "Digital electronics", "RTL design", "Digital logic"],
    highlights: ["Sequential logic", "Counters and timing concepts", "Digital system design"],
    art: "clock",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Naveen Kumar Gude | ECE, VLSI & Embedded Systems" },
      {
        name: "description",
        content:
          "Explore the engineering portfolio of Naveen Kumar Gude, an ECE student interested in VLSI, Verilog HDL, PCB design, embedded systems, drones, and AI-integrated electronics.",
      },
      { property: "og:title", content: "Naveen Kumar Gude | ECE & VLSI Engineering" },
      {
        property: "og:description",
        content:
          "A curious ECE student learning through hands-on projects in VLSI, PCB design, embedded systems, drones, and intelligent electronics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [formSending, setFormSending] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    setLightTheme(window.localStorage.getItem("naveen-theme") === "light");
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (themeLoaded) window.localStorage.setItem("naveen-theme", lightTheme ? "light" : "dark");
  }, [lightTheme, themeLoaded]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
    );
    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    navItems.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });

    const updateScrolled = () => setScrolled(window.scrollY > 36);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("scroll", updateScrolled);
    };
  }, []);

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const result = contactFormSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!result.success) {
      setFormStatus(result.error.issues[0]?.message ?? "Check your details and try again.");
      return;
    }

    setFormSending(true);
    setFormStatus("Sending your message…");
    const { name, email, subject, message } = result.data;
    const { error } = await supabase.from("contact_submissions").insert({ name, email, subject, message });
    if (error) {
      setFormStatus("We couldn’t save your message. Please use the email link to contact me.");
      setFormSending(false);
      return;
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { name, email, from_name: name, from_email: email, reply_to: email, subject, message },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      setFormStatus("Your message was sent successfully. Thank you for reaching out.");
      form.reset();
    } catch {
      setFormStatus("Your message is saved, but email delivery failed. Please contact me directly using the email link.");
    } finally {
      setFormSending(false);
    }
  }

  return (
    <main className={`portfolio-shell${lightTheme ? " light-theme" : ""}`}>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header-inner">
          <a className="brand-mark" href="#home" aria-label="Naveen Kumar Gude, home">
            <img src={lightTheme ? lightLogo.url : darkLogo.url} alt="Naveen Kumar Gude logo" />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map(({ label, id }) => (
              <a key={id} className={activeSection === id ? "active" : ""} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <Button
              variant="outline"
              size="icon"
              className="theme-toggle"
              aria-label={`Switch to ${lightTheme ? "dark" : "light"} theme`}
              title={`Switch to ${lightTheme ? "dark" : "light"} theme`}
              onClick={() => setLightTheme((value) => !value)}
            >
              {lightTheme ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
            </Button>
            <Button asChild className="nav-cta">
              <a href="#contact">LET’S TALK <ArrowUpRight aria-hidden="true" /></a>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="menu-toggle"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </Button>
          </div>
        </div>
        <nav id="mobile-navigation" className={`mobile-nav${menuOpen ? " open" : ""}`} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
          {navItems.map(({ label, id }) => (
            <a key={id} className={activeSection === id ? "active" : ""} href={`#${id}`} onClick={() => setMenuOpen(false)} tabIndex={menuOpen ? 0 : -1}>
              {label}<ArrowUpRight aria-hidden="true" />
            </a>
          ))}
        </nav>
      </header>

      <section id="home" className="hero-section">
        <div className="hero-gridline" aria-hidden="true" />
        <div className="hero-inner page-width">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-dot" /> Curious by design. Engineered through experiments.</p>
            <h1><span className="hero-line">HELLO,</span><span className="hero-line">I’M <em>NAVEEN</em></span><span className="hero-line">KUMAR<span className="gold-dot">.</span></span></h1>
            <AnimatedTitle />
            <p className="hero-description">I’m an Electronics and Communication Engineering student exploring the intersection of hardware, software, and intelligent technology. From PCBs and Verilog to embedded projects and drone simulation, I enjoy turning technical ideas into practical solutions.</p>
            <div className="hero-actions">
              <Button asChild className="button-gold"><a href="#projects">EXPLORE MY PROJECTS <ArrowUpRight aria-hidden="true" /></a></Button>
              <Button asChild variant="outline" size="icon" className="hero-social-link"><a href="https://www.linkedin.com/in/naveenkumargudeece" target="_blank" rel="noreferrer" aria-label="Naveen on LinkedIn" title="LinkedIn"><Linkedin aria-hidden="true" /></a></Button>
              <Button asChild variant="outline" size="icon" className="hero-social-link"><a href="https://github.com/NAVEENKUMARGUDE333" target="_blank" rel="noreferrer" aria-label="Naveen on GitHub" title="GitHub"><Github aria-hidden="true" /></a></Button>
            </div>
            <a className="scroll-cue" href="#about">SCROLL TO EXPLORE <ArrowDown aria-hidden="true" /></a>
          </div>
          <EngineeringIdentity lightTheme={lightTheme} />
          <div className="hero-coordinate coordinate-top" aria-hidden="true">16°30′N / 80°38′E</div>
          <div className="hero-coordinate coordinate-bottom" aria-hidden="true">ECE • 2027</div>
        </div>
        <div className="ticker" aria-label="Technical interests">
          <div className="ticker-track" aria-hidden="true">
            {Array.from({ length: 6 }, (_, group) => technicalTopics.map((topic, index) => (
              <span className="ticker-item" key={`${group}-${topic}`}>
                {topic}<b aria-hidden="true">✳</b>
              </span>
            )))}
          </div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="page-width">
          <SectionHeading number="01" label="ABOUT" title={<>CURIOUS ABOUT<br />HOW THINGS <mark>WORK.</mark></>} />
          <div className="about-layout">
            <div className="about-lead reveal"><span className="quote-mark">“</span><p>I like exploring the connection between electronics, programming, and artificial intelligence — then bringing those ideas off the screen and into the real world.</p><div className="about-signature">NAVEEN KUMAR GUDE <span>ECE STUDENT</span></div></div>
            <div className="about-detail reveal"><p>I am an Electronics and Communication Engineering student with a strong interest in core electronics and emerging technologies such as Artificial Intelligence, VLSI, and embedded systems.</p><p>My hands-on learning includes Arduino, ESP8266, ESP32, sensors, digital electronics, and Verilog HDL. Through practical projects and technical training, I keep building my problem-solving skills, technical knowledge, and creativity.</p><p>My goal is to become a skilled engineer developing intelligent, impactful technology solutions.</p></div>
          </div>
          <div className="interest-row">
            <Interest icon={<Radio />} title="Embedded systems" description="Microcontrollers, sensors & automation" />
            <Interest icon={<Microchip />} title="VLSI & Verilog" description="Digital logic & hardware description" />
            <Interest icon={<CircuitBoard />} title="PCB design" description="Circuit layouts & practical electronics" />
            <Interest icon={<Sparkles />} title="AI + electronics" description="Exploring intelligent hardware" />
          </div>
          <div className="section-rule" />
        </div>
      </section>

      <section id="education" className="section education-section">
        <div className="page-width">
          <div className="section-intro-row">
            <SectionHeading number="02" label="EDUCATION" title={<>BUILT ON<br /><mark>GOOD QUESTIONS.</mark></>} />
            <p className="intro-note reveal">Every circuit starts with<br />a question worth asking.</p>
          </div>
          <div className="education-list">
            <article className="education-entry reveal"><div className="education-year">2024<span>COMPLETED</span></div><div className="education-marker"><GraduationCap aria-hidden="true" /></div><div className="education-copy"><span className="micro-label">SECONDARY SCHOOL CERTIFICATE</span><h3>Subhodaya E.M. High School</h3><p>Completed secondary education and built a foundation for further technical learning.</p></div><div className="education-result"><span>SSC MARKS</span><strong>551</strong></div></article>
            <article className="education-entry reveal"><div className="education-year">2024 — 2027<span>EXPECTED JULY 2027</span></div><div className="education-marker"><GraduationCap aria-hidden="true" /></div><div className="education-copy"><span className="micro-label">DIPLOMA · ELECTRONICS & COMMUNICATION</span><h3>Government Polytechnic, Vijayawada</h3><p>Currently pursuing ECE, developing knowledge in electronics, digital systems, microcontrollers, PCB design, VLSI, and embedded technology.</p></div><div className="education-result ongoing"><span>STATUS</span><strong>IN PROGRESS</strong></div></article>
          </div>
        </div>
      </section>

      <section id="skills" className="section skills-section">
        <div className="page-width">
          <div className="section-intro-row skills-intro">
            <SectionHeading number="03" label="SKILLS" title={<>MY TECH<br /><mark>TOOLKIT.</mark></>} />
            <p className="intro-note reveal">A growing collection of tools,<br />concepts, and hands-on learning.</p>
          </div>
          <div className="skills-grid">
            {skills.map(({ number, icon: Icon, title, description, tags }, index) => (
              <article key={number} className={`skill-card reveal stagger-${index + 1}`}>
                <div className="skill-card-top"><span>{number} / 04</span><Icon aria-hidden="true" /></div>
                <h3>{title}</h3><p>{description}</p>
                <div className="tag-list">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="skill-accent" />
              </article>
            ))}
          </div>
          <p className="soft-skills"><span>ALSO IN MY TOOLKIT</span> COMMUNICATION <i /> LEADERSHIP <i /> PROBLEM-SOLVING <i /> CONTINUOUS LEARNING</p>
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="page-width">
          <div className="section-intro-row projects-intro">
            <SectionHeading number="04" label="SELECTED PROJECTS" title={<>THINGS I’VE<br /><mark>BUILT.</mark></>} />
            <p className="intro-note reveal">Hands-on experiments at the intersection<br />of electronics, hardware & software.</p>
          </div>
          <div className="projects-grid">
            {projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}
          </div>
        </div>
      </section>

      <section id="experience" className="section experience-section">
        <div className="page-width experience-layout">
          <SectionHeading number="05" label="EXPERIENCE" title={<>LEARNING<br />BY <mark>BUILDING.</mark></>} />
          <article className="experience-entry reveal">
            <div className="experience-timeline"><span /><span>06<br />MONTHS</span></div>
            <div className="experience-copy"><span className="micro-label">TECHNICAL TRAINING · VIJAYAWADA</span><h3>Technical Training Intern <em>— CITD</em></h3><p>Completed six months of technical training at CITD, gaining exposure to drone technology, Arduino Uno, microcontrollers, sensors, VLSI fundamentals, and Verilog HDL.</p>
              <div className="learning-list"><span>Drone technology & simulation</span><span>Arduino & microcontroller fundamentals</span><span>Sensors & hardware interfacing</span><span>VLSI concepts & Verilog HDL</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="section drive-section">
        <div className="page-width drive-layout">
          <div><SectionHeading number="06" label="AREAS OF INTEREST" title={<>WHAT<br />DRIVES <mark>ME.</mark></>} /><p className="drive-quote reveal">“My ambition is to grow into a skilled electronics engineer, strengthen my expertise in VLSI and embedded systems, and contribute to intelligent technology solutions that solve real-world problems.”</p></div>
          <div className="drive-list">
            <InterestLine number="01" title="AI + electronics" description="Connecting intelligent software with practical electronic systems." />
            <InterestLine number="02" title="VLSI & digital design" description="Building stronger foundations in Verilog, digital electronics, and integrated circuit concepts." />
            <InterestLine number="03" title="Embedded automation" description="Developing microcontroller-based solutions and experimenting with hardware and software." />
            <div className="drive-circuit" aria-hidden="true"><span /><span /><span /><span /></div>
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="page-width">
          <SectionHeading number="07" label="CONTACT" title={<>LET’S<br /><mark>CONNECT.</mark></>} />
          <div className="contact-layout">
            <div className="contact-details reveal">
              <p className="contact-intro">Open to learning opportunities, technical collaboration, engineering projects, and opportunities to grow.</p>
              <a className="contact-item" href="mailto:gudenaveenkumar9@gmail.com"><span className="contact-icon"><Mail /></span><span><small>WRITE TO ME</small><strong>gudenaveenkumar9@gmail.com</strong></span><ArrowUpRight /></a>
              <a className="contact-item" href="tel:+919652392414"><span className="contact-icon"><Phone /></span><span><small>GIVE ME A CALL</small><strong>+91 9652392414</strong></span><ArrowUpRight /></a>
              <div className="contact-location"><span className="contact-icon"><MapPin /></span><span><small>BASED IN</small><strong>Vijayawada, Andhra Pradesh, India</strong></span></div>
              <div className="social-links"><a href="https://www.linkedin.com/in/naveenkumargudeece" target="_blank" rel="noreferrer" aria-label="Naveen on LinkedIn"><span className="social-logo"><Linkedin /></span><span><small>CONNECT ON</small><strong>LinkedIn</strong></span><ArrowUpRight /></a><a href="https://github.com/NAVEENKUMARGUDE333" target="_blank" rel="noreferrer" aria-label="Naveen on GitHub"><span className="social-logo"><Github /></span><span><small>EXPLORE MY</small><strong>GitHub</strong></span><ArrowUpRight /></a></div>
            </div>
            <form className="contact-form reveal" onSubmit={sendMessage}>
              <div className="form-row"><label>Name<input name="name" type="text" autoComplete="name" placeholder="Your name" maxLength={100} required /></label><label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={255} required /></label></div>
              <label>Subject<input name="subject" type="text" placeholder="What would you like to discuss?" maxLength={200} required /></label>
              <label>Message<textarea name="message" rows={4} placeholder="Write your message..." maxLength={5000} required /></label>
              <Button type="submit" className="button-gold form-submit" disabled={formSending}>{formSending ? "SENDING…" : "SEND MESSAGE"} <Send aria-hidden="true" /></Button>
              <p className="form-note" role="status">{formStatus || "Your message will be sent directly to my inbox."}</p>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="page-width footer-main">
          <a className="footer-brand" href="#home"><span className="brand-mark"><img src={lightTheme ? lightLogo.url : darkLogo.url} alt="" /></span><span><strong>NAVEEN KUMAR GUDE</strong><small>ECE STUDENT · VLSI · EMBEDDED SYSTEMS</small></span></a>
          <nav aria-label="Footer navigation">{["home", "about", "projects", "contact"].map((id) => <a key={id} href={`#${id}`}>{id.toUpperCase()}</a>)}</nav>
          <a className="back-top" href="#home" aria-label="Back to top"><ArrowUp /></a>
        </div>
        <div className="page-width footer-bottom"><span>© {new Date().getFullYear()} NAVEEN KUMAR GUDE</span><span>MADE WITH CURIOSITY <i>✳</i></span></div>
      </footer>
    </main>
  );
}

function AnimatedTitle() {
  const roles = ["Embedded systems explorer", "VLSI design enthusiast", "PCB design learner"];
  const [typedText, setTypedText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedText(roles[0] ?? "Embedded systems explorer");
      return;
    }

    const target = roles[roleIndex] ?? roles[0] ?? "Embedded systems explorer";
    const complete = typedText === target;
    const delay = deleting ? (typedText.length === 0 ? 420 : 42) : complete ? 1400 : 82;
    const timer = window.setTimeout(() => {
      if (!deleting && complete) {
        setDeleting(true);
      } else if (deleting && typedText.length === 0) {
        setDeleting(false);
        setRoleIndex((current) => (current + 1) % roles.length);
      } else {
        setTypedText((current) => deleting ? current.slice(0, -1) : target.slice(0, current.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, roleIndex, typedText]);

  return (
    <div className="hero-profession" role="group" aria-label={`Electrical & Electronics Engineer, ${roles[roleIndex] ?? "Embedded systems explorer"}`}>
      <span className="profession-title" aria-hidden="true">Electrical &amp; Electronics Engineer</span>
      <span className="typed-role" aria-hidden="true">{typedText}<i /></span>
    </div>
  );
}

function EngineeringIdentity({ lightTheme }: { lightTheme: boolean }) {
  return (
    <div className="identity-wrap" aria-label="Naveen’s engineering identity card">
      <div className="identity-card">
        <span className="identity-label">ECE STUDENT · VIJAYAWADA</span>
        <div className="identity-portrait">
          <img className="identity-photo" src={profilePhoto.url} alt="Portrait of Naveen Kumar Gude" />
        </div>
        <span className="identity-name">NAVEEN KUMAR GUDE</span>
        <span className="identity-focus">VLSI · EMBEDDED SYSTEMS · PCB DESIGN</span>
      </div>
    </div>
  );
}

function SectionHeading({ number, label, title }: { number: string; label: string; title: React.ReactNode }) {
  return <div className="section-heading reveal"><div className="section-kicker"><span>{number} /</span><span>{label}</span></div><h2>{title}</h2></div>;
}

function Interest({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="interest-item reveal"><span className="interest-icon">{icon}</span><div><h3>{title}</h3><p>{description}</p></div></div>;
}

function InterestLine({ number, title, description }: { number: string; title: string; description: string }) {
  return <article className="interest-line reveal"><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight aria-hidden="true" /></article>;
}

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className={`project-card reveal stagger-${index + 1}`} aria-label={`View details for ${project.title}`}>
          <ProjectArtwork type={project.art} />
          <span className="project-copy">
            <span className="project-meta"><span>PROJECT {project.number}</span><span>{project.kind}</span></span>
            <span className="project-card-title">{project.title}</span>
            <span className="project-card-description">{project.description}</span>
            <span className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</span>
            <span className="project-footer"><span>VIEW PROJECT DETAILS</span><span className="project-arrow" aria-hidden="true"><ArrowUpRight /></span></span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="project-dialog" overlayClassName="project-dialog-backdrop">
        <div className="project-dialog-topline">
          <span>PROJECT {project.number}</span>
          <span>{project.kind}</span>
        </div>
        <div className="project-dialog-scroll">
          <DialogHeader className="project-dialog-heading">
            <DialogTitle>{project.title}</DialogTitle>
            <DialogDescription>{project.kind}</DialogDescription>
          </DialogHeader>
          {project.number === "01" ? <PowerProjectGallery /> : <div className="project-dialog-artwork"><ProjectArtwork type={project.art} /></div>}
          <section className="project-detail-section" aria-labelledby={`project-overview-${project.number}`}>
            <h3 id={`project-overview-${project.number}`}><span />PROJECT OVERVIEW</h3>
            <p>{project.description}</p>
          </section>
          <div className="project-detail-grid">
            <section className="project-detail-section project-detail-panel" aria-labelledby={`project-highlights-${project.number}`}>
              <h3 id={`project-highlights-${project.number}`}><span />KEY CONCEPTS</h3>
              <ul className="project-highlight-list">
                {project.highlights.map((highlight) => <li key={highlight}><span aria-hidden="true">+</span>{highlight}</li>)}
              </ul>
            </section>
            <section className="project-detail-section" aria-labelledby={`project-tools-${project.number}`}>
              <h3 id={`project-tools-${project.number}`}><span />TOOLS & TECHNOLOGIES</h3>
              <div className="project-detail-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </section>
          </div>
        </div>
        <DialogFooter className="project-dialog-footer">
          <span>PROJECT NOTES · NAVEEN KUMAR GUDE</span>
          <DialogClose asChild><Button className="project-dialog-close">Close details</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const powerProjectImages = [
  { src: powerBoardRender.url, alt: "3D render of the AC-to-DC 5V power supply circuit board", label: "3D BOARD VIEW" },
  { src: powerBoardLayout.url, alt: "PCB layout showing component placement and copper traces for the AC-to-DC converter", label: "PCB LAYOUT" },
  { src: powerSupplySchematic.url, alt: "EasyEDA circuit schematic for the AC-to-DC 5V power supply", label: "CIRCUIT SCHEMATIC" },
];

function PowerProjectGallery() {
  const [activeImage, setActiveImage] = useState(0);
  const image = powerProjectImages[activeImage];

  function showImage(index: number) {
    setActiveImage((index + powerProjectImages.length) % powerProjectImages.length);
  }

  return (
    <section className="project-image-gallery" aria-label="Project images">
      <figure className="project-gallery-image" aria-live="polite">
        <img key={image.src} src={image.src} alt={image.alt} />
        <figcaption><span>{String(activeImage + 1).padStart(2, "0")}</span> {image.label}</figcaption>
      </figure>
      <div className="project-gallery-controls" aria-label="Choose project image">
        <Button variant="outline" size="icon" className="project-gallery-arrow" aria-label="Show previous project image" onClick={() => showImage(activeImage - 1)}>
          <ChevronLeft aria-hidden="true" />
        </Button>
        <div className="project-gallery-pagination">
          {powerProjectImages.map((item, index) => (
            <Button
              key={item.src}
              variant="ghost"
              size="sm"
              className={`project-gallery-page${activeImage === index ? " is-active" : ""}`}
              aria-label={`Show ${item.label.toLowerCase()}`}
              aria-current={activeImage === index ? "true" : undefined}
              onClick={() => showImage(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="icon" className="project-gallery-arrow" aria-label="Show next project image" onClick={() => showImage(activeImage + 1)}>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}

function ProjectArtwork({ type }: { type: string }) {
  return (
    <div className={`project-art art-${type}`} aria-hidden="true">
      <div className="art-grid" />
      {type === "power" && <><div className="pcb-board"><span className="pcb-chip">AC<br />DC</span><span className="pcb-pad pad-one" /><span className="pcb-pad pad-two" /><span className="pcb-cap cap-one" /><span className="pcb-cap cap-two" /><span className="pcb-route route-one" /><span className="pcb-route route-two" /><span className="pcb-label">5V OUT</span></div><div className="art-caption">POWER CONVERSION / PCB LAYOUT</div></>}
      {type === "lock" && <><div className="lock-keypad"><div className="lock-display">ACCESS CONTROL</div><div className="key-grid">{Array.from({ length: 9 }, (_, i) => <span key={i}>{i + 1}</span>)}</div></div><div className="lock-symbol"><div className="lock-shackle" /><div className="lock-body"><span /></div></div><div className="art-caption">ARDUINO / SIMULATED SYSTEM</div></>}
      {type === "drone" && <><div className="drone-path"><span /><span /><span /></div><svg className="drone-svg" viewBox="0 0 240 140" fill="none"><path d="M120 70 69 39M120 70l51-31M120 70l-51 31M120 70l51 31" /><circle cx="58" cy="34" r="17" /><circle cx="182" cy="34" r="17" /><circle cx="58" cy="106" r="17" /><circle cx="182" cy="106" r="17" /><rect x="103" y="55" width="34" height="30" rx="5" /><path d="M120 55V39m0 46v16" /></svg><div className="drone-coords">X 014.82<br />Y 032.16<br />Z 008.04</div><div className="art-caption">PYSIMVERSE / FLIGHT SIMULATION</div></>}
      {type === "clock" && <><div className="clock-display"><span>1</span><i>:</i><span>2</span><i>:</i><span>3</span><small>VERILOG HDL</small></div><div className="clock-wave"><span /><span /><span /><span /><span /><span /><span /><span /></div><div className="art-caption">SEQUENTIAL LOGIC / DIGITAL CLOCK</div></>}
    </div>
  );
}
