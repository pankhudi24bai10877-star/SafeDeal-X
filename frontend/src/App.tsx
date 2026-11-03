/*navigation bar and hero section */



function App() {
  return (
    <main className="min-h-screen bg-[#080D19] text-white">

      {/* Navigation Bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

        <a href="#" className="text-2xl font-bold tracking-tight">
          SafeDeal <span className="text-blue-500">X</span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-slate-400 md:flex">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-white">
            How It Works
          </a>
          <a href="#about" className="transition hover:text-white">
            About
          </a>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-500">
          Connect Wallet
        </button>

      </nav>

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">

        {/* Left Content */}
        <div>

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-400"></span>
            AI-Powered · Blockchain-Secured
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Work with confidence.
            <span className="mt-2 block text-blue-500">
              Get paid with trust.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            A smarter way to manage freelance transactions.
            Create clear agreements, secure payments through
            blockchain escrow, and resolve disputes with AI assistance.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">

            <button className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold transition hover:bg-blue-500">
              Get Started →
            </button>

            <a
              href="#features"
              className="rounded-lg border border-slate-700 px-7 py-3.5 font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Explore Features
            </a>

          </div>

          <div className="mt-12 flex flex-wrap gap-8 text-sm text-slate-400">
            <div>
              <p className="text-xl font-bold text-white">AI</p>
              <p>Contract Intelligence</p>
            </div>

            <div>
              <p className="text-xl font-bold text-white">Web3</p>
              <p>Secure Escrow</p>
            </div>

            <div>
              <p className="text-xl font-bold text-white">Fair</p>
              <p>Dispute Resolution</p>
            </div>
          </div>

        </div>

        {/* Right Visual Preview */}
        <div className="relative">

          <div className="absolute -inset-8 rounded-full bg-blue-600/10 blur-3xl"></div>

          <div className="relative rounded-2xl border border-slate-700 bg-[#111827] p-6 shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-700 pb-5">
              <div>
                <p className="text-sm text-slate-400">Transaction Overview</p>
                <h2 className="mt-1 text-xl font-semibold">Project #SDX-1024</h2>
              </div>

              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                Protected
              </span>
            </div>

            <div className="py-8">
              <p className="text-sm text-slate-400">Escrow Balance</p>
              <h3 className="mt-2 text-4xl font-bold">0.50 ETH</h3>
              <p className="mt-2 text-sm text-slate-500">
                Illustrative testnet transaction
              </p>
            </div>

            <div className="space-y-5">

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Agreement</span>
                <span className="text-sm text-green-400">Verified</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-full rounded-full bg-blue-500"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Milestone 1</span>
                <span className="text-sm text-blue-400">In Progress</span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-700">
                <div className="h-full w-2/3 rounded-full bg-blue-500"></div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Payment Security</span>
                <span className="text-sm text-green-400">Escrow Locked</span>
              </div>

            </div>

            <div className="mt-8 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
              <p className="text-sm font-semibold text-blue-400">
                SafeDeal X Protection
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Funds remain locked until the agreed milestone conditions
                are satisfied and the payment is authorized.
              </p>
            </div>

          </div>
        </div>

      </section>
      
      {/* Features Section */}
      <section id="features" className="border-t border-slate-800 bg-[#0B1220] px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Why SafeDeal X?
            </p>
            <h2 className="mt-4 text-4xl font-bold">
              Everything you need for a safer deal.
            </h2>
            <p className="mt-5 leading-7 text-slate-400">
              Intelligent tools and blockchain technology work together
              to protect both clients and freelancers.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: "📄",
                title: "AI Contract Intelligence",
                description: "Analyze agreements, identify vague terms and generate clearer milestone-based contracts."
              },
              {
                icon: "🔐",
                title: "Blockchain Escrow",
                description: "Secure milestone payments through smart contracts with transparent transaction records."
              },
              {
                icon: "🤖",
                title: "Deliverable Verification",
                description: "Use AI to compare submitted work against agreed requirements and acceptance criteria."
              },
              {
                icon: "⚖️",
                title: "Fair Dispute Resolution",
                description: "Organize evidence and generate neutral AI summaries to support human dispute decisions."
              },
              {
                icon: "📊",
                title: "Transaction Risk Analysis",
                description: "Estimate transaction risks using project details and relevant historical patterns."
              },
              {
                icon: "⭐",
                title: "Trust & Reputation",
                description: "Build credibility through completed milestones, verified feedback and transaction history."
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-slate-800 bg-[#111827] p-7 transition hover:-translate-y-1 hover:border-blue-500/50"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="mt-6 text-xl font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Simple Process
            </p>
            <h2 className="mt-4 text-4xl font-bold">
              How SafeDeal X Works
            </h2>
          </div>

          <div className="mt-16 grid gap-10 md:grid-cols-4">

            {[
              {
                number: "01",
                title: "Create Agreement",
                description: "Client and freelancer define project scope, deadlines and milestones."
              },
              {
                number: "02",
                title: "Secure Funds",
                description: "Client deposits the agreed funds into blockchain escrow."
              },
              {
                number: "03",
                title: "Submit Work",
                description: "Freelancer submits deliverables for review against agreed requirements."
              },
              {
                number: "04",
                title: "Release Payment",
                description: "Approved milestones trigger payment release through the smart contract."
              }
            ].map((step) => (
              <div key={step.number} className="relative">
                <div className="text-4xl font-bold text-blue-500/50">
                  {step.number}
                </div>
                <h3 className="mt-5 text-xl font-semibold">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {step.description}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section id="about" className="px-6 pb-24">
        <div className="mx-auto max-w-7xl rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950 to-[#111827] px-8 py-16 text-center">

          <h2 className="text-3xl font-bold md:text-4xl">
            Make every transaction count.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
            Build stronger professional relationships with transparent
            agreements, protected payments and intelligent assistance.
          </p>

          <button className="mt-8 rounded-lg bg-blue-600 px-8 py-3.5 font-semibold transition hover:bg-blue-500">
            Get Started →
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">

          <p className="text-xl font-bold">
            SafeDeal <span className="text-blue-500">X</span>
          </p>

          <p className="text-center text-sm text-slate-500">
            Trust Before You Transact. © 2026 SafeDeal X.
          </p>

          <p className="text-sm text-slate-500">
            AI + Blockchain + Trust
          </p>

        </div>
      </footer>


    </main>
  )
}

export default App
