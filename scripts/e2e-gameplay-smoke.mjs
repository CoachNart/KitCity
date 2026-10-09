import assert from "node:assert/strict";
import { chromium } from "playwright";

const baseURL = process.env.KITCITY_BASE_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--enable-webgl", "--ignore-gpu-blocklist", "--use-gl=angle", "--use-angle=swiftshader"]
});
const pageErrors = [];
const attachErrors = page => page.on("pageerror", error => pageErrors.push(error.message));
const waitForGame = async page => {
  let lastError;
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      await page.goto(baseURL, { waitUntil: "domcontentloaded", timeout: 10000 });
      break;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(1000);
    }
  }
  if (!page.url().startsWith(baseURL)) throw lastError || new Error("Could not open KitCity");
  await page.waitForSelector("#gl", { timeout: 30000 });
  await page.waitForFunction(() => {
    const loader = document.querySelector("#bootLoading");
    return !loader || loader.classList.contains("done");
  }, undefined, { timeout: 60000 });
  await page.waitForTimeout(600);
};
const hold = async (page, keys, ms) => {
  for (const key of keys) await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  for (const key of keys.slice().reverse()) await page.keyboard.up(key);
};
const clickChoice = async (page, pattern) => {
  const button = page.locator("#sheet button").filter({ hasText: pattern }).first();
  await button.waitFor({ state: "visible", timeout: 12000 });
  await button.click();
};

try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  attachErrors(page);
  await waitForGame(page);
  assert.ok(await page.locator("#gl").evaluate(canvas => canvas.width > 0 && canvas.height > 0), "3D canvas is initialized");
  assert.ok(await page.locator("#gl").evaluate(canvas => Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"))), "browser provides a WebGL context");

  await page.locator("#startBtn").click();
  await page.waitForFunction(() => !document.querySelector("#hud").classList.contains("hidden"), undefined, { timeout: 15000 });
  await page.waitForTimeout(400);

  // Travel through the existing Lagos street grid to Amaka's actual in-world encounter.
  await hold(page, ["Shift", "W"], 5000);
  await hold(page, ["Shift", "D"], 3900);
  await hold(page, ["Shift", "W"], 2300);
  await page.waitForFunction(() => !document.querySelector("#talkBtn").classList.contains("hidden"), undefined, { timeout: 12000 });
  assert.equal(await page.locator("#talkBtn").innerText(), "Talk", "nearby NPC interaction appears after walking through the world");
  await page.locator("#talkBtn").click();
  await page.waitForFunction(() => !document.querySelector("#modal").classList.contains("hidden"), undefined, { timeout: 10000 });
  assert.match(await page.locator("#sheet").innerText(), /Amaka|Market Woman/i, "the prototype NPC opens the correct dialogue");

  await clickChoice(page, /Ask how she tracks payments/i);
  await clickChoice(page, /Let's check the evidence/i);
  await clickChoice(page, /Let's do it/i);
  let saved = await page.evaluate(() => JSON.parse(localStorage.getItem("kitcity_adventure_v1") || "{}"));
  assert.equal(saved.dialogueState.flags["prototype:started:kitcity-market-ledger"], true, "accepting the mission persists its started state");

  // Reach the real marked receipt, make a choice, then return to the same NPC for debrief.
  await hold(page, ["Shift", "S"], 3200);
  await hold(page, ["Shift", "A"], 2500);
  await page.waitForFunction(() => !document.querySelector("#talkBtn").classList.contains("hidden"), undefined, { timeout: 10000 });
  await page.locator("#talkBtn").click();
  await page.waitForFunction(() => /Supplier delivery receipt/.test(document.querySelector("#sheet")?.innerText || ""), undefined, { timeout: 10000 });
  await clickChoice(page, /Match the order number/i);
  saved = await page.evaluate(() => JSON.parse(localStorage.getItem("kitcity_adventure_v1") || "{}"));
  assert.equal(saved.dialogueState.flags["prototype:objective:kitcity-market-ledger:receipt"], true, "the in-world objective choice persists");
  assert.equal(saved.dialogueState.flags["prototype:objective-complete:kitcity-market-ledger"], true, "the objective completion gate opens only after the required field activity");

  await hold(page, ["Shift", "D"], 2500);
  await hold(page, ["Shift", "W"], 3200);
  await page.waitForFunction(() => !document.querySelector("#talkBtn").classList.contains("hidden"), undefined, { timeout: 10000 });
  await page.locator("#talkBtn").click();
  await clickChoice(page, /Share what I found/i);
  await clickChoice(page, /Complete the task/i);
  await page.waitForFunction(() => /Activity complete/.test(document.querySelector("#sheet")?.innerText || ""), undefined, { timeout: 10000 });
  assert.match(await page.locator("#sheet").innerText(), /XP earned/i, "mission completion displays its reward");
  await clickChoice(page, /Back to the streets/i);
  await page.waitForFunction(() => document.querySelector("#modal").classList.contains("hidden"), undefined, { timeout: 10000 });

  const progress = await page.evaluate(() => ({
    adventure: JSON.parse(localStorage.getItem("kitcity_adventure_v1") || "{}"),
    player: JSON.parse(localStorage.getItem("kitnaija_v1") || "{}")
  }));
  assert.ok(progress.adventure.completed.includes("kitcity-market-ledger"), "the mission is saved as completed");
  assert.equal(progress.adventure.dialogueState.flags["prototype:completed:kitcity-market-ledger"], true, "completion state survives outside the dialogue session");
  assert.equal(progress.player.done["adventure_kitcity-market-ledger"], true, "the player profile records the completed mission");
  assert.ok(progress.player.xp >= 35, "mission XP is granted to the player profile");

  // A real reload must restore the checkpoint and retain the returning NPC's follow-up.
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#startBtn");
  await page.waitForFunction(() => !document.querySelector("#bootLoading") || document.querySelector("#bootLoading").classList.contains("done"), undefined, { timeout: 60000 });
  await page.locator("#startBtn").click();
  await page.waitForFunction(() => !document.querySelector("#hud").classList.contains("hidden"), undefined, { timeout: 15000 });
  await page.waitForFunction(() => !document.querySelector("#talkBtn").classList.contains("hidden"), undefined, { timeout: 10000 });
  await page.locator("#talkBtn").click();
  await page.waitForFunction(() => /Good to see you again/.test(document.querySelector("#sheet")?.innerText || ""), undefined, { timeout: 10000 });
  const xpBeforeReturn = await page.evaluate(() => JSON.parse(localStorage.getItem("kitnaija_v1") || "{}").xp);
  await clickChoice(page, /I'll keep exploring/i);
  await page.waitForFunction(() => document.querySelector("#modal").classList.contains("hidden"), undefined, { timeout: 10000 });
  const xpAfterReturn = await page.evaluate(() => JSON.parse(localStorage.getItem("kitnaija_v1") || "{}").xp);
  assert.equal(xpAfterReturn, xpBeforeReturn, "returning to a completed NPC does not pay the mission reward again");

  // Copy the persisted save into a narrow touch-enabled context and exercise the on-screen joystick.
  const storage = await page.evaluate(() => Object.entries(localStorage));
  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  attachErrors(mobile);
  await mobile.addInitScript(entries => { for (const [key, value] of entries) localStorage.setItem(key, value); }, storage);
  await waitForGame(mobile);
  await mobile.locator("#startBtn").click();
  await mobile.waitForFunction(() => !document.querySelector("#hud").classList.contains("hidden"), undefined, { timeout: 15000 });
  await mobile.waitForFunction(() => !document.querySelector("#talkBtn").classList.contains("hidden"), undefined, { timeout: 10000 });
  assert.ok(await mobile.locator("#joy").isVisible(), "mobile joystick is visible");
  assert.ok(await mobile.locator("#runBtn").isVisible(), "mobile sprint control is visible");

  const joystick = await mobile.locator("#joy").boundingBox();
  assert.ok(joystick, "mobile joystick has a layout box");
  const x = joystick.x + joystick.width / 2;
  const y = joystick.y + joystick.height / 2;
  const touch = await mobileContext.newCDPSession(mobile);
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y, id: 1 }] });
  await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 38, id: 1 }] });
  await mobile.waitForTimeout(1800);
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await mobile.waitForFunction(() => document.querySelector("#talkBtn").classList.contains("hidden"), undefined, { timeout: 8000 });
  await touch.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y, id: 2 }] });
  await touch.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y + 38, id: 2 }] });
  await mobile.waitForTimeout(1800);
  await touch.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await mobile.waitForFunction(() => !document.querySelector("#talkBtn").classList.contains("hidden"), undefined, { timeout: 8000 });
  assert.deepEqual(pageErrors, [], "no uncaught JavaScript errors occur during desktop or mobile gameplay");

  console.log("PASS: production browser gameplay — WebGL launch, Lagos movement, prototype NPC dialogue, mission acceptance, practical objective, objective gate, debrief, reward, persistent completion, reload/resume, returning-NPC follow-up, no duplicate reward, mobile touch movement and responsive controls.");
  await mobileContext.close();
  await context.close();
} finally {
  await browser.close();
}
