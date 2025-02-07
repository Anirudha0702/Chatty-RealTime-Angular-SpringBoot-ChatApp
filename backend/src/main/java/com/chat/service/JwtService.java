package com.chat.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {
    private static final String SECRET_KEY = "dDlh2X3gYJqf/63XWojW82XtaUjJXJxBQtPCw1pi7Lc="; // 32+ character Base64-encoded key

    // ✅ Generate Secret Key
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ✅ Generate JWT Token (Uses `UserDetails`)
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())  // Fixes deprecated `setSubject()`
                .issuedAt(new Date())  // Fixes deprecated `setIssuedAt()`
                .expiration(new Date(System.currentTimeMillis() + 864_000_000)) // 10 days
                .signWith(getSigningKey()) // Fixes deprecated `signWith()`
                .compact();
    }

    // ✅ Validate JWT Token
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    // ✅ Extract Username from Token
    public String extractUsername(String token) {
        return parseClaims(token).getSubject();
    }

    // ✅ Check if Token is Expired
    private boolean isTokenExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }

    // ✅ Parse JWT Claims Safely
    private Claims parseClaims(String token) {
        Jws<Claims> jws = Jwts.parser()
                .verifyWith(getSigningKey())  // Fixes deprecated `parseClaimsJws()`
                .build()
                .parseSignedClaims(token);
        return jws.getPayload();
    }
}
