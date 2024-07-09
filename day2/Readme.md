# HashMap 구현하기

### 1. HashMap(해시맵)이란?

- HashMap은 Map 인터페이스를 구현한 대표적인 Map 컬렉션이다. 맵(Map) 인터페이스를 상속하고 있기 때문에 Map의 성질을 그대로 가지고 있다.
- Map은 키와 값으로 구성된 Entry 객체를 저장하는 구조를 가지고 있는 자료구조이다. 여기서 키와 값은 모두 객체이다. 값은 중복 저장될 수 있지만 키는 중복 저장될 수 없다.
- 만약 기존에 저장된 키와 동일한 키로 값을 저장하면 기존의 값은 없어지고 새로운 값으로 대치된다. HashMap은 이름 그대로 해싱을 사용하기 때문에 많은 양의 데이터를 검색하는 데 있어서 뛰어난 성능을 보인다.

### 2. HashMap의 특징

- { key: value } 한 쌍으로 데이터를 저장한다.
- HashMap은 순서를 보장하지 않는다. 즉, 저장된 순서와 꺼내온 순서가 동일하지 않을 수 있다.
- 다수의 스레드에서 접근할 경우 동기화 처리가 필요하다.
- key, value로 null 값을 사용할 수 있다.
- 검색, 추가, 삭제 시 시간 복잡도 : O(1)
- 해시맵 내부 구조는 연결 리스트에 대한 포인터를 유지하기 떄문에, 메모리 사용량이 크게 증가할 수 있다.
- 해시 함수 충돌이 발생할 경우 성능 저하로 인해 "체이닝(Chaining)"이나 "오픈 어드레싱(Open Addressing)" 등의 기법을 사용합니다.
- 해시 충돌 => 해시 함수를 사용하여 입력값을 해시값으로 변환할 떄, 서로 다른 입력값이 같은 해시값을 반환하는 상황

### 3. HashMap의 주요 메서드

- put(K extends Object key, V extens Object value) : Key-Value 쌍을 HashMap에 추가한다. 만약 해당 Key가 이미 존재할 경우 해당 Key의 Value를 새로운 값으로 덮어쓴다.
- get(Object key) : Key에 해당하는 Value를 반환한다. 만약 Key 값이 존재하지 않을 경우 null을 반환한다.
- remove(Object key) : Key에 해당하는 Key-Value 쌍을 HashMap에서 삭제한다. 삭제된 Value를 반환한다.
- size() => number : HashMap에 저장된 Key-Value 쌍의 개수를 반환한다.
- containsKey(Object key) => boolean : HashMap에 Key 값이 존재하는지 확인한다.
- keySet() : HashMap에 저장된 Key 값을 Set으로 반환한다.
- values() : HashMap에 저장된 value 값을 Collection으로 반환한다.
- entrySet() : HashMap에 저장된 Key-Value 쌍을 Entry 객체로 묶어서 Set으로 반환한다.

### 4. Hash Function (해시 함수)

- 임의 길이의 입력 값을 고정 길이의 암호화된 출력으로 변환해주는 함수
- key를 해시 함수에 넣어서 나오는 결과가 hash이며, 해시 함수란 key > hash로 만들어내는 함수

- 해시 함수의 특징
  1.  어떤 입력 값에도 항상 고정된 길이의 해시값을 출력한다. (MD/SHA256 알고리즘)
  2.  입력 값의 아주 일부만 변경되어도 전혀 다른 결과값을 출력한다. (눈사태 효과)
  3.  출력된 결과값을 통해 입력값을 유추할 수 없다.

### 5. Hash Collision (해시 충돌)

- 적재율 (load factor) : 적재율이란 데이터 크기에 대한 키의 개수의 비율
  => 키의 개수를 K, 해시 테이블의 크기를 N이라고 했을 때 적재율은 K/N이 된다.

- 해시 충돌을 완화하는 방법에는 크게 Open Addressing과 Separate Chaining이 있다.

  1. Open Addressing : 해시 테이블의 크기는 고정하면서 저장할 위치를 찾는다.
  2. Separate Chaining : 해시 테이블의 크기를 유연하게 만든다.

  #### 5-1. Open Addressing (개방 주소법)

  - 한 버킷 당 들어갈 수 있는 엔트리는 하나이지만, 해시 함수로 얻은 주소가 아난, 다른 주소에 데이터를 저장할 수 있또록 허용하는 방법

  - open addressing의 주요 목적은 저장할 엔트리를 위한 다음 slot을 찾는 것
    => 해시 함수로 얻은 주소에 이미 데이터가 적재 되어 있으면 덮어 쓰지 않고 다음 빈 저장 공간을 찾는 방법

  - Linear Probing (선형 탐사법)

    - 간단하게 선형으로 순차적 검색을 하는 방법
    - 해시 함수로 나온 해시 값(index)에 이미 다른 값이 저장되어 있다면, 해당 해시 값에서 고정된 폭만큼 옮겨 다음 빈칸을 찾아가는 방법

    - <단점> 특정 해시 값 주변이 모두 채워져 있는 일차 군집화(primary clustering) 문제가 발생할 수 있다. 예를 들어 모든 키가 2라는 해시 값을 반환할 경우 군집화 된 값들을 순차적으로 방문할 것이므로 성능이 크게 저하될 수 있음.

      > 따라서 Linear Probing은 해시 충돌이 해시 값 전체에 균등하게 발생할 때 유용한 방법.

  - Quadratic Probing (제곱 탐사법)

    - 제곱 탐사법은 선형 탐사법과 동일한데, 탐사 폭이 고정된 값이 아니라 제곱으로 늘어나는 점에 있어 차이가 있음.
    - 즉, 빈 버킷의 slot을 찾기 위해 고정된 값이 아닌, 2^1, 2^2, 2^3 ... 의 방식으로 이동해서 빈 칸을 찾는다.
    - 제곱 탐사법을 이용한 경우 데이터의 밀집도가 낮아져 다른 해시값에 영향을 미칠 가능성은 낮아짐.

    - <단점> 캐시의 성능이 떨어져 속도의 문제가 발생한다. 배열의 크기가 커지게 되면서 L1, L2 캐시 적중률(hit ratio)이 낮아지기 때문.

  - Double Hashing (이중 해싱)

    - 이중 해싱은 항목을 저장할 다음 위치를 결정할 떄, 원래 해시 함수와 다른 별개의 해시 함수를 이용하는 방법.
    - 이 방법은 다른 방법들보다 해시 테이블에 보다 균일하게 분포시킬 수 있으므로 효과적인 방법.
    - 하나는 처음 key를 저장할 index를 찾기 위한 것이고, 나머지 하나는 충돌 발생 시 저장할 index를 찾기 위한 것이며, 충돌 발생 시 저장할 index를 찾기 위한 해시 함수는 첫 번째 해시 함수와 달라야 한다.

    - <단점> 이중 해싱은 충돌의 발생 가능성은 가장 적으나, 캐시의 성능은 Linear Probing, Quadratic Probing과 비교했을 때 가장 좋지 않으며, 추가적인 해시 연산이 들어가기 때문에 가장 많은 연산량을 요구.

      > 탐사 방식에 따라 Open Addressing 해시의 성능이 달라지지만, 가장 치명적인 영향을 미치는 요소는 바로 해시 테이블의 적재율인 load factor.

      > load factor가 100%에 가까워질수록 데이터를 찾거나 삽입하기 위해 필요한 탐사 회수는 비약적으로 증가. (load factor 80% 이내에서 좋은 성능을 보임)

      > 따라서 load factor가 임계점을 넘어 큰 경우 성능은 double hashing > quadratic > linear의 순서로 볼 수 있음.

  #### 5-2. Separate Chaining (분리 연결법)

  - 분리 연결법은 개방 주소법과 달리, 한 버킷(slot) 당 들어갈 수 있는 엔트리의 수에 제한을 두지 않는다. 이 때 버킷에는 Linked List or Tree를 사용

  - 해시 값이 동일한 값들은 리스트로 연결되어 저장, 따라서 해시 충돌이 일어나더라도 리스트로 노드가 연결되기 때문에 index가 변하지 않고 데이터 개수의 제약이 없다는 장점이 있다. 하지만 Open Addressing과 비교했을 때 추가적인 메모리 공간이 필요하며 테이블의 적재율에 따라 선형적으로 성능이 저하

    > 따라서 데이터가 적은 경우에는 Open Addressing이 평균적으로 더 빠름.

---

🙏 참고 자료

> [[자료구조] 해시맵(HashMap)](https://velog.io/@kms403/%ED%95%B4%EC%8B%9C%EB%A7%B5HashMap)

> [해시 자료구조와, 해시 충돌 그리고 Java의 HashMap 동작 방법](https://dkswnkk.tistory.com/679)

---

✅ 더 공부해야 할 것들

- 캐시 메모리, 캐시 적중률, 참조 지역성의 원리