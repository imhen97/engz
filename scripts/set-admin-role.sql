-- 기존 사용자를 admin으로 설정하는 SQL 스크립트
-- 사용법: 이메일 주소를 변경한 후 실행하세요

-- 예시 1: 특정 이메일의 사용자를 admin으로 설정
UPDATE "User" 
SET "role" = 'admin' 
WHERE "email" = 'your-email@example.com';

-- 예시 2: 모든 사용자 확인 (role이 null인지 확인)
SELECT id, "name", "email", "role", "createdAt" 
FROM "User" 
ORDER BY "createdAt" DESC 
LIMIT 10;

-- 예시 3: admin 권한이 있는 사용자 확인
SELECT id, "name", "email", "role" 
FROM "User" 
WHERE "role" = 'admin';

