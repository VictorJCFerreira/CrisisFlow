// Realistic mock data for CrisisFlow / SOS Coord
// Event: Bacia do Rio Capibaribe enchente (Recife/PE region)

const PRIORITIES = {
  P1: { label: 'P1', name: 'Emergência',   color: 'var(--p1)', bg: 'var(--p1-bg)', desc: 'Ação imediata' },
  P2: { label: 'P2', name: 'Urgente',      color: 'var(--p2)', bg: 'var(--p2-bg)', desc: 'Atenção próxima' },
  P3: { label: 'P3', name: 'Pouco urgente',color: 'var(--p3)', bg: 'var(--p3-bg)', desc: 'Atenção intermediária' },
  P4: { label: 'P4', name: 'Não urgente',  color: 'var(--p4)', bg: 'var(--p4-bg)', desc: 'Padrão / ok' },
  P5: { label: 'P5', name: 'Rotina',       color: 'var(--p5)', bg: 'var(--p5-bg)', desc: 'Em andamento' },
};

const SPECIALTIES = ['Saúde', 'Logística', 'Resgate', 'Psicologia', 'Cadastro', 'Limpeza'];

const INITIAL_CASES = [
  {
    id: 'C-204', priority: 'P1', status: 'aberto',
    title: 'Família desalojada — telhado parcial',
    location: 'Ala B · Abrigo Várzea',
    people: 6, needs: ['Atend. médico', 'Cobertores', 'Alimentação'],
    team: [], openedMin: 12, note: 'Idoso com hipertensão sem medicação há 18h.'
  },
  {
    id: 'C-198', priority: 'P1', status: 'aberto',
    title: 'Resgate em telhado — Rua Coqueiral',
    location: 'Ponto de resgate · Coqueiral 4',
    people: 3, needs: ['Resgate aquático', 'Avaliação clínica'],
    team: [], openedMin: 8, note: 'Nível d\u2019água subindo. Bote a caminho.'
  },
  {
    id: 'C-191', priority: 'P2', status: 'aberto',
    title: 'Gestante 32sem — encaminhamento',
    location: 'Ala A · Abrigo São José',
    people: 1, needs: ['Transporte', 'Acompanhante'],
    team: ['V-12'], openedMin: 26
  },
  {
    id: 'C-187', priority: 'P2', status: 'aberto',
    title: 'Distribuição de água — Ala B',
    location: 'Ala B · Abrigo Várzea',
    people: 84, needs: ['Logística', 'Distribuição'],
    team: ['V-09'], openedMin: 41
  },
  {
    id: 'C-176', priority: 'P3', status: 'aberto',
    title: 'Cadastro de novos abrigados',
    location: 'Recepção · Abrigo Casa Forte',
    people: 22, needs: ['Cadastro', 'Triagem documental'],
    team: ['V-03', 'V-07'], openedMin: 64
  },
  {
    id: 'C-170', priority: 'P3', status: 'aberto',
    title: 'Apoio psicológico — grupo familiar',
    location: 'Sala 2 · Abrigo São José',
    people: 9, needs: ['Psicologia'],
    team: [], openedMin: 78
  },
  {
    id: 'C-162', priority: 'P4', status: 'aberto',
    title: 'Limpeza pós-chegada — Ala C',
    location: 'Ala C · Abrigo Várzea',
    people: 0, needs: ['Limpeza'],
    team: ['V-15'], openedMin: 110
  },
  {
    id: 'C-155', priority: 'P5', status: 'em-rota',
    title: 'Comboio doações Bairro Imbiribeira',
    location: 'Em rota · ETA 22min',
    people: 0, needs: ['Logística'],
    team: ['V-21', 'V-22'], openedMin: 145
  },
];

const INITIAL_VOLUNTEERS = [
  { id: 'V-01', name: 'Ana Ribeiro',     specialty: 'Saúde',      status: 'disponível', hoursShift: 4 },
  { id: 'V-02', name: 'Carlos Mendes',   specialty: 'Resgate',    status: 'disponível', hoursShift: 2 },
  { id: 'V-03', name: 'Beatriz Lima',    specialty: 'Cadastro',   status: 'em-missão',  hoursShift: 6, caseId: 'C-176' },
  { id: 'V-04', name: 'Diego Souza',     specialty: 'Logística',  status: 'descanso',   hoursShift: 11, restUntil: '23:10' },
  { id: 'V-05', name: 'Elaine Costa',    specialty: 'Psicologia', status: 'disponível', hoursShift: 3 },
  { id: 'V-06', name: 'Felipe Andrade',  specialty: 'Saúde',      status: 'disponível', hoursShift: 5 },
  { id: 'V-07', name: 'Gabriela Nunes',  specialty: 'Cadastro',   status: 'em-missão',  hoursShift: 7, caseId: 'C-176' },
  { id: 'V-08', name: 'Henrique Paiva',  specialty: 'Limpeza',    status: 'disponível', hoursShift: 2 },
  { id: 'V-09', name: 'Isabela Rocha',   specialty: 'Logística',  status: 'em-missão',  hoursShift: 8, caseId: 'C-187' },
  { id: 'V-10', name: 'João Pereira',    specialty: 'Resgate',    status: 'descanso',   hoursShift: 10, restUntil: '22:40' },
  { id: 'V-11', name: 'Karina Duarte',   specialty: 'Saúde',      status: 'disponível', hoursShift: 1 },
  { id: 'V-12', name: 'Lucas Vieira',    specialty: 'Logística',  status: 'em-missão',  hoursShift: 5, caseId: 'C-191' },
  { id: 'V-13', name: 'Marina Tavares',  specialty: 'Psicologia', status: 'disponível', hoursShift: 4 },
  { id: 'V-14', name: 'Nélson Bastos',   specialty: 'Resgate',    status: 'disponível', hoursShift: 3 },
  { id: 'V-15', name: 'Olívia Freitas',  specialty: 'Limpeza',    status: 'em-missão',  hoursShift: 6, caseId: 'C-162' },
  { id: 'V-16', name: 'Pedro Carvalho',  specialty: 'Cadastro',   status: 'disponível', hoursShift: 2 },
  { id: 'V-17', name: 'Renata Aguiar',   specialty: 'Saúde',      status: 'descanso',   hoursShift: 12, restUntil: '23:55' },
  { id: 'V-21', name: 'Tiago Moreira',   specialty: 'Logística',  status: 'em-missão',  hoursShift: 4, caseId: 'C-155' },
  { id: 'V-22', name: 'Vivian Pacheco',  specialty: 'Logística',  status: 'em-missão',  hoursShift: 4, caseId: 'C-155' },
];

const INITIAL_SUPPLIES = [
  { id: 'S-01', name: 'Água potável (L)',     shelter: 'Abrigo Várzea',    ward: 'Ala B', current: 180,  min: 1200, max: 1200, unit: 'L', critical: true },
  { id: 'S-02', name: 'Cestas básicas',       shelter: 'Abrigo Várzea',    ward: 'Ala B', current: 22,   min: 80,   max: 80,   unit: 'un' },
  { id: 'S-03', name: 'Cobertores',           shelter: 'Abrigo Várzea',    ward: 'Ala A', current: 56,   min: 100,  max: 140,  unit: 'un' },
  { id: 'S-04', name: 'Fraldas geriátricas',  shelter: 'Abrigo São José',  ward: 'Ala A', current: 30,   min: 50,   max: 120,  unit: 'pct' },
  { id: 'S-05', name: 'Leite em pó',          shelter: 'Abrigo São José',  ward: 'Ala B', current: 41,   min: 40,   max: 60,   unit: 'kg' },
  { id: 'S-06', name: 'Kits higiene',         shelter: 'Abrigo Casa Forte',ward: 'Geral', current: 96,   min: 80,   max: 120,  unit: 'un' },
  { id: 'S-07', name: 'Medicamentos básicos', shelter: 'Abrigo São José',  ward: 'Enf.',  current: 18,   min: 60,   max: 80,   unit: 'cx', critical: true },
  { id: 'S-08', name: 'Roupas adulto',        shelter: 'Abrigo Casa Forte',ward: 'Geral', current: 210,  min: 120,  max: 220,  unit: 'pç' },
  { id: 'S-09', name: 'Roupas infantis',      shelter: 'Abrigo Várzea',    ward: 'Ala C', current: 64,   min: 80,   max: 120,  unit: 'pç' },
  { id: 'S-10', name: 'Kits higiene',         shelter: 'Abrigo Boa Viagem',ward: 'Ala A', current: 75,   min: 60,   max: 100,  unit: 'un' },
  { id: 'S-11', name: 'Água potável (L)',     shelter: 'Abrigo Boa Viagem',ward: 'Geral', current: 900,  min: 800,  max: 1000, unit: 'L' },
];

const INITIAL_SHELTERS = [
  { id: 'SH-1', name: 'Abrigo Várzea',     capacity: 320, occupied: 286, water: 'crítico', power: 'ok', infirmary: 'ok',
    issues: ['Ala B: água potável < 15%', 'Falta gerador reserva', '3 famílias aguardando triagem'] },
  { id: 'SH-2', name: 'Abrigo São José',   capacity: 240, occupied: 198, water: 'ok',      power: 'ok', infirmary: 'alerta',
    issues: ['Medicamentos básicos abaixo do mínimo', 'Necessita enfermeiro 24h'] },
  { id: 'SH-3', name: 'Abrigo Casa Forte', capacity: 180, occupied: 142, water: 'ok',      power: 'ok', infirmary: 'ok',
    issues: ['Aguardando 22 cadastros pendentes'] },
  { id: 'SH-4', name: 'Abrigo Boa Viagem', capacity: 200, occupied: 92,  water: 'ok',      power: 'alerta', infirmary: 'ok',
    issues: ['Oscilação elétrica 18h–20h'] },
];

const INITIAL_TRUCKS = [
  { id: 'T-A', label: 'Comboio A — Água', origin: 'Depósito Central', dest: 'Abrigo Várzea',  progress: 72, etaMin: 12 },
  { id: 'T-B', label: 'Comboio B — Cestas', origin: 'CRAS Imbiribeira', dest: 'Abrigo São José', progress: 35, etaMin: 28 },
  { id: 'T-C', label: 'Comboio C — Medic.', origin: 'Farmácia Pop',  dest: 'Abrigo São José', progress: 10, etaMin: 44 },
];

const RISK_AREAS = [
  { id: 'R-1', name: 'Encosta — Alto do Pascoal', level: 'P1', people: 124, note: 'Deslizamento iminente' },
  { id: 'R-2', name: 'Margem — Capibaribe km 7', level: 'P2', people: 380, note: 'Nível +1,8m em 6h' },
  { id: 'R-3', name: 'Bairro — Imbiribeira sul',  level: 'P2', people: 510, note: 'Drenagem comprometida' },
  { id: 'R-4', name: 'Margem — Tejipió',          level: 'P3', people: 220, note: 'Monitoramento contínuo' },
];

const DONATION_POINTS = [
  { id: 'D-1', name: 'Ponto Boa Vista',     address: 'R. da União, 240',     itemsToday: 412, status: 'aberto' },
  { id: 'D-2', name: 'Ponto Casa Amarela',  address: 'Av. Norte, 1180',      itemsToday: 287, status: 'aberto' },
  { id: 'D-3', name: 'Ponto Pina',          address: 'R. das Graças, 88',    itemsToday: 96,  status: 'fechado' },
  { id: 'D-4', name: 'Ponto Várzea',        address: 'R. Acadêmico Hélio, 12', itemsToday: 521, status: 'aberto' },
];

const ITEM_AUTOCOMPLETE = [
  'Água potável (L)', 'Cestas básicas', 'Cobertores', 'Fraldas geriátricas',
  'Leite em pó', 'Kits higiene', 'Medicamentos básicos', 'Roupas adulto',
  'Roupas infantis', 'Lonas plásticas', 'Velas', 'Fósforos', 'Lanterna',
  'Sabonete', 'Escova de dente', 'Absorventes', 'Papel higiênico',
  'Outro',
];

window.CFData = {
  PRIORITIES, SPECIALTIES,
  INITIAL_CASES, INITIAL_VOLUNTEERS, INITIAL_SUPPLIES,
  INITIAL_SHELTERS, INITIAL_TRUCKS, RISK_AREAS, DONATION_POINTS,
  ITEM_AUTOCOMPLETE,
};
