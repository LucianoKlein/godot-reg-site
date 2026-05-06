import React from "react";
import s from "./page.module.scss";

const POPULAR_COURSES = [
  { id: "poker-1", tab: "Poker", name: "Texas Hold'em Fundamentals", instructor: "Aiden", duration: "8h 20m", students: 1243 },
  { id: "baccarat-1", tab: "Baccarat", name: "Baccarat Rules & Procedures", instructor: "Aiden", duration: "4h 10m", students: 2105 },
  { id: "baccarat-3", tab: "Baccarat", name: "Dealing Operations Standard Training", instructor: "Leo", duration: "9h 00m", students: 1890 },
  { id: "poker-2", tab: "Poker", name: "Tournament Strategy Masterclass", instructor: "Aiden", duration: "12h 30m", students: 892 },
];

const FAQ_ITEMS = [
  { q: "How can interview questions match the course content so closely?", a: "We break down common job requirements and workflows into a training question bank and operational standards, and use simulated practice to help you build reusable problem-solving and operational frameworks." },
  { q: "Do you really sign a contract immediately after enrollment?", a: "Yes, a formal contract is signed specifying the scope of services, process, and terms. The actual contract you sign shall prevail." },
  { q: "What exactly does 'job placement support' include?", a: "It typically includes training plans, resume optimization advice, mock interviews, and process support. Details vary by plan — contact us for the specific checklist." },
  { q: "Can I learn with zero experience? How long does it take?", a: "Absolutely — you can start from scratch, but you need to commit to the practice schedule. The timeline depends on your background, effort, and job availability." },
];

const FEATURES = [
  { t: "Simulation Software Practice", d: "Job-level simulations at the core, making training as close to real work as possible. You learn not just theory, but hands-on skills." },
  { t: "Job Placement Support (Full Journey)", d: "From courses to job search, we provide systematic support: resume prep, interview coaching, process guidance, and more (details per contract)." },
  { t: "60+ Course Library (Comprehensive Coverage)", d: "Courses and training form a closed loop: learn — practice — test — review — practice again, until you can deliver consistently." },
  { t: "Transparent Guarantee: Contract Upon Enrollment", d: "Clear terms, defined boundaries, no verbal promises. You just focus on your effort — everything else proceeds as agreed." },
  { t: "Flexible Scheduling: Fits Your Pace", d: "We adjust the training rhythm to your situation, so you can sustain effective practice at a manageable intensity." },
  { t: "Results-Oriented: Every Practice Prepares You for the Interview", d: "We break interview questions and job skills into a training checklist: you know what to practice, to what standard, and how to verify." },
];

const STEPS = [
  { title: "Align Goals: Map Out Job Competencies", text: "Clarify what the job requires, what the interview tests, and how you'll be evaluated on-site — then turn it into an actionable training plan." },
  { title: "Break Down Actions: Questions → Steps → Model Answers", text: "We don't just give conclusions — we provide the reasoning path and replicable operational procedures." },
  { title: "High-Frequency Drills: Repeat Until Consistent", text: "Use simulated practice to master key steps and build stable output: know how, do it right, do it fast." },
  { title: "Review & Iterate: Accelerate Through Mistakes", text: "Target weak spots for focused improvement, avoid ineffective grinding, and shorten the gap from learning to employment." },
];

const JSONLD_ORG = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Aiden Practical Training",
  description: "Systematic dealer training: poker, baccarat, dice courses with video lessons, study notes, and simulation practice.",
  url: typeof window !== "undefined" ? window.location.origin : "",
};

const JSONLD_COURSES = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: POPULAR_COURSES.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Course",
      name: c.name,
      provider: { "@type": "Organization", name: "Aiden Practical Training" },
      instructor: { "@type": "Person", name: c.instructor },
    },
  })),
};

export default function HomeEn() {
  return (
    <div className={s.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_ORG) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_COURSES) }} />
      <header className={s.nav}>
        <div className={s.container}>
          <div className={s.navInner}>
            <a href="/en" className={s.logo} aria-label="Aiden Practical Training - Home">
              <div className={s.logoMark} aria-hidden="true" />
              <div>
                <div className={s.logoTitle}>Aiden Practical Training</div>
                <div className={s.logoSub}>No Gimmicks, Only Results</div>
              </div>
            </a>
            <nav className={s.navLinks} aria-label="Page Navigation">
              <a href="#courses" className={s.navLink}>Popular Courses</a>
              <a href="#system" className={s.navLink}>Teaching System</a>
              <a href="#cases" className={s.navLink}>Case Studies</a>
              <a href="#faq" className={s.navLink}>FAQ</a>
              <a href="/en/courses" className={`${s.btn} ${s.btnGreen}`}>Courses</a>
              <a href="/en/quiz" className={`${s.btn} ${s.btnGreen}`}>Quiz</a>
              <a href="/en/english" className={`${s.btn} ${s.btnGreen}`}>English</a>
              <a href="/en/login" className={`${s.btn} ${s.btnPrimary}`}>Login</a>
            </nav>
          </div>
        </div>
      </header>
      <main>
        {/* ── Hero ── */}
        <section className={s.hero}>
          <div className={s.container}>
            <div className={s.heroGrid}>
              <div className={s.heroCard}>
                <div className={s.badgeRow}>
                  <span className={`${s.badge} ${s.badgeBrand}`}>No Gimmicks</span>
                  <span className={`${s.badge} ${s.badgeGreen}`}>Practice-Oriented</span>
                  <span className={s.badge}>Interview-Aligned</span>
                  <span className={s.badge}>Full Support</span>
                </div>
                <h1 className={s.h1}>Only Real Skills<br />and Real Results</h1>
                <p className={s.lead}>
                  We don&apos;t do fancy packaging — every lesson and drill is directly aligned with real job requirements.
                  The goal is clear: equip you with <strong>reusable, practical skills</strong> to ace the interview and land the job.
                </p>
                <div className={s.heroActions}>
                  <a href="/en/courses" className={`${s.btn} ${s.btnGreen}`}>Try Courses Free</a>
                  <a href="/en/quiz" className={`${s.btn} ${s.btnGreen}`}>Quiz Training</a>
                  <a href="#consult" className={`${s.btn} ${s.btnPrimary}`}>Contact Us</a>
                  <a href="#cases" className={s.btn}>View Case Studies</a>
                </div>
                <div className={s.miniCardGrid}>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>Student Feedback Keyword</p>
                    <div className={s.miniBig}>Practical</div>
                    <p className={s.miniDesc}>Interview questions closely match classroom exercises — stay calm, think clearly, deliver to standard.</p>
                  </div>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>Core of Training</p>
                    <div className={s.miniBig}>Job-Ready</div>
                    <p className={s.miniDesc}>Not just &quot;understanding&quot; — we emphasize &quot;doing.&quot; From problem breakdown to hands-on feel, trained to be job-ready.</p>
                  </div>
                </div>
              </div>
              <aside className={s.heroCard} aria-label="Key Info Cards">
                <div className={s.asideGrid}>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>Real Case</p>
                    <div className={s.miniBig} style={{ fontSize: 20 }}>Sandy Received Venetian Offer</div>
                    <p className={s.miniDesc}>From interview to job offer, her feedback in one word: <strong>Practical</strong>.</p>
                  </div>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>Training Support</p>
                    <div className={s.miniBig} style={{ fontSize: 20 }}>Simulation Software Practice</div>
                    <p className={s.miniDesc}>Build muscle memory for key actions with job-level simulations — learn skills you can use immediately.</p>
                  </div>
                  <div className={s.miniCard}>
                    <p className={s.miniTitle}>Service Promise</p>
                    <div className={s.miniBig} style={{ fontSize: 20 }}>Contract Upon Enrollment</div>
                    <p className={s.miniDesc}>A formal contract is signed immediately after enrollment — transparent process, clear terms, services delivered as agreed.</p>
                  </div>
                  <div className={s.warnCard}>
                    <p className={s.miniTitle} style={{ color: "rgba(255,255,255,0.92)" }}>Important Notice</p>
                    <p className={s.miniDesc}>Claims such as &quot;guaranteed placement&quot; are subject to the actual contract terms; individual results depend on background, effort, and job availability.</p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── Popular Courses ── */}
        <section id="courses" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>Popular Courses</h2>
                <p className={s.sub}>From beginner to advanced, covering poker, baccarat, dice and more — video lessons + study notes + simulation practice.</p>
              </div>
              <a href="/en/courses" className={s.btn}>View All Courses</a>
            </div>
            <div className={s.grid4}>
              {POPULAR_COURSES.map(c => (
                <a key={c.id} href={`/en/courses/${c.id}`} className={s.courseCard}>
                  <span className={s.courseTab}>{c.tab}</span>
                  <h3 className={s.courseName}>{c.name}</h3>
                  <p className={s.courseMeta}>Instructor: {c.instructor} · {c.duration}</p>
                  <p className={s.courseMeta}>{c.students} students</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── Teaching System ── */}
        <section id="system" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>Teaching Model: Solid, Reusable, Transferable</h2>
                <p className={s.sub}>Integrating neuroscience, psychology, pedagogy, and game theory to help students learn and practice in the way that suits them best.</p>
              </div>
            </div>
            <div className={s.grid2}>
              <div className={s.steps}>
                {STEPS.map((item, idx) => (
                  <div key={item.title} className={s.stepItem}>
                    <div className={s.stepNum}>{idx + 1}</div>
                    <div className={s.stepTextWrap}>
                      <p className={s.stepTitle}>{item.title}</p>
                      <p className={s.stepText}>{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={s.quote}>
                <p className={s.quoteText}>&quot;On the surface, Aiden is running a training program, but underneath he&apos;s connecting learning methods, practice systems, and interview strategies. Under this system, newcomers achieve results that even experienced people may not get.&quot;</p>
                <div className={s.quoteMeta}><span>Student Testimonial Summary</span><span>Keywords: Systematic · Practical</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Case Studies ── */}
        <section id="cases" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>Real Case Studies</h2>
                <p className={s.sub}>Let results and process speak: from &quot;how to practice&quot; to &quot;how to answer&quot; — breaking interviews down into trainable actions.</p>
              </div>
              <a href="#consult" className={s.btn}>Get the Same Training Path</a>
            </div>
            <div className={s.grid2}>
              <div className={s.quote}>
                <p className={s.quoteText}>&quot;During the interview, I realized the questions were exactly what you covered and had us practice in class! I wasn&apos;t nervous at all!&quot;</p>
                <div className={s.quoteMeta}><span>Student Feedback</span><span>Interview-Aligned · Reproducible</span></div>
              </div>
              <div className={s.quote}>
                <p className={s.quoteText}>&quot;I believe Aiden is someone who delivers real results — no other school has this kind of capability!&quot;</p>
                <div className={s.quoteMeta}><span>Student Feedback</span><span>Grounded · Results-Oriented</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features & Guarantees ── */}
        <section id="features" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>Exclusive Software &amp; Service Dual Guarantee</h2>
                <p className={s.sub}>Hands-on transformation of real job challenges into trainable, testable, job-ready skills.</p>
              </div>
            </div>
            <div className={s.grid3}>
              {FEATURES.map(f => (
                <div key={f.t} className={s.feature}>
                  <div className={s.featureTitle}>{f.t}</div>
                  <p className={s.featureText}>{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className={s.section}>
          <div className={s.container}>
            <div className={s.sectionHeader}>
              <div>
                <h2 className={s.h2}>Frequently Asked Questions</h2>
                <p className={s.sub}>What you care about, we address directly — no information asymmetry.</p>
              </div>
            </div>
            <div className={s.grid2}>
              {FAQ_ITEMS.map(item => (
                <div key={item.q} className={s.feature}>
                  <div className={s.featureTitle}>{item.q}</div>
                  <p className={s.featureText}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section id="consult" className={s.cta}>
          <div className={s.container}>
            <div className={s.ctaCard}>
              <span className={s.badge} style={{ display: "inline-block", margin: 0 }}>Choose a Trustworthy School · Results Delivered</span>
              <h3 className={s.ctaTitle} style={{ marginTop: 10 }}>Contact Us Now: Get Course Plans + Job Support Details + Contract Terms</h3>
              <p className={s.ctaText}>We don&apos;t do empty promises — only real work. You just focus on your effort and train hard; we handle the rest as agreed.</p>
              <div className={s.ctaActions}>
                <a href="/en/courses" className={`${s.btn} ${s.btnGreen}`}>Try Courses Free</a>
                <a href="#consult" className={`${s.btn} ${s.btnPrimary}`}>Message / Contact Us</a>
                <a href="#cases" className={s.btn}>Review Cases</a>
              </div>
              <div className={s.note}>Note: Claims such as &quot;guaranteed placement/promise/exclusive&quot; on this page are subject to the actual contract and service capabilities.</div>
            </div>
          </div>
        </section>

        <footer className={s.footer}>
          <div className={s.container}>
            <div className={s.footerInner}>
              <div>
                <div className={s.footerBrand}>Aiden Practical Training</div>
                <div className={s.footerCopy}>© {new Date().getFullYear()} All rights reserved.</div>
              </div>
              <div className={s.footerRight}>
                <div className={s.footerContact}>Contact: Please fill in your WeChat / Email / Phone here</div>
                <div className={s.footerLinks}>
                  <a href="/en/courses" className={s.footerLink}>Courses</a>
                  <span className={s.footerSep}>|</span>
                  <a href="/en/quiz" className={s.footerLink}>Quiz</a>
                  <span className={s.footerSep}>|</span>
                  <a href="#consult" className={s.footerLink}>Contact</a>
                  <span className={s.footerSep}>|</span>
                  <a href="#faq" className={s.footerLink}>FAQ</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}