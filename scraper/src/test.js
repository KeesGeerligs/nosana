import { readFile } from "fs/promises";
import { existsSync } from "fs";

const dataFolderPath = "../data";
const dataFilePath = `${dataFolderPath}/benchmark_data.json`;

async function loadDataFile() {
  if (existsSync(dataFilePath)) {
    try {
      const data = await readFile(dataFilePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error(
        `Error parsing JSON from data file: ${dataFilePath}`,
        error.message
      );
      throw error; // Rethrow error after logging
    }
  }
  return [];
}

(async () => {
  const results = await loadDataFile();
  console.log(Object.keys(results).length);
})();
