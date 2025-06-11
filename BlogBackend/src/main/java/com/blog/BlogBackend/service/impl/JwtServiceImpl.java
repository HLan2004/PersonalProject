package com.blog.BlogBackend.service.impl;

import com.blog.BlogBackend.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.expiration-time}")
    private Long jwtExpiration;

    private static final long EXTENDED_EXPIRATION = 30L * 24 * 60 * 60 * 1000; // 30 days
    private static final long INACTIVITY_TIMEOUT = 60 * 60 * 1000;



    private final Map<String, Long> tokenLastActivity = new ConcurrentHashMap<>();
    private final Set<String> tokenBlacklist = ConcurrentHashMap.newKeySet();



    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        // Use extended expiration for new tokens
        String token = buildToken(extraClaims, userDetails, EXTENDED_EXPIRATION);
        // Track initial activity
        tokenLastActivity.put(token, System.currentTimeMillis());
        return token;
    }


    public Long getExpirationTime() {
        return jwtExpiration;
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
        // Check if token is blacklisted
        if (tokenBlacklist.contains(token)) {
            return false;
        }

        // Check if token is inactive for too long
        if (isTokenInactive(token)) {
            return false;
        }

        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }


    public boolean isTokenValid(String token) {
        try {
            // Check if token is blacklisted
            if (tokenBlacklist.contains(token)) {
                return false;
            }

            // Check if token is inactive for too long
            if (isTokenInactive(token)) {
                return false;
            }

            // Basic token validation - check if not expired and properly formatted
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenInactive(String token) {
        Long lastActivity = tokenLastActivity.get(token);
        if (lastActivity == null) {
            return true; // No activity recorded, consider inactive
        }

        long currentTime = System.currentTimeMillis();
        return (currentTime - lastActivity) > INACTIVITY_TIMEOUT;
    }

    public void updateTokenActivity(String token) {
        if (token != null && !tokenBlacklist.contains(token)) {
            tokenLastActivity.put(token, System.currentTimeMillis());
        }
    }




    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            Long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public boolean isTokenNearExpiration(String token) {
        return false;
    }

    @Override
    public String refreshToken(String token) {
        updateTokenActivity(token);
        return token; // Return the same token with updated activity
    }


    @Override
    public void invalidateToken(String token) {
        tokenBlacklist.add(token);
        tokenLastActivity.remove(token); // Clean up activity tracking
    }

    // Cleanup method to remove old inactive tokens (optional - for memory management)
    public void cleanupInactiveTokens() {
        long currentTime = System.currentTimeMillis();
        tokenLastActivity.entrySet().removeIf(entry ->
                (currentTime - entry.getValue()) > INACTIVITY_TIMEOUT);
    }


}
