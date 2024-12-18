const { Keypair } = require('@solana/web3.js');
const { TextEncoder } = require('util');
const nacl = require('tweetnacl');

// The provided secret key array
const secretKeyArray = [

];

const secretKey = Uint8Array.from(secretKeyArray);
const keypair = Keypair.fromSecretKey(secretKey);

// Message to sign
const message = 'Hello Nosana Node!';
const encodedMessage = new TextEncoder().encode(message);

// Use tweetnacl to sign the message
const signature = nacl.sign.detached(encodedMessage, keypair.secretKey);
const signatureBase64 = Buffer.from(signature).toString('base64');
const publicKeyString = keypair.publicKey.toBase58();

// Node API endpoint
const nodeUrl = 'https://3vwMHHicGk9enrHst7cJhbucNWSMyMDuB8G9HX1DQk7A.node.k8s.dev.nos.ci/service/stop/testjobid123';

// Headers
const headers = {
  Authorization: `${publicKeyString}:${signatureBase64}`
};

(async () => {
  try {
    // Using native fetch in Node.js 18+
    const response = await fetch(nodeUrl, {
      method: 'POST',
      headers
    });
    const text = await response.text();

    console.log('Response status:', response.status);
    console.log('Response body:', text);

    if (!response.ok) {
      console.error('Error stopping job:', response.status, text);
    } else {
      console.log('Job stopped successfully (or no job found, but auth worked).');
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();
