import { Client } from "@nosana/sdk";
import { parentPort, workerData } from "worker_threads";

import { chunks } from "../utils/chunks.js";
import { extraction } from "./extraction.js";

const nosana = new Client("mainnet", undefined, {
  solana: {
    network:
      "https://rpc.ironforge.network/mainnet?apiKey=01HSGSXQ1WN15MKRZCXEX5AK6C",
  },
});

const groupSize = 100;

(async () => {
  try {
    const data = JSON.parse(workerData);
    const job_results = await nosana.jobs.getMultiple(
      data.map((j) => j.pubkey)
    );

    const groups = [...chunks(job_results, groupSize)];

    for (let i = 0; i < groups.length; i++) {
      await new Promise(async (resolve) => {
        const promises = [],
          results = {};

        let counter = 0;

        groups[i].forEach(async (job, index) => {
          promises.push(
            new Promise(async (resolve) => {
              const id = data[index + groupSize * i].pubkey;
              const jobResult = await extraction(id, job, nosana);
              results[id] = jobResult;
              counter++;
              resolve();
            })
          );
        });
        await Promise.all(promises);
        parentPort.postMessage({ results, counter });
        resolve();
      });
    }
  } catch (err) {
    throw err;
  }

  parentPort.close();
})();
