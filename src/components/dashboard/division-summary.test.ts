import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("./division-summary.tsx", import.meta.url),
  "utf8",
);

test("DivisionSummary report rows navigate to monthly report detail", () => {
  assert.match(source, /\/reports\/\$\{kpi\.reportId\}/);
  assert.doesNotMatch(source, /\/kpi\/\$\{kpi\.id\}/);
  assert.doesNotMatch(source, /navigateToKpi/);
});
