export const PACKAGES = [
  { id: "warm", label: "Тёплый контур", price: 65000, hint: "Фундамент, стены, кровля, окна, входная дверь" },
  { id: "prefinish", label: "Предчистовая", price: 85000, hint: "+ инженерные системы, штукатурка, стяжка" },
  { id: "turnkey", label: "Под ключ", price: 110000, hint: "+ чистовая отделка, сантехника, свет" },
] as const;

export const MATERIALS = [
  { id: "gasblock", label: "Газобетон", k: 1 },
  { id: "brick", label: "Кирпич", k: 1.14 },
  { id: "frame", label: "Каркас", k: 0.9 },
  { id: "timber", label: "Клеёный брус", k: 1.1 },
  { id: "monolith", label: "Монолит", k: 1.2 },
] as const;

export const FLOOR_K: Record<number, number> = { 1: 1, 2: 1.05, 3: 1.11 };

export const EXTRAS = [
  { id: "architecture", label: "Архитектурный проект", price: "от 2 500 ₽/м²" },
  { id: "design", label: "Дизайн интерьера", price: "от 3 000 ₽/м²" },
  { id: "landscape", label: "Ландшафтный проект", price: "от 150 000 ₽" },
  { id: "lawn", label: "Газон", price: "от 800 ₽/м²" },
  { id: "trees", label: "Озеленение и деревья", price: "по параметрам" },
  { id: "lighting", label: "Освещение участка", price: "от 180 000 ₽" },
  { id: "terrace", label: "Терраса", price: "от 18 500 ₽/м²" },
  { id: "gazebo", label: "Беседка", price: "от 420 000 ₽" },
  { id: "own-project", label: "У меня есть свой проект", price: "−3 %" },
  { id: "own-designer", label: "Работаю со своим дизайнером", price: "без наценки" },
] as const;

export type CalculatorInput = {
  area: number;
  floors: number;
  material: (typeof MATERIALS)[number]["id"];
  pack: (typeof PACKAGES)[number]["id"];
  extras: string[];
  lawnArea: number;
  treeCount: number;
  terraceArea: number;
};

export type CalculatorResult = {
  total: number;
  lines: { label: string; amount: number }[];
  input: CalculatorInput & { materialLabel: string; packLabel: string };
};

export function defaultCalculator(): CalculatorInput {
  return {
    area: 180,
    floors: 2,
    material: "gasblock",
    pack: "turnkey",
    extras: [],
    lawnArea: 300,
    treeCount: 6,
    terraceArea: 30,
  };
}

export function calculate(input: CalculatorInput): CalculatorResult {
  const pack = PACKAGES.find((p) => p.id === input.pack) ?? PACKAGES[2];
  const material = MATERIALS.find((m) => m.id === input.material) ?? MATERIALS[0];
  const floorK = FLOOR_K[input.floors] ?? 1;
  const area = Math.max(0, Number(input.area) || 0);
  const lines: { label: string; amount: number }[] = [];

  const construction = Math.round(area * pack.price * material.k * floorK);
  lines.push({ label: `${pack.label} · ${material.label} · ${input.floors} эт.`, amount: construction });
  let total = construction;
  const ex = new Set(input.extras);

  const add = (label: string, amount: number) => {
    lines.push({ label, amount });
    total += amount;
  };

  if (ex.has("architecture")) add("Архитектурный проект", Math.round(area * 2500));
  if (ex.has("design")) add("Дизайн интерьера", Math.round(area * 3000));
  if (ex.has("landscape")) add("Ландшафтный проект", 150000);
  if (ex.has("lawn")) {
    const lawn = Math.max(0, Number(input.lawnArea) || 0);
    add(`Газон · ${lawn} м²`, Math.round(lawn * 800));
  }
  if (ex.has("trees")) {
    const n = Math.max(0, Number(input.treeCount) || 0);
    add(`Озеленение · ${n} крупномер${n === 1 ? "" : n < 5 ? "а" : "ов"}`, n * 28000);
  }
  if (ex.has("lighting")) add("Освещение участка", 180000);
  if (ex.has("terrace")) {
    const t = Math.max(0, Number(input.terraceArea) || 0);
    add(`Терраса · ${t} м²`, Math.round(t * 18500));
  }
  if (ex.has("gazebo")) add("Беседка", 420000);
  if (ex.has("own-project")) {
    const discount = Math.round(total * 0.03);
    add("Скидка за готовый проект", -discount);
  }
  if (ex.has("own-designer")) lines.push({ label: "Свой дизайнер — без наценки", amount: 0 });

  return {
    total: Math.max(0, total),
    lines,
    input: { ...input, materialLabel: material.label, packLabel: pack.label },
  };
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(n) + " ₽";
}
