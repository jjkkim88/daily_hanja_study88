export type HanjaItem = {
  hanja: string;
  meaning: string;
  reading: string;
  source: string;
};

export type HanjaDataset = {
  schema: string;
  count: number;
  items: HanjaItem[];
};
