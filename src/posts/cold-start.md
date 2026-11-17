---
title: "콜드스타트 추천 시스템 — LightGCN과 대조학습으로 해결을 시도했지만, 왜 실패했을까?"
description: "신규 아이템 추천 문제를 해결하기 위해 MovieLens·TMDB 데이터를 결합하고, LightGCN에 메타데이터 임베딩·Graph Regularization·Contrastive Learning을 적용한 연구 프로젝트 회고. Cold-Start 평가 체계 구축부터 다양한 Loss·Sampling 실험, 실패 원인 분석까지의 과정을 정리했다."
date: 2025-02-21T09:00:00+09:00
category: 프로젝트 회고
topics:
  - 추천 시스템
  - 콜드스타트
  - 그래프 신경망
  - 대조학습
  - 실험 설계
  - 머신러닝
draft: false
---

# [RecSys] 상호작용이 없는 영화도 추천할 수 있을까? — LightGCN과 Contrastive Learning의 실패 기록

> **GitHub:** https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3
>
> **주요 기여:** WandB 실험 로깅, Cold User 평가 체계 구현, CLCRec 대조학습 모델 추가, LightGCN 기반 콜드스타트 대응 실험

## 1. 프로젝트 개요

추천 시스템은 사용자의 과거 상호작용을 학습하여 선호할 가능성이 높은 아이템을 예측한다.

하지만 새로운 영화가 등록되었을 때는 어떻게 추천해야 할까?

영화가 아무리 좋은 작품이더라도 아직 해당 영화를 시청한 사용자가 없다면 협업 필터링 기반 모델은 영화의 선호도를 학습할 정보가 부족하다.

이러한 문제를 **Cold-Start Problem**이라고 한다.

이전 영화 추천 프로젝트에서는 SASRec, RecVAE, EASER 등 다양한 알고리즘을 비교하고 앙상블을 통해 추천 성능을 개선하는 데 집중했다.

반면 이번 프로젝트에서는 특정 모델의 전체 추천 성능을 높이는 것보다, **상호작용이 거의 없는 신규 아이템을 얼마나 잘 추천할 수 있는가**에 집중했다.

이를 위해 그래프 기반 추천 모델인 LightGCN을 베이스라인으로 설정했다.

그리고 MovieLens의 사용자-영화 상호작용 데이터와 TMDB의 영화 메타데이터를 활용하여, 그래프의 연결 정보가 부족한 아이템에도 의미 있는 임베딩을 제공하고자 했다.

주요 실험 방향은 다음과 같았다.

- 텍스트 메타데이터를 이용한 아이템 임베딩 생성
- ID 임베딩과 메타데이터 임베딩의 정렬
- Graph Regularization을 통한 유사 아이템 표현 학습
- Contrastive Learning을 이용한 임베딩 개선
- Cold Item에 가중치를 부여하는 BPR Loss
- Negative Sampling 전략 변경
- Cold-Start 사용자 및 아이템에 대한 별도 평가

여러 방법을 시도했지만, 최종적으로 콜드스타트 추천 성능을 만족스럽게 개선하지 못했다.

이번 글에서는 사용한 알고리즘을 나열하기보다 **어떤 가설을 세웠고, 왜 그 방법을 적용했으며, 무엇이 기대대로 동작하지 않았는지**를 중심으로 정리하고자 한다.

## 2. 문제 정의: LightGCN은 왜 Cold Item에 취약할까?

### 2.1 LightGCN의 그래프 기반 협업 필터링

LightGCN은 사용자와 아이템 사이의 상호작용을 이분 그래프(Bipartite Graph)로 표현한다.

사용자가 영화를 시청했다면 해당 사용자 노드와 영화 노드 사이에 Edge를 생성한다.

이후 Graph Convolution을 통해 연결된 노드들의 임베딩을 전달하고 집계한다.

LightGCN의 기본적인 임베딩 전파는 다음과 같이 표현할 수 있다.

\[
E^{(k+1)} = \tilde{A}E^{(k)}
\]

여기서

- \(E^{(k)}\): k번째 레이어의 노드 임베딩
- \(\tilde{A}\): 정규화된 인접 행렬
- \(k\): 그래프 전파 레이어

이다.

최종 임베딩은 여러 레이어에서 얻은 표현을 결합하여 계산한다.

\[
E = \frac{1}{K+1}\sum_{k=0}^{K}E^{(k)}
\]

이 방식은 사용자와 아이템의 직접적인 관계뿐 아니라 다중 Hop을 통한 간접적인 협업 신호까지 활용할 수 있다는 장점이 있다.

하지만 추천 대상이 Cold Item이라면 문제가 발생한다.

### 2.2 Edge가 부족한 아이템

예를 들어 영화 A는 수천 명의 사용자가 시청했고, 영화 B는 단 한 명만 시청했다고 가정해 보자.

영화 A는 다양한 사용자 노드와 연결되어 있기 때문에 그래프 전파 과정에서 풍부한 정보를 얻을 수 있다.

반면 영화 B는 연결된 노드가 거의 없어 학습할 수 있는 정보가 제한적이다.

특히 Edge가 전혀 없는 신규 아이템은 이웃 노드로부터 협업 신호를 전달받을 수 없다.

이 경우 LightGCN의 그래프 전파만으로는 해당 아이템의 선호도를 충분히 학습하기 어렵다.

따라서 다음과 같은 가설을 세웠다.

> 신규 아이템에 사용자 상호작용이 없어도, 비슷한 기존 영화의 콘텐츠 정보를 활용한다면 의미 있는 추천 임베딩을 만들 수 있지 않을까?

이 가설을 검증하기 위해 콘텐츠 기반 메타데이터와 대조학습을 결합하는 방향으로 실험을 진행했다.

## 3. 데이터 구성: MovieLens와 TMDB 결합

### 3.1 MovieLens 데이터

프로젝트에서는 MovieLens 1M과 MovieLens 32M을 실험 데이터로 활용했다.

| 데이터셋 | 사용자 수 | 영화 수 | 평점 수 |
|---|---:|---:|---:|
| MovieLens 1M | 6,040 | 약 3,900 | 1,000,209 |
| MovieLens 32M | 200,948 | 87,585 | 32,000,204 |

MovieLens에는 사용자 ID, 영화 ID, 평점, 시청 시점을 나타내는 Timestamp 등이 존재한다.

또한 영화 제목과 장르 정보, IMDb 및 TMDB 식별자를 제공한다.

이를 통해 사용자-아이템 그래프를 구성하고, 영화 ID를 TMDB의 상세 정보와 연결할 수 있었다.

### 3.2 TMDB 메타데이터 활용

협업 필터링의 한계를 보완하기 위해 TMDB API를 통한 콘텐츠 정보 수집을 시도했다.

주요 활용 대상은 영화 줄거리, 장르, 배우 정보 등의 메타데이터였다.

이러한 정보는 상호작용이 없는 신규 영화에도 존재할 수 있기 때문에 콜드스타트 대응에 적합할 것이라고 판단했다.

예를 들어 두 영화가 비슷한 주제와 장르를 가지고 있다면, 시청 이력이 부족하더라도 콘텐츠 관점에서 유사성을 추정할 수 있다.

하지만 여기서 주의해야 할 점이 있다.

**콘텐츠가 유사하다는 사실이 사용자 선호도도 유사하다는 것을 보장하지는 않는다.**

동일한 장르의 영화라도 작품의 완성도, 배우, 연출 스타일에 따라 사용자의 선호도가 달라질 수 있다.

따라서 메타데이터 임베딩을 단순히 생성하는 것에서 끝나는 것이 아니라, 추천 목적에 맞게 학습하거나 기존 협업 임베딩과 연결하는 방법이 필요했다.

## 4. 메타데이터 임베딩: BERT로 콘텐츠 정보를 표현하기

### 4.1 텍스트를 고정 크기의 벡터로 변환

영화의 줄거리 텍스트는 그대로 그래프 추천 모델에 사용할 수 없으므로 수치형 벡터로 변환해야 한다.

프로젝트에서는 BERT 기반 임베딩 방식을 구현했다.

공개 저장소의 `embedding.py`에서는 `bert-base-uncased` 모델과 `BertTokenizerFast`를 사용한다.

텍스트를 Tokenization한 뒤 사전학습된 BERT에 입력하고, Pooler Output을 활용하여 문장 표현을 추출하는 구조다.

이후 PCA를 적용하여 임베딩 차원을 축소했다.

\[
z_i = PCA(BERT(text_i))
\]

이때 \(z_i\)는 영화 \(i\)의 줄거리에서 생성된 콘텐츠 임베딩이다.

BERT의 기본 768차원 표현을 그대로 사용하면 기존 LightGCN의 임베딩보다 차원이 커질 수 있다.

따라서 차원을 축소하여 메모리 사용량을 줄이고, 추천 모델의 잠재 차원과 맞추기 쉬운 형태로 만들고자 했다.

### 4.2 ELECTRA-Small 실험

BERT 이외에도 ELECTRA-Small을 활용한 임베딩을 실험 대상으로 검토했다.

ELECTRA는 Replaced Token Detection 방식으로 학습되며, 작은 모델 크기에서도 효율적인 표현 학습을 기대할 수 있다.

프로젝트에서는 상대적으로 가벼운 모델을 통해 임베딩 추출 비용을 줄이면서 추천에 필요한 의미 정보를 충분히 확보할 수 있는지 확인하고자 했다.

다만 언어 모델의 일반적인 성능이 높다고 추천용 임베딩의 성능까지 높아지는 것은 아니다.

궁극적으로는 생성한 임베딩이 사용자-아이템 선호도 예측에 도움이 되는지를 검증해야 했다.

### 4.3 Word2Vec과의 비교 가능성

저장소에는 BERT뿐 아니라 Word2Vec 기반 임베딩 함수도 구현되어 있다.

Word2Vec은 텍스트 내 단어 간 공동 출현 관계를 학습하여 단어 임베딩을 생성한다.

BERT보다 상대적으로 단순한 구조이므로 계산 비용 측면에서 장점이 있을 수 있다.

이처럼 여러 텍스트 표현 방법을 준비한 것은 복잡한 임베딩이 항상 더 유용한지 확인하기 위한 실험 기반이었다.

관련 코드: [src/data/embedding.py](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/blob/main/src/data/embedding.py)

## 5. 메타 임베딩을 LightGCN에 결합하기

### 5.1 Random Initialization의 한계

기존 LightGCN에서는 아이템 임베딩을 랜덤하게 초기화하고 사용자-아이템 상호작용을 통해 업데이트한다.

하지만 Cold Item은 상호작용이 적으므로 학습 과정에서 임베딩이 충분히 개선되지 않을 수 있다.

이 문제를 해결하기 위해 아이템의 초기 임베딩에 콘텐츠 기반 특징을 활용하는 실험을 진행했다.

프로젝트의 LightGCN 구현에는 `use_meta_embedding` 설정이 존재한다.

이 값이 활성화되면 외부에서 생성한 아이템 메타데이터 임베딩을 로드하여 아이템 임베딩 가중치에 적용하도록 구성했다.

이 방식의 목표는 협업 정보가 부족한 아이템도 초기부터 콘텐츠 정보를 가지도록 만드는 것이었다.

### 5.2 임베딩 공간 정렬 문제

하지만 여기에는 또 다른 문제가 있었다.

BERT가 생성한 텍스트 임베딩과 LightGCN이 학습하는 ID 임베딩은 서로 다른 목표로 만들어진다.

BERT 임베딩은 텍스트의 의미적인 관계를 표현하지만, LightGCN의 ID 임베딩은 사용자와 아이템의 상호작용을 설명하도록 학습된다.

따라서 두 표현이 동일한 차원을 가진다고 해서 같은 의미 공간에 있다고 볼 수는 없다.

이를 해결하기 위해 메타데이터 임베딩과 협업 임베딩이 유사한 방향을 가지도록 유도하는 Alignment Loss를 실험했다.

저장소에는 `BPRLoss_with_alignment_similarity`가 구현되어 있다.

이 방식에서는 기존 BPR Loss에 두 임베딩의 유사도를 반영한다.

개념적으로 다음과 같이 표현할 수 있다.

\[
L = L_{BPR} + \lambda L_{reg} - \alpha S(E_{id}, E_{meta})
\]

여기서 \(S\)는 두 임베딩 사이의 유사도 함수다.

목표는 사용자 상호작용으로 학습한 표현과 콘텐츠 기반 표현 사이의 차이를 줄이는 것이었다.

하지만 이러한 정렬이 항상 올바른 방향으로 작동한다고 보장할 수는 없다.

콘텐츠의 유사성과 소비자의 선호 관계가 일치하지 않는다면 오히려 추천 모델이 불필요한 제약을 받을 수 있기 때문이다.

## 6. Graph Regularization: 비슷한 아이템은 비슷한 임베딩을 갖도록

또 다른 접근으로 Graph Regularization을 실험했다.

아이템의 콘텐츠가 유사하다면 임베딩 공간에서도 가까운 위치에 존재하도록 유도하는 방식이다.

기본 아이디어는 다음과 같다.

\[
L_{graph}
=
\sum_{i,j} S_{ij}\|e_i-e_j\|^2
\]

여기서

- \(S_{ij}\): 아이템 간 유사도
- \(e_i,e_j\): 두 아이템의 임베딩

이다.

유사도가 높은 아이템은 두 임베딩 사이의 거리가 작아지도록 Loss를 구성할 수 있다.

프로젝트에서는 `BPRLossWithReg`를 구현하고, Cosine Similarity 기반 유사도 행렬을 활용하는 방식을 적용했다.

일정 Threshold 이상의 유사도를 가진 아이템 관계만 남기고, 임베딩 사이의 거리를 계산하여 정규화 항으로 사용했다.

또한 전체 아이템 간 거리 계산은 연산량이 크기 때문에 배치 단위로 나누어 계산하도록 구현했다.

하지만 이 방법에는 계산 비용 문제와 유사도 자체의 품질 문제가 존재했다.

아이템 수가 증가하면 모든 아이템 간 유사도 계산에는 많은 메모리와 연산이 필요하다.

또한 유사도 행렬이 실제 사용자 취향을 충분히 설명하지 못한다면 정규화가 오히려 성능을 악화시킬 가능성도 있다.

이 실험은 **유사한 콘텐츠를 가진 아이템의 임베딩을 가깝게 만드는 것과 실제 추천 성능을 높이는 것은 다른 문제**라는 점을 생각하게 했다.

관련 코드: [src/lightgcn_utils/loss.py](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/blob/main/src/lightgcn_utils/loss.py)

## 7. BPR Loss와 Negative Sampling을 바꾸면 Cold Item을 더 잘 학습할까?

### 7.1 BPR Loss의 기본 구조

LightGCN은 주로 Bayesian Personalized Ranking(BPR) 기반의 학습 방식을 사용한다.

BPR은 사용자가 실제로 소비한 Positive Item이 소비하지 않은 Negative Item보다 높은 점수를 갖도록 학습한다.

\[
L_{BPR}
=
-\sum_{(u,i,j)}
\log \sigma(\hat{y}_{ui}-\hat{y}_{uj})
\]

여기서

- \(u\): 사용자
- \(i\): Positive Item
- \(j\): Negative Item

이다.

이때 Cold Item은 학습 데이터에서 Positive로 등장하는 횟수 자체가 적을 수 있다.

따라서 Cold Item의 임베딩이 충분히 업데이트되지 않는 문제가 발생할 가능성이 있다.

### 7.2 Cold Positive Item에 가중치 부여

이를 보완하기 위해 Cold Item이 Positive로 등장하면 BPR Loss에 추가 가중치를 부여하는 방식을 구현했다.

프로젝트의 `BPRLoss_with_coldweight`에서는 다음과 같은 가중치 계산을 사용한다.

\[
w_i = 1 + \alpha \cdot \mathbb{1}(i \in ColdItems)
\]

이 가중치를 Positive Item에 대한 BPR Loss에 적용하면 Cold Item이 학습에 등장했을 때 더 큰 영향을 주도록 할 수 있다.

하지만 문제가 없는 방법은 아니다.

가중치가 지나치게 크면 적은 수의 Cold Item 상호작용에 모델이 과도하게 의존할 수 있다.

또한 상호작용 자체가 존재하지 않는 완전한 Cold Item에 대해서는 Loss 가중치만 조정하는 방식으로 충분한 학습 신호를 만들 수 없다.

### 7.3 Cold-aware Negative Sampling

Negative Sampling 전략도 변경했다.

일반적인 Random Negative Sampling에서는 전체 아이템 중에서 Negative Item을 무작위로 선택한다.

그러나 Cold Item은 전체 데이터에서 비중이 낮을 수 있어 충분히 선택되지 않을 가능성이 있다.

따라서 일정 확률로 Cold Item을 우선 선택하는 방식을 실험 대상으로 검토했다.

저장소 이슈에서는 Cold Item을 30% 확률로 우선 선택하고, 나머지 70%는 기존 방식으로 샘플링하는 전략을 제안했다.

이 방식은 Cold Item이 학습 과정에 더 자주 등장하도록 할 수 있다.

하지만 중요한 문제가 있다.

**Cold Item을 Negative로 자주 선택한다고 해서 Cold Item의 추천 가능성이 반드시 높아지는 것은 아니다.**

오히려 모델이 Cold Item에 낮은 선호 점수를 부여하도록 학습될 수 있다.

Negative Sampling은 단순한 학습 데이터 생성 과정이 아니라, 모델이 어떤 아이템을 선호하지 않아야 하는지 결정하는 중요한 요소라는 점을 이해할 수 있었다.

## 8. Contrastive Learning: 다른 관점에서 표현을 학습하기

### 8.1 대조학습을 시도한 이유

메타데이터 임베딩과 Graph Regularization 외에도 Contrastive Learning을 적용했다.

대조학습은 서로 유사한 표현을 가깝게 만들고, 구분해야 할 표현은 멀어지도록 학습하는 방식이다.

추천 시스템에서는 사용자와 아이템의 상호작용 데이터가 제한적일 때 추가적인 학습 신호를 제공하는 데 활용할 수 있다.

이번 프로젝트에서는 SGL(Self-supervised Graph Learning) 방식과 CLCRec을 실험 대상으로 검토했다.

### 8.2 SGL: 그래프를 증강하여 서로 다른 View 생성

SGL은 동일한 그래프에서 서로 다른 증강 View를 생성하고, 같은 노드의 표현이 유사해지도록 학습한다.

프로젝트에서는 Edge Dropout을 활용하는 방식을 구현했다.

원래 그래프에서 일부 Edge를 제거하여 서로 다른 그래프를 만든 뒤, 각 그래프에서 계산된 노드 임베딩을 비교한다.

이 과정에서 같은 노드의 임베딩은 Positive Pair가 된다.

다만 Cold Item은 애초에 연결된 Edge가 거의 없기 때문에, 일반적인 Random Edge Dropout을 사용하면 남아 있는 정보마저 사라질 수 있다.

따라서 Degree-aware Edge Dropout을 적용하여 노드의 연결 정도에 따라 Edge를 제거하는 방식을 검토했다.

구현에서는 특정 Threshold 이하의 Degree를 가진 노드는 Edge를 제거하지 않도록 처리하는 로직을 추가했다.

이는 연결성이 부족한 노드의 정보를 최대한 보존하면서 그래프 증강을 적용하려는 시도였다.

하지만 이러한 방법도 원래 존재하지 않는 Edge를 새롭게 생성하지는 못한다.

따라서 완전한 Cold Item 문제를 해결하기에는 구조적인 한계가 존재한다.

### 8.3 CLCRec: BPR과 Contrastive Loss 결합

프로젝트 후반에는 CLCRec 방법론을 적용하기 위해 별도의 모델 클래스를 추가했다.

공개 구현의 `CLCRec`은 LightGCN을 상속받아 기존 그래프 임베딩 구조를 활용한다.

이후 사용자 임베딩, Positive Item 임베딩, Negative Item 임베딩을 정규화하여 Contrastive Loss를 계산한다.

Positive Pair의 유사도는 다음과 같이 계산한다.

\[
s^+ = \frac{u \cdot i^+}{\tau}
\]

Negative Pair에도 같은 Temperature 파라미터 \(\tau\)를 적용한다.

이후 Positive와 Negative 유사도를 Logits로 구성하고 Cross Entropy Loss를 계산한다.

전체 학습 목표는 다음과 같이 결합한다.

\[
L_{total}
=
L_{BPR}
+
\lambda L_{contrastive}
+
L_{regularization}
\]

이 방식은 기존 BPR 학습을 유지하면서 사용자와 아이템의 표현을 추가적으로 학습하도록 설계한 것이다.

구현 과정에서는 `CLCRec.py`를 추가하는 것뿐 아니라 기존 `main.py`, 모델 등록 코드, Loss 선택 로직, YAML 설정도 수정했다.

기존 LightGCN 파이프라인에서 모델 이름을 변경하여 CLCRec을 실행할 수 있도록 연결한 것이다.

이는 단순히 Loss 함수를 구현하는 작업이 아니라 기존 추천 시스템 안에 새로운 실험 모델을 통합하는 과정이었다.

다만 Contrastive Learning은 추가적인 표현 학습을 제공할 수 있어도, 완전히 연결이 없는 Cold Item에 필요한 콘텐츠 정보를 자동으로 만들어내지는 못한다.

따라서 실제 콜드스타트 개선을 위해서는 대조학습의 Positive Pair와 Negative Pair를 어떤 정보로 구성하는지가 중요하다는 점을 확인했다.

관련 코드: [CLCRec.py](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/blob/main/src/models/CLCRec.py)

## 9. 전체 성능과 Cold-Start 성능을 분리해서 평가하기

### 9.1 전체 추천 성능만 보면 놓치는 문제

추천 시스템을 평가할 때 일반적으로 Recall@K, NDCG@K, MRR@K 등의 지표를 활용한다.

하지만 전체 사용자와 아이템을 대상으로 계산한 지표만으로 Cold-Start 성능을 판단하는 것은 위험할 수 있다.

대부분의 상호작용이 기존 인기 아이템에서 발생한다면, 모델이 인기 아이템을 잘 추천하는 것만으로 전체 지표가 높게 나타날 수 있다.

반면 신규 아이템이 추천되는 비율은 여전히 낮을 수 있다.

따라서 전체 추천 성능과 Cold-Start 성능을 구분하는 평가가 필요했다.

### 9.2 Cold User 평가 기능 추가

프로젝트에서는 Cold Item 문제를 중심으로 연구했지만, 사용자 측 데이터 희소성을 분석하기 위한 Cold User 평가도 구현했다.

기존 Leave-One-Out 방식은 사용자별 상호작용에서 일부를 검증 데이터로 분리한다.

이때 상호작용 수가 적은 사용자는 학습에 활용할 정보가 제한적이다.

처음에는 Cold User를 구분하는 기준에서 평가 지표가 0으로 나타나는 문제를 경험했다.

따라서 검증 대상 사용자의 최소 상호작용 수를 고려하여 Cold User 기준을 조정했다.

프로젝트 코드에서는 상호작용 수가 3개 이상 15개 이하인 사용자를 Cold User로 분류한다.

이후 다음과 같은 흐름으로 평가 구조를 확장했다.

1. Leave-One-Out 분할 과정에서 Cold User를 판별한다.
2. Cold User ID를 별도의 파일에 저장한다.
3. DataLoader에서 Cold User 목록을 읽어 평가 집합을 구성한다.
4. `test_cold()` 함수를 통해 Cold User의 성능을 별도로 계산한다.
5. 전체 사용자 성능과 Cold User 성능을 WandB에 각각 기록한다.

이를 통해 모델 전체의 성능을 확인하는 동시에 상호작용이 부족한 사용자 집단에서의 성능 변화도 관찰할 수 있도록 했다.

중요한 점은 Cold User 평가와 Cold Item 평가가 서로 다른 문제라는 것이다.

Cold User는 사용자의 과거 상호작용이 부족한 문제이고, Cold Item은 아이템의 상호작용이 부족한 문제다.

두 문제를 동일한 지표로 혼동하지 않으면서 별도로 살펴볼 필요가 있었다.

관련 작업: [PR #64 — Cold User 평가 구현](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/pull/64)

## 10. WandB를 활용한 실험 관리

여러 Loss 함수와 Sampling 전략, 메타데이터 임베딩을 조합하다 보니 실험을 기록하고 비교하는 일이 중요해졌다.

모델 구조뿐 아니라 학습률, 임베딩 차원, 그래프 레이어 수, Weight Decay 등도 성능에 영향을 주기 때문이다.

이를 위해 기존 LightGCN 베이스라인에 WandB 로깅 기능을 추가했다.

WandB를 사용하여 학습 Loss와 검증 지표, 모델별 실험 결과를 기록할 수 있도록 구성했다.

이후 프로젝트 설정 파일에서도 다음과 같은 옵션을 관리할 수 있도록 확장했다.

```yaml
model: LightGCN
wandb: true

model_args:
  LightGCN:
    latent_dim_rec: 64
    n_layers: 3
    use_meta_embedding: false
    use_ssl: false

loss: BPRLoss

train:
  neg_sampling: cold
```

각 실험의 목적에 따라 모델과 Loss, Negative Sampling 방법을 변경하는 방식으로 다양한 조합을 비교할 수 있었다.

이 과정에서 중요한 것은 단순히 실험 횟수를 늘리는 것이 아니라, **어떤 설정을 변경했을 때 지표가 어떻게 달라졌는지 추적할 수 있도록 만드는 것**이었다.

관련 작업: [PR #28 — WandB 로깅 추가](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/pull/28)

## 11. 왜 기대한 성능을 얻지 못했을까?

이번 프로젝트는 여러 방법론을 시도했지만 목표로 했던 수준의 Cold-Start 성능 개선을 달성하지 못했다.

그 과정에서 기술적으로 다시 생각해 볼 부분이 많았다.

### 11.1 Graph 기반 학습의 구조적인 한계

LightGCN은 그래프의 Edge를 통해 협업 신호를 전달한다.

하지만 신규 아이템에 Edge가 존재하지 않는다면 주변 사용자나 아이템으로부터 정보를 얻을 수 없다.

대조학습이나 Graph Regularization을 추가하더라도, 어떤 아이템이 다른 아이템과 연결되어야 하는지를 알려주는 정보가 없다면 학습에 한계가 있다.

즉, **기존 그래프의 표현을 개선하는 문제와 연결되지 않은 새로운 아이템을 추천하는 문제는 구분해야 한다.**

완전한 Cold Item을 추천하려면 메타데이터만으로도 임베딩을 생성하고 점수를 계산할 수 있는 별도의 경로가 필요할 수 있다.

### 11.2 임베딩 정렬이 곧 선호도 정렬은 아니다

메타데이터 임베딩과 ID 임베딩의 공간을 정렬하면 추천 성능이 좋아질 것이라고 기대했다.

하지만 텍스트의 의미적인 유사성이 실제 사용자 선호도와 일치하는 것은 아니다.

예를 들어 두 영화가 유사한 줄거리를 가지고 있어도 어떤 사용자는 하나의 영화만 선호할 수 있다.

따라서 메타데이터 임베딩을 추천 모델에 결합할 때는 단순한 유사도보다 사용자 선호와의 관계를 직접 학습할 필요가 있다.

### 11.3 학습 신호의 부족은 가중치만으로 해결되지 않는다

Cold Item의 BPR Loss 가중치를 높이거나 Negative Sampling 빈도를 변경하면 해당 아이템의 학습 빈도에 영향을 줄 수 있다.

하지만 이런 방법은 존재하는 상호작용 정보를 더 강하게 사용하는 방식에 가깝다.

아예 존재하지 않는 Positive Interaction을 새롭게 만들어 주지는 못한다.

특히 Negative Sampling 과정에서 Cold Item을 과도하게 Negative로 선택한다면 오히려 해당 아이템의 선호 점수를 낮추는 방향으로 학습될 수도 있다.

### 11.4 복잡한 방법을 추가할수록 검증도 복잡해진다

Graph Regularization, Contrastive Learning, Meta Embedding Alignment 등은 각각 서로 다른 목적을 가진다.

이를 한 번에 적용하면 성능 변화의 원인을 파악하기 어려워진다.

또한 기존 LightGCN의 함수 인터페이스와 새로운 모델의 Loss 반환 형식이 일치하는지, 메타데이터 임베딩의 차원이 올바르게 연결되어 있는지, 평가 데이터에 누수가 없는지 등을 함께 확인해야 한다.

실제로 다양한 모델과 Loss를 통합하는 작업에서는 학습 성능 이전에 코드의 실행 안정성과 실험의 재현성을 확보하는 과정도 중요했다.

이 경험을 통해 복잡한 아키텍처를 적용하기 전에 각 구성 요소가 독립적으로 올바르게 동작하는지 검증하는 것이 필요하다고 느꼈다.

## 12. 다시 프로젝트를 진행한다면?

이번 프로젝트를 다시 진행한다면 처음부터 여러 방법론을 결합하기보다 단계적으로 검증할 것이다.

### 12.1 Cold-Start를 먼저 명확하게 정의하기

첫 번째로 할 일은 Cold Item의 기준을 구분하는 것이다.

- 상호작용이 전혀 없는 Zero-shot Item
- 상호작용이 소수 존재하는 Few-shot Item
- 충분한 상호작용이 존재하는 Warm Item

이 세 집단을 동일한 방법으로 평가하면 모델의 실제 성능을 해석하기 어려울 수 있다.

따라서 집단별 성능을 별도로 측정할 것이다.

특히 Zero-shot Item에 대해서는 학습 그래프에 해당 아이템의 Edge가 없는 상태에서도 추천이 가능한 구조인지 먼저 검증할 필요가 있다.

### 12.2 콘텐츠 기반 추천 베이스라인 추가하기

LightGCN을 중심으로 성능을 개선하기 전에 콘텐츠 메타데이터만 사용하는 추천 모델을 별도로 구성할 것이다.

이를 통해 메타데이터 자체가 어느 정도의 추천 성능을 제공하는지 확인할 수 있다.

이후 콘텐츠 기반 모델과 LightGCN을 결합하여 협업 정보가 부족한 상황에서도 예측이 가능한 하이브리드 구조를 검토할 것이다.

### 12.3 단순한 구조부터 점진적으로 복잡하게 만들기

모델 개선 순서도 명확하게 설정할 것이다.

1. LightGCN 기본 성능 측정
2. 콘텐츠 기반 임베딩 단독 성능 측정
3. 콘텐츠 임베딩 초기화 또는 결합
4. 임베딩 정렬 적용
5. Graph Regularization 적용
6. Contrastive Learning 적용
7. Cold-Start 집단별 성능 비교

한 번에 하나의 주요 변수를 변경하는 방식으로 실험하면 성능이 개선되거나 악화된 원인을 더 정확하게 분석할 수 있다.

또한 실험 과정에서 실제 임베딩이 학습되는지, Gradient가 올바르게 전달되는지, Cold Item이 추천 결과에 포함되는지 등의 검증도 함께 수행할 것이다.

## 13. 프로젝트를 통해 배운 점

### 13.1 실패한 실험도 원인을 분석해야 의미가 있다

처음에는 메타데이터 임베딩과 대조학습을 결합하면 Cold-Start 문제를 해결할 수 있을 것이라고 기대했다.

하지만 여러 시도가 기대한 성능으로 이어지지는 않았다.

그 과정에서 단순히 유명한 논문의 방법론을 적용하는 것만으로는 문제를 해결할 수 없다는 점을 배웠다.

특히 모델이 사용하는 학습 신호가 실제 해결하려는 문제에 적합한지 먼저 검토해야 한다는 사실을 알게 되었다.

### 13.2 추천 성능은 전체 평균만으로 판단할 수 없다

이번 프로젝트에서 중요하게 생각한 것은 전체 추천 성능과 Cold-Start 성능을 분리하여 확인하는 것이었다.

전체 지표가 개선되더라도 실제로 해결하려던 사용자나 아이템 집단에서는 성능이 달라지지 않을 수 있다.

따라서 문제를 정의할 때 어떤 집단을 대상으로 개선할 것인지 명확하게 설정하고, 해당 집단에 대한 별도 평가 체계를 마련해야 한다.

### 13.3 실험 관리 역시 모델 개발의 일부다

여러 모델과 Loss, Sampling 전략을 실험하는 과정에서 WandB를 이용한 실험 추적과 설정 관리가 필요했다.

실험 결과를 기록하지 않으면 동일한 설정을 반복하거나 성능이 달라진 원인을 추적하기 어려울 수 있다.

모델의 성능을 개선하는 작업뿐 아니라, 실험을 비교하고 재현할 수 있는 환경을 만드는 것도 ML 엔지니어링에서 중요한 역량이라는 점을 배웠다.

### 13.4 구현 가능성과 문제 해결 가능성은 다르다

프로젝트에서는 여러 논문 기반 방법론을 코드로 구현하고 LightGCN 파이프라인에 연결했다.

하지만 새로운 모델이 실행된다는 사실만으로 문제를 해결했다고 볼 수는 없다.

알고리즘의 목적과 실제 데이터의 특성이 일치해야 하고, 학습 과정과 검증 결과가 이를 뒷받침해야 한다.

이번 프로젝트는 **모델 구현의 완성도와 실제 문제 해결 성능을 별도로 평가해야 한다**는 사실을 이해하게 된 경험이었다.

## 14. 마무리

이번 프로젝트는 결과만 놓고 보면 성공적인 프로젝트라고 말하기 어렵다.

Cold-Start 문제를 해결하기 위해 다양한 방법론을 시도했지만, 최종적으로 기대했던 수준의 추천 성능 개선을 달성하지 못했기 때문이다.

하지만 그 과정에서 LightGCN의 구조적인 한계를 분석하고, 메타데이터 임베딩과 Graph Regularization, Contrastive Learning, Negative Sampling 등 서로 다른 접근법을 실험할 수 있었다.

또한 Cold User 평가 기능을 추가하고 WandB를 활용하여 실험 결과를 추적하면서, 모델 성능을 측정하는 기준과 실험 관리의 중요성도 이해할 수 있었다.

이전 프로젝트에서는 여러 추천 모델을 앙상블하여 성능을 개선하는 경험을 했다면, 이번 프로젝트에서는 **기존 알고리즘이 해결하기 어려운 문제에 대해 새로운 방법을 적용하고 그 한계를 분석하는 경험**을 할 수 있었다.

다시 진행한다면 가장 먼저 Cold-Start의 정의와 평가 방식을 명확하게 설정하고, 콘텐츠만으로도 신규 아이템을 표현할 수 있는 구조부터 검증할 것이다.

이번 프로젝트를 통해 가장 크게 배운 것은 다음과 같다.

**복잡한 모델을 구현하는 것보다 중요한 것은 해결하려는 문제를 정확하게 정의하고, 필요한 학습 신호가 무엇인지 이해하며, 실험 결과를 통해 가설을 검증하는 과정이라는 점이다.**

목표했던 성능에는 도달하지 못했지만, 이후 추천 시스템을 설계할 때 무엇을 먼저 확인해야 하는지 배울 수 있었던 프로젝트였다.

---

### 관련 코드 및 작업 기록

- [프로젝트 GitHub 저장소](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3)
- [WandB 실험 로깅 추가 — PR #28](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/pull/28)
- [Cold User 평가 체계 확장 — PR #64](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/pull/64)
- [CLCRec 대조학습 모델 추가 — PR #75](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/pull/75)
- [BERT 기반 텍스트 임베딩 코드](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/blob/main/src/data/embedding.py)
- [LightGCN 및 그래프 증강 구현](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/blob/main/src/models/lightgcn.py)
- [Loss 함수 및 정규화 실험 코드](https://github.com/boostcampaitech7/level4-recsys-finalproject-hackathon-recsys-05-lv3/blob/main/src/lightgcn_utils/loss.py)
- [프로젝트 Wrap Up Report](https://github.com/user-attachments/files/18938745/TVING2_RecSys_.05.pdf)

**Tags:** `Recommendation System` `Cold-Start` `LightGCN` `Contrastive Learning` `CLCRec` `Graph Regularization` `BPR Loss` `Negative Sampling` `WandB` `PyTorch`