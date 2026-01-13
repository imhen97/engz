# useApiCall Hook 사용 예시

## 기본 사용법

```typescript
import { useApiCall } from "@/hooks/useApiCall";

function MyComponent() {
  const { data, error, isLoading, execute } = useApiCall<UserData>();

  const handleFetch = async () => {
    await execute(
      () => fetch("/api/user"),
      (userData) => {
        // 성공 콜백
        console.log("사용자 데이터:", userData);
      },
      (errorMessage) => {
        // 에러 콜백
        console.error("에러:", errorMessage);
      }
    );
  };

  return (
    <div>
      {isLoading && <p>로딩 중...</p>}
      {error && <p>에러: {error}</p>}
      {data && <p>데이터: {JSON.stringify(data)}</p>}
      <button onClick={handleFetch}>데이터 가져오기</button>
    </div>
  );
}
```

## POST 요청 예시 (성공 토스트 포함)

```typescript
import { useApiCall } from "@/hooks/useApiCall";

function CreateUserForm() {
  const { execute, isLoading } = useApiCall<User>({
    showSuccessToast: true,
    successMessage: "사용자가 성공적으로 생성되었습니다",
    showErrorToast: true, // 기본값이지만 명시적으로 설정
  });

  const handleSubmit = async (formData: FormData) => {
    await execute(
      () =>
        fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
          }),
        }),
      (newUser) => {
        // 성공 시 추가 처리
        router.push(`/user/${newUser.id}`);
      }
    );
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit(new FormData(e.currentTarget));
    }}>
      {/* 폼 필드 */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "생성 중..." : "생성하기"}
      </button>
    </form>
  );
}
```

## 에러 토스트 없이 사용 (커스텀 에러 처리)

```typescript
import { useApiCall } from "@/hooks/useApiCall";
import { useUIStore } from "@/store";

function CustomErrorHandling() {
  const { showToast } = useUIStore();
  const { execute, error } = useApiCall({
    showErrorToast: false, // 자동 토스트 비활성화
  });

  const handleAction = async () => {
    await execute(
      () => fetch("/api/some-action"),
      (data) => {
        showToast("success", "작업이 완료되었습니다!");
      },
      (errorMessage) => {
        // 커스텀 에러 처리
        if (errorMessage.includes("권한")) {
          showToast("warning", "이 작업을 수행할 권한이 없습니다");
        } else {
          showToast("error", `오류: ${errorMessage}`);
        }
      }
    );
  };

  return <button onClick={handleAction}>작업 실행</button>;
}
```

## 상태 초기화 예시

```typescript
import { useApiCall } from "@/hooks/useApiCall";

function ResettableComponent() {
  const { data, error, isLoading, execute, reset } = useApiCall();

  const handleFetch = () => {
    execute(() => fetch("/api/data"));
  };

  const handleReset = () => {
    reset(); // 모든 상태 초기화
  };

  return (
    <div>
      <button onClick={handleFetch}>데이터 가져오기</button>
      <button onClick={handleReset}>초기화</button>
      {data && <div>{JSON.stringify(data)}</div>}
    </div>
  );
}
```

## 여러 API 호출 동시 처리

```typescript
import { useApiCall } from "@/hooks/useApiCall";

function MultipleApiCalls() {
  const userCall = useApiCall<User>({ showErrorToast: true });
  const postsCall = useApiCall<Post[]>({ showErrorToast: true });

  useEffect(() => {
    // 병렬로 여러 API 호출
    Promise.all([
      userCall.execute(() => fetch("/api/user")),
      postsCall.execute(() => fetch("/api/posts")),
    ]);
  }, []);

  return (
    <div>
      {userCall.isLoading || postsCall.isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <>
          {userCall.data && <UserProfile user={userCall.data} />}
          {postsCall.data && <PostList posts={postsCall.data} />}
        </>
      )}
    </div>
  );
}
```

## 조건부 API 호출

```typescript
import { useApiCall } from "@/hooks/useApiCall";

function ConditionalApiCall({ userId }: { userId?: string }) {
  const { data, execute, isLoading } = useApiCall<User>();

  useEffect(() => {
    if (userId) {
      execute(
        () => fetch(`/api/user/${userId}`),
        (user) => {
          console.log("사용자 로드됨:", user);
        }
      );
    }
  }, [userId, execute]);

  if (!userId) {
    return <p>사용자 ID가 필요합니다</p>;
  }

  return (
    <div>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        data && <UserCard user={data} />
      )}
    </div>
  );
}
```

## LearningRoomContent 실제 적용 예시

`components/learning-room/LearningRoomContent.example.tsx` 파일을 참고하세요.

주요 변경사항:
1. `useState`와 `fetch` 대신 `useApiCall` 사용
2. 자동 에러 토스트 처리
3. 로딩 상태 자동 관리
4. 성공/에러 콜백으로 추가 처리 가능
