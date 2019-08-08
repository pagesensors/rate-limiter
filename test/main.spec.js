const sleep = require('util').promisify(setTimeout);
const RateLimiter = require('../src');

const oneSecond = 1100; // Sometimes setTimeout fires 40ms earlier than expected

describe("main", function () {

    it("missing capacity", async () => {
        try {
            const rateLimiter = new RateLimiter();
        } catch (e) {
            expect(e);
        }
    });

    it("missing windowTime", async () => {
        try {
            const rateLimiter = new RateLimiter(1);
        } catch (e) {
            expect(e);
        }
    });

    it("tryConsume single bucket, rate 1 req/sec", async () => {
        const rateLimiter = new RateLimiter(1, 1000);
        expect(rateLimiter.tryConsume('google.com')).toBe(true);
        expect(rateLimiter.tryConsume('google.com')).toBe(false);
        expect(rateLimiter.tryConsume('google.fr')).toBe(true);
        expect(rateLimiter.tryConsume('google.fr')).toBe(false);
        await sleep(oneSecond);
        
        expect(rateLimiter.tryConsume('google.com')).toBe(true);
        expect(rateLimiter.tryConsume('google.com')).toBe(false);
        expect(rateLimiter.tryConsume('google.fr')).toBe(true);
        expect(rateLimiter.tryConsume('google.fr')).toBe(false);
    });

    it("tryConsume single bucket, rate 1 req/ 2 sec", async () => {
        const rateLimiter = new RateLimiter(1, 2000);
        expect(rateLimiter.tryConsume('google.com')).toBe(true);
        expect(rateLimiter.tryConsume('google.com')).toBe(false);
        expect(rateLimiter.tryConsume('google.fr')).toBe(true);
        expect(rateLimiter.tryConsume('google.fr')).toBe(false);
        await sleep(oneSecond)

        expect(rateLimiter.tryConsume('google.com')).toBe(false);
        expect(rateLimiter.tryConsume('google.fr')).toBe(false);
        await sleep(oneSecond)

        expect(rateLimiter.tryConsume('google.com')).toBe(true);
        expect(rateLimiter.tryConsume('google.fr')).toBe(true);
    });

});
