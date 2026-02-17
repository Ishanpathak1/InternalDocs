/**
 * Simple rehype plugin: convert <pre><code class="language-mermaid"> to <pre class="mermaid">
 * so Mermaid can render diagrams client-side. No Playwright or server-side rendering needed.
 */
import { visit } from 'unist-util-visit';

export default function rehypeMermaidPre() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'pre') return;
      const code = node.children?.[0];
      if (!code || code.type !== 'element' || code.tagName !== 'code') return;
      const classes = code.properties?.className;
      if (!Array.isArray(classes) || !classes.some((c) => String(c).toLowerCase().includes('mermaid')))
        return;

      // Replace pre content with the diagram text; set class="mermaid"
      const textNode = code.children?.[0];
      const diagramText = textNode?.type === 'text' ? textNode.value : '';
      node.properties = node.properties || {};
      node.properties.className = ['mermaid'];
      node.children = [{ type: 'text', value: diagramText }];
    });
  };
}
