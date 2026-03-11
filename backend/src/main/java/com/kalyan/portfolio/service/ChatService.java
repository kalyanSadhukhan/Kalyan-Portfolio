package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.About;
import com.kalyan.portfolio.entity.Project;
import com.kalyan.portfolio.entity.Skill;
import com.kalyan.portfolio.repository.AboutRepository;
import com.kalyan.portfolio.repository.ProjectRepository;
import com.kalyan.portfolio.repository.SkillRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    private final ChatClient chatClient;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final AboutRepository aboutRepository;
    private final ContextBuilder contextBuilder;

    public ChatService(ChatClient.Builder chatClientBuilder,
                       SkillRepository skillRepository,
                       ProjectRepository projectRepository,
                       AboutRepository aboutRepository,
                       ContextBuilder contextBuilder) {
        this.chatClient = chatClientBuilder.build();
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.aboutRepository = aboutRepository;
        this.contextBuilder = contextBuilder;
    }

    public String chat(String userMessage) {

        List<Skill> skills = skillRepository.findAll();
        List<Project> projects = projectRepository.findAll();
        List<About> about = aboutRepository.findAll();

        String portfolioDataTemplate = contextBuilder.buildContext(skills, projects, about);

        String systemPrompt = """
You are the AI assistant for Kalyan's portfolio website.

STRICT RULES:
- Only answer using the portfolio data provided below.
- NEVER invent companies, universities, job titles, experiences, or projects.
- If the user asks about information not listed, reply:
  "That information is not available on Kalyan's portfolio."

Response rules:
- Maximum 4 sentences.
- Use bullet points when listing items.
- Keep answers short and structured.

PORTFOLIO DATA:
%s
""";

        String formattedSystemPrompt = String.format(systemPrompt, portfolioDataTemplate);

        try {
            String response = chatClient
                    .prompt()
                    .system(formattedSystemPrompt)
                    .user(userMessage)
                    .call()
                    .content()
                    .trim();

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            return "ERROR: " + e.getMessage();
        }
    }
}