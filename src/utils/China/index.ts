// import new2021Data from './new2021Data.json'

import new2021Data from "./new2021Data.json";
import new2022Data from "./new2022Data.json";
import new2023Data from "./new2023Data.json";

// export default {
//   new2021Data,
//   new2022Data,
//   new2023Data,
// };

const map: Record<string, ChinaData[]> = {
  new2021Data,
  new2022Data,
  new2023Data,
};
export async function getYearData(year: string | number) {
  return map[`new${year}Data`];
}
