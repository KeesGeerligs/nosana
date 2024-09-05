import cliProgress from "cli-progress";
import { Worker } from "worker_threads";

import { chunks } from "./utils/chunks.js";
import { saveProgress } from "./utils/saveDataFile.js";

import snapshot1 from "../snapshots/09-08-mainnet-jobs.json" assert { type: "json" };

const user = "Job24GWWfqnpQkG1Aip6pG8w3CMBBo4sepaBsVERp3S";

const main = async () => {
  if (snapshot1) {
    const startDate = new Date();
    const snapshot = [];

    snapshot1.forEach(({ payer, node, market, ipfsResult, pubkey }) => {
      if (payer === user) {
        snapshot.push({ id: pubkey, node, market, ipfsResult });
      }
    });

    const jobsGroups = [...chunks(snapshot, snapshot.length / 8)];
    const final_results = {};
    let results_counter = 0;

    const progressBar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );

    progressBar.start(snapshot.length, 0);

    try {
      await Promise.all(
        jobsGroups.map((group) => {
          return new Promise((resolve) => {
            const worker = new Worker(
              "./src/extraction/snapshot-extraction.js",
              {
                workerData: JSON.stringify(group),
              }
            );

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
    } catch (err) {
      progressBar.stop();
      throw err;
    }

    progressBar.stop();
    saveProgress(final_results);
    console.log(
      `Saved ${Object.keys(final_results).length} results in ${
        (new Date().getTime() - startDate.getTime()) / 1000
      }seconds`
    );
  }
};

main().catch(console.error);
