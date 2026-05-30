import type { StaticPageBlock, StaticPageContent } from "@/content/static-pages/data";

const wingMdWidthClasses = {
  "10": "md:w-10",
  "12": "md:w-12",
} as const;

const wingXlWidthClasses = {
  "16": "xl:w-16",
  "48": "xl:w-48",
} as const;

function renderBlock(block: StaticPageBlock, index: number) {
  if (block.type === "paragraph") {
    return (
      <p key={index} className="text-sm leading-7 text-white/85 sm:text-sm sm:leading-8">
        {block.text}
      </p>
    );
  }

  if (block.type === "list") {
    return (
      <ul
        key={index}
        className="list-disc space-y-2 pl-5 text-sm leading-7 text-white/85 sm:text-sm sm:leading-8"
      >
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return (
    <figure
      key={index}
      className="border-l-2 border-white/20 pl-4 italic text-white/90"
    >
      <blockquote className="space-y-1">
        {block.lines.map((line) => (
          <p key={line} className="text-sm leading-7 sm:text-sm sm:leading-8">
            {line}
          </p>
        ))}
      </blockquote>
      {block.attribution ? (
        <figcaption className="mt-3 text-xs not-italic uppercase tracking-[0.2em] text-white/50">
          {block.attribution}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function StaticPageRenderer({
  title,
  blocks,
  wingMdWidth,
  wingXlWidth,
}: StaticPageContent) {
  return (
    <section className="min-h-screen flex flex-col bg-black px-4 pt-20 sm:px-14 md:px-4 md:pt-24 md:pb-6">
      <div className="relative w-full flex-1 mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-black flex flex-col md:flex-row">
        <div className="flex flex-col md:grid md:min-h-[620px] md:grid-cols-12 w-full flex-1">
          <div className="md:col-span-7">
            <div className="aspect-[4/3] w-full bg-zinc-500 md:h-full md:min-h-[620px] md:aspect-auto relative overflow-hidden rounded-2xl md:rounded-none">
              <img
                src="/canh-bien.png"
                alt="đường viền"
                className={`pointer-events-none absolute rotate-90 md:rotate-none left-[70%] md:left-[98%] top-[97%] md:top-1/2 z-10 h-auto w-7 ${wingMdWidthClasses[wingMdWidth]} ${wingXlWidthClasses[wingXlWidth]} -translate-y-1/2`}
              />
            </div>
          </div>

          <div className="relative bg-black px-5 py-8 text-white sm:px-8 sm:py-10 md:col-span-5 md:px-10 md:py-12 lg:px-16 lg:py-16 flex-1">
            <h2 className="mb-5 text-center text-xl font-semibold uppercase tracking-widest sm:mb-6 sm:text-3xl md:mb-8">
              {title}
            </h2>

            <div className="z-50 relative mx-auto flex max-w-[32ch] flex-col gap-4 md:mx-0 md:max-w-none">
              {blocks.map((block, index) => renderBlock(block, index))}
            </div>

            <img
              src="/nui-1.png"
              alt="núi"
              className="pointer-events-none absolute bottom-0 left-[0%] z-10 h-auto w-48 md:w-44 xl:w-auto"
            />

            <img
              src="/nui-2.png"
              alt="núi"
              className="pointer-events-none absolute bottom-0 right-0 z-10 h-auto w-40 md:w-36 xl:w-auto"
            />

            <img
              src="/sun.png"
              alt="núi"
              className="pointer-events-none absolute bottom-[8%] right-0 z-8 h-auto w-28 md:block lg:w-36 xl:w-auto"
            />

            <img
              src="/cloud-4.png"
              alt="núi"
              className="pointer-events-none absolute bottom-[15%] left-[13%] z-10 h-auto w-10 md:block lg:w-14 xl:w-auto opacity-50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
