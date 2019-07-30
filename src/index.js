class RateLimiter {

    constructor(capacity, windowTime) {
        if (!capacity) {
            throw new Error("capacity not set");
        }
        if (!windowTime) {
            throw new Error("windowTime not set");
        }
        this.capacity = capacity;
        this.windowTime = windowTime;
        this.refillCountPerSecond = capacity / windowTime;
        this.lastRefillTimeStamp = new Map();
        this.availableTokens = new Map();
    }

    tryConsume(bucket) {
        this.refill(bucket);

        const availableTokens = this.availableTokens.get(bucket);
        if (availableTokens >= 1) {
            this.availableTokens.set(bucket, availableTokens - 1);
            return true;
        }
        return false;
    }

    refill(bucket) {
        const now = Date.now();

        if (!this.lastRefillTimeStamp.has(bucket)) {
            this.lastRefillTimeStamp.set(bucket, now);
            this.availableTokens.set(bucket, this.capacity);
            return;
        }

        const elapsedTime = now - this.lastRefillTimeStamp.get(bucket);
        if (elapsedTime > 0) {
            const tokensToBeAdded = elapsedTime * this.refillCountPerSecond;
            if (tokensToBeAdded > 0) {
                this.availableTokens.set(bucket, Math.min(this.capacity, this.availableTokens.get(bucket) + tokensToBeAdded));
                this.lastRefillTimeStamp.set(bucket, now);
            }
        }
    }
}

module.exports = RateLimiter;
