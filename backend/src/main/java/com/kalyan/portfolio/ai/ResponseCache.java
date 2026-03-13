package com.kalyan.portfolio.ai;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

/**
 * Thread-safe in-memory cache for chat responses.
 * Caches by normalized (lowercase + trimmed) question text so that
 * identical questions skip Gemini and return instantly.
 */
@Component
public class ResponseCache {

    private final ConcurrentHashMap<String, String> cache = new ConcurrentHashMap<>();

    private String normalize(String question) {
        return question == null ? "" : question.toLowerCase().trim();
    }

    public boolean contains(String question) {
        return cache.containsKey(normalize(question));
    }

    public String get(String question) {
        return cache.get(normalize(question));
    }

    public void put(String question, String answer) {
        if (question != null && answer != null) {
            cache.put(normalize(question), answer);
        }
    }

    public void clear() {
        cache.clear();
    }

    public int size() {
        return cache.size();
    }
}
