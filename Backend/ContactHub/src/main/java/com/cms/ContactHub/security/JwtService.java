package com.cms.ContactHub.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;

@Service
public class JwtService {

    @Autowired
    private UserDetailsService userDetailsService;

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

//            COLLECT EMAIL FROM JWT
            String email = claims.getSubject();
//            COLLECT USER DETAILS OBJECT (USER ENTITY WRAPPED INTO CUSTOM USER DETAILS)
            UserDetails user = userDetailsService.loadUserByUsername(email);
//            STORE USER DETAILS (USER ENTITY) INTO SECURITY CONTEXT HOLDER PROVIDING AUTHENTICATED USER ENTITY TO SPRING SECURITY FOR CURRENT REQUEST AFTER JWT VALIDATION THROUGH JWT FILTER
            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(auth);
            return true;

        }catch (Exception e){
            return false;
        }
    }

}
