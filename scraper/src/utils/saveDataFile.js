import { writeFile, readFile, mkdir } from "fs/promises";
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

async function saveDataFile(jobResults) {
  await writeFile(dataFilePath, JSON.stringify(jobResults, null, 2));
  console.log("Job results saved to data folder");
}

export async function saveProgress(jobResults) {
  // Create data folder if it does not exist
  if (!existsSync(dataFolderPath)) {
    await mkdir(dataFolderPath, { recursive: true });
  }

  // Load existing job results to merge with new results
  const existingJobResults = await loadDataFile();
  const updatedJobResults = { ...existingJobResults, ...jobResults };

  await saveDataFile(updatedJobResults);
}
