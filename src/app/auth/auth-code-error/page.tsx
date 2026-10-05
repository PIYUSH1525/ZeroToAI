import Link from "next/link";

export const metadata = { title: "Sign-in failed // NeuralPath" };

export default function AuthCodeErrorPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-white">Sign-in failed</h1>
      <p className="mt-2 text-sm text-slate-400">
        We couldn&apos;t complete your Google sign-in. Please try again.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Back to home
      </Link>
    </div>
  );
}
