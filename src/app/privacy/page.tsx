export const metadata = {
  title: "Privacy Policy | NeuralPath",
  description: "Privacy Policy and Google OAuth data usage for NeuralPath (mlroadmap.dev).",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 text-slate-300">
      <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="mb-10 text-sm text-slate-500">Last updated: October 5, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">1. Overview</h2>
          <p>
            <strong>NeuralPath</strong> (<a href="https://mlroadmap.dev" className="text-indigo-400 hover:underline">mlroadmap.dev</a>) is an AI and Machine Learning educational platform. We collect only the minimum information required to provide authentication and track your learning progress.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">2. Information We Collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Google Account Data (OAuth):</strong> When you sign in with Google via Supabase Authentication, we receive your basic profile information—specifically your <strong>name</strong> and <strong>email address</strong> (via standard <code>openid</code>, <code>email</code>, and <code>profile</code> scopes).
            </li>
            <li>
              <strong>Local Browser Storage:</strong> Your completed lessons, bookmarked topics, and daily learning streaks are stored locally in your browser&apos;s <code>localStorage</code>.
            </li>
            <li>
              <strong>Cookies &amp; Analytics:</strong> We use strictly necessary authentication session cookies managed by Supabase to keep you signed in, along with anonymous traffic metrics via Vercel Analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">3. How We Use Your Information</h2>
          <p>
            Your Google name and email are used solely to create your user session and display your profile on your personal learning dashboard. We do <strong>not</strong> sell, rent, or share your personal data with third-party advertisers, and we do not send marketing emails.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">4. Data Storage &amp; Third-Party Services</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong>Supabase:</strong> Manages secure Google OAuth authentication and session cookies.</li>
            <li><strong>Vercel:</strong> Hosts the application and collects anonymized performance analytics.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">5. Data Deletion &amp; Control</h2>
          <p>
            You can clear your locally saved learning progress and bookmarks at any time using the <strong>Reset Completed Topics</strong> button in your Dashboard Settings or by clearing your browser data. To revoke Google Sign-In access or request deletion of your authentication record, manage your connected apps at <a href="https://myaccount.google.com/permissions" className="text-indigo-400 hover:underline" target="_blank" rel="noreferrer">myaccount.google.com/permissions</a>.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-white">6. Contact</h2>
          <p>
            For any questions or data deletion requests, please reach out via our GitHub repository at{" "}
            <a
              href="https://github.com/PIYUSH1525/ZeroToAI"
              className="text-indigo-400 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              github.com/PIYUSH1525/ZeroToAI
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}