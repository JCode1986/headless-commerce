export default function Home() {
  return (
    <main className="min-h-dvh bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.12),_transparent_32rem),linear-gradient(135deg,_#fafafa_0%,_#f4f0e8_48%,_#eef4f2_100%)] px-6 py-8 text-zinc-950 sm:px-10 lg:px-16">
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center">
        <div className="max-w-3xl">
          <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-zinc-600">
            Headless Commerce
          </p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-none tracking-normal text-zinc-950 sm:text-6xl lg:text-7xl">
            Storefront coming soon.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-700 sm:text-xl">
            A modern commerce experience powered by Next.js, Shopify, and
            WordPress.
          </p>
        </div>
      </section>
    </main>
  );
}
