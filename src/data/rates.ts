import { useQuery } from "react-query";
import { IExchangeRate } from "../models";

let columnMap: Record<keyof IExchangeRate, string> = {
  amount: "množství",
  code: "kód",
  country: "země",
  currency: "měna",
  rate: "kurz",
};

export function getValueByColumn(
  vals: string[],
  columns: string[],
  propName: keyof IExchangeRate
): string {
  const colName = columnMap[propName];
  const idx = columns.findIndex((col) => col === colName);
  if (idx < 0) {
    throw new Error("Can't parse input data");
  }
  return vals[idx]?.trim() ?? "";
}

export function getNumberByColumn(
  vals: string[],
  columns: string[],
  propName: keyof IExchangeRate
): number {
  const val = getValueByColumn(vals, columns, propName);
  const num = parseFloat(val.replace(",", "."));
  if (isNaN(num)) {
    throw new Error("Error parsing a number");
  }
  return num;
}

export function parseExchangeRate(
  line: string,
  columns: string[]
): IExchangeRate {
  const vals = line.split("|");
  return {
    amount: getNumberByColumn(vals, columns, "amount"),
    code: getValueByColumn(vals, columns, "code"),
    country: getValueByColumn(vals, columns, "country"),
    currency: getValueByColumn(vals, columns, "currency"),
    rate: getNumberByColumn(vals, columns, "rate"),
  };
}

export function parseExchangeRates(text: string): IExchangeRate[] {
  const lines = text.split("\n");

  // first line contains release date, we don't have use for it right now so we throw it away
  lines.shift();

  let cols =
    lines
      .shift()
      ?.split("|")
      .map((col) => col.trim()) || [];

  return lines
    .filter((line) => line.length > 2)
    .map((line) => parseExchangeRate(line, cols));
}

async function fetchExchangeRates(): Promise<IExchangeRate[]> {
  const result = await fetch(
    "https://thingproxy.freeboard.io/fetch/http://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.txt",
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const text = await result.text();
  return parseExchangeRates(text);
}

export function useExchangeRates() {
  return useQuery("rates", fetchExchangeRates, { suspense: false });
}
