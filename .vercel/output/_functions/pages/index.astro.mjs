/* empty css                                  */
import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead, d as addAttribute } from '../chunks/astro/server_BfYNV1Pw.mjs';
import 'piccolore';
import { g as getCollection, $ as $$BaseLayout } from '../chunks/BaseLayout_EzYfQB7E.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const CATEGORIES = ["HFNY", "Kinship", "OCFS", "PICHC"];
  const allDocs = await getCollection("docs");
  const byCategory = (cat) => allDocs.filter((d) => {
    const cats = d.data.categories ?? [];
    return Array.isArray(cats) ? cats.some((c) => String(c) === cat) : String(cats) === cat;
  }).length;
  const categorySlug = (cat) => cat.toLowerCase();
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "CHSR Docs", "showNav": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-4xl"> <header class="mb-10"> <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">CHSR Docs</h1> <p class="mt-2 text-slate-600 dark:text-slate-400">
Pick a category to see its docs, or <a href="/docs" class="text-slate-800 underline dark:text-slate-200">view all docs</a>.
</p> </header> <div class="grid gap-4 sm:grid-cols-2"> ${CATEGORIES.map((cat) => {
    const count = byCategory(cat);
    const slug = categorySlug(cat);
    return renderTemplate`<a${addAttribute(`/docs/category/${slug}`, "href")} class="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-slate-500 dark:hover:bg-slate-700/50"> <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">${cat}</h2> <p class="mt-1 text-sm text-slate-500 dark:text-slate-400"> ${count} ${count === 1 ? "doc" : "docs"} </p> <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
View all ${cat} documentation →
</p> </a>`;
  })} </div> <p class="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
New here? Read the <a href="/docs/welcome" class="underline">Welcome</a> and
<a href="/docs/how-to-add-a-doc" class="underline">How to add a doc</a>.
</p> </div> ` })}`;
}, "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/index.astro", void 0);

const $$file = "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
