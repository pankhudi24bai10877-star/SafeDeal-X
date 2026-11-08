
import { useState } from "react";
import { apiRequest } from "../services/api";

type AuthMode = "login" | "register";

interface AuthPageProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onBack: () => void;
  onSuccess: (user: {
    id: string;
    name: string;
    email: string;
    role: string;
  }) => void;
}

function AuthPage({
  mode,
  onModeChange,
  onBack,
  onSuccess,
}: AuthPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/auth/register"
        : "/auth/login";

      const body = isRegister
        ? { name, email, password, role }
        : { email, password };

      const data = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      localStorage.setItem("safedeal_token", data.token);
      localStorage.setItem("safedeal_user", JSON.stringify(data.user));

      onSuccess(data.user);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page flex min-h-screen items-center justify-center bg-[#080D19] px-5 py-12 text-white">
      <div className="auth-layout">
        <section className="auth-story">
          <a href="#" className="brand auth-brand" aria-label="SafeDeal X">
            <span className="brand-mark">S</span>
            <span>SafeDeal<span className="brand-x">X</span></span>
          </a>
          <p className="section-kicker">Good work, well protected</p>
          <h2>Make room for<br /><span>better work.</span></h2>
          <p className="auth-story-copy">
            Clear agreements. Secure milestones. More time to focus on what you do best.
          </p>
          <div className="auth-illustration">
            <div className="auth-illustration-halo" />
            <svg viewBox="0 0 460 340" role="img" aria-labelledby="auth-art-title">
              <title id="auth-art-title">A freelancer working at a laptop</title>
              <ellipse cx="231" cy="298" rx="165" ry="17" fill="#dce8ff" />
              <rect x="113" y="221" width="238" height="12" rx="6" fill="#78a0ed" />
              <path d="M142 233h180l-17 13H157z" fill="#b9cff9" />
              <rect x="205" y="158" width="91" height="73" rx="7" fill="#263e71" />
              <rect x="212" y="165" width="77" height="57" rx="3" fill="#e1edff" />
              <rect x="221" y="176" width="41" height="5" rx="2.5" fill="#6a92e5" />
              <rect x="221" y="188" width="57" height="4" rx="2" fill="#afc7f5" />
              <rect x="221" y="198" width="47" height="4" rx="2" fill="#afc7f5" />
              <circle cx="177" cy="97" r="32" fill="#e9b18f" />
              <path d="M146 99c0-27 17-44 39-44 25 0 37 18 36 42-13-5-23-15-28-25-8 13-25 23-47 27z" fill="#253b67" />
              <path d="M124 213c2-51 22-84 54-84 32 0 54 33 56 84z" fill="#4a78dc" />
              <path d="M157 133l21 27 21-27" fill="#fff" opacity=".85" />
              <path d="M135 211l-33 20M220 211l28 22" stroke="#e9b18f" strokeWidth="13" strokeLinecap="round" />
              <circle cx="330" cy="106" r="23" fill="#d9e8ff" />
              <path d="M320 106l7 7 14-16" fill="none" stroke="#4771d5" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M90 148l5 11 11 5-11 5-5 11-5-11-11-5 11-5z" fill="#7ea5f2" />
            </svg>
            <div className="auth-visual-note"><span>✓</span><strong>Every milestone,<br />a little more peace of mind</strong></div>
          </div>
          <p className="auth-story-foot">Designed for independent minds and ambitious teams.</p>
        </section>

        <div className="auth-form-column">
          <button
            onClick={onBack}
            className="auth-back mb-8 text-sm text-slate-400 hover:text-white"
          >
            ← Back to home
          </button>

          <div className="auth-card rounded-2xl border border-slate-700 bg-[#111827] p-8 shadow-2xl">

          <h1 className="text-3xl font-bold">
            SafeDeal <span className="text-blue-500">X</span>
          </h1>

          <h2 className="mt-8 text-2xl font-semibold">
            {isRegister ? "Create your account" : "Welcome back"}
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            {isRegister
              ? "Join SafeDeal X and start working with confidence."
              : "Login to continue to your SafeDeal X account."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {isRegister && (
              <>
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    I want to join as
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="CLIENT">Client</option>
                    <option value="FREELANCER">Freelancer</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={isRegister ? 8 : undefined}
                required
                className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : isRegister
                  ? "Create Account"
                  : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setError("");
                onModeChange(isRegister ? "login" : "register");
              }}
              className="font-semibold text-blue-400 hover:text-blue-300"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
