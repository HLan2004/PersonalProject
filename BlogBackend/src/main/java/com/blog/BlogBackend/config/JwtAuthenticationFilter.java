package com.blog.BlogBackend.config;

import com.blog.BlogBackend.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;

@Component
@AllArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final HandlerExceptionResolver handlerExceptionResolver;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        System.out.println("[DEBUG] Filter is running. Request: " + request.getRequestURI());

        final String authHeader = request.getHeader("Authorization");
        System.out.println("[DEBUG] Authorization header: " + authHeader);

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("[DEBUG] No valid Authorization header found.");
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);
            System.out.println("[DEBUG] Extracted username: " + userEmail);

            // ✅ Kiểm tra đúng cách
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);
                System.out.println("[DEBUG] User authorities: " + userDetails.getAuthorities());


                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // ✅ Thiết lập Authentication vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    // ✅ Ghi log để kiểm tra
                    System.out.println("[DEBUG] Token hợp lệ, xác thực user: " + userEmail);
                } else {
                    System.out.println("[DEBUG] Token invalid.");
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception exception) {
            System.out.println("[ERROR] Exception in JWT Filter: " + exception.getMessage());
            handlerExceptionResolver.resolveException(request, response, null, exception);
        }
    }
}
