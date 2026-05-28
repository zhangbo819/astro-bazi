import new2020Data from "./2020Data.json";
import new2021Data from "./2021Data.json";
import new2022Data from "./2022Data.json";
import new2023Data from "./2023Data.json";

const map: Record<string | number, WorldItem[]> = {
  new2020Data,
  new2021Data,
  new2022Data,
  new2023Data,
};
export async function getWorldYearData(year: string | number) {
  return map[`new${year}Data`] || [];
}
