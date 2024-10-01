package com.example.timetable.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:8080")  // 허용할 도메인 설정
                        .allowedMethods("GET", "POST", "PUT", "DELETE")  // 허용할 HTTP 메서드 설정
                        .allowedHeaders("*")
                        .allowCredentials(true);
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:63342")  // 프론트엔드 도메인
                        .allowedMethods("GET", "POST");
            }
        };
    }
}
