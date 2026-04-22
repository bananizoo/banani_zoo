const fetch = global.fetch;

const BASE_URL = "https://bananizoo.vercel.app";

// 1
test("Home page loads", async () => {
  const res = await fetch(BASE_URL);
  expect(res.status).toBe(200);
});

test("Page contains text", async () => {
  const res = await fetch(BASE_URL);
  const text = await res.text();
  expect(text).toMatch(/Banani|Zoo/i);
});

test("Negative: wrong page", async () => {
  const res = await fetch(BASE_URL + "/wrong");
  expect(res.status).toBe(404);
});

// 2
test("HTML exists", async () => {
  const res = await fetch(BASE_URL);
  const text = await res.text();
  expect(text.includes("<html")).toBe(true);
});

test("Response time OK", async () => {
  const start = Date.now();
  await fetch(BASE_URL);
  const time = Date.now() - start;
  expect(time).toBeLessThan(5000);
});

test("Negative API", async () => {
  const res = await fetch(BASE_URL + "/api/test");
  expect(res.status).not.toBe(200);
});

// 3
test("Content not empty", async () => {
  const res = await fetch(BASE_URL);
  const text = await res.text();
  expect(text.length).toBeGreaterThan(100);
});

test("Headers exist", async () => {
  const res = await fetch(BASE_URL);
  expect(res.headers).toBeDefined();
});

test("Negative random page", async () => {
  const res = await fetch(BASE_URL + "/random123");
  expect(res.status).toBe(404);
});

// 4
test("Content type HTML", async () => {
  const res = await fetch(BASE_URL);
  expect(res.headers.get("content-type")).toContain("text/html");
});

test("Server responds", async () => {
  const res = await fetch(BASE_URL);
  expect(res.status).toBe(200);
});

test("Negative admin", async () => {
  const res = await fetch(BASE_URL + "/admin");
  expect([403, 404]).toContain(res.status);
});
