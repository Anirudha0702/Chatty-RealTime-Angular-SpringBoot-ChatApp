package com.chat.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class JwtResponse {
    @JsonProperty("access_token")
    private String accessToken;

    private User user;

    public JwtResponse(String token, User user) {
        this.accessToken = token;
        this.user = user;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
