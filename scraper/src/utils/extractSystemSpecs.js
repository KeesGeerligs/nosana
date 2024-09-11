export function extractSystemSpecs(system_specs, jobResult) {
  // Check if system_specs is defined and not empty
  if (!system_specs || system_specs.length === 0) {
    console.error("System specs are undefined or empty.");
    return;
  }

  const specString = system_specs[0];
  try {
    // Replace single quotes with double quotes for valid JSON
    let cleanedString = specString.replace(/'/g, '"');
    // Fix the nested quotes around os_version field
    cleanedString = cleanedString.replace(
      /"os_version":\s*""(.*?)""/,
      '"os_version": "$1"'
    );

    cleanedString = cleanedString.replaceAll("nan", "null");
    // Parse the string into an object
    const specObj = JSON.parse(cleanedString);
    // Remove the "gpu" entry if it exists
    delete specObj["gpu"];
    // Add parsed object to specs array
    jobResult.data.specs = specObj;
  } catch (error) {
    console.error("Failed to parse system spec:", specString, error);
  }
}
