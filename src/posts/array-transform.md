---
title: "filter와 map으로 데이터 변환을 나누기"
description: "필요한 항목을 고르고, 필요한 모양으로 바꾸는 과정을 작은 단계로 나눠봅니다."
date: 2026-11-09T09:00:00+09:00
category: 코드 노트
topics: [JavaScript, 리팩터링]
draft: true
---
## 선택과 변환을 구분하기

배열을 다루다 보면 **어떤 항목이 필요한지**와 **어떤 값으로 바꿀지**를 한 번에 생각하게 됩니다. 두 과정을 나누면 코드의 의도가 더 쉽게 드러납니다.

![원본 배열에서 filter와 map을 거쳐 새 배열을 만드는 흐름](/assets/data-flow.svg)

예를 들어 할 일 목록에서 완료한 항목의 제목만 모으려 합니다.

```javascript
const tasks = [
  { title: '문제 재현하기', done: true },
  { title: '원인 기록하기', done: true },
  { title: '개선안 비교하기', done: false }
];

const titles = tasks
  .filter(task => task.done)
  .map(task => task.title);

console.log(titles);
// ['문제 재현하기', '원인 기록하기']
```

`filter`는 조건을 만족하는 항목을 고르고, `map`은 각 항목을 새로운 값으로 바꿉니다.

## 각 단계의 역할

| 단계 | 입력 | 결과 |
| --- | --- | --- |
| `filter` | 모든 할 일 | 완료한 할 일 |
| `map` | 완료한 할 일 | 제목 문자열 |

두 메서드는 모두 새 배열을 반환합니다. 다만 객체가 든 배열을 복사했다고 해서 객체 자체까지 깊게 복사되는 것은 아닙니다.

> 배열의 바깥 구조가 새로 만들어지는 것과, 내부 객체가 독립적으로 복제되는 것은 다른 문제입니다.

## 분리할 때의 기준

1. 조건을 문장으로 설명할 수 있는지 확인합니다.
2. 결과에 필요한 값만 남깁니다.
3. 빈 배열과 조건을 만족하는 항목이 없는 경우를 확인합니다.

조건이 복잡해지면 함수 이름을 붙일 수도 있습니다.

```javascript
const isDone = task => task.done === true;
const getTitle = task => task.title;

const titles = tasks.filter(isDone).map(getTitle);
```

짧은 코드를 무조건 나누기보다, 이름이 맥락을 설명하는 데 도움이 되는지를 기준으로 삼습니다.
