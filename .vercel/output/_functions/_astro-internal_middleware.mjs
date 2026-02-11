import { d as defineMiddleware, s as sequence } from './chunks/index_eudYJDoH.mjs';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_XXOV4434.mjs';
import 'piccolore';
import './chunks/astro/server_BfYNV1Pw.mjs';
import 'clsx';

const onRequest$1 = defineMiddleware(async ({ locals }, next) => {
  locals.user = null;
  return next();
});

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
