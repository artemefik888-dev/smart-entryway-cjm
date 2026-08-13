"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import {
  artifactGroups,
  blueprint,
  clientJourney,
  decisions,
  flow,
  improvementBacklog,
  metrics,
  missingRoles,
  offerQuestions,
  products,
  roles,
  sessionSteps,
  sourceGaps,
  statusLabels,
  validation,
  type StatusKind,
} from "./cjm-data";

type IconName = "door" | "sensor" | "light" | "phone" | "arrow" | "warning" | "check";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    door: (
      <>
        <path d="M6 3h10v18H6z" />
        <path d="M10 12h.01" />
      </>
    ),
    sensor: (
      <>
        <rect x="5" y="4" width="6" height="16" rx="2" />
        <rect x="14" y="7" width="4" height="10" rx="1.5" />
        <path d="M8 10h.01" />
      </>
    ),
    light: (
      <>
        <path d="M9 18h6M10 21h4" />
        <path d="M8.8 14.5A6 6 0 1 1 15.2 14.5c-.9.7-1.2 1.4-1.2 2.5h-4c0-1.1-.3-1.8-1.2-2.5Z" />
      </>
    ),
    phone: (
      <>
        <rect x="7" y="2" width="10" height="20" rx="2.5" />
        <path d="M10 5h4M11 18h2" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    warning: (
      <>
        <path d="m12 3 9 17H3L12 3Z" />
        <path d="M12 9v5m0 3h.01" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function StatusChip({ kind, children }: { kind: StatusKind; children?: React.ReactNode }) {
  return <span className={`status-chip status-${kind}`}>{children ?? statusLabels[kind]}</span>;
}

function SectionHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="section-heading reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}

function ScrollControls({ target, label }: { target: RefObject<HTMLDivElement | null>; label: string }) {
  const move = (direction: number) => {
    target.current?.scrollBy({ left: direction * Math.min(640, window.innerWidth * 0.7), behavior: "smooth" });
  };
  return (
    <div className="scroll-controls" aria-label={`Прокрутка: ${label}`}>
      <span className="scroll-hint">Тяните дорожку или используйте кнопки</span>
      <button type="button" onClick={() => move(-1)} aria-label={`Назад: ${label}`}>← Назад</button>
      <button type="button" onClick={() => move(1)} aria-label={`Вперёд: ${label}`}>Вперёд →</button>
    </div>
  );
}

export default function Home() {
  const [activeRole, setActiveRole] = useState<keyof typeof roles>("estimator");
  const [activeFlow, setActiveFlow] = useState(0);
  const roleTrack = useRef<HTMLDivElement>(null);
  const clientTrack = useRef<HTMLDivElement>(null);
  const clientTrackTwo = useRef<HTMLDivElement>(null);
  const flowTrack = useRef<HTMLDivElement>(null);
  const roleKeys = Object.keys(roles) as Array<keyof typeof roles>;
  const currentRole = roles[activeRole];
  const currentFlow = flow[activeFlow];

  const onRoleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + roleKeys.length) % roleKeys.length;
    setActiveRole(roleKeys[nextIndex]);
    document.getElementById(`role-tab-${roleKeys[nextIndex]}`)?.focus();
  };

  return (
    <main id="top">
      <header className="hero">
        <div className="hero-bar shell">
          <a className="partner-mark" href="#top" aria-label="SberDevices и АТЛОН — наверх">
            <span>SberDevices</span><b>×</b><span>АТЛОН</span>
          </a>
          <StatusChip kind="hypothesis">Версия 0.1 • Рабочая гипотеза • Неутверждённый процесс</StatusChip>
        </div>
        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">CJM для совместного пилота</p>
            <h1>Умная прихожая<br />в подарок</h1>
            <p className="hero-subtitle">Каркас клиентского пути и работы команды для пилота</p>
            <div className="hero-thesis">
              <span className="thesis-kicker">Главный тезис</span>
              <p>Умная прихожая должна восприниматься как понятная часть ремонта, а не как отдельная технологическая продажа.</p>
            </div>
            <div className="hero-facts" aria-label="Ключевые элементы карты">
              <div><strong>3</strong><span>ключевые роли</span></div>
              <div><strong>10</strong><span>этапов клиента</span></div>
              <div><strong>4</strong><span>незакрытые функции</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <img src="assets/docx/image6.png" alt="Визуал прихожей с датчиком открытия из рабочего документа" />
            <div className="hero-visual-overlay">
              <span>Событие на двери</span><span>Сценарий света</span><span>Контроль в приложении</span>
            </div>
            <aside className="launch-risk">
              <Icon name="warning" />
              <div>
                <span>Главный риск запуска</span>
                <p>Подарок обещают до того, как определены состав, право на него, смета, доступность, монтаж, настройка и поддержка.</p>
              </div>
            </aside>
          </div>
        </div>
      </header>

      <nav className="sticky-nav" aria-label="Навигация по CJM">
        <div className="shell nav-inner">
          <a href="#offer">Оффер</a>
          <a href="#decisions">Тезисный маршрут акции</a>
          <a href="#flow">Сквозной CJM всех ролей</a>
          <a href="#gaps">Не закрытые роли</a>
          <a href="#roles">CJM ключевых ролей</a>
          <a href="#client">CJ клиента</a>
          <a href="#pilot">Операционный слой</a>
          <a href="#resolve">Что необходимо решить</a>
        </div>
      </nav>

      <section className="section shell" id="offer">
        <SectionHeader
          eyebrow="01 · Паспорт оффера"
          title="Понятный бытовой сценарий — до обсуждения технологии"
          lead="Клиент получает не набор коробок, а контролируемый вход в квартиру и автоматически включающийся свет. Состав, монтаж и условия пока остаются рабочей гипотезой."
        />

        <div className="offer-grid">
          <article className="scenario-card panel">
            <div className="panel-title-row">
              <div><span className="mini-label">Ценность в одном действии</span><h3>Свет встречает клиента</h3></div>
              <StatusChip kind="hypothesis" />
            </div>
            <div className="scenario-flow" aria-label="Сценарий умной прихожей">
              {[
                ["door", "Дверь", "открывается"],
                ["sensor", "Датчик", "фиксирует событие"],
                ["light", "Свет", "включается"],
                ["phone", "Клиент", "управляет и получает уведомление"],
              ].map(([icon, title, text], index) => (
                <div className="scenario-step" key={title}>
                  <div className="scenario-icon"><Icon name={icon as IconName} /></div>
                  <strong>{title}</strong><span>{text}</span>
                  {index < 3 && <i className="scenario-arrow"><Icon name="arrow" /></i>}
                </div>
              ))}
            </div>
            <div className="scenario-note">
              <strong>Что получает клиент</strong>
              <p>Контроль входной двери, автоматический вечерний/ночной сценарий света, управление и уведомление. Точная настройка сценария и границы бесплатной услуги требуют подтверждения.</p>
            </div>
          </article>

          <aside className="offer-summary panel">
            <span className="mini-label">Рабочий состав решения</span>
            <h3>4 устройства, 1 жизненный сценарий</h3>
            <ul className="clean-list">
              <li><span>01</span> Умный одноклавишный выключатель AtlasDesign Smart</li>
              <li><span>02</span> Умный датчик открытия SBER</li>
              <li><span>03</span> Умный хаб Sber</li>
              <li><span>04</span> SberBoom Mini 2</li>
            </ul>
            <div className="soft-warning"><StatusChip kind="confirm" /> Цена и скидка ниже перенесены из рабочего документа и не представлены как действующее коммерческое предложение.</div>
          </aside>
        </div>

        <div className="variants-grid" aria-label="Варианты комплекта">
          {products.variants.map((variant) => (
            <article className={`variant-card variant-${variant.id}`} key={variant.id}>
              <div className="variant-copy">
                <div className="variant-head">
                  <div><span className="mini-label">Вариант комплекта</span><h3>{variant.name}</h3></div>
                  {variant.id === "carbon" && <StatusChip kind="confirm">Цвет / подпись</StatusChip>}
                </div>
                <p>{variant.descriptor}</p>
                <div className="price-row">
                  <div><span>Полная стоимость</span><strong>{variant.total}</strong></div>
                  <div className="discount-price"><span>С учётом скидки АТЛОН</span><strong>{variant.discounted}</strong></div>
                </div>
                <p className="variant-note">{variant.note}</p>
              </div>
              <div className="variant-products">
                <div className="product-item primary-product">
                  <img src={variant.image} alt={`Выключатель: ${variant.name.toLowerCase()}`} />
                  <div><strong>AtlasDesign Smart</strong><span>{variant.switchPrice}</span></div>
                </div>
                {products.shared.map((product) => (
                  <div className="product-item" key={product.name}>
                    <img src={product.image} alt={product.name} />
                    <div><strong>{product.name}</strong><span>{product.price}</span></div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <article className="questions-block">
          <div className="questions-heading">
            <span className="question-mark">?</span>
            <div><p className="eyebrow">Совместно с АТЛОН</p><h3>Требует проработки до обещания клиенту</h3></div>
          </div>
          <ol>
            {offerQuestions.map((question) => <li key={question}>{question}</li>)}
          </ol>
        </article>
      </section>

      <section className="section section-tint" id="decisions">
        <div className="shell">
          <SectionHeader
            eyebrow="02 · Тезисный маршрут акции"
            title="Тезисный маршрут акции, ключевые реперные точки"
            lead="Цель: увидеть и закрыть риски запуска. Улучшить продажи, комплектацию, коммуникацию и аналитику после появления устойчивого базового процесса."
          />
          <div className="decision-grid">
            {decisions.map((item, index) => (
              <details className="decision-card" key={item.title} open={index < 3}>
                <summary>
                  <strong>{item.title}</strong>
                  <span className="summary-toggle" aria-hidden="true">+</span>
                </summary>
                <div className="decision-body">
                  <div><span className="field-label">Гипотеза</span><p>{item.wording}</p></div>
                  <div className="confirm-field"><span className="field-label">Что подтвердить</span><p>{item.confirm}</p></div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell flow-section" id="flow">
        <SectionHeader
          eyebrow="03 · Сквозной CJM всех ролей"
          title="Сквозной путь: от заявки на ремонт до работающей «Умной прихожей»"
          lead="Этапы 0–9 — целевой каркас для обсуждения. Выберите этап, чтобы увидеть задачу клиента, действие команды, передачу, риск и точку роста."
        />
        <div className="flow-status">
          <StatusChip kind="hypothesis">Статус.</StatusChip>
          <p>Это целевой каркас для обсуждения. Необходимо наложить поверх него после интервью.</p>
        </div>
        <ScrollControls target={flowTrack} label="сквозной CJM всех ролей" />
        <div className="flow-rail" ref={flowTrack} role="tablist" aria-label="Этапы сквозного процесса">
          {flow.map((item, index) => (
            <button
              id={`flow-tab-${index}`}
              role="tab"
              aria-selected={activeFlow === index}
              aria-controls="flow-detail"
              className={activeFlow === index ? "flow-node active" : "flow-node"}
              onClick={() => setActiveFlow(index)}
              type="button"
              key={item.number}
            >
              <span>{item.number}</span><strong>{item.title}</strong><small>{item.handoff}</small>
            </button>
          ))}
        </div>
        <article className="flow-detail" id="flow-detail" role="tabpanel" aria-labelledby={`flow-tab-${activeFlow}`}>
          <div className="flow-detail-title"><span className="flow-big-number">{currentFlow.number}</span><div><p className="mini-label">Выбранный этап</p><h3>{currentFlow.title}</h3><span className="handoff-pill">{currentFlow.handoff}</span></div></div>
          <div className="flow-detail-grid">
            <div><span className="field-label">Триггер и задача клиента</span><p>{currentFlow.client}</p></div>
            <div className="action-field"><span className="field-label">Фронт: действие команды</span><p>{currentFlow.team}</p></div>
            <div><span className="field-label">Выход / передача</span><p>{currentFlow.output}</p></div>
            <div className="risk-field"><span className="field-label">Боль или риск</span><p>{currentFlow.risk}</p></div>
            <div className="growth-field"><span className="field-label">Точка роста</span><p>{currentFlow.growth}</p></div>
          </div>
        </article>
        <div className="critical-handoffs">
          <span className="mini-label">Критичные передачи</span>
          <div>{flow.filter((item) => [0, 2, 3, 4, 5, 7, 8].includes(item.number)).map((item) => <span key={item.number}>{item.handoff}</span>)}</div>
        </div>
      </section>

      <section className="section gaps-section" id="gaps">
        <div className="shell">
          <SectionHeader
            eyebrow="04 · Не закрытые роли"
            title="Трех ролей недостаточно для end-to-end опыта"
            lead="Сметчик, дизайнер и комплектатор формируют предложение и закупку, но не закрывают обязательство перед клиентом. В пилоте нужно назначить еще минимум четыре функции."
          />
          <div className="missing-grid">
            {missingRoles.map((role, index) => (
              <article className="missing-card" key={role.name}>
                <div className="missing-card-head"><span>0{index + 1}</span><StatusChip kind="undefined">Нет данных</StatusChip></div>
                <h3>{role.name}</h3>
                <div><span className="field-label">Зона ответственности</span><p>{role.scope}</p></div>
                <div className="open-question"><StatusChip kind="question">Критичный вопрос</StatusChip><p>{role.question}</p></div>
              </article>
            ))}
          </div>
          <aside className="closed-process">
            <Icon name="check" />
            <div><span>Критерий замкнутого процесса</span><p>Для каждого объекта известны: текущий владелец, следующий владелец, обязательный артефакт передачи, SLA и подтверждение завершения.</p></div>
          </aside>
        </div>
      </section>

      <section className="section shell roles-section" id="roles">
        <SectionHeader
          eyebrow="05 · CJM ключевых ролей"
          title="CJM ключевых ролей"
          lead="Три последовательных маршрута превращают обещание акции в проект и спецификацию. На каждой карточке действие видно сразу; риск, артефакт и критерий выхода раскрываются по запросу."
        />
        <div className="role-tabs" role="tablist" aria-label="Выбор роли">
          {roleKeys.map((key, index) => (
            <button
              id={`role-tab-${key}`}
              role="tab"
              aria-selected={activeRole === key}
              aria-controls="role-panel"
              tabIndex={activeRole === key ? 0 : -1}
              className={activeRole === key ? "role-tab active" : "role-tab"}
              onClick={() => setActiveRole(key)}
              onKeyDown={(event) => onRoleKeyDown(event, index)}
              type="button"
              key={key}
            >
              <span>0{index + 1}</span><strong>{roles[key].label}</strong>
            </button>
          ))}
        </div>

        <div className="role-panel" id="role-panel" role="tabpanel" aria-labelledby={`role-tab-${activeRole}`}>
          <div className="role-intro">
            <div><p className="mini-label">{currentRole.label}</p><h3>{currentRole.title}</h3></div>
            <div className="mission"><span>Миссия роли.</span><p>{currentRole.mission}</p></div>
          </div>
          <ScrollControls target={roleTrack} label={`путь роли ${currentRole.label}`} />
          <div className="journey-track role-track" ref={roleTrack} tabIndex={0} aria-label={`Этапы роли ${currentRole.label}`}>
            {currentRole.steps.map((step, index) => (
              <article className="role-step" key={step.title}>
                <div className="step-index"><span>{String(index + 1).padStart(2, "0")}</span>{index < currentRole.steps.length - 1 && <i />}</div>
                <div className="role-step-card">
                  <div className="role-step-main">
                    <span className="action-label">Действие / решение</span>
                    <h4>{step.title}</h4>
                    <div className="job-block"><span>Job to be done</span><p>{step.job}</p></div>
                    <p className="action-copy">{step.action}</p>
                  </div>
                  <details className="step-details">
                    <summary>Риски, артефакт и выход <span aria-hidden="true">+</span></summary>
                    <div className="detail-stack">
                      <div className="detail-risk"><StatusChip kind="risk">Боль и риск</StatusChip><p>{step.risk}</p></div>
                      <div className="detail-artifact"><StatusChip kind="artifact">Нужный артефакт</StatusChip><p>{step.artifact}</p></div>
                      <div className="detail-done"><StatusChip kind="done">Критерий выхода</StatusChip><p>{step.done}</p></div>
                    </div>
                  </details>
                </div>
              </article>
            ))}
          </div>
          <div className="handoff-banner"><span>{currentRole.next}</span><strong>Передача считается завершённой только после подтверждения следующего владельца.</strong></div>
          <div className="role-refinement">
            <div><span className="refine-number">01</span><h4>Что создать</h4>{currentRole.create.map((item) => <p key={item}>{item}</p>)}</div>
            <div><span className="refine-number">02</span><h4>Что подтвердить</h4>{currentRole.confirm.map((item) => <p key={item}>{item}</p>)}</div>
            <div><span className="refine-number">03</span><h4>Владелец / следующая роль</h4>{currentRole.owner.map((item) => <p key={item}>{item}</p>)}</div>
          </div>
        </div>
      </section>

      <section className="section client-section" id="client">
        <div className="shell">
          <SectionHeader
            eyebrow="06 · CJ клиента"
            title="Человек заказывает ремонт, а не технологию"
            lead="Ниже — гипотеза клиентского опыта. Эмоции и вопросы необходимо проверить интервью; они не являются результатом исследования."
          />
          <div className="client-group">
            <ScrollControls target={clientTrack} label="этапы от заявки до расчета" />
            <div className="journey-track client-track" ref={clientTrack} tabIndex={0} aria-label="Этапы клиентского пути от заявки до расчета">
              {clientJourney.slice(0, 5).map((item, index) => (
                <article className="client-step" key={item.stage}>
                  <div className="client-stage-head"><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.stage}</h3></div>
                  <dl>
                    <div><dt>Главная задача клиента</dt><dd>{item.task}</dd></div>
                    <div><dt>Вероятные вопросы</dt><dd>{item.questions}</dd></div>
                    <div className="feeling-row"><dt>Ожидаемое ощущение</dt><dd>{item.feeling}</dd></div>
                    <div className="pain-row"><dt>Боль</dt><dd>{item.pain}</dd></div>
                    <div className="experience-row"><dt>Дизайн опыта / метрика</dt><dd>{item.design}</dd></div>
                  </dl>
                </article>
              ))}
            </div>
          </div>

          <div className="client-group client-group-followup">
            <SectionHeader
              eyebrow="CJ КЛИЕНТА • ПРОДОЛЖЕНИЕ"
              title="Клиентская ценность возникает при бесшовном клиентском пути"
            />
            <ScrollControls target={clientTrackTwo} label="этапы от ожидания поставки до развития" />
            <div className="journey-track client-track" ref={clientTrackTwo} tabIndex={0} aria-label="Этапы клиентского пути от ожидания поставки до развития">
              {clientJourney.slice(5).map((item, index) => (
              <article className="client-step" key={item.stage}>
                <div className="client-stage-head"><span>{String(index + 6).padStart(2, "0")}</span><h3>{item.stage}</h3></div>
                <dl>
                  <div><dt>Главная задача клиента</dt><dd>{item.task}</dd></div>
                  <div><dt>Вероятные вопросы</dt><dd>{item.questions}</dd></div>
                  <div className="feeling-row"><dt>Ожидаемое ощущение</dt><dd>{item.feeling}</dd></div>
                  <div className="pain-row"><dt>Боль</dt><dd>{item.pain}</dd></div>
                  <div className="experience-row"><dt>Дизайн опыта / метрика</dt><dd>{item.design}</dd></div>
                </dl>
              </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section shell operations" id="pilot">
        <SectionHeader
          eyebrow="07 · Операционный слой"
          title="Что должно поддержать пилот за пределами красивой карты"
          lead="Service blueprint, артефакты, измерение и валидация собраны в раскрывающиеся блоки, чтобы не перегружать основную историю встречи."
        />

        <details className="ops-accordion" open>
          <summary><span>01</span><strong>Точки передачи: клиент → фронт АТЛОН → backstage</strong><i aria-hidden="true">+</i></summary>
          <div className="ops-content">
            <div className="blueprint-legend"><span className="lane-client">Клиент</span><span className="lane-front">Фронт АТЛОН</span><span className="lane-back">Backstage / продуктовый контур</span></div>
            <div className="blueprint-scroll" tabIndex={0} aria-label="Service blueprint точек передачи">
              {blueprint.map((item) => (
                <article className="blueprint-column" key={item.stage}>
                  <h4>{item.stage}</h4>
                  <div className="lane lane-client"><span>Клиент</span><p>{item.client}</p></div>
                  <div className="lane lane-front"><span>Фронт АТЛОН</span><p>{item.front}</p></div>
                  <div className="lane lane-back"><span>Backstage</span><p>{item.backstage}</p></div>
                  <div className="blueprint-meta"><span>Артефакт</span><p>{item.artifact}</p><span>Передача</span><p>{item.handoff}</p><span>Событие</span><code>{item.event}</code><span>Владелец</span><p>{item.owner}</p></div>
                </article>
              ))}
            </div>
          </div>
        </details>

        <details className="ops-accordion">
          <summary><span>02</span><strong>Приоритетный backlog улучшений</strong><i aria-hidden="true">+</i></summary>
          <div className="ops-content">
            <div className="backlog-scroll" tabIndex={0} aria-label="Приоритетный backlog улучшений">
              <table className="backlog-table">
                <thead>
                  <tr>
                    <th scope="col">Приоритет</th>
                    <th scope="col">Инициатива</th>
                    <th scope="col">Какую проблему решает</th>
                    <th scope="col">Минимальная версия</th>
                    <th scope="col">Зависимость</th>
                    <th scope="col">Как проверить</th>
                  </tr>
                </thead>
                <tbody>
                  {improvementBacklog.map((item) => (
                    <tr key={item.initiative}>
                      <td data-label="Приоритет"><span className={`backlog-priority backlog-${item.priority.toLowerCase()}`}>{item.priority}</span></td>
                      <td data-label="Инициатива"><strong>{item.initiative}</strong></td>
                      <td data-label="Какую проблему решает">{item.problem}</td>
                      <td data-label="Минимальная версия" className="backlog-minimum">{item.minimum}</td>
                      <td data-label="Зависимость">{item.dependency}</td>
                      <td data-label="Как проверить">{item.verification}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>

        <details className="ops-accordion">
          <summary><span>03</span><strong>Минимальный комплект артефактов пилота</strong><i aria-hidden="true">+</i></summary>
          <div className="ops-content artifact-grid">
            {artifactGroups.map(([title, items]) => (
              <article className="checklist-card" key={title}>
                <h4>{title}</h4>
                {items.map((item) => <label key={item}><input type="checkbox" /> <span>{item}</span></label>)}
              </article>
            ))}
          </div>
        </details>

        <details className="ops-accordion">
          <summary><span>04</span><strong>Метрики пилота — без вымышленных значений</strong><i aria-hidden="true">+</i></summary>
          <div className="ops-content metrics-grid">
            {metrics.map(([level, metric, definition, source]) => (
              <article className="metric-card" key={`${level}-${metric}`}>
                <span className="metric-level">{level}</span><h4>{metric}</h4><p>{definition}</p><small>Источник: {source}</small>
              </article>
            ))}
          </div>
        </details>

        <details className="ops-accordion">
          <summary><span>05</span><strong>План валидации до CJM V0.2</strong><i aria-hidden="true">+</i></summary>
          <div className="ops-content validation-grid">
            {validation.map((item) => (
              <article className="validation-card" key={item.audience}>
                <div className="validation-head"><h4>{item.audience}</h4><StatusChip kind="confirm" /></div>
                <div><span className="field-label">Минимальная выборка</span><p>{item.sample}</p></div>
                <div><span className="field-label">Что узнать</span><p>{item.learn}</p></div>
                <div className="validation-result"><span className="field-label">Результат</span><p>{item.result}</p></div>
              </article>
            ))}
          </div>
        </details>

        <details className="ops-accordion" open>
          <summary><span>06</span><strong>Сценарий рабочей сессии с АТЛОНом</strong><i aria-hidden="true">+</i></summary>
          <div className="ops-content session-grid">
            {sessionSteps.map((step, index) => <div className="session-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></div>)}
          </div>
        </details>
      </section>

      <section className="final-section" id="resolve">
        <div className="shell final-grid">
          <div className="final-copy">
            <p className="eyebrow">08 · Что необходимо решить</p>
            <h2>Подтвердить обещание, назначить владельцев, проверить путь на реальных объектах</h2>
            <p>Текущая версия предназначена для совместной валидации и назначения владельцев. Она не является утверждённой операционной моделью или коммерческими условиями акции.</p>
            <a href="#top" className="back-top">Вернуться к началу ↑</a>
          </div>
          <div className="final-checks">
            {[
              "Состав, цена, цвет и допустимые замены",
              "Право на подарок и отражение в договоре/смете",
              "Монтаж, ПНР, приёмка, гарантия и поддержка",
              "Владельцы, SLA и артефакты каждой передачи",
              "Инструментирование 5–10 пилотных объектов",
            ].map((item) => <div key={item}><Icon name="check" /><span>{item}</span></div>)}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="shell footer-grid">
          <div><strong>SberDevices × АТЛОН</strong><p>Умная прихожая в подарок · CJ/CJM для рабочей сессии</p></div>
          <div className="assumptions"><h3>Смысловые допущения и отмеченные пробелы</h3><ul>{sourceGaps.map((item) => <li key={item}>{item}</li>)}</ul></div>
        </div>
        <div className="shell footer-bottom"><span>Версия 0.1 • Рабочая гипотеза • Неутверждённый процесс</span><span>Источник: рабочий DOCX V2</span></div>
      </footer>
    </main>
  );
}
