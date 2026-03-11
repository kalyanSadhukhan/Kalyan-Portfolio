package com.kalyan.portfolio.service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatClient chatClient;

    public ChatService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public String chat(String userMessage) {

        String systemPrompt = """
You are the AI assistant for Kalyan's portfolio website.

STRICT RULES:
- Only answer using the portfolio data provided below.
- NEVER invent companies, universities, job titles, or experiences.
- If the user asks about information not listed, reply:
  "That information is not available on Kalyan's portfolio."

Response rules:
- Maximum 4 sentences.
- Use bullet points when listing items.
- Keep answers short and structured.

PORTFOLIO DATA:

Name: Kalyan

Skills:
- Spring Boot
- Java
- REST API Development
- AI integration
- Backend development

Projects:
- AI Portfolio Assistant
- Full-stack portfolio website

Experience:
- Backend development using Spring Boot
- Building AI-enabled web applications
- Designing REST APIs
""";

        try {

            String response = chatClient
                    .prompt()
                    .system(systemPrompt)
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