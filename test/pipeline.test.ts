import { describe, expect, test } from "bun:test";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BeancountParser } from "../src";
import {
  Balance,
  Close,
  Commodity,
  Custom,
  Document,
  Event,
  Include,
  Note,
  Open,
  Option,
  Pad,
  Plugin,
  Price,
  Query,
  Transaction,
} from "../src/model";

// Covers the antlr4ng lexer → parser → visitor wiring: every directive rule
// must reach its model class. Field values are out of scope here.
describe("antlr4ng pipeline: directive dispatch", () => {
  const cases: [string, string, Function][] = [
    ["open", '2022-01-01 open Assets:Checking USD,EUR', Open],
    ["close", "2022-12-31 close Assets:Checking", Close],
    ["price", "2022-01-01 price EUR 1.10 USD", Price],
    ["balance", "2022-01-01 balance Assets:Checking 100.00 USD", Balance],
    ["pad", "2022-01-01 pad Assets:Checking Equity:Opening-Balances", Pad],
    ["note", '2022-01-01 note Assets:Checking "called bank"', Note],
    ["document", '2022-01-01 document Assets:Checking "a.pdf"', Document],
    ["event", '2022-01-01 event "location" "Paris"', Event],
    ["query", '2022-01-01 query "q" "SELECT 1"', Query],
    ["custom", '2022-01-01 custom "budget" Assets:Checking 10 USD', Custom],
    ["commodity", "2022-01-01 commodity USD", Commodity],
    ["option", 'option "title" "Ledger"', Option],
    ["plugin", 'plugin "beancount.plugins.auto" "cfg"', Plugin],
    ["include", 'include "other.bean"', Include],
    ["transaction header", '2022-01-15 txn "Payee" "Narration"', Transaction],
  ];

  test.each(cases)("%s directive becomes its model class", (_name, input, cls) => {
    const { directives } = BeancountParser.parse(`${input}\n`);
    expect(directives).toHaveLength(1);
    expect(directives[0]).toBeInstanceOf(cls);
  });

  test("keeps source order across mixed directives", () => {
    const { directives } = BeancountParser.parse(
      [
        'option "title" "Ledger"',
        "2022-01-01 open Assets:Checking USD",
        "2022-01-01 commodity USD",
        '2022-06-01 note Assets:Checking "mid-year"',
        "2022-12-31 close Assets:Checking",
        "",
      ].join("\n"),
    );
    expect(directives.map((d) => d.constructor)).toEqual([Option, Open, Commodity, Note, Close]);
  });

  test.each([
    ["empty input", ""],
    ["whitespace only", "  \n\t\n"],
    ["comment only", "; just a comment\n"],
  ])("%s yields no directives", (_name, input) => {
    expect(BeancountParser.parse(input).directives).toEqual([]);
  });
});

// src/parser/* is committed; it must match what the grammar generates, or
// grammar edits silently fail to take effect.
test("committed src/parser matches regenerated output of Beancount.g4", () => {
  const root = join(import.meta.dir, "..");
  const out = mkdtempSync(join(tmpdir(), "beancount-antlr-"));
  try {
    const gen = Bun.spawnSync(
      [
        join(root, "node_modules/.bin/antlr-ng"),
        "-Dlanguage=TypeScript",
        "--generate-visitor",
        "--generate-listener",
        "false",
        "-o",
        out,
        join(root, "src/grammar/Beancount.g4"),
      ],
      { cwd: root },
    );
    expect(gen.exitCode).toBe(0);
    for (const file of ["BeancountLexer.ts", "BeancountParser.ts", "BeancountVisitor.ts"]) {
      expect(readFileSync(join(root, "src/parser", file), "utf8")).toBe(
        readFileSync(join(out, file), "utf8"),
      );
    }
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
