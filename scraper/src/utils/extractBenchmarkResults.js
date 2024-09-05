export function extractBenchmarkResults(results, jobResult) {
  [
    // "gemma_results",
    // "phi3_results",
    // "mistral_results",
    "llama3.1_results",
    // "qwen_results",
    // "llama3_70b_results"
  ].forEach((name) => {
    const modelResults = results[name];
    if (modelResults && modelResults.length > 0) {
      let totalTokens = 0;
      let totalInferenceSeconds = 0;
      let totalSeconds = 0;
      let totalGpuClockSpeed = 0;
      let totalGpuPowerUsage = 0;
      let totalTTFT = 0;
      let count = 0;
      let concurrentUsers = 0;

      modelResults.forEach((resultStr, index) => {
        try {
          const cleanedString = resultStr.replace(/'/g, '"');
          const modelData = JSON.parse(cleanedString);

          totalTokens += parseInt(modelData.total_tokens, 10);
          totalInferenceSeconds += parseFloat(modelData.total_inference_seconds);
          totalSeconds += parseFloat(modelData.total_seconds);
          totalGpuClockSpeed += parseFloat(modelData.average_gpu_clock_speed);
          totalGpuPowerUsage += parseFloat(modelData.average_gpu_power_usage);
          totalTTFT += parseFloat(modelData.average_time_to_first_token);
          
          // Capture concurrent users from the first result
          if (index === 0) {
            concurrentUsers = parseInt(modelData.concurrent_users, 10);
          }
          
          count++;
        } catch (error) {
          console.error(`Error parsing ${name} JSON:`, error.message);
        }
      });

      const avgGpuClockSpeed = count > 0 ? totalGpuClockSpeed / count : 0;
      const avgGpuPowerUsage = count > 0 ? totalGpuPowerUsage / count : 0;
      const avgTTFT = count > 0 ? totalTTFT / count : 0;

      jobResult.data.performance[name.replace("_results", "")] = {
        totalInferenceSeconds: parseFloat(totalInferenceSeconds.toFixed(2)),
        producedTokens: parseInt(totalTokens),
        totalSeconds: parseFloat(totalSeconds.toFixed(2)),
        tokensPerSecond: parseFloat((totalTokens / totalSeconds).toFixed(2)),
        averageGpuClockSpeed: parseFloat(avgGpuClockSpeed.toFixed(2)),
        averageGpuPowerUsage: parseFloat(avgGpuPowerUsage.toFixed(2)),
        averageTimeToFirstToken: parseFloat(avgTTFT.toFixed(2)),
        concurrentUsers: concurrentUsers
      };
    }
  });
}