import 'piccolore';
import { j as decodeKey } from './chunks/astro/server_BfYNV1Pw.mjs';
import 'clsx';
import './chunks/astro-designed-error-pages_XXOV4434.mjs';
import 'es-module-lexer';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_CWx4uEf_.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///C:/Users/IP282924/Desktop/HFNY%20Documents/","cacheDir":"file:///C:/Users/IP282924/Desktop/HFNY%20Documents/node_modules/.astro/","outDir":"file:///C:/Users/IP282924/Desktop/HFNY%20Documents/dist/","srcDir":"file:///C:/Users/IP282924/Desktop/HFNY%20Documents/src/","publicDir":"file:///C:/Users/IP282924/Desktop/HFNY%20Documents/public/","buildClientDir":"file:///C:/Users/IP282924/Desktop/HFNY%20Documents/dist/client/","buildServerDir":"file:///C:/Users/IP282924/Desktop/HFNY%20Documents/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.Ccnijrvg.css"}],"routeData":{"route":"/docs/category/[category]","isIndex":false,"type":"page","pattern":"^\\/docs\\/category\\/([^/]+?)\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"category","dynamic":false,"spread":false}],[{"content":"category","dynamic":true,"spread":false}]],"params":["category"],"component":"src/pages/docs/category/[category].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.Ccnijrvg.css"}],"routeData":{"route":"/docs","isIndex":true,"type":"page","pattern":"^\\/docs\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/docs/index.astro","pathname":"/docs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.Ccnijrvg.css"},{"type":"inline","content":".doc-prose pre *,.doc-prose pre code,.doc-prose pre span,.doc-prose pre [data-highlighted-line],.doc-prose pre [data-highlighted-chars]{background:transparent!important}html.dark .doc-prose pre{background:#0f172a!important;color:#e2e8f0;border-color:#334155}html:not(.dark) .doc-prose pre{background:#f8fafc!important;color:#334155;border-color:#e2e8f0}html:not(.dark) .doc-prose pre,html:not(.dark) .doc-prose pre code,html:not(.dark) .doc-prose pre span{color:#334155!important;font-family:ui-monospace,Cascadia Code,Source Code Pro,Menlo,Consolas,monospace}.doc-prose table{font-family:\"Source Sans 3\",system-ui,sans-serif;font-size:.9375rem;width:100%;border-collapse:collapse}.doc-prose table th,.doc-prose table td{padding:.6rem .75rem;border-bottom:1px solid #e2e8f0;vertical-align:top;text-align:left}html.dark .doc-prose table th,html.dark .doc-prose table td{border-bottom-color:#475569}.doc-prose table th{font-weight:600;color:#475569}html.dark .doc-prose table th{color:#94a3b8}.doc-prose table td{color:#334155}html.dark .doc-prose table td{color:#cbd5e1}.doc-prose table code{font-family:\"Source Sans 3\",system-ui,sans-serif!important;font-size:inherit!important;font-weight:500;background:#f1f5f9!important;color:#1e293b!important;padding:.15em .4em!important;border-radius:4px;border:none}html.dark .doc-prose table code{background:#334155!important;color:#e2e8f0!important}\n"}],"routeData":{"route":"/docs/[...slug]","isIndex":false,"type":"page","pattern":"^\\/docs(?:\\/(.*?))?\\/?$","segments":[[{"content":"docs","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/docs/[...slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.Ccnijrvg.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/docs/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/category/[category].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/docs/category/[category]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/IP282924/Desktop/HFNY Documents/src/pages/docs/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/docs/index@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/IP282924/Desktop/HFNY Documents/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/docs/category/[category]@_@astro":"pages/docs/category/_category_.astro.mjs","\u0000@astro-page:src/pages/docs/index@_@astro":"pages/docs.astro.mjs","\u0000@astro-page:src/pages/docs/[...slug]@_@astro":"pages/docs/_---slug_.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BweJ1mPg.mjs","C:/Users/IP282924/Desktop/HFNY Documents/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_C-fgg_pa.mjs","C:\\Users\\IP282924\\Desktop\\HFNY Documents\\.astro\\content-assets.mjs":"chunks/content-assets_DleWbedO.mjs","C:\\Users\\IP282924\\Desktop\\HFNY Documents\\.astro\\content-modules.mjs":"chunks/content-modules_Dz-S_Wwv.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_B3YvdsAP.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/_slug_.Ccnijrvg.css","/favicon.svg"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"fda3POuxRWlHcccBlaccoLsy7zAy40EMA8ZwfeJ6tpM="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
