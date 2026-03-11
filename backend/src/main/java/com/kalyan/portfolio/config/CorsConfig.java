package com.kalyan.portfolio.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

       registry.addMapping("/**")
        .allowedOrigins(
            "http://localhost:8083",
            "https://kalyan-portfolio-steel.vercel.app"
        )
        .allowedMethods("*")
        .allowedHeaders("*")
        .allowCredentials(true);
                .maxAge(3600);

    }
}
