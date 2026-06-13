// Live MCP smoke test — boots server.js over stdio and exercises it as a real client.
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const transport = new StdioClientTransport({ command: 'node', args: [join(here, 'server.js')] });
const client = new Client({ name: 'smoke', version: '1.0.0' });
await client.connect(transport);

const tools = await client.listTools();
console.log('TOOLS:', tools.tools.map((t) => t.name).join(', '));
console.log('has outputSchema on search:', !!tools.tools.find((t) => t.name === 'search_components').outputSchema);
console.log('readOnly annotation:', tools.tools.find((t) => t.name === 'search_components').annotations?.readOnlyHint);

const s = await client.callTool({ name: 'search_components', arguments: { query: 'streaming chat token by token', limit: 3 } });
console.log('\nSEARCH structuredContent.count:', s.structuredContent.count);
console.log('top result:', s.structuredContent.results[0].path, '| score', s.structuredContent.results[0].score, '| demo', s.structuredContent.results[0].demoUrl);

const b = await client.callTool({ name: 'get_snippet', arguments: { path: 'ai/streaming-text.js' } });
const bt = b.content[0].text;
console.log('\nGET_SNIPPET includes companion css:', bt.includes('ai/streaming-text.css'));
console.log('GET_SNIPPET includes both code fences:', (bt.match(/```/g) || []).length >= 4);

const rel = await client.callTool({ name: 'get_related', arguments: { path: 'components/modals.css' } });
console.log('\nGET_RELATED companions+related counts:', rel.structuredContent.companions.length, '/', rel.structuredContent.related.length);

const skills = await client.callTool({ name: 'list_skills', arguments: {} });
console.log('\nSKILLS:', skills.structuredContent.skills.slice(0, 6).map((s) => s.name).join(', '), '…');

const ov = await client.callTool({ name: 'overview', arguments: {} });
const o = ov.structuredContent;
console.log('\nOVERVIEW:', `${o.snippets} snippets · ${o.folders} folders · ${o.skillDocs} skills · ${o.guides} guides · ${o.packages} pkg-docs · ${o.palettes} palettes`);

const docList = await client.callTool({ name: 'list_docs', arguments: { kind: 'guide' } });
console.log('GUIDES:', docList.structuredContent.docs.map((d) => d.name).join(', '));

const pkg = await client.callTool({ name: 'get_doc', arguments: { name: 'blender-shader-nodes' } });
console.log('GET_DOC(blender-shader-nodes) resolved:', pkg.content[0].text.slice(0, 60).replace(/\n/g, ' '));

const pals = await client.callTool({ name: 'list_palettes', arguments: { query: 'finance' } });
console.log('\nPALETTES(finance):', pals.structuredContent.palettes.map((p) => p.name).join(', '));
const pal = await client.callTool({ name: 'get_palette', arguments: { name: 'pal-midnight' } });
console.log('GET_PALETTE(midnight) accent token:', pal.structuredContent.tokens.accent, '| mode', pal.structuredContent.mode);

const res = await client.listResources();
const tmpls = await client.listResourceTemplates();
console.log('\nRESOURCES:', res.resources.map((r) => r.uri).join(', '));
console.log('TEMPLATES:', tmpls.resourceTemplates.map((r) => r.uriTemplate).join(', '));

const prompts = await client.listPrompts();
console.log('PROMPTS:', prompts.prompts.map((p) => p.name).join(', '));

await client.close();
console.log('\nSMOKE OK');
