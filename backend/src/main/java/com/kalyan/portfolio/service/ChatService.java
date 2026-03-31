package com.kalyan.portfolio.service;

import com.kalyan.portfolio.ai.*;
import com.kalyan.portfolio.entity.*;
import com.kalyan.portfolio.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * RAG-powered chat service for Kalyan's portfolio chatbot.
 *
 * Pipeline:
 *   1. Normalize question & check ResponseCache.
 *   2. Route question via QueryRouter to detect relevant domain(s).
 *   3. Fetch only relevant DB records.
 *   4. For project questions, also fetch GitHub README content.
 *   5. Build a compressed context via ContextBuilder.
 *   6. Send context + question to Gemini via ChatClient.
 *   7. Cache and return the response.
 */
@Service
public class ChatService {

    // ──────────────────────────────── DEPENDENCIES ──────────────────────────────

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private final ChatClient chatClient;
    private final ResponseCache responseCache;
    private final QueryRouter queryRouter;
    private final ContextBuilder contextBuilder;
    private final GitHubReadmeService gitHubReadmeService;

    // Repositories (used directly for lightweight reads)
    private final AboutRepository aboutRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final AchievementRepository achievementRepository;
    private final HobbyRepository hobbyRepository;

    // ──────────────────────────────── CONTEXT CACHE ──────────────────────────────

    private String cachedContext;
    private long lastCacheTime;
    private static final long CACHE_DURATION = 300_000; // 5 minutes in ms

    public ChatService(ChatClient.Builder chatClientBuilder,
                       ResponseCache responseCache,
                       QueryRouter queryRouter,
                       ContextBuilder contextBuilder,
                       GitHubReadmeService gitHubReadmeService,
                       AboutRepository aboutRepository,
                       SkillRepository skillRepository,
                       ProjectRepository projectRepository,
                       EducationRepository educationRepository,
                       CertificationRepository certificationRepository,
                       AchievementRepository achievementRepository,
                       HobbyRepository hobbyRepository) {
        this.chatClient             = chatClientBuilder.build();
        this.responseCache          = responseCache;
        this.queryRouter            = queryRouter;
        this.contextBuilder         = contextBuilder;
        this.gitHubReadmeService    = gitHubReadmeService;
        this.aboutRepository        = aboutRepository;
        this.skillRepository        = skillRepository;
        this.projectRepository      = projectRepository;
        this.educationRepository    = educationRepository;
        this.certificationRepository = certificationRepository;
        this.achievementRepository  = achievementRepository;
        this.hobbyRepository        = hobbyRepository;
    }

    // ──────────────────────────────── MAIN ENTRY ────────────────────────────────

    public String chat(String userMessage) {
        if (userMessage == null || userMessage.isBlank()) {
            return "Please ask me something about Kalyan's portfolio!";
        }

        // 1. Cache check — return immediately for repeated questions
        if (responseCache.contains(userMessage)) {
            return responseCache.get(userMessage);
        }

        try {
            // 2. Route question to detect relevant domains
            List<QueryType> types = queryRouter.route(userMessage);

            // 3. Build or reuse cached context
            String context = getOrBuildContext(types, userMessage);

            // Edge case: no data found in DB at all
            if (context.isBlank()) {
                String fallback = "I don't have enough portfolio data to answer that question yet.";
                responseCache.put(userMessage, fallback);
                return fallback;
            }

            // 4. Build Gemini prompt and call
            String answer = callGemini(userMessage, context);

            // 5. Cache and return
            responseCache.put(userMessage, answer);
            return answer;

        } catch (Exception e) {
            e.printStackTrace();
            return e.getMessage();
        }
    }

    // ──────────────────────────────── CONTEXT CACHE LOGIC ───────────────────────

    /**
     * Returns the cached full context if still valid, otherwise rebuilds it
     * from the database. DB fetch is logged when it occurs.
     */
    private String getOrBuildContext(List<QueryType> types, String userMessage) {
        long now = System.currentTimeMillis();

        // Return cached context if it is still fresh
        if (cachedContext != null && (now - lastCacheTime) < CACHE_DURATION) {
            return cachedContext;
        }

        // ── Cache miss → fetch from DB ────────────────────────────────────────
        log.info("DB FETCH EXECUTED");

        List<About>         aboutList      = new ArrayList<>();
        List<Skill>         skills         = new ArrayList<>();
        List<Project>       projects       = new ArrayList<>();
        List<Education>     education      = new ArrayList<>();
        List<Certification> certifications = new ArrayList<>();
        List<Achievement>   achievements   = new ArrayList<>();
        List<Hobby>         hobbies        = new ArrayList<>();

        // FIX: GENERAL no longer triggers a full fetch — use minimal fallback instead
        boolean includeAll = false;

        boolean isGeneral = types.isEmpty() || types.contains(QueryType.GENERAL);

        // ABOUT + SKILLS are always fetched for GENERAL / empty queries (minimal fallback)
        if (isGeneral || types.contains(QueryType.ABOUT))
            aboutList = aboutRepository.findAll();

        if (isGeneral || types.contains(QueryType.SKILLS))
            skills = skillRepository.findAll();

        // Remaining domains only when explicitly routed
        if (includeAll || types.contains(QueryType.PROJECTS))
            // FIX: limit to 5 projects to reduce payload size
            projects = projectRepository.findAll()
                           .stream()
                           .limit(5)
                           .collect(Collectors.toList());

        if (includeAll || types.contains(QueryType.EDUCATION))
            education = educationRepository.findAll();

        if (includeAll || types.contains(QueryType.CERTIFICATIONS))
            certifications = certificationRepository.findAll();

        if (includeAll || types.contains(QueryType.ACHIEVEMENTS))
            achievements = achievementRepository.findAll();

        if (includeAll || types.contains(QueryType.HOBBIES))
            hobbies = hobbyRepository.findAll();

        // FIX: GitHub README fetch is temporarily disabled to reduce latency/CPU
        // Uncomment the block below to re-enable external README fetching:
        /*
        Map<String, String> readmeMap = new HashMap<>();
        if ((includeAll || types.contains(QueryType.PROJECTS)) && !projects.isEmpty()) {
            List<Project> relevantProjects = filterRelevantProjects(projects, userMessage);
            for (Project p : relevantProjects) {
                if (p.getGithubLink() != null && !p.getGithubLink().isBlank()) {
                    String readme = gitHubReadmeService.fetchReadme(p.getGithubLink());
                    if (!readme.isBlank()) {
                        readmeMap.put(p.getGithubLink(), readme);
                    }
                }
            }
        }
        */
        Map<String, String> readmeMap = new HashMap<>();

        // Build compressed context and store in cache
        String context = buildContext(
            aboutList, skills, projects, education,
            certifications, achievements, hobbies, readmeMap
        );

        cachedContext = context;
        lastCacheTime = now;

        return context;
    }

    // ──────────────────────────────── GEMINI CALL ───────────────────────────────

    private String callGemini(String question, String context) {
        String systemPrompt = """
You are the AI assistant for Kalyan's portfolio website.

STRICT RULES:
- Answer ONLY using the portfolio data provided in CONTEXT below.
- NEVER invent information not present in the context.
- If the answer is not in the context, reply: "That information is not available on Kalyan's portfolio."
- When explaining a project, mention its tech stack, features, and architecture if present in context.
- When listing skills, group them by category if available.
- Keep answers clear and structured. Use bullet points for lists.
- Maximum response length: 6 sentences or equivalent bullet points.

CONTEXT:
%s
""".formatted(context);

        return chatClient
            .prompt()
            .system(systemPrompt)
            .user(question)
            .call()
            .content()
            .trim();
    }

    // ──────────────────────────────── CONTEXT BUILDER ───────────────────────────

    private String buildContext(List<About> aboutList,
                                 List<Skill> skills,
                                 List<Project> projects,
                                 List<Education> education,
                                 List<Certification> certifications,
                                 List<Achievement> achievements,
                                 List<Hobby> hobbies,
                                 Map<String, String> readmeMap) {
        StringBuilder sb = new StringBuilder();

        if (!aboutList.isEmpty())
            sb.append(contextBuilder.buildAboutContext(aboutList)).append("\n\n");
        if (!skills.isEmpty())
            sb.append(contextBuilder.buildSkillsContext(skills)).append("\n\n");
        if (!projects.isEmpty())
            sb.append(contextBuilder.buildProjectsContext(projects, readmeMap)).append("\n\n");
        if (!education.isEmpty())
            sb.append(contextBuilder.buildEducationContext(education)).append("\n\n");
        if (!certifications.isEmpty())
            sb.append(contextBuilder.buildCertificationsContext(certifications)).append("\n\n");
        if (!achievements.isEmpty())
            sb.append(contextBuilder.buildAchievementsContext(achievements)).append("\n\n");
        if (!hobbies.isEmpty())
            sb.append(contextBuilder.buildHobbiesContext(hobbies)).append("\n\n");

        return sb.toString().trim();
    }

    // ──────────────────────────────── RELEVANCE FILTER ──────────────────────────

    /**
     * Returns the subset of projects most relevant to the question.
     * Matches against project title, description, and tech stack keywords.
     * Falls back to all projects if nothing specific is matched.
     */
    private List<Project> filterRelevantProjects(List<Project> projects, String question) {
        String q = question.toLowerCase();
        List<Project> matched = projects.stream()
            .filter(p -> {
                String title = p.getTitle() != null ? p.getTitle().toLowerCase() : "";
                String tech  = p.getTechStack() != null ? p.getTechStack().toLowerCase() : "";
                return containsAnyWord(q, title.split("\\s+"))
                    || containsAnyWord(q, tech.split("[,\\s]+"));
            })
            .collect(Collectors.toList());

        return matched.isEmpty() ? projects : matched;
    }

    private boolean containsAnyWord(String text, String[] words) {
        for (String word : words) {
            if (word.length() > 2 && text.contains(word)) return true;
        }
        return false;
    }
}