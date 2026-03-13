package com.kalyan.portfolio.ai;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Fetches and caches GitHub README files for portfolio projects.
 * Extracts the owner/repo from a GitHub URL and calls the raw content API.
 * Results are cached in-memory to avoid repeated GitHub API calls.
 */
@Service
public class GitHubReadmeService {

    private final WebClient webClient;
    private final ConcurrentHashMap<String, String> readmeCache = new ConcurrentHashMap<>();

    // Pattern to extract owner and repo from GitHub URLs
    private static final Pattern GITHUB_PATTERN =
        Pattern.compile("github\\.com/([^/]+)/([^/]+?)(?:\\.git)?(?:[/?#].*)?$");

    public GitHubReadmeService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .baseUrl("https://raw.githubusercontent.com")
            .defaultHeader("Accept", "text/plain")
            .defaultHeader("User-Agent", "KalyanPortfolioChatbot/1.0")
            .build();
    }

    /**
     * Fetches and returns the README for a GitHub repo URL.
     * Returns an empty string if not found or if the URL is invalid.
     * Results are cached — repeated calls for the same URL return instantly.
     */
    public String fetchReadme(String githubUrl) {
        if (githubUrl == null || githubUrl.isBlank()) return "";

        // Return cached version if available
        if (readmeCache.containsKey(githubUrl)) {
            return readmeCache.get(githubUrl);
        }

        String[] ownerRepo = extractOwnerAndRepo(githubUrl);
        if (ownerRepo == null) return "";

        String owner = ownerRepo[0];
        String repo  = ownerRepo[1];

        try {
            // Try README.md first (most common), then README
            String content = tryFetchReadme(owner, repo, "README.md");
            if (content == null || content.isBlank()) {
                content = tryFetchReadme(owner, repo, "README");
            }
            if (content == null) content = "";

            // Summarize if too long (keep first ~2000 chars to limit tokens)
            if (content.length() > 2000) {
                content = content.substring(0, 2000) + "\n[README truncated...]";
            }

            readmeCache.put(githubUrl, content);
            return content;

        } catch (Exception e) {
            readmeCache.put(githubUrl, ""); // cache empty on error to avoid retries
            return "";
        }
    }

    private String tryFetchReadme(String owner, String repo, String filename) {
        try {
            return webClient.get()
                .uri("/{owner}/{repo}/HEAD/{file}", owner, repo, filename)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorReturn("")
                .block();
        } catch (Exception e) {
            return "";
        }
    }

    private String[] extractOwnerAndRepo(String url) {
        Matcher matcher = GITHUB_PATTERN.matcher(url);
        if (matcher.find()) {
            return new String[]{ matcher.group(1), matcher.group(2) };
        }
        return null;
    }

    public int cacheSize() {
        return readmeCache.size();
    }
}
