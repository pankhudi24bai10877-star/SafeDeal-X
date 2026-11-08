
import { useEffect, useState, type FormEvent } from "react";
import { apiRequest } from "../services/api";

interface Project {
  id: string;
  title: string;
  description: string;
  budget: number | string;
  status: string;
}

interface Freelancer {
  id: string;
  name: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number | string;
  dueDate: string;
  status: string;
}

interface DashboardPageProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  onLogout: () => void;
}

function DashboardPage({ user, onLogout }: DashboardPageProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [freelancerLoading, setFreelancerLoading] = useState(true);
  const [freelancerError, setFreelancerError] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [milestoneError, setMilestoneError] = useState("");
  const [milestoneSuccess, setMilestoneSuccess] = useState("");

  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneDescription, setMilestoneDescription] = useState("");
  const [milestoneAmount, setMilestoneAmount] = useState("");
  const [milestoneDueDate, setMilestoneDueDate] = useState("");
  const [milestoneCreating, setMilestoneCreating] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/projects");
      setProjects(data.projects ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchFreelancers = async () => {
    setFreelancerLoading(true);
    setFreelancerError("");

    try {
      const data = await apiRequest("/users/freelancers");
      setFreelancers(data.freelancers ?? []);
    } catch (err) {
      setFreelancerError(
        err instanceof Error ? err.message : "Could not load freelancers."
      );
    } finally {
      setFreelancerLoading(false);
    }
  };

  const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setSuccess("");

    if (Number(budget) <= 0 || !Number.isFinite(Number(budget))) {
      setFormError("Please enter a valid positive budget.");
      return;
    }

    if (!freelancerId) {
      setFormError("Please select a freelancer.");
      return;
    }

    setCreating(true);

    try {
      await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          budget: Number(budget),
          freelancerId,
        }),
      });

      setSuccess("Project created successfully!");
      setTitle("");
      setDescription("");
      setBudget("");
      setFreelancerId("");

      await fetchProjects();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not create project."
      );
    } finally {
      setCreating(false);
    }
  };

  const fetchMilestones = async (projectId: string) => {
    setSelectedProjectId(projectId);
    setMilestones([]);
    setMilestonesLoading(true);
    setMilestoneError("");
    setMilestoneSuccess("");

    try {
      const data = await apiRequest(
        `/projects/${projectId}/milestones`
      );

      setMilestones(data.milestones ?? []);
    } catch (err) {
      setMilestoneError(
        err instanceof Error ? err.message : "Could not load milestones."
      );
    } finally {
      setMilestonesLoading(false);
    }
  };

  const handleCreateMilestone = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedProjectId) return;

    if (
      !Number.isFinite(Number(milestoneAmount)) ||
      Number(milestoneAmount) <= 0
    ) {
      setMilestoneError("Please enter a valid positive milestone amount.");
      return;
    }

    setMilestoneError("");
    setMilestoneSuccess("");
    setMilestoneCreating(true);

    try {
      await apiRequest(
        `/projects/${selectedProjectId}/milestones`,
        {
          method: "POST",
          body: JSON.stringify({
            title: milestoneTitle,
            description: milestoneDescription,
            amount: Number(milestoneAmount),
            dueDate: milestoneDueDate,
          }),
        }
      );

      setMilestoneTitle("");
      setMilestoneDescription("");
      setMilestoneAmount("");
      setMilestoneDueDate("");
      setMilestoneSuccess("Milestone created successfully!");

      await fetchMilestones(selectedProjectId);
    } catch (err) {
      setMilestoneError(
        err instanceof Error ? err.message : "Could not create milestone."
      );
    } finally {
      setMilestoneCreating(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    if (user.role === "CLIENT") {
      fetchFreelancers();
    } else {
      setFreelancerLoading(false);
    }
  }, [user.role]);

  const projectStatusCounts = projects.reduce<Record<string, number>>(
    (counts, project) => {
      const status = project.status || "Unspecified";
      counts[status] = (counts[status] ?? 0) + 1;
      return counts;
    },
    {}
  );

  return (
    <main className="dashboard-page min-h-screen bg-[#080D19] p-6 text-white md:p-10">
      <header className="dashboard-header flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          SafeDeal <span className="text-blue-500">X</span>
        </h1>

        <button
          onClick={onLogout}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
        >
          Logout
        </button>
      </header>

      <section className="dashboard-welcome mt-12">
        <div className="dashboard-welcome-copy">
          <p className="text-sm text-blue-400">YOUR WORKSPACE</p>
          <h2 className="mt-2 text-3xl font-bold">Welcome, {user.name}!</h2>
          <p className="mt-2 text-slate-400">
            {user.role === "CLIENT" ? "Your projects, thoughtfully in sync." : "Your next great project starts here."}
          </p>
          <span className="dashboard-role-pill">{user.role.toLowerCase()} · {user.email}</span>
        </div>
        <div className="dashboard-welcome-art" aria-hidden="true">
          <div className="welcome-art-orbit" />
          <svg viewBox="0 0 300 210">
            <ellipse cx="153" cy="188" rx="112" ry="12" fill="#d9e7ff" opacity=".8" />
            <rect x="69" y="146" width="172" height="10" rx="5" fill="#94b7fc" />
            <path d="M92 156h126l-12 10H105z" fill="#c6d9fc" />
            <rect x="129" y="103" width="64" height="53" rx="5" fill="#1e3c77" />
            <rect x="134" y="108" width="54" height="41" rx="2" fill="#dfebff" />
            <rect x="141" y="116" width="27" height="4" rx="2" fill="#6089e2" />
            <rect x="141" y="125" width="39" height="3" rx="1.5" fill="#a9c2f3" />
            <circle cx="102" cy="72" r="22" fill="#edb494" />
            <path d="M80 74c0-19 12-31 27-31 17 0 26 13 25 30-10-4-17-10-20-18-6 9-17 16-32 19z" fill="#203763" />
            <path d="M64 143c2-37 16-60 39-60 23 0 39 23 40 60z" fill="#6090ed" />
            <path d="M208 72c0-18 12-30 27-30 16 0 25 12 24 29-9-3-16-9-20-17-6 9-17 15-31 18z" fill="#30456f" />
            <circle cx="231" cy="71" r="21" fill="#d59b7b" />
            <path d="M190 143c2-37 16-59 40-59s38 22 40 59z" fill="#86b9ef" />
            <circle cx="234" cy="45" r="13" fill="#dff8ef" />
            <path d="M228 45l4 4 8-9" fill="none" stroke="#319b75" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="welcome-art-caption">Better work, together</span>
        </div>
      </section>

      <section className="dashboard-overview" aria-label="Project overview">
        <article className="overview-count-card">
          <span className="overview-icon">◈</span>
          <p>Projects in your workspace</p>
          <strong>{loading ? "—" : projects.length}</strong>
          <span className="overview-footnote">{loading ? "Syncing your workspace" : "Based on your current projects"}</span>
        </article>
        <article className="overview-status-card">
          <div className="overview-card-heading">
            <div><span className="overview-kicker">AT A GLANCE</span><h3>Project pulse</h3></div>
            <span className="pulse-icon">↗</span>
          </div>
          {loading && <p className="overview-empty">Loading project status…</p>}
          {!loading && projects.length === 0 && (
            <p className="overview-empty">Your project status overview will appear here.</p>
          )}
          {!loading && projects.length > 0 && (
            <div className="status-summary-list">
              {Object.entries(projectStatusCounts).map(([status, count], index) => (
                <div className="status-summary-item" key={status}>
                  <div className="status-summary-label"><span>{status}</span><strong>{count}</strong></div>
                  <div className="status-summary-track">
                    <span className={`status-summary-fill status-tone-${index % 4}`} style={{ width: `${(count / projects.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      {user.role === "CLIENT" && (
        <section className="project-create-card mt-10 rounded-xl border border-slate-700 bg-[#111827] p-6">
          <h3 className="text-xl font-semibold">
            Create a New Project
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Add your project details and assign a freelancer.
          </p>

          <form
            onSubmit={handleCreateProject}
            className="mt-6 space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Project Title
              </label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter project title"
                className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Select Freelancer
              </label>

              <select
                value={freelancerId}
                onChange={(e) => setFreelancerId(e.target.value)}
                required
                disabled={freelancerLoading || freelancers.length === 0}
                className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">
                  {freelancerLoading
                    ? "Loading freelancers..."
                    : "Choose a freelancer"}
                </option>

                {freelancers.map((freelancer) => (
                  <option key={freelancer.id} value={freelancer.id}>
                    {freelancer.name}
                  </option>
                ))}
              </select>

              {freelancerError && (
                <p className="mt-2 text-sm text-red-400">
                  {freelancerError}
                </p>
              )}

              {!freelancerLoading &&
                !freelancerError &&
                freelancers.length === 0 && (
                  <p className="mt-2 text-sm text-slate-400">
                    No registered freelancers found.
                  </p>
                )}
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Project Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Describe the work you need..."
                className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Budget
              </label>

              <input
                type="number"
                min="0.01"
                step="0.01"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
                placeholder="Enter budget"
                className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {formError && (
              <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                {formError}
              </p>
            )}

            {success && (
              <p className="rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={
                creating ||
                freelancerLoading ||
                freelancers.length === 0
              }
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {creating ? "Creating Project..." : "Create Project"}
            </button>
          </form>
        </section>
      )}

      <section className="projects-section mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">
            {user.role === "CLIENT" ? "My Projects" : "Assigned Projects"}
          </h3>

          <button
            onClick={fetchProjects}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm hover:bg-blue-500"
          >
            Refresh Projects
          </button>
        </div>

        {loading && (
          <p className="mt-6 text-slate-400">
            Loading your projects...
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-700 bg-[#111827] p-8">
            <p className="text-lg font-semibold">No projects yet</p>

            <p className="mt-2 text-sm text-slate-400">
              Your projects will appear here once they are created or assigned.
            </p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <article
                key={project.id}
                className="project-card rounded-xl border border-slate-700 bg-[#111827] p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h4 className="text-lg font-semibold">
                    {project.title}
                  </h4>

                  <span className="project-status rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                    {project.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-400">
                  {project.description}
                </p>

                <p className="mt-5 text-sm">
                  Budget:{" "}
                  <span className="font-semibold">
                    {project.budget}
                  </span>
                </p>

                <button
                  onClick={() => fetchMilestones(project.id)}
                  className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500"
                >
                  View Milestones
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedProjectId && (
        <section className="milestone-panel mt-10 rounded-xl border border-slate-700 bg-[#111827] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">
              Project Milestones
            </h3>

            <button
              onClick={() => {
                setSelectedProjectId("");
                setMilestones([]);
                setMilestoneError("");
                setMilestoneSuccess("");
              }}
              className="text-sm text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {milestonesLoading && (
            <p className="mt-4 text-slate-400">
              Loading milestones...
            </p>
          )}

          {milestoneError && (
            <p className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
              {milestoneError}
            </p>
          )}

          {milestoneSuccess && (
            <p className="mt-4 rounded-lg bg-green-500/10 p-3 text-sm text-green-400">
              {milestoneSuccess}
            </p>
          )}

          {!milestonesLoading && milestones.length === 0 && !milestoneError && (
            <p className="mt-4 text-slate-400">
              No milestones added yet.
            </p>
          )}

          {!milestonesLoading && milestones.length > 0 && (
            <div className="mt-5 space-y-4">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="milestone-item rounded-lg border border-slate-700 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h4 className="font-semibold">
                      {milestone.title}
                    </h4>

                    <span className="milestone-status rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                      {milestone.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {milestone.description}
                  </p>

                  <p className="mt-3 text-sm">
                    Amount:{" "}
                    <span className="font-semibold">
                      {milestone.amount}
                    </span>
                  </p>

                  {milestone.dueDate && (
                    <p className="mt-1 text-sm text-slate-400">
                      Due:{" "}
                      {new Date(milestone.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {user.role === "CLIENT" && (
            <form
              onSubmit={handleCreateMilestone}
              className="mt-8 space-y-4 border-t border-slate-700 pt-6"
            >
              <h4 className="text-lg font-semibold">
                Add New Milestone
              </h4>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Milestone Title
                </label>

                <input
                  value={milestoneTitle}
                  onChange={(e) => setMilestoneTitle(e.target.value)}
                  required
                  placeholder="e.g. Frontend Development"
                  className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>

                <textarea
                  value={milestoneDescription}
                  onChange={(e) => setMilestoneDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Describe the milestone deliverables..."
                  className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Amount
                </label>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={milestoneAmount}
                  onChange={(e) => setMilestoneAmount(e.target.value)}
                  required
                  placeholder="Enter milestone amount"
                  className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Due Date
                </label>

                <input
                  type="date"
                  value={milestoneDueDate}
                  onChange={(e) => setMilestoneDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-[#080D19] px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={milestoneCreating || milestonesLoading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
              >
                {milestoneCreating ? "Adding Milestone..." : "Add Milestone"}
              </button>
            </form>
          )}
        </section>
      )}
    </main>
  );
}

export default DashboardPage;
