package com.example.quanlyphongtro.utils;

import com.example.quanlyphongtro.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "NGOC_ANH_KEL_SUPER_SECRET_KEY_FOR_JWT_TOKEN_GENERATION_123456789"; //set động trong config sau
    private final long EXPIRATION_TIME = 36000000;

    // SecretKeySpec -> biến byte[] (getBytes()) thành object  Key
    private final Key SIGNING_KEY = new SecretKeySpec(
            SECRET_KEY.getBytes(StandardCharsets.UTF_8),
            SignatureAlgorithm.HS512.getJcaName());

    // Tạo token từ username
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) //set 1h
                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
                .compact();
    }
//    public String generateToken(UserDetails userDetails) {
//        return Jwts.builder()
//                .setSubject(userDetails.getUsername())
//                .claim("roles", userDetails.getAuthorities())
//                .setIssuedAt(new Date())
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) //set 1h
//                .signWith(SIGNING_KEY, SignatureAlgorithm.HS512)
//                .compact();
//    }

    // Giải mã token lấy username
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Xác thực token
    public boolean validateToken(String token, UserDetails userDetails){
        return extractUsername(token)
                .equals(userDetails.getUsername()) &&
                !isTokenExprired(token);
    }

    // Xét token còn hạn
    public boolean isTokenExprired(String token) {
        Date expiration = Jwts.parserBuilder()
                .setSigningKey(SIGNING_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
        return expiration.before(new Date());
    }
}
