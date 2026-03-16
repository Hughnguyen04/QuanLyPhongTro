//package com.example.quanlyphongtro.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//public class SecurityConfig {
//    @Bean
//    public PasswordEncoder passwordEncoder(){
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
//        http.cors(Customizer.withDefaults()) //bật cors
//                .csrf(csrf -> csrf.disable());//tắt csrf khi test api
//                .authorizeHttpRequests(auth -> auth
//                    // Cho phép đăng ký và đăng nhập không cần xác thực
//                    .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
//                    // Chỉ ADMIN mới được quản lý tài khoản
//                    .requestMatchers("/api/accounts/**").hasRole("ADMIN")
//                    // STAFF có thể quản lý phòng
//                    .requestMatchers("/api/rooms/**").hasAnyRole("ADMIN", "STAFF")
//                    // GUEST chỉ được xem thông tin phòng
//                    .requestMatchers("/api/public/**").hasAnyRole("ADMIN", "STAFF", "GUEST")
//                    // Các request khác phải đăng nhập
//                    .anyRequest().authenticated()
//                );
//        return http.build();
//    }
//}
