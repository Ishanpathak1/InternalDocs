/* empty css                                     */
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead, d as addAttribute, F as Fragment } from '../../chunks/astro/server_BfYNV1Pw.mjs';
import 'piccolore';
import { a as getEntry, g as getCollection, r as renderEntry, $ as $$BaseLayout } from '../../chunks/BaseLayout_EzYfQB7E.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro();
const $$ = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const slug = Astro2.params.slug;
  const id = typeof slug === "string" ? slug : slug ? slug.join("/") : "";
  if (!id) {
    return Astro2.redirect("/docs");
  }
  const entry = await getEntry("docs", id);
  if (!entry) {
    return new Response(null, { status: 404, statusText: "Not Found" });
  }
  const allDocs = await getCollection("docs");
  const moreDocs = allDocs.filter((e) => e.id !== entry.id).sort((a, b) => (b.data.pubDate?.valueOf() ?? 0) - (a.data.pubDate?.valueOf() ?? 0));
  const { Content } = await renderEntry(entry);
  const writtenDate = entry.data.pubDate ? new Date(entry.data.pubDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : null;
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": entry.data.title }, { "default": async ($$result2) => renderTemplate`  ${maybeRenderHead()}<article class="mx-auto max-w-[900px] rounded-2xl bg-white px-6 py-10 shadow-sm transition-colors dark:bg-slate-800 dark:shadow-none sm:px-12 sm:py-14" style="font-family: 'Lora', Georgia, serif;"> <header class="mb-10"> <h1 class="text-[2rem] font-bold leading-tight tracking-tight text-[#1a1a1a] dark:text-slate-100 sm:text-[2.75rem]" style="font-family: 'Source Sans 3', system-ui, sans-serif;"> ${entry.data.title} </h1> ${entry.data.description && renderTemplate`<p class="mt-5 text-[1.25rem] leading-[1.6] text-[#4a4a4a] dark:text-slate-300"> ${entry.data.description} </p>`} <div class="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-[#e8e6e3] pb-6 text-sm text-[#6b6b6b] dark:border-slate-600 dark:text-slate-400" style="font-family: 'Source Sans 3', system-ui, sans-serif;"> ${entry.data.author && renderTemplate`<span class="font-medium text-[#1a1a1a] dark:text-slate-200">${entry.data.author}</span>`} ${entry.data.author && writtenDate && renderTemplate`<span class="text-[#c4c4c4] dark:text-slate-500" aria-hidden="true">·</span>`} ${writtenDate && renderTemplate`<time${addAttribute(entry.data.pubDate?.toISOString(), "datetime")}>${writtenDate}</time>`} ${entry.data.codeLocation && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate` <span class="text-[#c4c4c4] dark:text-slate-500" aria-hidden="true">·</span> <a${addAttribute(entry.data.codeLocation.startsWith("http") ? entry.data.codeLocation : "#", "href")}${addAttribute(entry.data.codeLocation.startsWith("http") ? "_blank" : void 0, "target")}${addAttribute(entry.data.codeLocation.startsWith("http") ? "noopener noreferrer" : void 0, "rel")} class="rounded-md bg-[#f0efec] px-2 py-0.5 text-xs text-[#555] hover:bg-[#e8e6e3] hover:text-[#1a1a1a] dark:bg-slate-600 dark:text-slate-300 dark:hover:bg-slate-500 dark:hover:text-slate-100"> ${entry.data.codeLocation} </a> ` })}`} </div> </header> <div class="doc-prose prose prose-lg max-w-none prose-headings:font-sans prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[#1a1a1a] dark:prose-headings:text-slate-100 prose-p:text-[1.125rem] prose-p:leading-[1.8] prose-p:text-[#292929] dark:prose-p:text-slate-200 prose-a:text-[#1a1a1a] dark:prose-a:text-sky-300 prose-a:underline prose-a:decoration-[#1a1a1a]/30 dark:prose-a:decoration-sky-400/50 prose-a:underline-offset-2 hover:prose-a:decoration-[#1a1a1a] dark:hover:prose-a:decoration-sky-400 prose-strong:text-[#1a1a1a] dark:prose-strong:text-slate-100 prose-code:rounded prose-code:bg-[#f0efec] dark:prose-code:bg-slate-600 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none prose-code:font-mono prose-code:text-[#1a1a1a] dark:prose-code:text-slate-200 prose-pre:!mt-6 prose-pre:!mb-6 prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-200/80 prose-pre:bg-slate-100 prose-pre:px-4 prose-pre:py-4 prose-pre:font-mono prose-pre:text-sm prose-pre:leading-relaxed prose-pre:text-slate-800 dark:prose-pre:border-slate-600 dark:prose-pre:bg-slate-950 dark:prose-pre:text-slate-100 prose-pre_[code]:bg-transparent prose-pre_[code]:p-0 prose-pre_[code]:text-inherit prose-blockquote:border-l-4 prose-blockquote:border-[#1a1a1a]/20 dark:prose-blockquote:border-slate-500 prose-blockquote:bg-[#fafaf9] dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-1 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-[#4a4a4a] dark:prose-blockquote:text-slate-300 prose-li:text-[#292929] dark:prose-li:text-slate-200" style="font-family: 'Lora', Georgia, serif;"> ${renderComponent($$result2, "Content", Content, {})} </div> <footer class="mt-14 border-t border-[#e8e6e3] pt-6 dark:border-slate-600"> <a href="/docs" class="inline-flex items-center gap-2 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] dark:text-slate-400 dark:hover:text-slate-200" style="font-family: 'Source Sans 3', system-ui, sans-serif;"> <span aria-hidden="true">←</span> Back to docs
</a> ${moreDocs.length > 0 && renderTemplate`<div class="mt-8 rounded-xl border border-[#e8e6e3] bg-[#fafaf9] px-5 py-4 dark:border-slate-600 dark:bg-slate-800/50" style="font-family: 'Source Sans 3', system-ui, sans-serif;"> <h2 class="text-sm font-semibold uppercase tracking-wide text-[#6b6b6b] dark:text-slate-400">
More docs
</h2> <ul class="mt-3 flex flex-wrap gap-x-4 gap-y-1"> ${moreDocs.map((doc) => renderTemplate`<li> <a${addAttribute(`/docs/${doc.id}`, "href")} class="text-[#1a1a1a] underline decoration-[#1a1a1a]/30 underline-offset-2 hover:decoration-[#1a1a1a] dark:text-slate-200 dark:decoration-slate-400/50 dark:hover:decoration-slate-300"> ${doc.data.title} </a> </li>`)} </ul> </div>`} </footer> </article> ` })}`;
}, "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/[...slug].astro", void 0);

const $$file = "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/[...slug].astro";
const $$url = "/docs/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
