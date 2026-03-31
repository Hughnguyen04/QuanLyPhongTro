<?php
 
// Middleware kiểm tra JWT token và phân quyền
 
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
 
function checkAuth($requiredRoles = []) {
    // Lấy header Authorization
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        exit(json_encode(["error" => "Missing Authorization header"]));
    }
 
    $authHeader = $headers['Authorization'];
    if (strpos($authHeader, 'Bearer ') !== 0) {
        http_response_code(401);
        exit(json_encode(["error" => "Invalid Authorization header"]));
    }
 
    $jwt = substr($authHeader, 7);
 
    try {
        // Verify token với secret
        $decoded = JWT::decode($jwt, new Key("NGOC_ANH_KEL_SUPER_SECRET_KEY_FOR_JWT_TOKEN_GENERATION_123456789", "HS512"));
        
        // ✅ CÁCH 1: Xử lý 'roles' array (chuẩn Spring Security)
        if (!isset($decoded->roles) || !is_array($decoded->roles)) {
            http_response_code(400);
            exit(json_encode(["error" => "Token missing 'roles' array"]));
        }
 
        // Trích xuất các authority từ roles array
        $userRoles = array_map(function($role) {
            return $role->authority ?? null;
        }, $decoded->roles);
        $userRoles = array_filter($userRoles); // Loại bỏ null values
 
        // Kiểm tra role có nằm trong danh sách cho phép không
        if (!empty($requiredRoles)) {
            $hasRequiredRole = false;
            foreach ($requiredRoles as $required) {
                if (in_array($required, $userRoles)) {
                    $hasRequiredRole = true;
                    break;
                }
            }
            
            if (!$hasRequiredRole) {
                http_response_code(403);
                exit(json_encode(["error" => "Forbidden", "required" => $requiredRoles, "userRoles" => $userRoles]));
            }
        }
 
        // Thêm roles vào decoded object để sử dụng sau
        $decoded->userRoles = $userRoles;
        
        return $decoded; // trả về payload để API dùng tiếp
    } catch (Exception $e) {
        http_response_code(401);
        exit(json_encode(["error" => "Invalid token", "message" => $e->getMessage()]));
    }
}