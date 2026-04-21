const fetch = global.fetch;

const BASE_URL = "https://bananizoo.vercel.app";

//1 людина
test("Home page loads (200)", async () => {
  const res = await fetch(BASE_URL);
  expect(res.status).toBe(200);
});

test("Home page contains Banani or Zoo", async () => {
  const res = await fetch(BASE_URL);
  const text = await res.text();
  expect(text).toMatch(/Banani|Zoo/i);
});

test("Negative: invalid page returns not 200", async () => {
  const res = await fetch(BASE_URL + "/wrong-page-123");
  expect(res.status).toBe(404);
});


//2 людина
test("Response time is acceptable", async () => {
  const start = Date.now();
  await fetch(BASE_URL);
  const end = Date.now();

  expect(end - start).toBeLessThan(5000);
});

test("HTML is returned", async () => {
  const res = await fetch(BASE_URL);
  const text = await res.text();
  expect(text.includes("<html")).toBe(true);
});

test("Negative: API route should not exist", async () => {
  const res = await fetch(BASE_URL + "/api/test");
  expect(res.status).not.toBe(200);
});


//3 людина
test("Page has content length > 0", async () => {
  const res = await fetch(BASE_URL);
  const text = await res.text();
  expect(text.length).toBeGreaterThan(100);
});

test("Page returns text not empty", async () => {
  const res = await fetch(BASE_URL);
  const text = await res.text();
  expect(text).toBeTruthy();
});

test("Negative: random page fails", async () => {
  const res = await fetch(BASE_URL + "/this-page-does-not-exist");
  expect(res.status).toBe(404);
});


//4 людина
test("Site has correct content type", async () => {
  const res = await fetch(BASE_URL);
  expect(res.headers.get("content-type")).toContain("text/html");
});

test("Server responds with headers", async () => {
  const res = await fetch(BASE_URL);
  expect(res.headers).toBeDefined();
});

test("Negative: forbidden route check", async () => {
  const res = await fetch(BASE_URL + "/admin");
  expect([404, 403]).toContain(res.status);
});
