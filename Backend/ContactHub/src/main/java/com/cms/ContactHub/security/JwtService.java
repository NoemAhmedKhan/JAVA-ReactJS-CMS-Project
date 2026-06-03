package com.cms.ContactHub.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;

@Service
public class JwtService {
//    SECRET KEY
    private final String secretKey = "HsNoW37mySecretKEyi6o9KEy24Tm5NoNLiyUy2oF33Ds9FXJWT";

    public String generateToken(String email) {
        // CONVERT SECRET KEY STRING INTO KEY OBJECT
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

        // GENERATE JWT
        return Jwts.builder()
                .setSubject(email) // STORE USER EMAIL
                .setIssuedAt(new Date()) // TOKEN CREATED TIME
                .setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60))) // TOKEN EXPIRATION TIME (1 HOUR)
                .signWith(key, SignatureAlgorithm.HS256) // SIGN TOKEN
                .compact(); // CONVERT TOKEN TO STRING
    }

    public boolean validateToken(String token) {
        // CONVERT SECRET KEY STRING INTO SECRET KEY OBJECT
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes());

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String email = claims.getSubject();

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());

            SecurityContextHolder.getContext().setAuthentication(auth);

            return true;
        }catch (Exception e){
            return false;
        }
    }

}
