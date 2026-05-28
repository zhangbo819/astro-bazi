interface Window {
  echarts: any;
}
interface WorldItem {
  index: string;
  name: string;
  country: string;
  industry: string;
  EnglishName: string;
  revenue: string;
  profit: string;
  simpleName?: string;
  profitMargin?: string;
  compare_index?: string;
}

interface WorldClass {
  name: string;
  count: number;
  children: WorldItem[];
}

interface ChinaDataItem {
  index: string;
  name: string;
  revenue: number | string;
  address: string;
}
interface ChinaData {
  name: string;
  count: number;
  children: {
    name?: name;
    count: number;
    children: ChinaDataItem[];
  }[];
}
