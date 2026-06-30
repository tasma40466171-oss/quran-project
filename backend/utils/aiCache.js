// utils/aiCache.js
"use strict";

/**
 * Simple in-memory cache for AI responses
 * Cache key format: "ai:{model}:{hash of input}"
 * Cache TTL: 1 hour (configurable)
 */

const cache = new Map();
const DEFAULT_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Generate a hash key for the input
 */
function generateKey(model, input) {
    const crypto = require('crypto');
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const hash = crypto.createHash('md5').update(inputStr).digest('hex');
    return `ai:${model}:${hash}`;
}

/**
 * Get cached response if available and not expired
 */
function get(model, input) {
    const key = generateKey(model, input);
    const cached = cache.get(key);
    
    if (!cached) {
        return null;
    }
    
    // Check if expired
    if (Date.now() > cached.expiresAt) {
        cache.delete(key);
        return null;
    }
    
    console.log(`[AI Cache] Cache hit for key: ${key}`);
    return cached.data;
}

/**
 * Set cached response with TTL
 */
function set(model, input, data, ttl = DEFAULT_TTL) {
    const key = generateKey(model, input);
    const expiresAt = Date.now() + ttl;
    
    cache.set(key, {
        data,
        expiresAt,
        createdAt: Date.now(),
    });
    
    console.log(`[AI Cache] Cached response for key: ${key} (TTL: ${ttl}ms)`);
}

/**
 * Clear expired cache entries
 */
function clearExpired() {
    const now = Date.now();
    let cleared = 0;
    
    for (const [key, value] of cache.entries()) {
        if (now > value.expiresAt) {
            cache.delete(key);
            cleared++;
        }
    }
    
    console.log(`[AI Cache] Cleared ${cleared} expired entries`);
    return cleared;
}

/**
 * Clear all cache entries
 */
function clearAll() {
    const size = cache.size;
    cache.clear();
    console.log(`[AI Cache] Cleared all ${size} entries`);
    return size;
}

/**
 * Get cache statistics
 */
function getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;
    
    for (const [key, value] of cache.entries()) {
        if (now > value.expiresAt) {
            expired++;
        } else {
            active++;
        }
    }
    
    return {
        total: cache.size,
        active,
        expired,
    };
}

// Auto-clear expired entries every 10 minutes
setInterval(clearExpired, 10 * 60 * 1000);

module.exports = {
    get,
    set,
    clearExpired,
    clearAll,
    getStats,
    DEFAULT_TTL,
};
