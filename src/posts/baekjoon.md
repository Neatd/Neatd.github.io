---
title: "백준"
description: "백준 문제 풀이들"
date: 2025-02-13T09:00:00+09:00
category: 개발 기록
topics: [Python, 알고리즘, 코딩 테스트]
draft: false
---

## 백준 (파이썬)

<details>
<summary><h3>기초 문제들</h3></summary>


```python
# 11654 아스키 코드

ascii = input()
print(ord(ascii))
```

```python
# 3733

result = []

while True:
    try:
        n, s = map(int, input().split())
        result.append(s // (n+1))
    except:
        for x in result:
            print(x)
        break
```

```python
# 3003

have = list(map(int, input().split()))
must = [1, 1, 2, 2, 2, 8]

print(" ".join(map(str, [a - b for a, b in zip(must, have)])))
```

```python
# 2744

word = input()

print(word.swapcase())
```

```python
# 1152 단어의 개수

print(len(input().split()))
```

```python
# 2675 문자열 반복

T = int(input())

for _ in range(T):
    R, S = input().split()
    S = list(S)
    new = []

    for s in range(int(R)):
        for _ in range(int(R)):
            new.append(s)

    print("".join(new))
```

```python
T = int(input())

for _ in range(T):
    R, S = input().split()
    for s in S:
        print(s*int(R), end='')  
    print()
```

```python
# 10809 알파벳 찾기

S = input()
alphabet = {chr(i): -1 for i in range(ord('a'), ord('z') + 1)}

for i, s in enumerate(S):
    if alphabet[s] == -1:
        alphabet[s] = i

for value in alphabet.values():
    print(value, end=' ')
```

```python
# 31403 A+B-C

A = input()
B = input()
C = input()

print(int(A)+int(B)-int(C))
print(int(A+B)-int(C))
```

```python
# 2920 음계

asd = list(map(int, input().split()))

ac = sorted(asd)
dc = sorted(asd, reverse=True)

if asd == ac:
    print("ascending")
elif asd == dc:
    print("descending")
else:
    print("mixed")
```

```python
# 10250 ACM 호텔 

T = int(input())

for _ in range(T):
    H, W, N = map(int, input().split())

    floor = N%H
    ho = (N//H)+1

    if floor == 0:
        floor = H
        ho -= 1
    
    if ho < 10:
        print(str(floor)+"0"+str(ho))
    else:
        print(str(floor)+str(ho))

```

### **Class 1 브론즈**

```python
# 4153 직각삼각형

while(True):
    triangle = list(map(int, input().split()))
    if sum(triangle) == 0:
        break

    a = triangle.pop(triangle.index(max(triangle)))
    b = triangle.pop()
    c = triangle.pop()

    if (a**2) == ((b**2)+(c**2)):
        print("right")
    else:
        print("wrong")
```

```python
# 30802 웰컴 키트

N = int(input())
S = list(map(int, input().split()))
T, P = map(int, input().split())

t_num = 0
for s in S:
    tn = s//T
    if s%T > 0:
        tn += 1
    t_num += tn

print(t_num)
print((N//P),(N%P))
```

```python
# 1978 소수 찾기

N = int(input())
ls = list(map(int, input().split()))
answer = 0

for i in ls:
    if i == 1:
        continue

    flag = True

    for j in range(2, i+1):
        if (i%j==0) and (i!=j):
            flag = False

    if flag == True:
        answer += 1

print(answer)
```

```python
# 2231 분해합

def find_smallest_constructor(N):
    for M in range(max(1, N - 54), N):
        if M + sum(map(int, str(M))) == N:
            return M
    return 0

N = int(input())

print(find_smallest_constructor(N))
```

```python
# 2292 벌집

N = int(input())
m = 1
c = 1
while(m < N):
    m += (6*c)
    c += 1

print(c)
```

```python
# 2798 블랙잭

from itertools import combinations

def blackjack(N, M, cards):
    max_sum = 0
    
    # 카드에서 3장을 고르는 모든 조합을 확인
    for combo in combinations(cards, 3):
        total = sum(combo)
        if total <= M:
            max_sum = max(max_sum, total)
    
    return max_sum

# 입력 받기
N, M = map(int, input().split())
cards = list(map(int, input().split()))

# 함수 호출
result = blackjack(N, M, cards)
print(result)
```

```python
# 15829 Hashing

def calculate_hash(L, string):
    r = 31
    M = 1234567891
    hash_value = 0
    power_r = 1 

    for i in range(L):
        a_i = ord(string[i]) - ord('a') + 1
        hash_value = (hash_value + a_i * power_r) % M
        power_r = (power_r * r) % M

    return hash_value

L = int(input())  
string = input() 

print(calculate_hash(L, string))

```

```python
# 1259 팰린드롬수

while True:
    num = input().strip() 
    if num == '0':  
        break
    if num == num[::-1]:  
        print("yes")
    else:
        print("no")
```

```python
# 2609 최대공약수와 최소공배수 

import math

a, b = map(int, input().split())

gcd = math.gcd(a, b)

lcm = (a * b) // gcd

print(gcd)
print(lcm)

```
</details>

<details>
<summary><h3>1929 - 소수 구하기</h3></summary>


#### 문제

M이상 N이하의 소수를 모두 출력하는 프로그램을 작성하시오.

#### 입력

첫째 줄에 자연수 M과 N이 빈 칸을 사이에 두고 주어진다. (1 ≤ M ≤ N ≤ 1,000,000) M이상 N이하의 소수가 하나 이상 있는 입력만 주어진다.

#### 출력

한 줄에 하나씩, 증가하는 순서대로 소수를 출력한다.

#### 풀이

1. m과 n을 int로 매핑해서 입력 받는다.
2. 소수를 구하는 함수를 만든다.
    
    나는 에라토스테네스의 체를 이용해서 함수를 만들었다.
    
3. 특정 범위 소수를 찾는다.
4. 리스트 컴프리헨션을 통해 원소 하나씩 출력한다.

#### 코드

```python
#1
m, n = map(int, input().split())

#2
def sieve_of_eratosthenes(limit):
    primes = [True] * (limit + 1)
    primes[0], primes[1] = False, False

    for i in range(2, int(limit**0.5) + 1):
        if primes[i]:
            for j in range(i * i, limit + 1, i):
                primes[j] = False

    return [i for i in range(2, limit + 1) if primes[i]]

#3
def primes_in_range(n, m):
    primes = sieve_of_eratosthenes(m)
    return [p for p in primes if p >= n]

ls = primes_in_range(m, n)

#4
print(*ls, sep='\n')
```


</details>

<details>
<summary><h3>1966 - 프린터 큐</h3></summary>


#### 문제

여러분도 알다시피 여러분의 프린터 기기는 여러분이 인쇄하고자 하는 문서를 인쇄 명령을 받은 ‘순서대로’, 즉 먼저 요청된 것을 먼저 인쇄한다. 여러 개의 문서가 쌓인다면 Queue 자료구조에 쌓여서 FIFO - First In First Out - 에 따라 인쇄가 되게 된다. 하지만 상근이는 새로운 프린터기 내부 소프트웨어를 개발하였는데, 이 프린터기는 다음과 같은 조건에 따라 인쇄를 하게 된다.

현재 Queue의 가장 앞에 있는 문서의 ‘중요도’를 확인한다.

나머지 문서들 중 현재 문서보다 중요도가 높은 문서가 하나라도 있다면, 이 문서를 인쇄하지 않고 Queue의 가장 뒤에 재배치 한다. 그렇지 않다면 바로 인쇄를 한다.

예를 들어 Queue에 4개의 문서(A B C D)가 있고, 중요도가 2 1 4 3 라면 C를 인쇄하고, 다음으로 D를 인쇄하고 A, B를 인쇄하게 된다.

여러분이 할 일은, 현재 Queue에 있는 문서의 수와 중요도가 주어졌을 때, 어떤 한 문서가 몇 번째로 인쇄되는지 알아내는 것이다. 예를 들어 위의 예에서 C문서는 1번째로, A문서는 3번째로 인쇄되게 된다.

#### 입력

첫 줄에 테스트케이스의 수가 주어진다. 각 테스트케이스는 두 줄로 이루어져 있다.

테스트케이스의 첫 번째 줄에는 문서의 개수 N(1 ≤ N ≤ 100)과, 몇 번째로 인쇄되었는지 궁금한 문서가 현재 Queue에서 몇 번째에 놓여 있는지를 나타내는 정수 M(0 ≤ M < N)이 주어진다. 이때 맨 왼쪽은 0번째라고 하자. 두 번째 줄에는 N개 문서의 중요도가 차례대로 주어진다. 중요도는 1 이상 9 이하의 정수이고, 중요도가 같은 문서가 여러 개 있을 수도 있다.

#### 출력

각 테스트 케이스에 대해 문서가 몇 번째로 인쇄되는지 출력한다.

#### 풀이

collections의 deque를 이용하여 큐를 구현하는데, 이 때 큐 동작 안에서 중요도가 낮으면 pop과 동시에 append를 하였다. 그리고 중요도가 가장 큰 문서라면, pop한다. 이 때 cnt를 1 증가시키고 만약 확인하고자 하는 문서가 출력될 차례라면 cnt를 출력한다.

#### 코드

```python
from collections import deque

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    importances = deque(map(int, input().split()))
    idxs = deque(list(range(0, len(importances))))
    cnt = 0
    while importances:
        if importances[0] < max(importances):
            importances.append(importances.popleft())
            idxs.append(idxs.popleft())
        elif importances[0] == max(importances):
            cnt += 1
            importances.popleft()
            if idxs[0] == m:
                print(cnt)
            idxs.popleft()
```


</details>

<details>
<summary><h3>2839 - 설탕 배달</h3></summary>


#### 문제

상근이는 요즘 설탕공장에서 설탕을 배달하고 있다. 상근이는 지금 사탕가게에 설탕을 정확하게 N킬로그램을 배달해야 한다. 설탕공장에서 만드는 설탕은 봉지에 담겨져 있다. 봉지는 3킬로그램 봉지와 5킬로그램 봉지가 있다.

상근이는 귀찮기 때문에, 최대한 적은 봉지를 들고 가려고 한다. 예를 들어, 18킬로그램 설탕을 배달해야 할 때, 3킬로그램 봉지 6개를 가져가도 되지만, 5킬로그램 3개와 3킬로그램 1개를 배달하면, 더 적은 개수의 봉지를 배달할 수 있다.

상근이가 설탕을 정확하게 N킬로그램 배달해야 할 때, 봉지 몇 개를 가져가면 되는지 그 수를 구하는 프로그램을 작성하시오.

#### 입력

첫째 줄에 N이 주어진다. (3 ≤ N ≤ 5000)

#### 출력

상근이가 배달하는 봉지의 최소 개수를 출력한다. 만약, 정확하게 N킬로그램을 만들 수 없다면 -1을 출력한다.

#### 풀이

N 킬로그램을 최소 개수의 봉지로 배달하기 위해

먼저 5킬로그램을 담을 수 있는 봉지의 최대 개수부터 시작한다.

만약 나머지가 0이면 i를 프린트하고 3으로 나눌 수 있는 경우라면 5킬로짜리 i개랑 3으로 나눈 몫을 더해 프린트하면 된다.

for 문에서 break가 일어나지 않은 경우 -1를 출력한다.

#### 코드

```python
n = int(input())

for i in range(n//5, -1, -1):
    r = n-i*5
    if r % 3 == 0:
        print(i+r//3)
        break
    elif r == 0:
        print(i)
        break
else:
    print(-1)
```


</details>

<details>
<summary><h3>4949 - 균형 잡힌 세상</h3></summary>


#### 문제

세계는 균형이 잘 잡혀있어야 한다. 양과 음, 빛과 어둠 그리고 왼쪽 괄호와 오른쪽 괄호처럼 말이다.

정민이의 임무는 어떤 문자열이 주어졌을 때, 괄호들의 균형이 잘 맞춰져 있는지 판단하는 프로그램을 짜는 것이다.

문자열에 포함되는 괄호는 소괄호("()") 와 대괄호("[]")로 2종류이고, 문자열이 균형을 이루는 조건은 아래와 같다.

- 모든 왼쪽 소괄호("(")는 오른쪽 소괄호(")")와만 짝을 이뤄야 한다.
- 모든 왼쪽 대괄호("[")는 오른쪽 대괄호("]")와만 짝을 이뤄야 한다.
- 모든 오른쪽 괄호들은 자신과 짝을 이룰 수 있는 왼쪽 괄호가 존재한다.
- 모든 괄호들의 짝은 1:1 매칭만 가능하다. 즉, 괄호 하나가 둘 이상의 괄호와 짝지어지지 않는다.
- 짝을 이루는 두 괄호가 있을 때, 그 사이에 있는 문자열도 균형이 잡혀야 한다.

정민이를 도와 문자열이 주어졌을 때 균형잡힌 문자열인지 아닌지를 판단해보자.

#### 입력

각 문자열은 마지막 글자를 제외하고 영문 알파벳, 공백, 소괄호("( )"), 대괄호("[ ]")로 이루어져 있으며, 온점(".")으로 끝나고, 길이는 100글자보다 작거나 같다.

입력의 종료조건으로 맨 마지막에 온점 하나(".")가 들어온다.

#### 출력

각 줄마다 해당 문자열이 균형을 이루고 있으면 "yes"를, 아니면 "no"를 출력한다.

#### 풀이

딕셔너리를 이용해서 괄호 종류들의 짝을 맞춘다.

yesorno() 함수는 스택으로 구현을 한다.

여는 괄호라면 스택에 넣는다.

닫는 괄호일 때 스택의 길이가 0이 아니고 스택의 top이 i과 같은 종류의 괄호일 때 pop을 한다. 이 때 만약 닫는 괄호가 스택의 top에 있는 경우가 아니라면 틀린 경우로 판단한다.

스택의 길이가 0이라면 짝꿍이 다 맞는 경우로 yes를 출력하고 0이 아니라면 no를 출력한다.

#### 코드

```python
from collections import deque

ls = {"(":")", "[":"]"}

def yesorno(n):
    stack = deque()
    for i in n:
        if i == "(" or i == "[":
            stack.append(i)
        elif (i == ")") or (i=="]"):
            if (len(stack) != 0) and (ls[stack[-1]] == i):
                stack.pop()
            else: return 1
    return len(stack)

while(True):
    n = input()
    if n == ".":
        break
    stack = yesorno(list(n))
    if stack == 0: print('yes')
    else: print('no')
```


</details>

<details>
<summary><h3>10816 - 숫자카드2</h3></summary>


#### 문제

숫자 카드는 정수 하나가 적혀져 있는 카드이다. 상근이는 숫자 카드 N개를 가지고 있다. 정수 M개가 주어졌을 때, 이 수가 적혀있는 숫자 카드를 상근이가 몇 개 가지고 있는지 구하는 프로그램을 작성하시오.

#### 입력

첫째 줄에 상근이가 가지고 있는 숫자 카드의 개수 N(1 ≤ N ≤ 500,000)이 주어진다. 둘째 줄에는 숫자 카드에 적혀있는 정수가 주어진다. 숫자 카드에 적혀있는 수는 -10,000,000보다 크거나 같고, 10,000,000보다 작거나 같다.

셋째 줄에는 M(1 ≤ M ≤ 500,000)이 주어진다. 넷째 줄에는 상근이가 몇 개 가지고 있는 숫자 카드인지 구해야 할 M개의 정수가 주어지며, 이 수는 공백으로 구분되어져 있다. 이 수도 -10,000,000보다 크거나 같고, 10,000,000보다 작거나 같다.

#### 출력

첫째 줄에 입력으로 주어진 M개의 수에 대해서, 각 수가 적힌 숫자 카드를 상근이가 몇 개 가지고 있는지를 공백으로 구분해 출력한다.

#### 풀이

N개의 가지고 있는 카드들과

M개의 주어진 카드들을 입력으로 받는다.

Counter의 get()을 이용해서 각 카드를 몇 개 가지고 있는지 출력할 수 있다.ㄱ=

처음에 그냥 리스트의 counter를 사용했더니, 시간 초과가 났다.

#### 코드

```python
from collections import Counter

input()
N = list(map(int, input().split()))
input()
M = list(map(int, input().split()))

c = Counter(N)

for i in M:
    print(c.get(i, 0))
```

시간 초과나는 코드

```python
# 시간 초과

input()
N = list(map(int, input().split()))
input()
M = list(map(int, input().split()))

for i in M:
    try:
        print(N.count(i))
    except:
        print(0)
```


</details>

<details>
<summary><h3>10828 - 스택</h3></summary>


#### 문제

정수를 저장하는 스택을 구현한 다음, 입력으로 주어지는 명령을 처리하는 프로그램을 작성하시오.

명령은 총 다섯 가지이다.

- push X: 정수 X를 스택에 넣는 연산이다.
- pop: 스택에서 가장 위에 있는 정수를 빼고, 그 수를 출력한다. 만약 스택에 들어있는 정수가 없는 경우에는 -1을 출력한다.
- size: 스택에 들어있는 정수의 개수를 출력한다.
- empty: 스택이 비어있으면 1, 아니면 0을 출력한다.
- top: 스택의 가장 위에 있는 정수를 출력한다. 만약 스택에 들어있는 정수가 없는 경우에는 -1을 출력한다.

#### 입력

첫째 줄에 주어지는 명령의 수 N (1 ≤ N ≤ 10,000)이 주어진다. 둘째 줄부터 N개의 줄에는 명령이 하나씩 주어진다. 주어지는 정수는 1보다 크거나 같고, 100,000보다 작거나 같다. 문제에 나와있지 않은 명령이 주어지는 경우는 없다.

#### 출력

출력해야하는 명령이 주어질 때마다, 한 줄에 하나씩 출력한다.

#### 풀이

그냥 collections의 deque를 이용하여 주어진 stack 연산들을 구현하면 된다.!

- input()으로 받으면 시간 초과나고, PyPy3로 하면 되기는 된다.

#### 코드

```python
import sys
from collections import deque

stack = deque()

# sys.stdin.read()로 한 번에 모든 입력을 받기
input = sys.stdin.read
data = input().splitlines()

n = int(data[0])

for i in range(1, n + 1):
    s = data[i]
    if "push" in s:
        stack.append(s.split()[1])
    elif s == "pop":
        if stack:
            print(stack.pop())
        else:
            print(-1)
    elif s == "size":
        print(len(stack))
    elif s == "empty":
        if stack:
            print(0)
        else:
            print(1)
    elif s == "top":
        if stack:
            print(stack[-1])
        else:
            print(-1)
```


</details>

<details>
<summary><h3>11866 - 요세푸스 문제 0</h3></summary>


#### 문제

요세푸스 문제는 다음과 같다.

1번부터 N번까지 N명의 사람이 원을 이루면서 앉아있고, 양의 정수 K(≤ N)가 주어진다. 이제 순서대로 K번째 사람을 제거한다. 한 사람이 제거되면 남은 사람들로 이루어진 원을 따라 이 과정을 계속해 나간다. 이 과정은 N명의 사람이 모두 제거될 때까지 계속된다. 원에서 사람들이 제거되는 순서를 (N, K)-요세푸스 순열이라고 한다. 예를 들어 (7, 3)-요세푸스 순열은 <3, 6, 2, 7, 5, 1, 4>이다.

N과 K가 주어지면 (N, K)-요세푸스 순열을 구하는 프로그램을 작성하시오.

#### 입력

첫째 줄에 N과 K가 빈 칸을 사이에 두고 순서대로 주어진다. (1 ≤ K ≤ N ≤ 1,000)

#### 출력

예제와 같이 요세푸스 순열을 출력한다.

#### 풀이

처음에는 어떤 점화식 같은 것을 통해 하려고 했는데, 쉽지가 않았다. 자꾸만 틀렸다.

그래서 그냥 뇌에서 생각나는 대로 풀었다.ㅇ=

기준이 되는 인덱스를 삭제하고, 다음 인덱스(지금에서 K-1칸 뒤의 인덱스)를 찾기.

어찌저찌 풀리긴 하였다.

그래도 다른 풀이가 있는지 나중에 찾아보아야겠다.

#### 코드

```python
N, K = map(int, input().split())
c = list(range(1, N+1))

answer = []
pivot = K-1
for i in range(N-1):
    answer.append(c[pivot])
    del c[pivot]
    pivot = (pivot + (K-1)) % (len(c))

answer.append(c[0])

print("<" + ", ".join(map(str, answer)) + ">")
```


</details>

<details>
<summary><h3>18110 - solved.ac</h3></summary>


#### 문제

solved.ac는 Sogang ICPC Team 학회원들의 알고리즘 공부에 도움을 주고자 만든 서비스이다. 지금은 서강대뿐만 아니라 수많은 사람들이 solved.ac의 도움을 받아 알고리즘 공부를 하고 있다.

ICPC Team은 백준 온라인 저지에서 문제풀이를 연습하는데, 백준 온라인 저지의 문제들에는 난이도 표기가 없어서, 지금까지는 다양한 문제를 풀어 보고 싶더라도 난이도를 가늠하기 어려워 무슨 문제를 풀어야 할지 판단하기 곤란했기 때문에 solved.ac가 만들어졌다. solved.ac가 생긴 이후 전국에서 200명 이상의 기여자 분들께서 소중한 난이도 의견을 공유해 주셨고, 지금은 약 7,000문제에 난이도 표기가 붙게 되었다.

어떤 문제의 난이도는 그 문제를 푼 사람들이 제출한 난이도 의견을 바탕으로 결정한다. 난이도 의견은 그 사용자가 생각한 난이도를 의미하는 정수 하나로 주어진다. solved.ac가 사용자들의 의견을 바탕으로 난이도를 결정하는 방식은 다음과 같다.

아직 아무 의견이 없다면 문제의 난이도는 0으로 결정한다.

의견이 하나 이상 있다면, 문제의 난이도는 모든 사람의 난이도 의견의 30% 절사평균으로 결정한다.

절사평균이란 극단적인 값들이 평균을 왜곡하는 것을 막기 위해 가장 큰 값들과 가장 작은 값들을 제외하고 평균을 내는 것을 말한다. 30% 절사평균의 경우 위에서 15%, 아래에서 15%를 각각 제외하고 평균을 계산한다. 따라서 20명이 투표했다면, 가장 높은 난이도에 투표한 3명과 가장 낮은 난이도에 투표한 3명의 투표는 평균 계산에 반영하지 않는다는 것이다.

제외되는 사람의 수는 위, 아래에서 각각 반올림한다. 25명이 투표한 경우 위, 아래에서 각각 3.75명을 제외해야 하는데, 이 경우 반올림해 4명씩을 제외한다.

마지막으로, 계산된 평균도 정수로 반올림된다. 절사평균이 16.7이었다면 최종 난이도는 17이 된다.

사용자들이 어떤 문제에 제출한 난이도 의견 목록이 주어질 때, solved.ac가 결정한 문제의 난이도를 계산하는 프로그램을 작성하시오.

#### 입력

첫 번째 줄에 난이도 의견의 개수 n이 주어진다. (0 ≤ n ≤ 3 × 105)

이후 두 번째 줄부터 1 + n번째 줄까지 사용자들이 제출한 난이도 의견 n개가 한 줄에 하나씩 주어진다. 모든 난이도 의견은 1 이상 30 이하이다.

#### 출력

solved.ac가 계산한 문제의 난이도를 출력한다.

#### 풀이

문제 자체는 어렵지 않지만, 파이썬의 round()를 사용하면 안된다. 0.4까지 낮은 수로 반올림, 0.6부터 높은 수로 반올림 이런 느낌이라고 한다. 그래서 0.5부터 높은 수로 반올림을 구현해야한다고 한다.

#### 코드

```python
import sys

def r(n):
  if n - int(n) >= 0.5: return int(n)+1
  else: return int(n)

n = int(sys.stdin.readline().rstrip())

if n:
    ranks = []
    for i in range(n):
        ranks.append(int(sys.stdin.readline().rstrip()))

    nn = r(n * 0.15)
    rankss = sorted(ranks)[nn:-nn]
    if nn > 0:
        print(r(sum(rankss)/len(rankss)))
    else:
        print(r(sum(ranks)/len(ranks)))

else: print(0)
```


</details>

<details>
<summary><h3>1874 - 스택 수열</h3></summary>


#### 문제

스택 (stack)은 기본적인 자료구조 중 하나로, 컴퓨터 프로그램을 작성할 때 자주 이용되는 개념이다. 스택은 자료를 넣는 (push) 입구와 자료를 뽑는 (pop) 입구가 같아 제일 나중에 들어간 자료가 제일 먼저 나오는 (LIFO, Last in First out) 특성을 가지고 있다.

1부터 n까지의 수를 스택에 넣었다가 뽑아 늘어놓음으로써, 하나의 수열을 만들 수 있다. 이때, 스택에 push하는 순서는 반드시 오름차순을 지키도록 한다고 하자. 임의의 수열이 주어졌을 때 스택을 이용해 그 수열을 만들 수 있는지 없는지, 있다면 어떤 순서로 push와 pop 연산을 수행해야 하는지를 알아낼 수 있다. 이를 계산하는 프로그램을 작성하라.

#### 입력

첫 줄에 n (1 ≤ n ≤ 100,000)이 주어진다. 둘째 줄부터 n개의 줄에는 수열을 이루는 1이상 n이하의 정수가 하나씩 순서대로 주어진다. 물론 같은 정수가 두 번 나오는 일은 없다.

#### 출력

입력된 수열을 만들기 위해 필요한 연산을 한 줄에 한 개씩 출력한다. push연산은 +로, pop 연산은 -로 표현하도록 한다. 불가능한 경우 NO를 출력한다.

#### 풀이

긍까 1부터 차례대로 넣다 빼면서 주어진 수열 만들어보고 되면 그 연산을 출력하고 안되는 수열이면 NO 출력하면 된다.

#### 코드

```python
n = int(input())
ls = [int(input()) for _ in range(n)]

stack = []
cur = 1
ops = []

for num in ls:
    # num까지 순차대로 숫자를 넣어요
    while cur <= num:
        stack.append(cur)
        ops.append('+')
        cur += 1

    # 스택의 맨 위가 num과 같으면 pop
    if stack[-1] == num:
        stack.pop()
        ops.append('-')
    else:
        print("NO")
        exit()

print("\n".join(ops))
```


</details>

<details>
<summary><h3>1920 - 수 찾기</h3></summary>


#### 문제

N개의 정수 A[1], A[2], …, A[N]이 주어져 있을 때, 이 안에 X라는 정수가 존재하는지 알아내는 프로그램을 작성하시오.

#### 입력

첫째 줄에 자연수 N(1 ≤ N ≤ 100,000)이 주어진다. 다음 줄에는 N개의 정수 A[1], A[2], …, A[N]이 주어진다. 다음 줄에는 M(1 ≤ M ≤ 100,000)이 주어진다. 다음 줄에는 M개의 수들이 주어지는데, 이 수들이 A안에 존재하는지 알아내면 된다. 모든 정수의 범위는 -231 보다 크거나 같고 231보다 작다.

#### 출력

M개의 줄에 답을 출력한다. 존재하면 1을, 존재하지 않으면 0을 출력한다.

#### 풀이

A는 겹치지 않기 때문에 set()를 사용하여 시간 초과되지 않을 수 있었다.

#### 코드

```python
n = int(input())
A = set(map(int, input().split()))
m = int(input())
B = list(map(int, input().split()))

for i in range(m):
    if B[i] in A:
        print(1)
    else: print(0)
```

```python
# 시간초과

n = int(input())
A = list(map(int, input().split()))
m = int(input())
B = list(map(int, input().split()))

for i in range(m):
    if B[i] in A:
        print(1)
    else: print(0)
```


</details>

<details>
<summary><h3>1978 - 소수 찾기</h3></summary>


#### 문제

주어진 수 N개 중에서 소수가 몇 개인지 찾아서 출력하는 프로그램을 작성하시오.

#### 입력

첫 줄에 수의 개수 N이 주어진다. N은 100이하이다. 다음으로 N개의 수가 주어지는데 수는 1,000 이하의 자연수이다.

#### 출력

주어진 수들 중 소수의 개수를 출력한다.

#### 풀이

주어진 수들을 차례로 보며 소수인지만 확인하면 된다. 2이상의 수들에 대해 차례대로 확인한다.

시간 초과는 안났지만 생각해보니 효율적인지는?! 모르겠다.

#### 코드

```python
N = int(input())
ls = list(map(int, input().split()))
answer = 0

for i in ls:
    if i == 1:
        continue

    flag = True

    for j in range(2, i+1):
        if (i%j==0) and (i!=j):
            flag = False

    if flag == True:
        answer += 1

print(answer)
```


</details>

<details>
<summary><h3>2108 - 통계학</h3></summary>


#### 문제

수를 처리하는 것은 통계학에서 상당히 중요한 일이다. 통계학에서 N개의 수를 대표하는 기본 통계값에는 다음과 같은 것들이 있다. 단, N은 홀수라고 가정하자.

1. 산술평균 : N개의 수들의 합을 N으로 나눈 값
2. 중앙값 : N개의 수들을 증가하는 순서로 나열했을 경우 그 중앙에 위치하는 값
3. 최빈값 : N개의 수들 중 가장 많이 나타나는 값
4. 범위 : N개의 수들 중 최댓값과 최솟값의 차이N개의 수가 주어졌을 때, 네 가지 기본 통계값을 구하는 프로그램을 작성하시오.

#### 입력

첫째 줄에 수의 개수 N(1 ≤ N ≤ 500,000)이 주어진다. 단, N은 홀수이다. 그 다음 N개의 줄에는 정수들이 주어진다. 입력되는 정수의 절댓값은 4,000을 넘지 않는다.

#### 출력

첫째 줄에는 산술평균을 출력한다. 소수점 이하 첫째 자리에서 반올림한 값을 출력한다.

둘째 줄에는 중앙값을 출력한다.

셋째 줄에는 최빈값을 출력한다. 여러 개 있을 때에는 최빈값 중 두 번째로 작은 값을 출력한다.

넷째 줄에는 범위를 출력한다.

#### 풀이

산술평균은 그냥 리스트 모든 값의 합을 길이로 나눈 값 출력.

중앙값은 정렬된 리스트의 중앙 값 출력.

최빈값은 Counter를 이용하여 최빈 값 출력하되, 여러 개의 최빈 값이 존재할 때에는 두번째 최빈값 출력.

범위는 최대 - 최소 출력.

파이썬 참 잘 만들어졌구나 대박입니다! 감사합니다.

#### 코드

```python
# input()으로 받아서 그런지 PyPy3로는 되었다.
# readlines로 할 것!

from collections import Counter

N = int(input())
I = []
for i in range(N):
    I.append(int(input()))

print(round(sum(I)/len(I)))

print(sorted(I)[N//2])

counter = Counter(I)
most_common = counter.most_common()
max_count = most_common[0][1]
mode = [num for num, count in most_common if count == max_count]
if len(mode) > 1:
    mode = sorted(mode)
    mode_value = mode[1]
else:
    mode_value = mode[0]
print(mode_value)

print(max(I)-min(I))
```


</details>

<details>
<summary><h3>2164 - 카드 2</h3></summary>


#### 문제

N장의 카드가 있다. 각각의 카드는 차례로 1부터 N까지의 번호가 붙어 있으며, 1번 카드가 제일 위에, N번 카드가 제일 아래인 상태로 순서대로 카드가 놓여 있다.

이제 다음과 같은 동작을 카드가 한 장 남을 때까지 반복하게 된다. 우선, 제일 위에 있는 카드를 바닥에 버린다. 그 다음, 제일 위에 있는 카드를 제일 아래에 있는 카드 밑으로 옮긴다.

예를 들어 N=4인 경우를 생각해 보자. 카드는 제일 위에서부터 1234 의 순서로 놓여있다. 1을 버리면 234가 남는다. 여기서 2를 제일 아래로 옮기면 342가 된다. 3을 버리면 42가 되고, 4를 밑으로 옮기면 24가 된다. 마지막으로 2를 버리고 나면, 남는 카드는 4가 된다.

N이 주어졌을 때, 제일 마지막에 남게 되는 카드를 구하는 프로그램을 작성하시오.

#### 입력

첫째 줄에 정수 N(1 ≤ N ≤ 500,000)이 주어진다.

#### 출력

첫째 줄에 남게 되는 카드의 번호를 출력한다.

#### 풀이

리스트를 이용하니 시간 초과가 뜬다.

collections의 deque를 이용해서 풀었더니 되었다. 앞으로 deque를 적극 이용해야겠다.

#### 코드

```python
# dequeue의 popleft와 append는 O(1)이 걸림

from collections import deque

n = int(input())

cards = deque(range(1, n+1))

while len(cards) > 1:
    cards.popleft()
    cards.append(cards.popleft())

print(cards[0])
```

```python
# 시간 초과 list의 pop과 append는 O(n)이 걸림
n = int(input())

cards = list(range(1, n+1))

while(len(cards) > 1):
    cards.pop(0)
    cards.append(cards.pop(0))
print(cards[0])
```


</details>

<details>
<summary><h3>2231 - 분해합</h3></summary>


#### 문제

어떤 자연수 N이 있을 때, 그 자연수 N의 분해합은 N과 N을 이루는 각 자리수의 합을 의미한다. 어떤 자연수 M의 분해합이 N인 경우, M을 N의 생성자라 한다. 예를 들어, 245의 분해합은 256(=245+2+4+5)이 된다. 따라서 245는 256의 생성자가 된다. 물론, 어떤 자연수의 경우에는 생성자가 없을 수도 있다. 반대로, 생성자가 여러 개인 자연수도 있을 수 있다.

자연수 N이 주어졌을 때, N의 가장 작은 생성자를 구해내는 프로그램을 작성하시오.

#### 입력

첫째 줄에 자연수 N(1 ≤ N ≤ 1,000,000)이 주어진다.

#### 출력

첫째 줄에 답을 출력한다. 생성자가 없는 경우에는 0을 출력한다.

#### 풀이

N - 54의 의미:

이 문제에서 M이 N의 생성자라고 했을 때, M은 N보다 작아야 한다. M이 N과 가까운 숫자일수록 M의 자릿수 합이 작아지기 때문에, M은 N보다 몇 단위 작은 숫자일 가능성이 크다.

자릿수 합이 최대일 때, 각 자릿수가 9일 경우이다. 예를 들어, 2자리 숫자에서 자릿수 합의 최댓값은 18이고, 3자리 숫자에서는 자릿수 합의 최댓값이 27입니다. 이를 일반화하면, M이 N보다 최대 54만큼 작을 수 있다고 볼 수 있다.

54는 9가 두 자릿수로 각각 더해졌을 때의 최대 값 (9 + 9 + 9 = 27)이므로, N의 생성자를 찾을 때 N - 54부터 시작하여 N-1까지 확인하는 것이 적절하다.

#### 코드

```python
def find_smallest_constructor(N):
    for M in range(max(1, N - 54), N):
        if M + sum(map(int, str(M))) == N:
            return M
    return 0

N = int(input())

print(find_smallest_constructor(N))
```


</details>

<details>
<summary><h3>2292 - 벌집</h3></summary>


#### 문제

위의 그림과 같이 육각형으로 이루어진 벌집이 있다. 그림에서 보는 바와 같이 중앙의 방 1부터 시작해서 이웃하는 방에 돌아가면서 1씩 증가하는 번호를 주소로 매길 수 있다. 숫자 N이 주어졌을 때, 벌집의 중앙 1에서 N번 방까지 최소 개수의 방을 지나서 갈 때 몇 개의 방을 지나가는지(시작과 끝을 포함하여)를 계산하는 프로그램을 작성하시오. 예를 들면, 13까지는 3개, 58까지는 5개를 지난다.

#### 입력

첫째 줄에 N(1 ≤ N ≤ 1,000,000,000)이 주어진다.

#### 출력

입력으로 주어진 방까지 최소 개수의 방을 지나서 갈 때 몇 개의 방을 지나는지 출력한다.

#### 풀이

N번방까지 최소 몇 개의 방을 가로 질러 가야하는지 계산할 때 벌집 구조를 생각해야한다.

1부터 6을 더해가면서 한 층 한 층 가로질러 간다.

만약 N보다 크거나 같아지면 그 층이 N번방이 있는 층이 될 것이다.

#### 코드

```python
N = int(input())
m = 1
c = 1
while(m < N):
    m += (6*c)
    c += 1

print(c)
```


</details>

<details>
<summary><h3>2798 - 블랙잭</h3></summary>


#### 문제

카지노에서 제일 인기 있는 게임 블랙잭의 규칙은 상당히 쉽다. 카드의 합이 21을 넘지 않는 한도 내에서, 카드의 합을 최대한 크게 만드는 게임이다. 블랙잭은 카지노마다 다양한 규정이 있다.

한국 최고의 블랙잭 고수 김정인은 새로운 블랙잭 규칙을 만들어 상근, 창영이와 게임하려고 한다.

김정인 버전의 블랙잭에서 각 카드에는 양의 정수가 쓰여 있다. 그 다음, 딜러는 N장의 카드를 모두 숫자가 보이도록 바닥에 놓는다. 그런 후에 딜러는 숫자 M을 크게 외친다.

이제 플레이어는 제한된 시간 안에 N장의 카드 중에서 3장의 카드를 골라야 한다. 블랙잭 변형 게임이기 때문에, 플레이어가 고른 카드의 합은 M을 넘지 않으면서 M과 최대한 가깝게 만들어야 한다.

N장의 카드에 써져 있는 숫자가 주어졌을 때, M을 넘지 않으면서 M에 최대한 가까운 카드 3장의 합을 구해 출력하시오.

#### 입력

첫째 줄에 카드의 개수 N(3 ≤ N ≤ 100)과 M(10 ≤ M ≤ 300,000)이 주어진다. 둘째 줄에는 카드에 쓰여 있는 수가 주어지며, 이 값은 100,000을 넘지 않는 양의 정수이다.

합이 M을 넘지 않는 카드 3장을 찾을 수 있는 경우만 입력으로 주어진다.

#### 출력

첫째 줄에 M을 넘지 않으면서 M에 최대한 가까운 카드 3장의 합을 출력한다.

#### 풀이

블랙잭에 대해 잘 몰랐는데 흥미로웠다.

그냥 문제 마지막 줄을 구현하면 된다.

조합을 이용했다. 주어진 카드들 중 3장의 합이 가장 큰 경우를 찾으면 된다.

#### 코드

```python
from itertools import combinations

def blackjack(N, M, cards):
    max_sum = 0

    # 카드에서 3장을 고르는 모든 조합을 확인
    for combo in combinations(cards, 3):
        total = sum(combo)
        if total <= M:
            max_sum = max(max_sum, total)

    return max_sum

# 입력 받기
N, M = map(int, input().split())
cards = list(map(int, input().split()))

# 함수 호출
result = blackjack(N, M, cards)
print(result)
```


</details>

<details>
<summary><h3>4153 - 직각삼각형</h3></summary>


#### 문제

과거 이집트인들은 각 변들의 길이가 3, 4, 5인 삼각형이 직각 삼각형인것을 알아냈다. 주어진 세변의 길이로 삼각형이 직각인지 아닌지 구분하시오.

#### 입력

입력은 여러개의 테스트케이스로 주어지며 마지막줄에는 0 0 0이 입력된다. 각 테스트케이스는 모두 30,000보다 작은 양의 정수로 주어지며, 각 입력은 변의 길이를 의미한다.

#### 출력

각 입력에 대해 직각 삼각형이 맞다면 "right", 아니라면 "wrong"을 출력한다.

#### 풀이

0 0 0이 입력될 때까지 주어지는 세 변의 길이를 통해 직각삼각형인지 판단하면 된다.

가장 큰 변의 길이의 제곱 = 나머지 두 변의 길이의 제곱의 합

이면 직각삼각형이다.

#### 코드

```python
while(True):
    triangle = list(map(int, input().split()))
    if sum(triangle) == 0:
        break

    a = triangle.pop(triangle.index(max(triangle)))
    b = triangle.pop()
    c = triangle.pop()

    if (a**2) == ((b**2)+(c**2)):
        print("right")
    else:
        print("wrong")
```


</details>

<details>
<summary><h3>9012 - 괄호</h3></summary>


#### 문제

괄호 문자열(Parenthesis String, PS)은 두 개의 괄호 기호인 ‘(’ 와 ‘)’ 만으로 구성되어 있는 문자열이다. 그 중에서 괄호의 모양이 바르게 구성된 문자열을 올바른 괄호 문자열(Valid PS, VPS)이라고 부른다. 한 쌍의 괄호 기호로 된 “( )” 문자열은 기본 VPS 이라고 부른다. 만일 x 가 VPS 라면 이것을 하나의 괄호에 넣은 새로운 문자열 “(x)”도 VPS 가 된다. 그리고 두 VPS x 와 y를 접합(concatenation)시킨 새로운 문자열 xy도 VPS 가 된다. 예를 들어 “(())()”와 “((()))” 는 VPS 이지만 “(()(”, “(())()))” , 그리고 “(()” 는 모두 VPS 가 아닌 문자열이다.

여러분은 입력으로 주어진 괄호 문자열이 VPS 인지 아닌지를 판단해서 그 결과를 YES 와 NO 로 나타내어야 한다.

#### 입력

입력 데이터는 표준 입력을 사용한다. 입력은 T개의 테스트 데이터로 주어진다. 입력의 첫 번째 줄에는 입력 데이터의 수를 나타내는 정수 T가 주어진다. 각 테스트 데이터의 첫째 줄에는 괄호 문자열이 한 줄에 주어진다. 하나의 괄호 문자열의 길이는 2 이상 50 이하이다.

#### 출력

출력은 표준 출력을 사용한다. 만일 입력 괄호 문자열이 올바른 괄호 문자열(VPS)이면 “YES”, 아니면 “NO”를 한 줄에 하나씩 차례대로 출력해야 한다.

#### 풀이

내가 아래 첨부한 대로 각각의 괄호의 짝을 딕셔너리로 만들어 놓을 필요는 없다. 딕셔너리가 유용한 상황은 여러 종류의 괄호가 나오는 경우일 것이다.

여는 괄호가 나오면 스택에 넣고, 닫는 괄호가 나오면 꺼낸다. 문장이 끝나고 최종적으로 stack에 아무것도 남아있지 않으면 (길이가 0이면) YES, 아니면 NO를 출력한다.

파이썬으로 문제를 풀면서 deque를 잘 사용하게 되는 것 같다.

#### 코드

```python
from collections import deque

ls = {"(":")"}

def yesorno(n):
    stack = deque()
    for i in n:
        if i == "(":
            stack.append(i)
        elif i == ")":
            if (len(stack) != 0) and (ls[stack[-1]] == i):
                stack.pop()
            else: return 1
    return len(stack)

n = int(input())

for i in range(n):
    s = input()
    stack = yesorno(list(s))

    if stack == 0: print('YES')
    else: print('NO')
```


</details>

<details>
<summary><h3>10773 - 제로</h3></summary>


#### 문제

나코더 기장 재민이는 동아리 회식을 준비하기 위해서 장부를 관리하는 중이다.

재현이는 재민이를 도와서 돈을 관리하는 중인데, 애석하게도 항상 정신없는 재현이는 돈을 실수로 잘못 부르는 사고를 치기 일쑤였다.

재현이는 잘못된 수를 부를 때마다 0을 외쳐서, 가장 최근에 재민이가 쓴 수를 지우게 시킨다.

재민이는 이렇게 모든 수를 받아 적은 후 그 수의 합을 알고 싶어 한다. 재민이를 도와주자!

#### 입력

첫 번째 줄에 정수 K가 주어진다. (1 ≤ K ≤ 100,000)

이후 K개의 줄에 정수가 1개씩 주어진다. 정수는 0에서 1,000,000 사이의 값을 가지며, 정수가 "0" 일 경우에는 가장 최근에 쓴 수를 지우고, 아닐 경우 해당 수를 쓴다.

정수가 "0"일 경우에 지울 수 있는 수가 있음을 보장할 수 있다.

#### 출력

재민이가 최종적으로 적어 낸 수의 합을 출력한다. 최종적으로 적어낸 수의 합은 231-1보다 작거나 같은 정수이다.

#### 풀이

재민이가 틀리게 말하면 앗촤촤촤촤촤!!! 하면서 0을 외친다고 한다. 그러면 0이 나오면 기존의 스택의 맨 위 빼면 된다.ㅂ=

#### 코드

```python
# 33192 KB, 2552 ms

k = int(input())
stack = []
for i in range(k):
    n = int(input())
    if n > 0:
        stack.append(n)
    elif n == 0:
        stack.pop()
print(sum(stack))
```


</details>

<details>
<summary><h3>10814 - 나이 순 정렬</h3></summary>


#### 문제

온라인 저지에 가입한 사람들의 나이와 이름이 가입한 순서대로 주어진다. 이때, 회원들을 나이가 증가하는 순으로, 나이가 같으면 먼저 가입한 사람이 앞에 오는 순서로 정렬하는 프로그램을 작성하시오.

#### 입력

첫째 줄에 온라인 저지 회원의 수 N이 주어진다. (1 ≤ N ≤ 100,000)

둘째 줄부터 N개의 줄에는 각 회원의 나이와 이름이 공백으로 구분되어 주어진다. 나이는 1보다 크거나 같으며, 200보다 작거나 같은 정수이고, 이름은 알파벳 대소문자로 이루어져 있고, 길이가 100보다 작거나 같은 문자열이다. 입력은 가입한 순서로 주어진다.

#### 출력

첫째 줄부터 총 N개의 줄에 걸쳐 온라인 저지 회원을 나이 순, 나이가 같으면 가입한 순으로 한 줄에 한 명씩 나이와 이름을 공백으로 구분해 출력한다.

#### 풀이

people.sort(key=lambda x: x[0])

위 부분이 포인트인 것 같은데,

리스트가 이중 리스트일 때 첫번째 요소에 대해서만 정렬을 하기 위해 람다 함수를 사용했다. 이 lambda, map, 등등을 이용하면 정말 간편하게 원하는 대로 리스트나 여러 자료구조를 만질 수 있어서 유용한 것 같다.

#### 코드

```python
n = int(input())
people = []
for i in range(n):
    age, name = input().split()
    people.append([int(age), name])
people.sort(key=lambda x: x[0])

for j in range(n):
    print(people[j][0], people[j][1])
```


</details>

<details>
<summary><h3>10834 - 큐</h3></summary>


#### 문제

정수를 저장하는 큐를 구현한 다음, 입력으로 주어지는 명령을 처리하는 프로그램을 작성하시오.

명령은 총 여섯 가지이다.

- push X: 정수 X를 큐에 넣는 연산이다.
- pop: 큐에서 가장 앞에 있는 정수를 빼고, 그 수를 출력한다. 만약 큐에 들어있는 정수가 없는 경우에는 -1을 출력한다.
- size: 큐에 들어있는 정수의 개수를 출력한다.
- empty: 큐가 비어있으면 1, 아니면 0을 출력한다.
- front: 큐의 가장 앞에 있는 정수를 출력한다. 만약 큐에 들어있는 정수가 없는 경우에는 -1을 출력한다.
- back: 큐의 가장 뒤에 있는 정수를 출력한다. 만약 큐에 들어있는 정수가 없는 경우에는 -1을 출력한다.

#### 입력

첫째 줄에 주어지는 명령의 수 N (1 ≤ N ≤ 10,000)이 주어진다. 둘째 줄부터 N개의 줄에는 명령이 하나씩 주어진다. 주어지는 정수는 1보다 크거나 같고, 100,000보다 작거나 같다. 문제에 나와있지 않은 명령이 주어지는 경우는 없다.

#### 출력

출력해야하는 명령이 주어질 때마다, 한 줄에 하나씩 출력한다.

#### 풀이

문제에서 제시된 동작들을 차례대로 구현하면 된다. 나는 deque라는 자료구조를 이용했는데, 이 문제를 풀며 deque에 대해 더 알아보게 되어 좋았다.

#### 코드

```python
import sys
from collections import deque

stack = deque()

input = sys.stdin.read
data = input().splitlines()

n = int(data[0])

for i in range(1, n + 1):
    s = data[i]
    if "push" in s:
        stack.append(s.split()[1])
    elif s == "pop":
        if stack:
            print(stack.popleft())
        else:
            print(-1)
    elif s == "size":
        print(len(stack))
    elif s == "empty":
        if stack:
            print(0)
        else:
            print(1)
    elif s == "front":
        if stack:
            print(stack[0])
        else:
            print(-1)
    elif s == "back":
        if stack:
            print(stack[-1])
        else:
            print(-1)
```


</details>

<details>
<summary><h3>2606 - 바이러스</h3></summary>


문제로 가기

#### 풀이

생각의 흐름대로 풀어서.. 그다지 효율적이지 못한 코드같다. 시간 초과가 안떴으니까 그냥 넘어갔던 것 같다.

우선, 입력 받은 pair를 그대로 리스트에 넣어버렸다.

최초로 감염된 컴퓨터의 번호인 1을 queue에 넣고 시작한다.

연결되어있는 쌍들을 찾아서 만약 감염 되었다면 nodes라는 set 객체에 넣어버렸다. 그리고 큐에 그 번호를 넣는다.

왜 이렇게 풀었슬까..?

그냥 bfs나 dfs로 풀면 되는 문제 같다.!!!!!!!!!!!!!

#### 코드

```python
from collections import deque

num_com = int(input())
num_pair = int(input())
pairs = []
for _ in range(num_pair):
    pairs.append(list(map(int, input().split())))

queue = deque()
queue.append(1)
nodes = set()
nodes.add(1)

while queue:
    cur = queue.popleft()
    for i in range(num_pair):
        if (pairs[i][0] == cur) and (pairs[i][1] not in nodes):
            queue.append(pairs[i][1])
            nodes.add(pairs[i][1])
        if (pairs[i][1] == cur) and (pairs[i][0] not in nodes):
            queue.append(pairs[i][0])
            nodes.add(pairs[i][0])

print(len(nodes)-1)
```


</details>

<details>
<summary><h3>21736 - 헌내기는 친구가 필요해</h3></summary>


문제 보기

#### 풀이

문제를 보자마자 음 그래프 탐색 문제로 풀면 되겠군 했다.

나는 bfs로 풀었다. 상하좌우가 O면 큐에 추가하고, P면 친구 한 명 사귀고 큐에 추가하는 식으로 했다.

다만 x, y의 범위를 확인하는 부분을 조금 느슨하게 하고

무작정 try, except로 한 부분이 조금 걸린다.

#### 코드

```python
from collections import deque

N, M = map(int, input().split())
campus = []
cnt = 0

for k in range(N):
    l = list(input())
    campus.append(l)
    if "I" in l:
        i = (k, l.index("I"))

def bfs(graph, start):
    queue = deque()
    queue.append(start)

    visited = set()
    visited.add(start)

    def determine(x, y):
        global cnt
        try:
            if (x, y) not in visited and x>=0 and y >= 0:
                if graph[x][y] == "O":
                    queue.append((x, y))
                elif graph[x][y] == "P":
                    cnt += 1
                    queue.append((x, y))
                visited.add((x, y))
        except:
            pass

    while queue:
        x, y = queue.popleft()
        determine(x+1, y)
        determine(x, y+1)
        determine(x-1, y)
        determine(x, y-1)

bfs(campus, i)
if cnt>0: print(cnt)
else: print("TT")
```


</details>

<details>
<summary><h3>1260 - DFS와 BFS</h3></summary>


문제 보기

#### 풀이

DFS와 BFS를 공부해볼 수 있는 좋은 문제였다.

1. 이중 리스트로 그래프를 표현한다.

2. pair가 주어지면 그래프의 각각의 노드 번호에 추가해준다. graph[a] = b, graph[b] = a

3. 각 노드에 연결되어있는 노드들을 정렬하고자 하면, for문을 이용하여 그래프 이중 리스트 안의 각각의 리스트를 정렬해준다.

4-1. dfs는 재귀 함수를 이용하는 것처럼, 예를 들어 a노드에 연결된 b노드를 탐방하다가 b노드에 연결된 c를 탐방하는 식으로 방문이 이루어진다.

4-2. bfs는 queue 구조를 이용하여 a 노드에 연결된 방문하지 않았던 모든 노드들을 큐에 넣고, a노드 탐방이 끝나면 b노드를 탐방하게 될 것이다.

#### 코드

```python
from collections import deque

N, M, V = map(int, input().split())

graph = [[] for _ in range(N + 1)]

for _ in range(M):
    s, e = map(int, input().split())
    graph[s].append(e)
    graph[e].append(s)

for adj in graph:
    adj.sort()

def dfs(node, visited):
    visited[node] = True
    dfs_order.append(node)

    for neighbor in graph[node]:
        if not visited[neighbor]:
            dfs(neighbor, visited)

def bfs(start):
    visited = [False] * (N + 1)
    queue = deque([start])
    visited[start] = True
    bfs_order = []

    while queue:
        node = queue.popleft()
        bfs_order.append(node)

        for neighbor in graph[node]:
            if not visited[neighbor]:
                visited[neighbor] = True
                queue.append(neighbor)

    return bfs_order

dfs_order = []
visited_dfs = [False] * (N + 1)
dfs(V, visited_dfs)

bfs_order = bfs(V)

print(" ".join(map(str, dfs_order)))
print(" ".join(map(str, bfs_order)))
```

</details>

