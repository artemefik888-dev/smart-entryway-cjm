import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);

async function render() {
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  const handleRequest =
    typeof worker === "function" ? worker : worker.fetch.bind(worker);

  return handleRequest(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the CJ/CJM workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Умная прихожая в подарок/i);
  assert.match(html, /Версия 0\.1/);
  assert.match(html, /Рабочая гипотеза/);
  assert.match(html, /Паспорт оффера/);
  assert.match(html, /Тезисный маршрут акции/);
  assert.match(html, /Сквозной CJM всех ролей/);
  assert.match(html, /Не закрытые роли/);
  assert.match(html, /CJM ключевых ролей/);
  assert.match(html, /CJ клиента/);
  assert.match(html, /Операционный слой/);
  assert.match(html, /Что необходимо решить/);
  assert.match(html, /Приоритетный backlog улучшений/);
  assert.doesNotMatch(html, /Эмоциональная линия|Гипотеза напряжения клиента/);
  assert.doesNotMatch(html, /lorem ipsum/i);
});
