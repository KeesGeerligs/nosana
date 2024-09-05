/**
 * Returns chunks of size n.
 * @param {Array<any>} array any array
 * @param {number} n size of chunk
 */
export function* chunks(array, n) {
  for (let i = 0; i < array.length; i += n) yield array.slice(i, i + n);
}
