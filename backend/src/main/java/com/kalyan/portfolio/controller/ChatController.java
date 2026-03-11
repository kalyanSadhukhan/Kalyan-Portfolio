package com.kalyan.portfolio.controller;

import com.kalyan.portfolio.dto.ChatRequest;
import com.kalyan.portfolio.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:8083")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public Map<String, String> chat(@RequestBody ChatRequest request) {

        String reply = chatService.chat(request.getMessage());

        return Map.of(
                "reply", reply
        );
    }
}