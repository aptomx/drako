export interface IUpdateOrDeleteResult {
  // biome-ignore lint/suspicious/noExplicitAny: Database raw result format varies
  raw: any;
  affected?: number;
}
