const AGENT_PREFIX = 'AGENT_';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function generateAgentWallet() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    const randomString = Array.from(array)
        .map(b => CHARS[b % CHARS.length])
        .join('')
        .slice(0, 24);
    return `${AGENT_PREFIX}${randomString}`;
}
export function shortenWallet(wallet, chars = 4) {
    if (!wallet)
        return 'Unknown';
    return `${wallet.slice(0, chars)}...${wallet.slice(-chars)}`;
}
//# sourceMappingURL=wallet.js.map