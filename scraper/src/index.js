import cliProgress from "cli-progress";
import { Worker } from "worker_threads";

import { chunks } from "./utils/chunks.js";
import { saveProgress } from "./utils/saveDataFile.js";
import { getAllJobsInOrder } from "./utils/getAllJobsInOrder.js";

const user = "Job24GWWfqnpQkG1Aip6pG8w3CMBBo4sepaBsVERp3S";

const main = async () => {
  const startDate = new Date();
  console.log(`Retrieving all completed job addresses for ${user}`);
  const job_addresses = await getAllJobsInOrder({ project: user, state: 2 });

  console.log(`Found ${job_addresses.length} jobs.`);

  let final_results = {},
    results_counter = 0;
  const job_groups = [...chunks(job_addresses, job_addresses.length / 8)];

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );
  progressBar.start(job_addresses.length, 0);

  await Promise.all(
    job_groups.map((group) => {
      return new Promise((resolve) => {
        const worker = new Worker("./src/extraction/onchain-extraction.js", {
          workerData: JSON.stringify(group),
        });

        worker.on("message", async ({ results, counter }) => {
          Object.assign(final_results, results);
          results_counter += counter;
          progressBar.update(results_counter);
        });
        worker.on("error", (res) => console.log(res));
        worker.on("exit", () => resolve());
      });
    })
  );

  progressBar.stop();
  saveProgress(final_results);
  console.log(
    `Saved ${Object.keys(final_results).length} results in ${
      (new Date().getTime() - startDate.getTime()) / 1000
    }seconds`
  );
};

main().catch(console.error);
