const sleep = require('util').promisify(setTimeout);
const { assert } = require('chai');
const RateLimiter = require('../src');

const oneSecond = 1100; // Sometimes setTimeout fires 40ms earlier than expected

describe("main", function () {

    this.timeout(5000);

    it("missing capacity", async () => {
        try {
            const rateLimiter = new RateLimiter();
        } catch (e) {
            assert(e);
        }
    });

    it("missing windowTime", async () => {
        try {
            const rateLimiter = new RateLimiter(1);
        } catch (e) {
            assert(e);
        }
    });

    it("tryConsume single bucket, rate 1 req/sec", async () => {
        const rateLimiter = new RateLimiter(1, 1000);
        assert(rateLimiter.tryConsume('google.com') === true);
        assert(rateLimiter.tryConsume('google.com') === false);
        assert(rateLimiter.tryConsume('google.fr') === true);
        assert(rateLimiter.tryConsume('google.fr') === false);
        await sleep(oneSecond);
        
        assert(rateLimiter.tryConsume('google.com') === true);
        assert(rateLimiter.tryConsume('google.com') === false);
        assert(rateLimiter.tryConsume('google.fr') === true);
        assert(rateLimiter.tryConsume('google.fr') === false);
    });

    it("tryConsume single bucket, rate 1 req/ 2 sec", async () => {
        const rateLimiter = new RateLimiter(1, 2000);
        assert(rateLimiter.tryConsume('google.com') === true);
        assert(rateLimiter.tryConsume('google.com') === false);
        assert(rateLimiter.tryConsume('google.fr') === true);
        assert(rateLimiter.tryConsume('google.fr') === false);
        await sleep(oneSecond)

        assert(rateLimiter.tryConsume('google.com') === false);
        assert(rateLimiter.tryConsume('google.fr') === false);
        await sleep(oneSecond)

        assert(rateLimiter.tryConsume('google.com') === true);
        assert(rateLimiter.tryConsume('google.fr') === true);
    });

});
