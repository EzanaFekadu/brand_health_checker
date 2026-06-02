export const T = {
  canvas: '#f7f6f2',
  paper: '#ffffff',
  paperWarm: '#fcfbf6',
  ink: '#211f18',
  ink2: '#54503f',
  muted: '#8c8674',
  line: '#e7e3da',
  lineSoft: '#efece4',
  green: '#2f7d4f',
  greenDeep: '#245f3d',
  greenTint: '#e7f0ea',
  amber: '#cf9622',
  amberDeep: '#9a6c12',
  amberTint: '#f6ecd6',
  clay: '#cf5340',
  clayDeep: '#9a3527',
  clayTint: '#f6e2dc',
  cream: '#f4efe2',
  ui: "'Hanken Grotesk', sans-serif",
  display: "'Bricolage Grotesque', sans-serif",
}

export const bandColor = (s) => s >= 70 ? T.green : s >= 45 ? T.amber : T.clay
export const bandDeep  = (s) => s >= 70 ? T.greenDeep : s >= 45 ? T.amberDeep : T.clayDeep
export const bandTint  = (s) => s >= 70 ? T.greenTint : s >= 45 ? T.amberTint : T.clayTint
export const bandWord  = (s) => s >= 80 ? 'GOOD' : s >= 70 ? 'OK' : s >= 45 ? 'FAIR' : 'POOR'
export const gradeLetter = (s) => s >= 80 ? 'A' : s >= 70 ? 'B' : s >= 55 ? 'C' : s >= 40 ? 'D' : 'E'
export const flag = (r) => r === 'US' ? '🇺🇸' : r === 'EU' ? '🇪🇺' : '🏳️'
