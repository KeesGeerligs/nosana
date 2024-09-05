import { Client } from "@nosana/sdk";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes/index.js";
import * as anchor from "@coral-xyz/anchor";

const nosana = new Client("mainnet", undefined, {
  solana: {
    network:
      "https://rpc.ironforge.network/mainnet?apiKey=01HSGSXQ1WN15MKRZCXEX5AK6C",
  },
});

const { BN } = anchor.default ? anchor.default : anchor;

const excludedJobs = [
  "Af6vBZSM3eLfJHvfMXKUa3CCeP4b8VEFbBaRhMsJHvtb",
  "DhZJphpRXFVH1sGqYEiiPyeXQr2LEv4FvFnUuCvi3eQF",
  "4vkKcBAs3DuFYK9ZLxzcfmHvwtgaYMJMuv7gnMya8qam",
  "ERgvm546BuSLfHzWegKweGUjecDVtiSui7Pgwnpwo8r3",
  "4pndLabGeRzLtFMdpi34fZCS9u6t9z5jcWT26sf5qbeL",
  "AFPUhb1yaJyhhQ7yyKraTHb4xYgN3zmN6z9oG7qJZ3qe",
];

export async function getAllJobsInOrder(filters, prevEndDate) {
  await nosana.jobs.loadNosanaJobs();
  const jobAccount = nosana.jobs.jobs.account.jobAccount;
  const filter = jobAccount.coder.accounts.memcmp(
    jobAccount.idlAccount.name,
    undefined
  );
  const coderFilters = [];
  if (filter?.offset != undefined && filter?.bytes != undefined) {
    coderFilters.push({
      memcmp: { offset: filter.offset, bytes: filter.bytes },
    });
  }
  if (filter?.dataSize != undefined) {
    coderFilters.push({ dataSize: filter.dataSize });
  }
  if (filters) {
    if (filters.state >= 0) {
      coderFilters.push({
        memcmp: {
          offset: 208,
          bytes: bs58.encode(Buffer.from([filters.state])),
        },
      });
    }
    if (filters.project) {
      coderFilters.push({
        memcmp: {
          offset: 176,
          bytes: filters.project,
        },
      });
    }
    if (filters.node) {
      coderFilters.push({
        memcmp: {
          offset: 104,
          bytes: filters.node,
        },
      });
    }
    if (filters.market) {
      console.log("filter", filters);
      coderFilters.push({
        memcmp: {
          offset: 72,
          bytes: filters.market,
        },
      });
    }
  }
  const accounts = await jobAccount.provider.connection.getProgramAccounts(
    jobAccount.programId,
    {
      dataSlice: { offset: 208, length: 17 },
      filters: [...coderFilters],
    }
  );
  const filterExcludedJobs = accounts.filter(({ pubkey, account }) => {
    if (excludedJobs.includes(pubkey.toString())) return false;
    return true;
  });
  const accountsWithTimeStart = filterExcludedJobs.map(
    ({ pubkey, account }) => ({
      pubkey,
      state: account.data[0],
      timeStart: parseFloat(new BN(account.data.slice(9), "le")),
      timeEnd: parseFloat(new BN(account.data.slice(1, 9), "le")),
    })
  );
  // sort by desc timeStart & put 0 on top
  const sortedAccounts = accountsWithTimeStart.sort((a, b) => {
    if (a.state === b.state) {
      if (a.timeEnd === b.timeEnd) {
        return a.pubkey.toString().localeCompare(b.pubkey.toString());
      }
      if (a.timeEnd === 0) return -1;
      if (b.timeEnd === 0) return 1;
      return b.timeEnd - a.timeEnd;
    }
    return a.state - b.state;
  });

  if (prevEndDate) {
    return sortedAccounts.filter(
      (val) => new Date(val.timeEnd * 1000).getTime() > prevEndDate.getTime()
    );
  }
  return sortedAccounts;
}
