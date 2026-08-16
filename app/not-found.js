import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-dvh bg-stone-50 px-6 py-8 text-zinc-950 sm:px-10 lg:px-16">
      <section
        aria-labelledby="not-found-heading"
        className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center border-t border-zinc-950/10"
      >
        <div className="max-w-2xl">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.18em] text-zinc-600">
            404
          </p>
          <h1
            id="not-found-heading"
            className="text-5xl font-semibold leading-none tracking-normal text-zinc-950 sm:text-6xl"
          >
            Page not found.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-700">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2"
          >
            Return home
          </Link>
        </div>
      </section>
    </main>
  );
}
