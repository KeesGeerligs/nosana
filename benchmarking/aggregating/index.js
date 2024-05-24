import { Client, sleep } from '@nosana/sdk';
import { readFile, writeFile } from 'fs/promises';

const config = {
  solana: {
    network: 'https://rpc.ironforge.network/mainnet?apiKey=01HSGSXQ1WN15MKRZCXEX5AK6C',
  },
};

const nosana = new Client('mainnet', undefined, config);

const jobResults = {};
(async () => {
  const job_addresses = (await readFile('./job_addresses.txt', 'utf8')).toString().split("\n");
  console.log(`retrieving ${job_addresses.length} jobs..`, job_addresses);
  const jobs = await nosana.jobs.getMultiple(job_addresses);
  for (let i = 0; i < job_addresses.length; i++) {
    const job = jobs[i];
    jobResults[job_addresses[i]] = job;
    if (job.state === 'COMPLETED') {
      console.log(`retrieving job result for ${job_addresses[i]}..`);
      const result = await nosana.ipfs.retrieve(job.ipfsResult);
      jobResults[job_addresses[i]].result = result;
      await sleep(1);
    }
  }
  console.log('writing to file jobs.json..');
  await writeFile("jobs.json", JSON.stringify(jobResults))
  console.log('Done');
})();
