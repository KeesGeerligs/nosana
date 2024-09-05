import { Client, sleep } from "@nosana/sdk";
import { readFile, writeFile } from "fs/promises";

const config = {
  solana: {
    network:
      "https://rpc.ironforge.network/mainnet?apiKey=01HSGSXQ1WN15MKRZCXEX5AK6C",
  },
};

const nosana = new Client("mainnet", undefined, config);

const jobResults = [];
(async () => {
  const job_addresses = (await readFile("./job_addresses.txt", "utf8"))
    .toString()
    .split("\n");
  console.log(`retrieving ${job_addresses.length} jobs..`, job_addresses);
  const jobs = await nosana.jobs.getMultiple(job_addresses);
  for (let i = 0; i < job_addresses.length; i++) {
    const job = jobs[i];
    const nodeName = job.node;

    // Initialize the structure
    const jobResult = {
      job_id: job_addresses[i],
      node: nodeName,
      data: {
        specs: {},
        performance: [],
      },
    };

    if (job.state === "COMPLETED") {
      console.log(`retrieving job result for ${job_addresses[i]}..`);
      const result = await nosana.ipfs.retrieve(job.ipfsResult);

      // Extract and parse logs dynamically and structure them
      const relevantLogKeywords = [
        "gpu_info",
        "cpu_info",
        "os_version",
        "gpu_memory_total",
        "gpu_memory_free",
        "gpu_memory_used",
        "gpu_load",
        "gpu_temperature",
        "driver",
        "Internet speed test",
      ];

      const specs = {
        gpu_info: "",
        cpu_info: "",
        os_version: "",
        gpu_memory_total: "",
        gpu_memory_free: "",
        gpu_memory_used: "",
        gpu_load: "",
        gpu_temperature: "",
        driver: "",
        internet_speed_test: {
          download_speed: "",
          upload_speed: "",
          duration: "",
        },
      };

      result.opStates.forEach((state) => {
        state.logs.forEach((log) => {
          if (log.log.includes("{'id':")) {
            try {
              const parsedLog = JSON.parse(
                log.log.replace(/'/g, '"').replace(/(\b\w+):/g, '"$1":')
              );
              specs.gpu_info = parsedLog.name || specs.gpu_info;
              specs.driver = parsedLog.driver || specs.driver;
              specs.gpu_memory_total =
                parsedLog.gpu_memory_total || specs.gpu_memory_total;
              specs.gpu_memory_free =
                parsedLog.gpu_memory_free || specs.gpu_memory_free;
              specs.gpu_memory_used =
                parsedLog.gpu_memory_used || specs.gpu_memory_used;
              specs.gpu_load = parsedLog.gpu_load || specs.gpu_load;
              specs.gpu_temperature =
                parsedLog.gpu_temperature || specs.gpu_temperature;
            } catch (error) {
              console.error("Error parsing log:", log.log, error);
            }
          } else if (log.log.includes("gpu_info")) {
            specs.gpu_info = log.log.split(": ")[1].trim();
          } else if (log.log.includes("cpu_info")) {
            specs.cpu_info = log.log.split(": ")[1].trim();
          } else if (log.log.includes("os_version")) {
            specs.os_version = log.log.split(": ")[1].trim().replace(/"/g, "");
          } else if (log.log.includes("gpu_memory_total")) {
            specs.gpu_memory_total = log.log.split(": ")[1].trim();
          } else if (log.log.includes("gpu_memory_free")) {
            specs.gpu_memory_free = log.log.split(": ")[1].trim();
          } else if (log.log.includes("gpu_memory_used")) {
            specs.gpu_memory_used = log.log.split(": ")[1].trim();
          } else if (log.log.includes("gpu_load")) {
            specs.gpu_load = log.log.split(": ")[1].trim();
          } else if (log.log.includes("gpu_temperature")) {
            specs.gpu_temperature = log.log.split(": ")[1].trim();
          } else if (log.log.includes("driver")) {
            specs.driver = log.log.split(": ")[1].trim();
          } else if (log.log.includes("Internet speed test:")) {
            const internetSpeedLogs = state.logs.slice(
              state.logs.indexOf(log) + 1,
              state.logs.indexOf(log) + 4
            );
            internetSpeedLogs.forEach((speedLog) => {
              if (speedLog.log.includes("Download Speed")) {
                specs.internet_speed_test.download_speed = speedLog.log
                  .split(": ")[1]
                  .trim();
              } else if (speedLog.log.includes("Upload Speed")) {
                specs.internet_speed_test.upload_speed = speedLog.log
                  .split(": ")[1]
                  .trim();
              } else if (
                speedLog.log.includes("Internet speed test duration")
              ) {
                specs.internet_speed_test.duration = speedLog.log
                  .split(": ")[1]
                  .trim();
              }
            });
          }
        });
      });

      // Process performance results
      const performanceResults = [];
      const results = result.opStates.map((state) => state.results);

      results.forEach((result) => {
        const benchmarks = [];
        const benchmarkNames = [
          "gemma_results",
          "phi3_results",
          "mistral_results",
          "llama3_results",
          "qwen_results",
        ];

        const maxResultsLength = Math.max(
          result.gemma_results?.length || 0,
          result.phi3_results?.length || 0,
          result.mistral_results?.length || 0,
          result.llama3_results?.length || 0,
          result.qwen_results?.length || 0
        );

        for (let j = 0; j < maxResultsLength; j++) {
          const benchmark = {};

          benchmarkNames.forEach((name) => {
            if (result[name]?.[j]) {
              const modelData = JSON.parse(
                result[name][j].replace(/'/g, '"').replace(/(\b\w+):/g, '"$1":')
              );
              benchmark[name.split("_")[0]] = {
                totalInferenceSeconds: modelData.total_inference_seconds,
                producedTokens: modelData.total_tokens,
                decodingSeconds: modelData.total_decoding_seconds,
                tokensPerSecond: modelData.average_token_per_second,
              };
            }
          });

          benchmarks.push({ [`Benchmark${j + 1}`]: benchmark });
        }

        performanceResults.push(...benchmarks);
      });

      jobResult.data.specs = specs;
      jobResult.data.performance = performanceResults;
      await sleep(1);
    }

    jobResults.push(jobResult);
  }
  console.log("writing to file jobs.json..");
  await writeFile("jobs.json", JSON.stringify(jobResults, null, 2));
  console.log("Done");
})();
