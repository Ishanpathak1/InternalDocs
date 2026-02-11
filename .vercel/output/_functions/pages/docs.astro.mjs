/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_BfYNV1Pw.mjs';
import 'piccolore';
import { g as getCollection, $ as $$BaseLayout } from '../chunks/BaseLayout_EzYfQB7E.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const entries = await getCollection("docs");
  const docs = entries.sort((a, b) => {
    const aDate = a.data.pubDate?.valueOf() ?? 0;
    const bDate = b.data.pubDate?.valueOf() ?? 0;
    return bDate - aDate;
  });
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Docs" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-5xl"> <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Documentation</h1> <p class="mt-1 text-slate-600 dark:text-slate-400">All docs. Add or edit .md files in the repo and push to update.</p> <h2 class="mt-8 text-lg font-semibold text-slate-800 dark:text-slate-200">All docs</h2> <ul class="mt-3 space-y-2"> ${docs.map((doc) => renderTemplate`<li> <a${addAttribute(`/docs/${doc.id}`, "href")} class="block rounded border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-500"> <span class="font-medium">${doc.data.title}</span> ${doc.data.author && renderTemplate`<span class="ml-2 text-slate-500 dark:text-slate-400">by ${doc.data.author}</span>`} ${doc.data.description && renderTemplate`<span class="ml-2 text-slate-500 dark:text-slate-400">— ${doc.data.description}</span>`} </a> </li>`)} </ul> ${docs.length === 0 && renderTemplate`<p class="mt-4 text-slate-500 dark:text-slate-400">No docs yet. Add .md files to <code class="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-700">src/content/docs/</code> and push to the repo.</p>`} </div> ` })}`;
}, "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/index.astro", void 0);

const $$file = "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/index.astro";
const $$url = "/docs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
