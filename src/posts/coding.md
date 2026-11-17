---
title: "알고리즘 코테 위한 정리 — 선택 기준과 파이썬 핵심 틀"
description: "완전탐색, 누적합, 투 포인터, 이분 탐색, BFS·DFS, 최단거리, 그리디, DP와 Union-Find를 조건·복잡도·코드로 압축한 노트."
date: 2025-11-26T09:00:00+09:00
category: 코딩테스트
topics: [Python, 알고리즘, 코딩테스트]
draft: false
---

## 1. 문제를 읽고 먼저 할 일

**입력 크기 → 필요한 연산 → 후보 알고리즘 → 정당성 → 복잡도 → 코드** 순서로 생각한다. 코드는 특별한 언급이 없으면 정점·인덱스가 0부터 시작한다.

| 문제의 신호 | 먼저 검토할 것 |
| --- | --- |
| 작은 N, 모든 경우 | 완전탐색·백트래킹·비트마스크 |
| 존재·중복·빈도 | set·dict·Counter |
| 정적인 구간 합 질의 반복 | 누적합 |
| 정렬 후 양 끝을 줄이기 | 투 포인터 |
| 연속 구간, 한 방향으로 확장·축소 | 슬라이딩 윈도우·투 포인터 |
| 답이 커질수록 가능 여부가 한쪽으로 바뀜 | 이분 탐색·매개변수 탐색 |
| 같은 비용의 최단 이동 횟수 | BFS |
| 가중치 0·1 / 음수 없는 가중치 | 0-1 BFS / Dijkstra |
| 이전 결과로 최적값·경우의 수 계산 | DP |
| 선행 작업 관계 | 위상 정렬 |
| 집합 합치기·연결 여부 | Union-Find |

대략 `N≈20`이면 부분집합, `N≈10³`이면 O(N²), `N≈10⁵`이면 O(N log N)·O(N)을 후보로 볼 수 있다. 실행 시간 보장은 아니다. 중첩 정도, 상태 수, 메모리, 파이썬 상수 비용도 함께 계산한다. `N!`은 `2^N`보다 훨씬 빠르게 커진다.

## 2. 완전탐색과 백트래킹

**다 만들고 검사하는 비용이 감당되면 완전탐색부터.** 백트래킹은 답이 될 수 없는 가지를 중간에 끊는다.

```python
def choose(n, r):
    path, result = [], []
    def dfs(start):
        if len(path) == r:
            result.append(path[:])
            return
        need = r - len(path)
        for x in range(start, n - need + 1):
            path.append(x)
            dfs(x + 1)
            path.pop()
    dfs(0)
    return result
```

위 코드는 `0..n-1` 중 r개 조합이다. 순열은 사용 여부를 따로 관리한다. 선택 후 복구하는 `append → 재귀 → pop`과, 결과에 복사본을 저장하는 것을 기억한다. 경우가 많으면 결과를 모두 저장하지 말고 개수·최적값만 갱신한다.

## 3. 누적합과 차분 배열

`prefix[i] = 앞에서 i개 합`으로 정의하면 `[l, r)` 합은 `prefix[r] - prefix[l]`이다. 전처리 O(N), 질의 O(1).

```python
def prefix_sums(a):
    prefix = [0]
    for x in a:
        prefix.append(prefix[-1] + x)
    return prefix

a = [2, 4, 1, 3]
p = prefix_sums(a)
answer = p[3] - p[1]  # a[1:3] 합 = 5
```

- 1-based 양끝 포함 `[L, R]`이면 `prefix[R] - prefix[L-1]`.
- 2차원 누적합: 큰 사각형에서 위·왼쪽을 빼고 겹친 부분을 더한다.
- 구간에 값을 더하는 작업을 모아 처리한다면 차분 배열. `[l, r)`에 v 추가는 `diff[l] += v`, `diff[r] -= v`, 마지막에 누적합. `diff` 길이는 N+1.
- 갱신과 질의가 섞이면 단순 누적합 대신 Fenwick tree·segment tree를 검토한다.

## 4. 투 포인터와 슬라이딩 윈도우

**양수 배열에서 합이 target 이상인 가장 짧은 연속 구간.** 오른쪽을 늘리고, 조건을 만족하는 동안 왼쪽을 줄인다. 각 포인터가 한 번씩만 움직여 O(N).

```python
def min_window_len(a, target):  # a의 모든 원소 > 0, target > 0
    left = total = 0
    answer = len(a) + 1
    for right, x in enumerate(a):
        total += x
        while total >= target:
            answer = min(answer, right - left + 1)
            total -= a[left]
            left += 1
    return 0 if answer == len(a) + 1 else answer
```

음수가 섞이면 합이 단조롭게 변하지 않아 이 틀을 그대로 쓸 수 없다. 정렬된 두 수의 합은 `left + right` 비교 후 작은 쪽을 키우거나 큰 쪽을 줄인다. 정렬로 원래 순서가 사라져도 되는 문제인지 먼저 확인한다.

고정 길이 K 구간은 이전 합에서 빠지는 값 하나를 빼고 새 값 하나를 더한다. 매번 `sum(a[i:i+K])`를 하면 O(NK)이 된다.

## 5. 누적합 + 해시: 음수도 있는 구간 합

현재 누적합이 s라면, 앞에서 `s-target`인 누적합이 나온 횟수만큼 합이 target인 구간이 생긴다. 평균 O(N).

```python
def count_sum(a, target):
    freq = {0: 1}  # 시작점부터의 구간도 세기
    total = answer = 0
    for x in a:
        total += x
        answer += freq.get(total - target, 0)
        freq[total] = freq.get(total, 0) + 1
    return answer
```

현재 누적합을 등록하기 **전에** 구간 수를 센다. 순서를 바꾸면 target=0에서 길이 0인 구간까지 셀 수 있다.

## 6. 이분 탐색과 매개변수 탐색

원소 검색은 정렬된 배열에서 `bisect_left`·`bisect_right`. 답 탐색은 **가능 여부의 단조성**부터 확인한다.

```python
def first_true(lo, hi, feasible):
    # 정수 범위 [lo, hi), False ... False, True ... True
    # True가 없으면 원래 hi 반환
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    return lo
```

`feasible()`이 O(F)이면 전체는 O(F log 범위). “최소의 가능한 값”인지 “최대의 가능한 값”인지 먼저 적는다. 최대 문제는 단조 방향에 맞춰 틀을 바꾸고, 가능한 답이 없는 경우도 처리한다.

## 7. 그래프 표현, BFS, DFS

인접 리스트 `graph[u]`에 이웃 정점을 저장한다. 무방향 간선이면 양쪽에 추가한다. 가중 그래프는 `(다음 정점, 비용)`으로 저장한다.

### BFS: 같은 비용의 최단거리

```python
from collections import deque

def bfs(graph, start):
    dist = [-1] * len(graph)
    dist[start] = 0
    q = deque([start])
    while q:
        u = q.popleft()
        for v in graph[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1  # 큐에 넣을 때 방문 처리
                q.append(v)
    return dist
```

### DFS: 연결 여부와 깊이 탐색

```python
def dfs_reachable(graph, start):
    seen = [False] * len(graph)
    seen[start] = True
    stack = [start]
    while stack:
        u = stack.pop()
        for v in graph[u]:
            if not seen[v]:
                seen[v] = True
                stack.append(v)
    return seen
```

인접 리스트 기준 둘 다 O(V+E). 위 반복 DFS는 도달 가능성 확인용이며 재귀 DFS와 방문 순서·종료 시점이 같다고 가정하면 안 된다. 연결 요소는 아직 방문하지 않은 정점마다 탐색을 시작해 센다.

실제 경로까지 필요하면 처음 발견할 때 `parent[v] = u`를 저장하고 도착점부터 부모를 따라간 뒤 뒤집는다.

## 8. 격자 탐색과 상태 설계

```python
from collections import deque

def grid_dist(grid, start):  # 0: 통로, 1: 벽, 비어 있지 않은 직사각형
    n, m = len(grid), len(grid[0])
    dist = [[-1] * m for _ in range(n)]
    sr, sc = start
    if grid[sr][sc] == 1:
        return dist
    dist[sr][sc] = 0
    q = deque([(sr, sc)])
    while q:
        r, c = q.popleft()
        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m:
                if grid[nr][nc] == 0 and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[r][c] + 1
                    q.append((nr, nc))
    return dist
```

- 좌표가 같은 것과 상태가 같은 것은 다르다. 벽을 한 번 부술 수 있다면 `(r, c, 부순 횟수)`까지 방문 상태에 포함한다.
- 여러 시작점에서 동시에 퍼지면 시작점 전부를 거리 0으로 큐에 넣는 multi-source BFS.
- 회전·상하좌우 좌표계를 먼저 통일하고, 범위를 확인한 뒤 배열에 접근한다. 음수 인덱스는 오류 없이 뒤쪽을 읽는다.

## 9. 최단거리 알고리즘 선택

| 조건 | 후보 |
| --- | --- |
| 모든 간선 비용이 같음 | BFS |
| 비용이 0 또는 1 | 0-1 BFS: 0이면 deque 앞, 1이면 뒤 |
| 비용이 음수 아님 | Dijkstra |
| 음수 간선 있음 | Bellman-Ford 등. 관련 음수 사이클 확인 |
| 정점이 작고 모든 쌍 거리 필요 | Floyd-Warshall: O(V³) |

```python
import heapq

def dijkstra(graph, start):  # graph[u] = [(v, weight), ...], weight >= 0
    dist = [float('inf')] * len(graph)
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        cost, u = heapq.heappop(pq)
        if cost != dist[u]:
            continue  # 이미 더 짧게 갱신된 오래된 항목
        for v, weight in graph[u]:
            next_cost = cost + weight
            if next_cost < dist[v]:
                dist[v] = next_cost
                heapq.heappush(pq, (next_cost, v))
    return dist
```

단순 그래프의 힙 구현은 보통 O((V+E) log V)로 본다. 평행 간선이 많으면 힙 크기에 따른 log E도 고려한다. **Dijkstra는 처음 큐에 넣었을 때 방문 확정하지 않는다.** Floyd-Warshall은 중간 정점 k가 가장 바깥 반복문이다.

## 10. 그리디: 가장 좋아 보인다는 것만으로는 부족

선택이 이후 최적해를 망치지 않는 이유를 설명해야 한다. 정렬 기준을 정한 뒤 교환 논증이나 반례로 확인한다.

```python
def max_meetings(intervals):  # start <= end, 끝난 시각에 바로 다음 회의 가능
    end_time = float('-inf')
    count = 0
    for start, end in sorted(intervals, key=lambda x: (x[1], x[0])):
        if start >= end_time:
            count += 1
            end_time = end
    return count
```

위는 끝나는 시간이 빠른 회의를 우선 선택하는 경우다. 임의의 동전 구성에서 큰 동전부터 고르는 방법은 항상 최적이 아니다. 예를 들어 동전 1·3·4로 6을 만들면 `4+1+1`보다 `3+3`이 적다.

## 11. DP: 점화식 전에 상태의 의미

**상태 정의 → 전이 → 초기값 → 계산 순서 → 정답 위치**를 적는다. 같은 부분 문제가 반복되고 작은 문제의 결과로 큰 문제를 구성할 수 있는지 본다.

```python
def make_one(n):  # n >= 1
    # dp[i]: i를 1로 만드는 최소 연산 횟수
    dp = [0] * (n + 1)
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + 1
        if i % 2 == 0:
            dp[i] = min(dp[i], dp[i // 2] + 1)
        if i % 3 == 0:
            dp[i] = min(dp[i], dp[i // 3] + 1)
    return dp[n]
```

위 세 식은 선택 가능한 마지막 연산을 비교하는 하나의 상태 전이다. `dp[1]=0`, 작은 상태부터 계산하므로 참조하는 값이 이미 준비되어 있다. 시간·공간 O(N).

- 최소값 DP: 불가능한 상태는 보통 `inf`, 시작 상태만 0.
- 최대값 DP: 음수도 가능한 문제면 0 초기화가 잘못된 해를 만들 수 있다.
- 경우의 수 DP: 보통 아무것도 선택하지 않는 경우를 1로 초기화하는지 확인.
- Top-down은 메모이제이션, bottom-up은 반복 순서가 핵심. DP가 항상 반복문 한 개인 것은 아니다.

## 12. 배낭 DP와 동전 DP의 반복 방향

### 0/1 배낭: 각 물건 최대 한 번

```python
def knapsack(items, capacity):  # items = [(양의 무게, 가치), ...]
    dp = [0] * (capacity + 1)   # 용량 이하에서 얻는 최대 가치
    for weight, value in items:
        for c in range(capacity, weight - 1, -1):
            dp[c] = max(dp[c], dp[c - weight] + value)
    return dp[capacity]
```

용량을 **내림차순**으로 돌아 같은 물건이 이번 반복에서 다시 사용되지 않게 한다. O(N×용량). 무게·용량이 매우 크면 이 DP 자체가 불가능할 수 있다.

### 무제한 동전 조합 수: 순서 구분 안 함

```python
def coin_ways(coins, target):  # 서로 다른 양의 동전, 사용 횟수 제한 없음
    dp = [0] * (target + 1)
    dp[0] = 1
    for coin in coins:
        for total in range(coin, target + 1):
            dp[total] += dp[total - coin]
    return dp[target]
```

여기서는 오름차순으로 돌아 같은 동전을 다시 사용할 수 있다. 합계를 바깥에 두고 동전을 안쪽에 두면 순서가 다른 구성을 따로 세는 형태가 된다. **최소 동전 수 / 조합 수 / 순열 수를 구분**한다.

## 13. LIS: 가장 긴 증가 부분 수열

```python
from bisect import bisect_left

def lis_length(a):
    tails = []
    for x in a:
        i = bisect_left(tails, x)
        if i == len(tails):
            tails.append(x)
        else:
            tails[i] = x
    return len(tails)
```

O(N log N). `tails[i]`는 길이 i+1인 증가 부분 수열의 끝값을 작게 유지하는 정보다. **tails 자체가 원본의 실제 LIS라는 보장은 없다.** 엄격 증가가 아니라 비감소라면 `bisect_right`를 검토한다. 실제 수열 복원은 이전 인덱스 등을 따로 저장한다.

## 14. Union-Find와 최소 신장 트리

```python
class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while x != self.parent[x]:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a == b:
            return False
        if self.size[a] < self.size[b]:
            a, b = b, a
        self.parent[b] = a
        self.size[a] += self.size[b]
        return True
```

경로 압축 + 크기 기준 합치기로 연산당 분할상환 O(α(N)). 무방향 간선을 추가할 때 이미 같은 집합이면 사이클이 생긴다. 방향 그래프의 사이클 판정에 그대로 쓰면 안 된다.

**Kruskal**: 간선을 비용순 정렬 → `union()`이 성공하는 간선만 선택 → N-1개면 종료. 연결되지 않았다면 신장 트리가 아니라 포리스트다. MST의 전체 간선 비용 최소화와, 시작점에서의 최단거리는 다른 문제다.

## 15. 위상 정렬

방향 비순환 그래프(DAG)의 선행 관계를 지키는 순서. 진입차수 0부터 처리한다. O(V+E).

```python
from collections import deque

def topological_sort(graph):
    indegree = [0] * len(graph)
    for edges in graph:
        for v in edges:
            indegree[v] += 1
    q = deque(i for i, degree in enumerate(indegree) if degree == 0)
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                q.append(v)
    return order if len(order) == len(graph) else None
```

순서에 여러 답이 있을 수 있다. 매번 가장 작은 정점이 필요하면 deque 대신 최소 힙. 일부 정점이 남으면 사이클이 있다. DAG에서 작업 완료 시각·경로 수를 계산하면 위상 정렬 + DP로 연결된다.

## 16. 단조 스택: 다음 큰 원소

아직 답을 못 찾은 인덱스를 쌓아두고, 현재 값이 더 크면 그 인덱스의 답을 갱신한다.

```python
def next_greater(a):
    answer = [-1] * len(a)
    stack = []
    for i, x in enumerate(a):
        while stack and a[stack[-1]] < x:
            answer[stack.pop()] = x
        stack.append(i)
    return answer
```

각 원소가 한 번 들어가고 한 번 나와 O(N). 같은 값을 큰 값으로 볼지에 따라 `<`, `<=`가 달라진다. 괄호 문제는 일반 스택으로 열고 닫는 짝을 확인한다.

## 17. 정수 알고리즘과 비트마스크

**소수 하나 판정**은 `isqrt(n)`까지 나누어본다. **범위 전체 소수**는 에라토스테네스의 체를 검토한다.

```python
from math import isqrt

def sieve(n):  # n >= 0
    prime = [True] * (n + 1)
    prime[0] = False
    if n >= 1:
        prime[1] = False
    for p in range(2, isqrt(n) + 1):
        if prime[p]:
            for multiple in range(p * p, n + 1, p):
                prime[multiple] = False
    return prime
```

체는 통상 O(N log log N), 공간 O(N). 0과 1은 소수가 아니다. 비트마스크 부분집합은 `range(1 << N)`으로 순회하고, 각 원소까지 확인하면 O(N×2^N)이다. 상태가 작으면 `dp[mask]`, 매우 큰 수의 거듭제곱 나머지는 `pow(a, b, mod)`도 떠올린다.

## 18. 갱신이 있는 구간 합: Fenwick tree

합처럼 누적 가능한 연산에서 점 갱신·구간 합을 O(log N)으로 처리한다. **이 코드의 내부 인덱스는 1-based**이며 `add()`에는 1 이상을 전달한다.

```python
class Fenwick:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    def add(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & -i

    def prefix(self, i):  # 1..i 합, i=0이면 0
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & -i
        return total

    def range_sum(self, left, right):  # 양끝 포함
        return self.prefix(right) - self.prefix(left - 1)
```

값을 새 값으로 바꾸려면 차이 `새값-기존값`을 더한다. 구간 최솟값 등 다른 연산은 segment tree를 검토한다. 값의 범위가 크고 순서만 중요하면 `sorted(set(values))`로 좌표 압축할 수 있지만, 압축 인덱스 차이는 원래 수치의 거리가 아니다.

## 19. 유형별로 마지막에 의심할 것

| 증상·유형 | 확인할 것 |
| --- | --- |
| 시간 초과 | 반복문 속 `in list`, `count`, 슬라이싱, 중복 방문, 중복 정렬 |
| BFS | 큐에 넣을 때 방문했는지, 방문 상태에 필요한 정보가 모두 있는지 |
| Dijkstra | 음수 간선, 오래된 힙 항목, 도달 불가 처리 |
| 이분 탐색 | 단조성, 양끝 포함 여부, 답 없음, 경계에서 무한 반복 |
| DP | 상태 뜻, 불가능 초기값, 전이 순서, 메모리 크기 |
| 그리디 | 선택을 바꾸어도 최적해가 유지되는 이유, 작은 반례 |
| 문자열·스택 | 빈 스택, 짝 없는 닫는 괄호, 중복 문자 |
| 그래프·트리 | 방향성, 연결되지 않은 정점, 부모로 되돌아가는 간선 |
| 구현·시뮬레이션 | 동시에 바뀌어야 할 값을 순차 갱신하지 않았는지 |

## 마지막 1분 복습

1. 답의 범위와 최악의 연산 수부터 계산한다.
2. 인덱스는 0/1-based, 구간은 양끝 포함/반열린 구간 중 하나로 통일한다.
3. 자료구조의 개별 연산 비용까지 포함해 복잡도를 센다.
4. 최소 입력·동일값·음수·불가능·최댓값 경계를 확인한다.
5. 시간 초과가 나면 자료구조, 상태 중복, 반복 계산부터 의심한다.
6. 어려운 문제는 작은 완전탐색 정답과 최적화 풀이를 비교해 반례를 찾는다.

파이썬 문법과 라이브러리 사용은 [파이썬 코테 직전 정리](/posts/python/)에서 따로 훑는다.

## 더 찾아볼 때

- [Python 표준 라이브러리](https://docs.python.org/3/library/)
- [University of Maryland: 알고리즘 강의·0/1 배낭 DP](https://www.cs.umd.edu/class/spring2025/cmsc451-0101/Lects/cmsc451-spring25-lects.pdf)

문자열 매칭(KMP·Trie), LCS·편집 거리, 트리 DP·LCA, SCC, 네트워크 플로, 기하 등은 필요할 때 별도 노트로 확장한다.
