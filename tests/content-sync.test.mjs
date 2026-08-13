import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const data = await readFile(new URL("../app/cjm-data.ts", import.meta.url), "utf8");
const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

function sliceExport(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);
  assert.ok(startIndex >= 0, `Missing start marker: ${start}`);
  assert.ok(endIndex > startIndex, `Missing end marker: ${end}`);
  return source.slice(startIndex, endIndex);
}

function assertInOrder(source, values) {
  let cursor = -1;
  for (const value of values) {
    const next = source.indexOf(value, cursor + 1);
    assert.ok(next > cursor, `Missing or out of order: ${value}`);
    cursor = next;
  }
}

test("page sections keep the DOCX V3 order and names", () => {
  assertInOrder(page, [
    "01 · Паспорт оффера",
    "02 · Тезисный маршрут акции",
    "03 · Сквозной CJM всех ролей",
    "04 · Не закрытые роли",
    "05 · CJM ключевых ролей",
    "06 · CJ клиента",
    "07 · Операционный слой",
    "08 · Что необходимо решить",
  ]);

  assertInOrder(page, [
    'href="#offer"',
    'href="#decisions"',
    'href="#flow"',
    'href="#gaps"',
    'href="#roles"',
    'href="#client"',
    'href="#pilot"',
    'href="#resolve"',
  ]);

  assert.doesNotMatch(page, /02 · Карта решений|05 · End-to-end|06 · Незакрытые роли|03 · Центральный блок|До CJM V0\.2/);
});

test("V3 updates hero and offer without changing the product set", () => {
  assertInOrder(page, [
    "<strong>3</strong><span>ключевые роли</span>",
    "<strong>4</strong><span>роли исполнения</span>",
    "<strong>10</strong><span>этапов сквозного пути клиента</span>",
    "<strong>4</strong><span>роли требуют назначения владельцев</span>",
  ]);
  assert.match(page, /Контроль входной двери, автоматический сценарий света, управление и уведомление\. Точная настройка сценария и границы бесплатной услуги требуют подтверждения\./);
  assert.match(page, /Набор представлен в двух вариациях цветов выключателя\./);
  assert.doesNotMatch(page, /автоматический вечерний\/ночной сценарий света/);
  assert.doesNotMatch(page, /variant-note|Рабочая комплектация из документа|В другом месте документа цвет назван «чёрным»/);
  assert.doesNotMatch(data, /note: "Рабочая комплектация|note: "В другом месте документа/);
  assert.match(css, /V3 readability for the full offer/);
  assert.match(css, /#offer \.scenario-step > span,[\s\S]*font-size: 16px; line-height: 1\.4/);
});

test("decision route contains every DOCX row and no priority filter", () => {
  const decisions = sliceExport(data, "export const decisions", "export const roles");
  assert.equal((decisions.match(/title:/g) ?? []).length, 13);
  assertInOrder(decisions, [
    'title: "Суть предложения"',
    'title: "Состав подарка"',
    'title: "Условия участия"',
    'title: "Момент возникновения права"',
    'title: "Коммуникация"',
    'title: "Отражение в смете"',
    'title: "Платное расширение"',
    'title: "Демонстрация в шоуруме"',
    'title: "Комплектация"',
    'title: "Монтаж"',
    'title: "Пусконаладка"',
    'title: "Гарантия и поддержка"',
    'title: "Аналитика"',
  ]);
  assert.match(decisions, /Умный выключатель встраиваемый одноклавишный AtlasDesign Smart, с опц\. Нейтралью \(белый или черный\)/);
  assert.doesNotMatch(decisions, /priority:/);
  assert.doesNotMatch(page, /decisionFilter|filter-button|Фильтр приоритета решений/);
  assert.match(page, /<span className="decision-number">\{index \+ 1\}<\/span>/);
});

test("V3 numbers the five persistent flow detail fields", () => {
  assertInOrder(page, [
    '<b>1</b><span className="field-label">Триггер и задача клиента</span>',
    '<b>2</b><span className="field-label">Фронт: действие команды</span>',
    '<b>3</b><span className="field-label">Выход / передача</span>',
    '<b>4</b><span className="field-label">Боль или риск</span>',
    '<b>5</b><span className="field-label">Точка роста</span>',
  ]);
  assert.match(page, /<span className="flow-big-number">\{currentFlow\.number\}<\/span>/);
  assert.doesNotMatch(page, /Выбранный этап \{currentFlow\.number\}|Выбранный этап 0/);
});

test("role CJMs preserve DOCX text, empty cell and handoffs", () => {
  const roles = sliceExport(data, "export const roles", "export const clientJourney");
  assert.match(roles, /Формирует доверие к акции и ко всему предложению ремонта Формирует доверие к акции и ко всему предложению ремонта/);
  assert.match(roles, /Предложение расчета всей квартиры \( свет, безопаность, климат \)/);
  assert.match(roles, /done: ""/);
  assert.match(roles, /Утверждение компановки ЭУИ – выдает рабочую документацию/);
  assert.match(roles, /risk: "-"/);
  assert.match(roles, /Разделить подарок от оборудование апсейла, СМР и ПНР\./);
  assert.match(roles, /next: "Передача → менеджер \/ дизайнер"/);
  assert.match(roles, /next: "Передача → комплектатор"/);
  assert.match(roles, /next: "Передача → закупка \/ объект"/);
});

test("client journey has two groups of five and no emotion graph", () => {
  const client = sliceExport(data, "export const clientJourney", "export const flow");
  assert.equal((client.match(/stage:/g) ?? []).length, 10);
  assert.match(page, /clientJourney\.slice\(0, 5\)/);
  assert.match(page, /clientJourney\.slice\(5\)/);
  assert.match(page, /Человек заказывает ремонт, а не технологию/);
  assert.match(page, /Клиентская ценность возникает при бесшовном клиентском пути/);
  assert.match(client, /stage: "Пусконаладка и передача аккаунта"/);
  assert.doesNotMatch(page, /EmotionGraph|Эмоциональная линия|Гипотеза напряжения клиента/);
  assert.doesNotMatch(data, /tension:/);
});

test("operational backlog is second and keeps P0, P1 and P2", () => {
  const backlog = sliceExport(data, "export const improvementBacklog", "export const artifactGroups");
  assert.equal((backlog.match(/priority: "P0"/g) ?? []).length, 4);
  assert.equal((backlog.match(/priority: "P1"/g) ?? []).length, 4);
  assert.equal((backlog.match(/priority: "P2"/g) ?? []).length, 2);
  assertInOrder(page, [
    "Точки передачи: клиент → фронт АТЛОН → backstage",
    "Приоритетный backlog улучшений",
    "Минимальный комплект артефактов пилота",
    "Метрики пилота — без вымышленных значений",
    "План валидации до CJM V0.2",
    "Сценарий рабочей сессии с АТЛОНом",
  ]);
  assert.match(backlog, /Шаблон 4 строк: подарок, upgrade, СМР, ПНР\./);
  assert.match(backlog, /D\+7\/D\+30 сообщения, CSAT и сценарный upsell\./);
});

test("V3 enlarges uncovered roles and rebuilds the final decision block", () => {
  assert.match(css, /V3 readability for uncovered execution roles/);
  assert.match(css, /\.gaps-section \.missing-card > div p \{ font-size: 16px; line-height: 1\.4; \}/);
  assert.match(page, /Подтвердить запуск пилотной акции, назначить ответственных владельцев, проверить путь на реальных объектах/);
  assertInOrder(page, [
    "Состав устройств, цена, цвет и допустимые замены",
    "Право на подарок и отражение в договоре/смете",
    "Обучение сметчиков и внедрение услуги",
    "Монтаж, ПНР, приёмка, гарантия и поддержка",
    "Владельцы, SLA и артефакты на каждой реперной точки",
    "Инструментирование 5–10 пилотных объектов",
  ]);
  assert.doesNotMatch(page, /Смысловые допущения и отмеченные пробелы|sourceGaps|className="assumptions"/);
  assert.doesNotMatch(data, /export const sourceGaps/);
  assert.doesNotMatch(css, /\.assumptions/);
});
