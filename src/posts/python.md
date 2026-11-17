---
title: "파이썬 코테 직전 정리 — 문법·자료구조·표준 라이브러리"
description: "입출력, 정렬과 lambda, 문자열, dict·set, deque·heap·bisect부터 자주 틀리는 문법까지 빠르게 훑는 파이썬 노트."
date: 2025-08-02T09:00:00+09:00
category: 코딩테스트
topics: [Python, 코딩테스트, 자료구조]
draft: false
---

## 1. 먼저 고르는 자료구조

| 필요한 동작 | 우선 떠올릴 것 | 핵심 |
| --- | --- | --- |
| 인덱스 접근, 뒤에서 넣고 빼기 | `list` | 인덱스 O(1), 뒤 삽입 분할상환 O(1) |
| 앞뒤에서 넣고 빼기 | `deque` | 양 끝 삽입·삭제 O(1) |
| 존재 여부, 중복 제거 | `set` | 조회 평균 O(1), 순서에 의존하지 않기 |
| 키로 값 조회 | `dict` | 조회·갱신 평균 O(1) |
| 등장 횟수 | `Counter` | 반복해서 `list.count()` 하지 않기 |
| 최솟값을 반복해서 꺼내기 | `heapq` | 삽입·삭제 O(log N), 최소 조회 O(1) |
| 정렬된 배열에서 경계 찾기 | `bisect` | 경계 검색 O(log N), 리스트 삽입은 O(N) |

`dict`·`set`의 O(1)은 평균적인 복잡도다. 큰 정수 연산, 긴 문자열 비교, 해시 계산 비용까지 언제나 상수인 것은 아니다.

## 2. 입력과 출력

```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
grid = [list(map(int, input().split())) for _ in range(n)]

answer = [1, 2, 3]
print(*answer)                      # 1 2 3
print("\n".join(map(str, answer)))  # 한 줄에 하나씩
```

- `split()`은 연속 공백·줄바꿈을 알아서 구분한다. 보통 `split(' ')`보다 편하다.
- 문자열 입력에서 앞뒤 공백이 의미 있으면 `strip()` 대신 `rstrip('\n')`을 쓴다.
- `list(input().strip())`은 문자 격자, `list(map(int, input().strip()))`은 공백 없는 숫자 격자.
- 입력 끝까지 읽을 때는 `for line in sys.stdin:`. 빈 줄과 EOF는 다르다.
- `sys.stdin.buffer.read().split()`은 빠를 수 있지만 전체 입력과 토큰을 메모리에 올린다. 토큰은 `bytes`라 문자열 비교 시 `b'YES'`처럼 맞춰야 한다.

## 3. 리스트와 슬라이싱

```python
a = [10, 20, 30, 40]
a[-1]                 # 40
a[1:3]                # [20, 30]: 오른쪽 끝 제외
a[::-1]               # 뒤집은 새 리스트
a.append(50)          # 원소 하나 추가
a.extend([60, 70])    # 원소들을 이어 붙이기
last = a.pop()        # 마지막 원소 제거 후 반환
```

`pop(0)`, 앞쪽 `insert()`, `remove()`, `x in a`, `count()`는 O(N). 반복문 안에서 반복하면 O(N²)이 될 수 있다. 슬라이싱은 복사한 길이만큼 시간·공간을 쓴다.

### 2차원 배열과 복사

```python
n, m = 3, 4
grid = [[0] * m for _ in range(n)]  # 행마다 독립적인 리스트
# grid = [[0] * m] * n             # 같은 행을 공유하므로 주의

a = [[1], [2]]
b = a[:]                          # 바깥 리스트만 복사
c = [row[:] for row in a]          # 행까지 복사: 더 깊은 객체는 별도
```

`b = a`는 복사가 아니라 같은 객체를 가리키는 대입이다. 복잡한 중첩 구조 전체를 복사해야 한다면 `copy.deepcopy()`를 검토한다.

## 4. sort(), sorted(), lambda

| 표현 | 원본 변경 | 반환값 |
| --- | --- | --- |
| `a.sort()` | O | `None` |
| `sorted(a)` | X | 새 리스트 |
| `a.reverse()` | O | `None` |
| `a[::-1]` | X | 새 리스트 |

```python
words = ["apple", "banana", "kiwi", "orange"]
words.sort(key=len)  # ['kiwi', 'apple', 'banana', 'orange']

rows = [(2, "b"), (1, "b"), (3, "a")]
rows.sort(key=lambda x: (x[1], x[0]))
# [(3, 'a'), (1, 'b'), (2, 'b')]

students = [("민수", 90), ("지수", 90), ("가람", 80)]
students.sort(key=lambda x: (-x[1], x[0]))  # 점수 내림차순, 이름 오름차순
```

`lambda 인자: 반환할 표현식`은 짧은 익명 함수다. `key`에는 원소 하나를 받아 비교 기준을 만드는 함수를 넣는다. 튜플은 앞 항목부터 차례로 비교한다.

- 숫자 내림차순 기준은 `-값`으로 표현할 수 있다. 문자열에는 이 방법을 쓸 수 없다.
- `reverse=True`는 정렬 기준 전체를 뒤집는다. 기준별 방향이 다르면 따로 설계한다.
- 파이썬 정렬은 **안정 정렬**: key가 같으면 기존 순서를 유지한다.
- `a = a.sort()`라고 쓰면 `a`가 `None`이 된다.

[공식 정렬 안내](https://docs.python.org/3/howto/sorting.html)

## 5. dict 정렬과 조회

```python
scores = {"b": 2, "a": 3, "c": 2}
sorted(scores)                                    # ['a', 'b', 'c']
sorted(scores.items())                            # 키 기준 (키, 값) 리스트
sorted(scores.items(), key=lambda x: (x[1], x[0])) # 값 ↑, 동점이면 키 ↑
scores.get("없는키", 0)                           # 없으면 0, 키는 추가하지 않음

for key, value in scores.items():
    pass
```

**`items()`는 리스트가 아니라 `(키, 값)`을 순회할 수 있는 view다.** `sorted()` 결과가 리스트다. 다시 `dict()`로 만들면 그 순서로 삽입된다. Python 3.7 이상에서 dict는 삽입 순서를 보존하지만, 자동으로 키순 정렬되는 것은 아니다.

키의 존재는 `key in scores`로 확인한다. `get()`의 결과가 0이라고 키가 없다고 단정하면 안 된다. 순회하면서 키 개수를 바꾸는 것도 피한다. [dict 공식 문서](https://docs.python.org/3/library/stdtypes.html#mapping-types-dict)

## 6. Counter와 defaultdict

```python
from collections import Counter, defaultdict

count = Counter([1, 1, 2, 3])
count[1]                 # 2
count[9]                 # 0
count.most_common(2)     # [(1, 2), (2, 1)]

groups = defaultdict(list)
for name, score in [("A", 90), ("B", 90)]:
    groups[score].append(name)

freq = {}
for x in [1, 1, 2]:
    freq[x] = freq.get(x, 0) + 1
```

`defaultdict`는 없는 키를 `[]`로 읽으면 기본값을 만들어 저장한다. 단순 조회만 필요하다면 `get()`을 고려한다. [collections 공식 문서](https://docs.python.org/3/library/collections.html)

## 7. set과 tuple

```python
a, b = {1, 2, 3}, {3, 4}
a & b                  # {3}: 교집합
a | b                  # {1, 2, 3, 4}: 합집합
a - b                  # {1, 2}: 차집합
a ^ b                  # {1, 2, 4}: 대칭차집합
a.discard(9)           # 없어도 오류 없음; remove(9)는 오류

unique = list(dict.fromkeys([3, 1, 3, 2]))  # [3, 1, 2]: 순서 유지 중복 제거
visited = {(0, 0), (1, 2)}                 # 좌표는 tuple로
one = (1,)                                # 원소 한 개짜리 tuple
```

빈 set은 `set()`, `{}`는 빈 dict다. dict 키와 set 원소는 해시 가능해야 한다. 리스트는 불가능하고, 튜플도 내부에 리스트가 있으면 불가능하다.

## 8. 문자열에서 자주 쓰는 것

```python
s = "Abc 123"
s.lower(), s.upper(), s.swapcase()
s.split()                      # ['Abc', '123']
s.replace(" ", "")              # 'Abc123': 새 문자열 반환
s.startswith("Ab"), s.endswith("23")
ord('a'), chr(97)               # 97, 'a'
"-".join(["a", "b", "c"])       # 'a-b-c'
"abc".find("z")                 # -1; index()는 없으면 예외
f"{3.14159:.2f}"                # '3.14': 소수점 둘째 자리까지 표시
f"{7:03d}"                      # '007': 앞을 0으로 채워 3자리
```

문자열은 불변이다. `s[0] = 'a'`는 불가능하다. 반복해서 문자열을 이어 붙이기보다 리스트에 모은 뒤 `join()`을 고려한다. 문자열 정렬은 숫자 정렬과 다르다: `'10' < '2'`는 `True`다.

## 9. enumerate, zip, 컴프리헨션

```python
names = ["A", "B"]
for i, name in enumerate(names, start=1):
    pass

a, b = [1, 2, 3], [10, 20, 30]
sums = [x + y for x, y in zip(a, b)]       # [11, 22, 33]
squares = [x * x for x in a if x % 2]      # [1, 9]
labels = ["짝수" if x % 2 == 0 else "홀수" for x in a]
index = {name: i for i, name in enumerate(names)}
```

`zip()`은 기본적으로 가장 짧은 입력에 맞춰 끝난다. `map`, `filter`, `zip`은 한 번 순회하면 소진되는 iterator라는 점도 기억한다. 간단한 필터·변환은 컴프리헨션으로 읽기 쉽게 쓸 수 있다.

## 10. 스택과 큐

```python
from collections import deque

stack = []
stack.append(3)
top = stack[-1]          # 비어 있으면 IndexError
stack.pop()

q = deque([1, 2])
q.append(3)
q.popleft()             # 1
q.appendleft(0)
q.rotate(1)             # 오른쪽 한 칸; 음수면 왼쪽
```

스택은 `list`, 일반적인 BFS 큐는 `deque`. `deque`의 가운데 인덱스 접근은 O(N)이고, 큰 회전의 비용도 항상 O(1)은 아니다.

## 11. heapq: 최소 힙과 최대 힙

```python
import heapq

h = [5, 2, 7]
heapq.heapify(h)          # O(N): 원본을 힙으로
heapq.heappush(h, 1)      # O(log N)
smallest = heapq.heappop(h)
next_smallest = h[0]      # 최소 원소만 보장. 전체가 정렬된 것은 아님

max_h = []
for x in [5, 2, 7]:
    heapq.heappush(max_h, -x)
largest = -heapq.heappop(max_h)  # 7
```

최대 힙은 채점 환경 호환성을 위해 음수 변환 방식을 기억한다. 튜플을 넣으면 앞 항목부터 비교하므로 `(거리, 정점)`처럼 우선순위를 먼저 둔다. 동점 뒤에 비교 불가능한 객체가 오면 순번을 추가한다. [heapq 공식 문서](https://docs.python.org/3/library/heapq.html)

## 12. bisect: 중복 개수와 삽입 위치

```python
from bisect import bisect_left, bisect_right

a = [1, 2, 2, 2, 4]      # 반드시 정렬된 상태
left = bisect_left(a, 2)  # 1: 처음 2 이상인 위치
right = bisect_right(a, 2)# 4: 처음 2 초과인 위치
count = right - left     # 3
exists = left < len(a) and a[left] == 2
```

찾을 값이 없거나 모든 값보다 크면 위치가 `len(a)`일 수 있다. 탐색 O(log N)과 리스트 중간 삽입 O(N)을 구분한다. [bisect 공식 문서](https://docs.python.org/3/library/bisect.html)

## 13. 순열·조합·중복 선택

```python
from itertools import permutations, combinations
from itertools import product, combinations_with_replacement

a = [1, 2, 3]
list(permutations(a, 2))                    # 순서 O, 같은 위치 재사용 X: 6개
list(combinations(a, 2))                    # 순서 X, 같은 위치 재사용 X: 3개
list(product(a, repeat=2))                  # 순서 O, 중복 선택 O: 9개
list(combinations_with_replacement(a, 2))   # 순서 X, 중복 선택 O: 6개
```

실전에서는 `list()`로 전부 만들지 말고 바로 순회해 메모리를 아낀다. 입력에 같은 값이 있으면 값이 중복된 결과가 나올 수 있다. 생성 개수 자체가 크면 iterator를 써도 시간은 해결되지 않는다. [itertools 공식 문서](https://docs.python.org/3/library/itertools.html)

## 14. 정수·수학·나머지 연산

```python
from math import gcd, isqrt, comb

-3 // 2                  # -2: 0 방향이 아니라 내림
-3 % 2                   # 1
q, r = divmod(17, 5)      # 3, 2
ceil_div = (17 + 5 - 1) // 5  # 양의 정수 올림 나눗셈
gcd(12, 18)              # 6
isqrt(10)                # 3: 정수 제곱근
comb(5, 2)               # 10
pow(2, 10, 1000)         # 24: 거듭제곱의 나머지
```

- Python 정수는 고정 폭 overflow는 없지만, 커질수록 연산·메모리 비용이 든다.
- 최소공배수: 두 수가 모두 0이면 0, 그 외에는 `abs(a // gcd(a, b) * b)`.
- 정수 문제에서 `int(a / b)`로 몫을 구하면 큰 수에서 부동소수점 오차가 생길 수 있다.
- `round()`는 정확히 중간인 경우 짝수 쪽을 택하는 규칙이 있다. 문제의 반올림 정의를 확인한다.
- 소수는 이진 부동소수점으로 정확히 표현되지 않을 수 있다. 출력 자릿수와 계산의 정확도를 구분한다.
- 모듈러 나눗셈은 일반 나눗셈이 아니다. 역원이 존재하는 조건부터 확인한다.

[math 공식 문서](https://docs.python.org/3/library/math.html)

## 15. 비트 연산 빠르게 보기

```python
mask, i = 0, 3
mask |= 1 << i              # i번째 비트 켜기
exists = bool(mask & (1 << i))
mask &= ~(1 << i)           # 끄기
mask ^= 1 << i              # 뒤집기
full = (1 << 5) - 1         # 하위 5개 비트가 1
count = bin(full).count('1') # 3.10 이상이면 full.bit_count()도 가능
```

`^`는 거듭제곱이 아니라 XOR. 거듭제곱은 `**`다. `~mask`는 파이썬에서 무한 길이 부호 확장 관점이므로, N비트 반전이 목적이면 `mask ^ ((1 << N) - 1)`을 쓴다.

## 16. 함수·재귀·캐시

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

- 캐시 인자는 해시 가능해야 한다. 리스트 대신 튜플 등으로 바꿀 수 있다.
- 캐시는 함수 호출 결과를 재사용한다. 테스트케이스의 외부 데이터가 바뀌면 `fib.cache_clear()`처럼 초기화할지 확인한다.
- 깊은 재귀는 `RecursionError`가 날 수 있다. 제한을 무작정 크게 올리면 메모리·실행 안정성 문제가 생길 수 있어 반복문·명시적 스택도 검토한다.
- 함수에서 바깥 변수에 재대입하면 스코프를 확인한다. 전역은 `global`, 감싼 함수의 지역 변수는 `nonlocal`.
- 기본 인자를 `[]`로 두면 호출 간 공유된다. 보통 `None`으로 받고 함수 안에서 새 리스트를 만든다.

## 17. 짧지만 자주 틀리는 것

| 실수 | 기억할 것 |
| --- | --- |
| `x is 1000` | 값 비교는 `==`, `None` 여부는 `is None` |
| `if result:`로 존재 판단 | 0·빈 문자열도 유효한 결과일 수 있음 |
| 리스트를 순회하며 삭제 | 인덱스가 밀림. 새 리스트·역순 순회 등 검토 |
| `max([])`, 빈 스택의 `pop()` | 빈 입력 조건 확인 |
| `a[-1]`로 범위 밖을 감지 | 음수 인덱스는 뒤쪽 원소를 정상 조회함 |
| 반복문 안 `sum(a[l:r])` | 슬라이싱과 합산이 매번 구간 길이만큼 듦 |
| `all([])`, `any([])` | 각각 `True`, `False` |
| `for ... else` | `break` 없이 끝났을 때만 `else` 실행 |

## 마지막 30초 체크

- 입력이 숫자·문자열·공백 없는 격자 중 무엇인가?
- 중복·순서·동점 정렬 기준을 지켰는가?
- `sort()` 반환값, 얕은 복사, 2차원 배열 공유를 확인했는가?
- 반복문 안에 O(N) 조회·복사가 숨어 있지 않은가?
- 빈 값, 원소 1개, 음수, 큰 수, 없는 키를 처리했는가?
- 함수형 제출이면 테스트케이스 사이에 전역 상태가 남지 않는가?
- 디버깅 출력과 로컬 파일 입력 코드를 지웠는가?

알고리즘 선택과 풀이 틀은 [알고리즘 코테 직전 정리](/posts/coding/)에 이어서 정리한다.
