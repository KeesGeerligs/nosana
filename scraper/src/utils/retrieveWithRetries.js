import { sleep } from "@nosana/sdk";

export const retrieveWithRetries = async (
  ipfsResult,
  client,
  retries = 5,
  delay = 10
) => {
  // Start with a shorter delay and more retries
  let currentDelay = delay;
  for (let i = 0; i < retries; i++) {
    try {
      // console.log(`fetch ${ipfsResult}`);
      return await client.ipfs.retrieve(ipfsResult);
    } catch (error) {
      if (i === retries - 1) {
        throw error; // Final retry, throw the error
      }
      console.error(
        `Attempt ${i + 1} failed: ${
          error.message
        }. Retrying in ${currentDelay} ms...`
      );
      await sleep(currentDelay);
      currentDelay *= 1.5; // Increase delay by a factor of 1.5 instead of doubling
    }
  }
};
