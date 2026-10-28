import http from 'node:http';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const path = '/data/visits.json';
mkdirSync('/data', { recursive: true });
let visits = 0;
try { const parsed = JSON.parse(readFileSync(path, 'utf8')); if (Number.isSafeInteger(parsed.visits) && parsed.visits >= 0) visits = parsed.visits; }
catch { /* first boot: start at zero */ }
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (req.url === '/health') { res.end(JSON.stringify({ status: 'ok' })); return; }
  if (req.url !== '/') { res.writeHead(404); res.end(JSON.stringify({ error: 'not-found' })); return; }
  visits += 1;
  try { writeFileSync(path, JSON.stringify({ visits }), 'utf8'); }
  catch (error) { console.error('Failed to persist visit counter:', error); res.writeHead(500); res.end(JSON.stringify({error:'storage-unavailable'})); return; }
  res.end(JSON.stringify({ application: 'Ops Atlas Compose Lab', visits, explanation: 'State survives container recreation because /data is a named volume' }));
});
server.listen(3000, '0.0.0.0', () => console.log('Training app listening on 3000'));
