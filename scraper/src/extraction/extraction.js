import { extractFromLogs } from "../utils/extractFromLogs.js";
import { extractSystemSpecs } from "../utils/extractSystemSpecs.js";
import { retrieveWithRetries } from "../utils/retrieveWithRetries.js";
import { extractBenchmarkResults } from "../utils/extractBenchmarkResults.js";

export async function extraction(id, job, nosana) {
  const jobResult = {
    job_id: id,
    node: job.node.toString(),
    market: job.market.toString(),
    data: {
      specs: {},
      performance: {},
    },
  };

  const { opStates } = await retrieveWithRetries(job.ipfsResult, nosana);

  if (opStates[0].results) {
    const { system_specs } = opStates[0].results;
    if (system_specs) extractSystemSpecs(system_specs, jobResult);
    extractBenchmarkResults(opStates[0].results, jobResult);
    extractFromLogs(opStates[0].logs, jobResult);
  }

  return jobResult;
}
