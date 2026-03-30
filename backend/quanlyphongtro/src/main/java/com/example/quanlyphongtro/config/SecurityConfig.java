package com.example.quanlyphongtro.config;

//import com.example.quanlyphongtro.utils.JwtFilter;
import com.example.quanlyphongtro.utils.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.cors(Customizer.withDefaults()) //bật cors
                .csrf(csrf -> csrf.disable())//tắt csrf khi test api
                .authorizeHttpRequests(auth -> auth
                    // Cho phép đăng nhập không cần xác thực
                    .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                    // ADMIN và STAFF mới được tạo tài khoản
//                    .requestMatchers("/api/auth/register").hasAnyRole("ADMIN", "STAFF")
                    // Chỉ ADMIN mới được quản lý tài khoản
                    .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "STAFF")
                    // Chỉ ADMIN mới được gửi thông báo
                    .requestMatchers("/api/notifications/create").hasRole("ADMIN")
                    // Nhân viên và khách sẽ đọc thông báo
                    .requestMatchers("/api/notifications").hasAnyRole("STAFF", "GUEST")
                    //Đánh dấu đã đọc
                    .requestMatchers("/api/notifications/*/read").hasAnyRole("STAFF", "GUEST")
                    // ADMIN và STAFF có thể quản lý phòng
                    //.requestMatchers("/api/rooms/**").hasAnyRole("ADMIN", "STAFF")
                    //ADMIN và STAFF có thể quản lý người thuê
                    //.requestMatchers("api/tenants/**").hasAnyRole("ADMIN", "STAFF")
                    // GUEST chỉ được xem thông tin phòng
                    //.requestMatchers("/api/room/details").hasAnyRole("ADMIN", "STAFF", "GUEST")
                    // Các request khác phải đăng nhập
                    .anyRequest().authenticated() // các API khác thì yêu cầu đăng nhập
                )
                // tắt session để chỉ log với jwttoken
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        // Thêm jwtFilter(cách login khác để thay login mặc định) vào trước UsernamePwFilter(login mặc định) để check quyền
        // Thứ tự filter: ...-> jwt -> userAuth -> AuthorizationFilter(check role)
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
