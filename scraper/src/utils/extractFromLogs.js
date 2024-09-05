function parseLogData(logs) {
  const internetInfo = {
    download_speed_mbps: null,
    upload_speed_mbps: null,
    internet_speed_test_duration_sec: null,
  };
  let ollamaVersion = "";

  for (const logEntry of logs) {
    if (logEntry.type === "stdout") {
      const log = logEntry.log;
      if (log.includes("Download Speed")) {
        internetInfo["download_speed_mbps"] = parseFloat(
          log.split(": ")[1].split(" ")[0]
        );
      } else if (log.includes("Upload Speed")) {
        internetInfo["upload_speed_mbps"] = parseFloat(
          log.split(": ")[1].split(" ")[0]
        );
      } else if (log.includes("Internet speed test duration")) {
        internetInfo["internet_speed_test_duration_sec"] = parseFloat(
          log.split(": ")[1].split(" ")[0]
        );
      } else if (log.includes("ollama_version")) {
        ollamaVersion = log.split(": ")[1].trim();
      }

      if (ollamaVersion !== "") {
        break;
      }
    }
  }

  return { internetInfo, ollamaVersion };
}

export function extractFromLogs(logs, jobResults) {
  const { internetInfo, ollamaVersion } = parseLogData(logs);

  jobResults.data.specs.internet_info = internetInfo;
  jobResults.data.specs.ollama_version = ollamaVersion;
}
