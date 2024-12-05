const fs = require('fs');
const solanaWeb3 = require('@solana/web3.js');

// Address to track
const ADDRESS = 'nosJhNRqr2bc9g1nfGDcXXTXvYUmxD4cVwy2pMWhrYM';

// Helper function to add delay between requests
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchTransactions() {
    try {
        // Initialize connection with Helius RPC
        const connection = new solanaWeb3.Connection(
            'https://rpc.ironforge.network/mainnet?apiKey=01HSGSXQ1WN15MKRZCXEX5AK6C',
            'confirmed'
        );
        const pubKey = new solanaWeb3.PublicKey(ADDRESS);

        // Fetch first batch of 1000 signatures
        console.log('Fetching first batch of signatures...');
        const firstBatch = await connection.getSignaturesForAddress(
            pubKey,
            { limit: 1000 }
        );

        // Fetch second batch using the last signature as 'before' parameter
        console.log('Fetching second batch of signatures...');
        const secondBatch = await connection.getSignaturesForAddress(
            pubKey,
            { 
                limit: 1000,
                before: firstBatch[firstBatch.length - 1].signature
            }
        );

        // Combine both batches
        const signatures = [...firstBatch, ...secondBatch];
        console.log(`Total signatures fetched: ${signatures.length}`);

        // Filter last 24 hours
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const recentSignatures = signatures.filter(sig => 
            (sig.blockTime * 1000) > oneDayAgo
        );

        console.log(`Found ${recentSignatures.length} transactions in the last 24 hours`);

        // Get full transaction details with rate limiting
        const transactions = [];
        for (const sig of recentSignatures) {
            try {
                // Add delay between requests
                await sleep(100);

                const txDetails = await connection.getParsedTransaction(
                    sig.signature,
                    { maxSupportedTransactionVersion: 0 }
                );
                
                transactions.push({
                    signature: sig.signature,
                    timestamp: new Date(sig.blockTime * 1000),
                    status: sig.confirmationStatus,
                    details: txDetails
                });

                console.log(`Processed transaction ${transactions.length} of ${recentSignatures.length}`);
            } catch (err) {
                console.log(`Error processing transaction ${sig.signature}:`, err.message);
                if (err.message.includes('429')) {
                    console.log('Rate limit hit, waiting 2 seconds...');
                    await sleep(2000);
                }
            }
        }

        // Save to file
        fs.writeFileSync('transactions.json', JSON.stringify(transactions, null, 2));
        console.log(`Successfully saved ${transactions.length} transactions to transactions.json`);

    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
}

fetchTransactions();