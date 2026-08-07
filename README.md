# «Умная прихожая в подарок» — CJ/CJM V0.1

> **Версия 0.1 • Рабочая гипотеза • Неутверждённый процесс**

Интерактивная CJ/CJM-карта совместного пилота SberDevices × АТЛОН. Страница показывает паспорт оффера, маршруты сметчика, дизайнера и комплектатора, клиентский путь, end-to-end flow, незакрытые роли и операционный слой пилота.

## Публичная версия

[https://artemefik888-dev.github.io/smart-entryway-cjm/](https://artemefik888-dev.github.io/smart-entryway-cjm/)

## Локальный запуск

Требуется Node.js 22.13+ и pnpm 11.

```bash
pnpm install
pnpm dev
```

После запуска откройте [http://localhost:3000](http://localhost:3000).

## Production и статическая сборка

Проверка Vinext production-сборки:

```bash
pnpm build
```

Статическая сборка для GitHub Pages:

```bash
VITE_BASE_PATH=/smart-entryway-cjm/ pnpm static:build
pnpm static:preview
```

Результат создаётся в `dist-static/`. Backend и внешние API странице не требуются.

## Где редактировать содержание

- `app/cjm-data.ts` — роли, этапы, статусы, решения, метрики и формулировки;
- `app/page.tsx` — интерфейс и интерактивные сценарии;
- `app/globals.css` — визуальная система и адаптивные состояния;
- `public/assets/docx/` — используемые изображения устройств и прихожей;
- `static/` и `vite.static.config.ts` — entry point и конфигурация статической версии.

## GitHub Pages

Workflow `.github/workflows/pages.yml` при каждом push в `main`:

1. устанавливает Node.js и pnpm;
2. запускает lint и тест production-рендера;
3. собирает и проверяет base-aware статическую версию;
4. загружает только `dist-static/`;
5. публикует сайт официальными GitHub Pages Actions.

Workflow также поддерживает ручной запуск через `workflow_dispatch`.

Исходный DOCX, PDF, постраничные рендеры, `source/`, локальные конфигурации и экспериментальные backend/database-файлы исключены из публичного состава репозитория.
