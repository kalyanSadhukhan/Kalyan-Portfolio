package com.kalyan.portfolio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kalyan.portfolio.entity.About;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AboutTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testControllerPut() throws Exception {
        About about = new About();
        about.setBio("Original");

        MvcResult postResult = mockMvc.perform(post("/api/about")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(about)))
                .andExpect(status().isOk())
                .andReturn();

        About created = objectMapper.readValue(postResult.getResponse().getContentAsString(), About.class);

        About update = new About();
        update.setBio("Updated via Controller");
        update.setProfileImageUrl("some-url");

        MvcResult putResult = mockMvc.perform(put("/api/about/" + created.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(update)))
                .andReturn();

        System.out.println("PUT Status: " + putResult.getResponse().getStatus());
        if (putResult.getResolvedException() != null) {
            putResult.getResolvedException().printStackTrace();
        }
    }
}
