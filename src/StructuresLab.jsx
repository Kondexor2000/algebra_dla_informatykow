import React, { useMemo, useState } from 'react';
import { ArrowRight, Binary, Code2, RotateCw, Shuffle } from 'lucide-react';
import './structures.css';

const FIELDS = {
  4: { polynomial: 0b10011, label: 'GF(2⁴)', polynomialLabel: 'x⁴ + x + 1' },
  8: { polynomial: 0x11b, label: 'GF(2⁸)', polynomialLabel: 'x⁸ + x⁴ + x³ + x + 1' },
};

function gfMultiply(a, b, degree, polynomial) {
  let result = 0;
  const highBit = 1 << degree;
  while (b > 0) {
    if (b & 1) result ^= a;
    b >>= 1;
    a <<= 1;
    if (a & highBit) a ^= polynomial;
  }
  return result;
}

function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }
function lcm(a, b) { return (a * b) / gcd(a, b); }

function analyzePermutation(permutation) {
  const seen = new Set();
  const cycles = [];
  for (let start = 0; start < permutation.length; start++) {
    if (seen.has(start)) continue;
    const cycle = [];
    let current = start;
    while (!seen.has(current)) {
      seen.add(current);
      cycle.push(current);
      current = permutation[current];
    }
    if (cycle.length > 1) cycles.push(cycle);
  }
  const order = cycles.reduce((value, cycle) => lcm(value, cycle.length), 1);
  let inversions = 0;
  for (let i = 0; i < permutation.length; i++)
    for (let j = i + 1; j < permutation.length; j++)
      if (permutation[i] > permutation[j]) inversions++;
  return { cycles, order, parity: inversions % 2 === 0 ? 'parzysta' : 'nieparzysta' };
}

function parsePermutation(value) {
  const values = value.split(',').map((part) => Number(part.trim()));
  if (values.length < 2 || values.some((item) => !Number.isInteger(item))) return null;
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.some((item, index) => item !== index)) return null;
  return values;
}

export default function StructuresLab() {
  const [degree, setDegree] = useState(4);
  const [gfA, setGfA] = useState('7');
  const [gfB, setGfB] = useState('B');
  const [gfOperation, setGfOperation] = useState('×');
  const [permutationInput, setPermutationInput] = useState('1, 2, 0, 3');
  const field = FIELDS[degree];
  const mask = (1 << degree) - 1;
  const a = Number.parseInt(gfA, 16);
  const b = Number.parseInt(gfB, 16);
  const validFieldInputs = Number.isInteger(a) && Number.isInteger(b) && a >= 0 && a <= mask && b >= 0 && b <= mask;
  const gfResult = validFieldInputs ? (gfOperation === '+' ? a ^ b : gfMultiply(a, b, degree, field.polynomial)) : null;
  const permutation = useMemo(() => parsePermutation(permutationInput), [permutationInput]);
  const permutationInfo = permutation ? analyzePermutation(permutation) : null;

  return <section className="structures-section" id="implementacje">
    <div className="section-head structures-head">
      <div><div className="eyebrow">TRZY PROJEKTY. KONKRETNE IMPLEMENTACJE <span className="short-rule"/></div><h2>Od aksjomatu<br/>do działającego kodu.</h2></div>
      <p>Te przykłady realizują trzy zastosowania: modelowanie struktur przez typy, rachunki w ciele Galois oraz analizę elementów grupy symetrycznej.</p>
    </div>
    <article className="types-card">
      <div className="types-intro"><span className="concept-icon lavender"><Code2 size={19}/></span><span className="concept-index">PROJEKT 01 / TYPY I AKSJOMATY</span><h3>Struktury zapisane w typach.</h3><p>Traity opisują wymagane operacje i relacje między strukturami. Implementacje dostarczają działania dla konkretnych obiektów, np. liczb modulo n.</p><div className="type-pills"><span>Monoid</span><ArrowRight size={13}/><span>Group</span><ArrowRight size={13}/><span>Ring</span><ArrowRight size={13}/><span>Field</span></div></div>
      <div className="type-code"><div className="code-top"><div className="window-dots"><i/><i/><i/></div><span>algebra.rs</span><span className="rust-tag">RUST · SZKIC API</span></div><pre><code><span className="code-purple">trait</span> <span className="code-teal">Monoid</span>: <span className="code-teal">Sized</span> {'{'}<br/>  <span className="code-blue">fn</span> <span className="code-yellow">op</span>(&amp;<span className="code-blue">self</span>, rhs: &amp;<span className="code-teal">Self</span>) -&gt; <span className="code-teal">Self</span>;<br/>  <span className="code-blue">fn</span> <span className="code-yellow">identity</span>() -&gt; <span className="code-teal">Self</span>;<br/>{'}'}<br/><span className="code-purple">trait</span> <span className="code-teal">Group</span>: <span className="code-teal">Monoid</span> {'{'} <span className="code-blue">fn</span> <span className="code-yellow">inverse</span>(&amp;<span className="code-blue">self</span>) -&gt; <span className="code-teal">Self</span>; {'}'}<br/><span className="code-purple">trait</span> <span className="code-teal">Ring</span>: <span className="code-teal">AdditiveGroup</span> + <span className="code-teal">MultiplicationMonoid</span> {'{}'}<br/><span className="code-purple">trait</span> <span className="code-teal">Field</span>: <span className="code-teal">Ring</span> + <span className="code-teal">NonZeroMultiplicativeGroup</span> {'{}'}<br/><br/><span className="code-comment">// Implementacje: Z/nZ, permutacje, macierze.</span></code></pre></div>
    </article>

    <div className="demo-grid">
      <article className="demo-card gf-card">
        <div className="demo-title"><span className="demo-icon"><Binary size={18}/></span><div><span className="concept-index">PROJEKT 02 / CIAŁA GALOIS</span><h3>Mnożenie w GF(2<sup>m</sup>)</h3></div></div>
        <p className="demo-description">Elementy to wielomiany nad GF(2), zapisane jako liczby binarne. Mnożenie redukujemy przez wielomian nierozkładalny.</p>
        <div className="gf-controls"><label>ciało<select value={degree} onChange={(event) => setDegree(Number(event.target.value))}><option value={4}>GF(2⁴)</option><option value={8}>GF(2⁸) · AES</option></select></label><label>a (hex)<input value={gfA} maxLength={2} onChange={(event) => setGfA(event.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}/></label><button className="gf-op" onClick={() => setGfOperation(gfOperation === '+' ? '×' : '+')} aria-label="Zmień działanie">{gfOperation}</button><label>b (hex)<input value={gfB} maxLength={2} onChange={(event) => setGfB(event.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}/></label></div>
        <div className="gf-result"><span>{field.label} · modulo {field.polynomialLabel}</span><strong>{gfResult === null ? '—' : `0x${gfResult.toString(16).toUpperCase().padStart(2, '0')}`}</strong>{!validFieldInputs && <small>Wartość musi być elementem wybranego ciała.</small>}</div>
        <div className="demo-foot">Przykład AES: w GF(2⁸), 0x57 × 0x83 = 0xC1.</div>
      </article>

      <article className="demo-card permutation-card">
        <div className="demo-title"><span className="demo-icon mint-icon"><Shuffle size={18}/></span><div><span className="concept-index">PROJEKT 03 / GRUPA SYMETRYCZNA</span><h3>Analizator permutacji</h3></div></div>
        <p className="demo-description">Wpisz obrazy elementów 0, 1, …, n−1. Na przykład „1, 2, 0” oznacza 0↦1, 1↦2, 2↦0.</p>
        <label className="permutation-label">PERMUTACJA <input value={permutationInput} onChange={(event) => setPermutationInput(event.target.value)} aria-invalid={!permutation}/></label>
        {permutationInfo ? <div className="permutation-results"><div><span>ROZKŁAD NA CYKLE</span><strong>{permutationInfo.cycles.length ? permutationInfo.cycles.map((cycle) => `(${cycle.join(' ')})`).join(' ') : 'identyczność'}</strong></div><div><span>RZĄD ELEMENTU</span><strong><RotateCw size={14}/> {permutationInfo.order}</strong></div><div><span>PARZYSTOŚĆ</span><strong>{permutationInfo.parity}</strong></div></div> : <div className="permutation-error">Podaj permutację, czyli każdy numer od 0 do n−1 dokładnie raz.</div>}
        <div className="demo-foot">Rząd permutacji to NWW długości jej rozłącznych cykli.</div>
      </article>
    </div>
  </section>;
}
