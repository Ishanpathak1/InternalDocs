/* empty css                                        */
import { c as createComponent, r as renderComponent, a as renderTemplate, b as createAstro, m as maybeRenderHead, d as addAttribute } from '../../../chunks/astro/server_BfYNV1Pw.mjs';
import 'piccolore';
import { g as getCollection, $ as $$BaseLayout } from '../../../chunks/BaseLayout_EzYfQB7E.mjs';
export { renderers } from '../../../renderers.mjs';

const $$Astro = createAstro();
const $$category = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$category;
  const categorySlug = Astro2.params.category?.toLowerCase();
  const categoryMap = {
    hfny: "HFNY",
    kinship: "Kinship",
    ocfs: "OCFS",
    pichc: "PICHC"
  };
  const category = categorySlug ? categoryMap[categorySlug] : null;
  if (!category) {
    return Astro2.redirect("/");
  }
  const allDocs = await getCollection("docs");
  const docs = allDocs.filter((d) => {
    const cats = d.data.categories ?? [];
    return Array.isArray(cats) ? cats.some((c) => String(c) === category) : String(cats) === category;
  }).sort((a, b) => (b.data.pubDate?.valueOf() ?? 0) - (a.data.pubDate?.valueOf() ?? 0));
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": `${category} \u2013 CHSR Docs` }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="mx-auto max-w-4xl"> <nav class="mb-6 text-sm text-slate-600 dark:text-slate-400"> <a href="/" class="hover:text-slate-900 dark:hover:text-slate-200">Home</a> <span class="mx-1">/</span> <span class="text-slate-900 dark:text-slate-200">${category}</span> </nav> <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-100">${category}</h1> <p class="mt-2 text-slate-600 dark:text-slate-400">
All docs in this category. Code locations are in each doc’s frontmatter (<code class="rounded bg-slate-100 px-1 dark:bg-slate-700">codeLocation</code>).
</p> <ul class="mt-8 space-y-3"> ${docs.map((doc) => renderTemplate`<li> <a${addAttribute(`/docs/${doc.id}`, "href")} class="block rounded-xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700/50 dark:hover:border-slate-500"> <span class="font-medium">${doc.data.title}</span> ${doc.data.author && renderTemplate`<span class="ml-2 text-slate-500 dark:text-slate-400">by ${doc.data.author}</span>`} ${doc.data.description && renderTemplate`<span class="mt-1 block text-sm text-slate-600 dark:text-slate-400"> ${doc.data.description} </span>`} </a> </li>`)} </ul> ${docs.length === 0 && renderTemplate`<p class="mt-6 text-slate-500 dark:text-slate-400">No docs in this category yet.</p>`} <p class="mt-10"> <a href="/" class="text-slate-600 underline hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
← Back to home
</a> </p> </div> ` })}`;
}, "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/category/[category].astro", void 0);

const $$file = "C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/category/[category].astro";
const $$url = "/docs/category/[category]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$category,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
