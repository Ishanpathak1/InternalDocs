/**
 * Rehype plugin: wrap code blocks in collapsible <details> panels.
 * Skips mermaid diagrams (pre.mermaid). Uses language from code block for summary label.
 */
import { visit } from 'unist-util-visit';

export default function rehypeCollapsibleCode() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'pre' || !parent || index === undefined) return;
      const code = node.children?.[0];
      if (!code || code.type !== 'element' || code.tagName !== 'code') return;

      const classes = code.properties?.className || [];
      const classList = Array.isArray(classes) ? classes : [classes];
      if (classList.some((c) => String(c).toLowerCase().includes('mermaid'))) return;

      const langClass = classList.find((c) => typeof c === 'string' && c.startsWith('language-'));
      const lang = langClass ? String(langClass).replace(/^language-/, '') : '';
      const label = lang ? `View ${lang} code` : 'View code';

      const summaryNode = {
        type: 'element',
        tagName: 'summary',
        properties: { className: ['doc-code-summary'] },
        children: [{ type: 'text', value: label }],
      };

      const detailsNode = {
        type: 'element',
        tagName: 'details',
        properties: { className: ['doc-code-details'] },
        children: [summaryNode, node],
      };

      parent.children[index] = detailsNode;
    });
  };
}
