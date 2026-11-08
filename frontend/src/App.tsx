import { useState } from "react";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [page, setPage] = useState<
    "landing" | "login" | "register" | "dashboard"
  >("landing");

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
  } | null>(null);

  if (page === "login" || page === "register") {
    return (
      <AuthPage
        mode={page}
        onModeChange={(mode) => setPage(mode)}
        onBack={() => setPage("landing")}
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          setPage("dashboard");
        }}
      />
    );
  }

  if (page === "dashboard" && user) {
    return (
      <DashboardPage
        user={user}
        onLogout={() => {
          localStorage.removeItem("safedeal_token");
          localStorage.removeItem("safedeal_user");
          setUser(null);
          setPage("landing");
        }}
      />
    );
  }

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <a href="#" className="brand" aria-label="SafeDeal X home">
          <span className="brand-mark">S</span>
          <span>SafeDeal<span className="brand-x">X</span></span>
        </a>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>

        <button className="button button-outline nav-action" onClick={() => setPage("login")}>
          Log in <span aria-hidden="true">↗</span>
        </button>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="status-dot" /> AI-powered · Blockchain-secured</div>
          <h1>
            Good work deserves
            <span>great trust.</span>
          </h1>
          <p className="hero-description">
            A calmer, smarter way to work together. Set clear milestones, protect every payment, and build partnerships that last.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => setPage("register")}>
              Get started <span aria-hidden="true">→</span>
            </button>
            <a className="button button-quiet" href="#how-it-works">
              See how it works <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-proof">
            <div className="proof-avatars" aria-hidden="true">
              <span>J</span><span>M</span><span>A</span>
            </div>
            <p><strong>Built for better collaboration</strong><br />For independent minds and ambitious teams</p>
          </div>
        </div>

        <div className="hero-art" aria-label="Illustration of collaborators working together">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="art-sparkle sparkle-one">✦</div>
          <div className="art-sparkle sparkle-two">✧</div>
          <div className="collab-card">
            <div className="collab-card-top">
              <div><span className="mini-label">YOUR WORKSPACE</span><strong>Brand refresh</strong></div>
              <span className="card-menu">•••</span>
            </div>
            <div className="collab-art">
              <svg viewBox="0 0 520 340" role="img" aria-labelledby="team-art-title">
                <title id="team-art-title">Two creative collaborators working on laptops</title>
                <ellipse cx="260" cy="301" rx="190" ry="19" fill="#dcecff" />
                <path d="M66 242c13-67 81-119 172-119 93 0 160 52 176 119v41H66z" fill="#eaf3ff" />
                <rect x="113" y="215" width="294" height="13" rx="6.5" fill="#7fa8f8" />
                <path d="M144 229h235l-16 13H160z" fill="#c6d9fc" />
                <rect x="227" y="174" width="91" height="68" rx="7" fill="#263e71" />
                <rect x="234" y="181" width="77" height="53" rx="3" fill="#d9eaff" />
                <rect x="243" y="191" width="34" height="5" rx="2.5" fill="#6e9df1" />
                <rect x="243" y="202" width="57" height="4" rx="2" fill="#afc7f5" />
                <rect x="243" y="212" width="47" height="4" rx="2" fill="#afc7f5" />
                <circle cx="174" cy="91" r="31" fill="#f3bf9e" />
                <path d="M144 91c0-25 16-43 37-43 24 0 36 17 35 40-12-5-21-14-26-23-8 13-25 22-46 26z" fill="#23365e" />
                <path d="M126 200c2-48 21-79 51-79s51 31 53 79z" fill="#4a78dc" />
                <path d="M155 124l19 26 19-26" fill="#fff" opacity=".8" />
                <path d="M132 202h75l23 20h-89z" fill="#fff" />
                <circle cx="349" cy="91" r="30" fill="#d99a76" />
                <path d="M319 88c2-27 19-43 40-43 23 0 34 17 34 38-15-1-26-9-33-19-9 12-24 20-41 24z" fill="#35446d" />
                <path d="M296 200c2-47 21-78 53-78 30 0 50 31 52 78z" fill="#8bbaf7" />
                <path d="M327 124l22 27 19-27" fill="#fff" opacity=".85" />
                <path d="M300 202h80l21 20h-91z" fill="#fff" />
                <path d="M145 203l-34 25M374 203l34 25" stroke="#f3bf9e" strokeWidth="13" strokeLinecap="round" />
                <circle cx="99" cy="102" r="12" fill="#b9d1ff" />
                <circle cx="424" cy="144" r="8" fill="#b9d1ff" />
                <path d="M91 158l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" fill="#80a9f7" />
              </svg>
            </div>
            <div className="collab-card-bottom">
              <div className="collab-people"><span>J</span><span>M</span><span>+2</span></div>
              <span className="secure-tag"><span className="tiny-check">✓</span> Escrow protected</span>
            </div>
          </div>
          <div className="floating-note note-top"><span className="note-icon">✓</span><span><strong>Milestone approved</strong><small>Payment released securely</small></span></div>
          <div className="floating-note note-bottom"><span className="note-icon note-blue">✦</span><span><strong>Better work, together</strong><small>One clear step at a time</small></span></div>
        </div>
      </section>

      <div className="trust-strip">
        <span>BUILT FOR TRUSTED INDEPENDENT WORK</span>
        <div><span>✦ Clear agreements</span><span>◈ Protected payments</span><span>◎ Fair collaboration</span></div>
      </div>

      <section id="features" className="features-section">
        <div className="section-heading">
          <p className="section-kicker">A better way to work</p>
          <h2>Everything in sync.<br /><span>Everyone protected.</span></h2>
          <p>Thoughtful tools that help good work move forward with clarity and confidence.</p>
        </div>
        <div className="feature-grid">
          {[
            { icon: "▤", title: "AI contract intelligence", description: "Spot unclear terms and shape agreements around milestones everyone understands.", color: "lavender" },
            { icon: "◈", title: "Blockchain escrow", description: "Keep payments protected and transparent from kickoff through completion.", color: "blue" },
            { icon: "✧", title: "Deliverable verification", description: "Compare submitted work against the expectations you agreed on together.", color: "sky" },
            { icon: "⚖", title: "Fair dispute support", description: "Bring context and evidence together for balanced, informed decisions.", color: "peach" },
            { icon: "↗", title: "Transaction insights", description: "Understand project risks early with data-informed guidance.", color: "mint" },
            { icon: "☆", title: "Trust that compounds", description: "Build a reputation through completed milestones and reliable work.", color: "rose" },
          ].map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className={`feature-icon ${feature.color}`}>{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="steps-section">
        <div className="steps-intro">
          <p className="section-kicker">Simple by design</p>
          <h2>From first hello<br />to <span>work well done.</span></h2>
          <p>Keep the important details clear, so you can focus on the work that matters.</p>
        </div>
        <div className="steps-list">
          {[
            { number: "01", title: "Agree on the work", description: "Set the scope, milestones, and expectations together." },
            { number: "02", title: "Secure the payment", description: "Funds are held safely while the work gets underway." },
            { number: "03", title: "Share progress", description: "Submit deliverables and review them against your agreement." },
            { number: "04", title: "Celebrate the finish", description: "Approve completed milestones and release payment with confidence." },
          ].map((step) => (
            <article className="step-item" key={step.number}>
              <span className="step-number">{step.number}</span>
              <div><h3>{step.title}</h3><p>{step.description}</p></div>
              <span className="step-chevron" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="closing-section">
        <div className="closing-orb" aria-hidden="true" />
        <p className="section-kicker">Make room for great work</p>
        <h2>Trust makes good work<br /><span>feel even better.</span></h2>
        <p>Build stronger professional relationships with clear agreements, secure payments, and a little more peace of mind.</p>
        <button className="button button-light" onClick={() => setPage("register")}>Create your free account <span aria-hidden="true">→</span></button>
      </section>

      <footer className="landing-footer">
        <a href="#" className="brand"><span className="brand-mark">S</span><span>SafeDeal<span className="brand-x">X</span></span></a>
        <p>Trust before you transact. © 2026 SafeDeal X.</p>
        <span>AI · Blockchain · Trust</span>
      </footer>
    </main>
  );
}

export default App;
