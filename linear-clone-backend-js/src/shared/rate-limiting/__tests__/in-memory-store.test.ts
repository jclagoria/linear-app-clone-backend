import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryStore } from '../in-memory-store';

describe('InMemoryStore', () => {
  let store: InMemoryStore;

  beforeEach(() => {
    store = new InMemoryStore();
  });

  describe('increment', () => {
    it('should increment count for new key', async () => {
      const result = await store.increment('test-key', 60000);
      expect(result.count).toBe(1);
      expect(result.ttl).toBe(60000);
    });

    it('should increment count for existing key', async () => {
      await store.increment('test-key', 60000);
      const result = await store.increment('test-key', 60000);
      expect(result.count).toBe(2);
    });

    it('should reset count after window expires', async () => {
      vi.useFakeTimers();
      
      await store.increment('test-key', 60000);
      vi.advanceTimersByTime(61000);
      
      const result = await store.increment('test-key', 60000);
      expect(result.count).toBe(1);
      
      vi.useRealTimers();
    });
  });

  describe('decrement', () => {
    it('should decrement count', async () => {
      await store.increment('test-key', 60000);
      await store.increment('test-key', 60000);
      await store.decrement('test-key');
      
      const result = await store.get('test-key');
      expect(result?.count).toBe(1);
    });

    it('should not decrement below zero', async () => {
      await store.decrement('test-key');
      
      const result = await store.get('test-key');
      expect(result?.count ?? 0).toBe(0);
    });
  });

  describe('reset', () => {
    it('should delete the key', async () => {
      await store.increment('test-key', 60000);
      await store.reset('test-key');
      
      const result = await store.get('test-key');
      expect(result).toBeNull();
    });
  });

  describe('get', () => {
    it('should return null for non-existent key', async () => {
      const result = await store.get('non-existent');
      expect(result).toBeNull();
    });

    it('should return null for expired key', async () => {
      vi.useFakeTimers();
      
      await store.increment('test-key', 60000);
      vi.advanceTimersByTime(61000);
      
      const result = await store.get('test-key');
      expect(result).toBeNull();
      
      vi.useRealTimers();
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', async () => {
      vi.useFakeTimers();
      
      await store.increment('key1', 60000);
      await store.increment('key2', 60000);
      vi.advanceTimersByTime(61000);
      
      await store.cleanup();
      
      const result1 = await store.get('key1');
      const result2 = await store.get('key2');
      expect(result1).toBeNull();
      expect(result2).toBeNull();
      
      vi.useRealTimers();
    });
  });
});
