# 마이그레이션 3 실패 해결 가이드

## 문제 상황

마이그레이션 `3_add_current_routine_id`가 실패하여 새로운 마이그레이션이 적용되지 않습니다.

## 원인

`Routine` 테이블이 데이터베이스에 존재하지 않아 외래 키 제약 조건을 추가할 수 없었습니다.

## 해결 방법

### 방법 1: Neon 콘솔에서 직접 실행 (권장)

1. Neon 대시보드에 로그인
2. 데이터베이스 SQL Editor 열기
3. 다음 SQL 실행:

```sql
-- 실패한 마이그레이션을 rolled back으로 표시
UPDATE "_prisma_migrations"
SET rolled_back_at = NOW(),
    finished_at = NOW(),
    applied_steps_count = 0,
    logs = 'Migration rolled back: Routine table does not exist. Column will be added in a future migration.'
WHERE migration_name = '3_add_current_routine_id'
AND finished_at IS NULL;
```

4. 확인:

```sql
SELECT * FROM "_prisma_migrations" WHERE migration_name = '3_add_current_routine_id';
```

### 방법 2: 로컬에서 스크립트 실행

```bash
# DATABASE_URL 환경 변수 설정 후
./scripts/fix-migration-3.sh
```

### 방법 3: Vercel 환경 변수로 해결

Vercel에서는 직접 실행할 수 없으므로, Neon 콘솔에서 방법 1을 사용하세요.

## 확인

해결 후 다음 명령으로 확인:

```bash
pnpm prisma migrate status
```

모든 마이그레이션이 정상 상태여야 합니다.

## 참고

- `currentRoutineId` 컬럼은 이미 추가되었을 수 있습니다 (마이그레이션이 부분적으로 실행됨)
- 외래 키 제약 조건은 `Routine` 테이블이 생성된 후 별도 마이그레이션으로 추가할 수 있습니다
- 수정된 마이그레이션 파일은 이미 조건부 로직을 포함하고 있어 재실행해도 안전합니다
