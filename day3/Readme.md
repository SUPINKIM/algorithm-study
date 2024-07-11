# 자바스크립트의 Class

- 클래스는 객체 지향 프로그래밍에서 특정 객체를 생성하기 위해 변수와 메소드를 정의하는 일종의 틀로, 객체를 정의하기 위한 상태(멤버 변수)와 메서드(함수)로 구성된다.

new 연산자와 생성자 함수에서 배운 `new function`을 사용할 수 있습니다.
여기에 더하여 모던 자바스크립트에 도입된 클래스(class)라는 문법을 사용하면 객체 지향 프로그래밍에서 사용되는 다양한 기능을 자바스크립트에서도 사용할 수 있습니다.

- 기본 문법

* 클래스는 다음과 같은 기본 문법을 사용해 만들 수 있습니다.

```js
class MyClass {
  constructor() {}
  method1() {}
  method2() {}
  method3() {}
  ...
}
```

이렇게 클래스를 만들고, `new MyClass()` 를 호출하면 내부에서 정의한 메서드가 들어있는 객체가 생성됩니다.

객체의 기본 상태를 설정해주는 생성자 메서드 constructor()는 new에 의해 자동으로 호출되므로, 특별한 절차 없이 객체를 초기화 할 수 있습니다.

### 클래스란

클래스는 자바스크립트에서 새롭게 창안한 개체(entity)가 아닙니다.
자바스크립트에서 클래스는 함수의 한 종류입니다.

```js
class User {
  contructor(name) {
    this.name = name;
  }
  sayHi() {
    alert(this.name);
  }
}

console.log(typeof User); // function
```

class User { ... } 문법 구조가 진짜 하는 일은 다음과 같습니다.

1. User 라는 이름을 가진 함수를 만듭니다. `함수 본문`은 생성자 메서드 constructor에서 가져옵니다. 생성자 메서드가 없으면 본문이 비워진 채로 함수가 만들어집니다.
2. sayHi와 같은 클래스 내에서 정의한 메서드를 `User.prototype`에 저장합니다.

new User를 호출해 객체를 만들고 객체의 메서드를 호출하면 함수의 prototype 프로퍼티에서 설명한 것처럼 `메서드를 prototype 프로퍼티를 통해 가져옵니다.` 이 과정이 있기 때문에 객체에서 클래스 메서드에 접근할 수 있습니다.

> ex) User => `constructor(name) { this.name = name; }` -> (prototype) -> User.prototype => `sayHi: function, constructor : User`

** 정리 **

```js
class User {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    alert(this.name);
  }
}

// 클래스는 함수입니다.
alert(typeof User); // function

// 정확히는 생성자 메소드와 동일합니다.
alert(User === User.prototype.contructor); // true

// 클래스 내부에서 정의한 메서드는 User.prototype에 저장됩니다.
alert(User.prototype.sayHi); // alert(this.name);

// 현재 프로토타입에는 메서드가 두 개입니다.
alert(Object.getOwnPropertyNames(User.prototype)); // constructor, sayHi
```

### 클래스는 단순한 편의 문법이 아닙니다.

어떤 사람들은 class 키워드 없이도 클래스 역할을 하는 함수를 선언할 수 있기 때문에 클래스는 '편의 문법'에 불과하다고 말합니다.

```js
// class User와 동일한 기능을 하는 순수 함수를 만들어 봅시다.

// 1. 생성자 함수를 만듭니다.
function User(name) {
  this.name = name; // 모든 함수의 프로토타입은 'constructor' 프로퍼티를 기본으로 갖고 있기 때문에 constructor 프로퍼티를 명시적으로 만들 필요가 없습니다.
}

// 2. prototype에 메서드를 추가합니다.
User.prototype.sayHi = function () {
  alert(this.name);
};

let user = new User("Supin");
user.sayHi();
```

위 예시처럼 순수 함수로 클래스 역할을 하는 함수를 선언하는 방법과 class 키워드를 사용하는 방법의 결과는 거의 같습니다. `class`가 단순 편의 문법이라고 생각하는 이유가 여기에 있습니다.

그런데 두 방법에는 중요한 차이가 몇 가지 있습니다.

1. `class`로 만든 함수엔 특수 내부 프로퍼티인 `[[IsClassConstructor]]: true` 가 이름표처럼 붙습니다. 이것만으로도 두 방법엔 분명한 차이가 있음을 알 수 있습니다.

자바스크립트는 다양한 경우에 `[[IsClassConstructor]]: true` 를 활용합니다. 클래스 생성자를 `new`와 함께 호출하지 않으면 에러가 발생하는데 이 때 `[[IsClassConstructor]]: true` 가 사용됩니다.

```js
User3 // 생성자 함수

ƒ User3(name) {
    this.name = name;

    const sayHi = () => {
        alert(this.name)
    }
}

User // 클래스

class User {
  contructor(name) {
    this.name = name;
  }
  sayHi() {
    alert(this.name);
  }
}

User3() // undefined
User() // Error 발생! VM10017:1 Uncaught TypeError: Class constructor User cannot be invoked without 'new'
```

클래스 생성자를 문자열로 형변환하면 'class...'로 시작하는 문자열이 되는데 이 때도 `[[IsClassConstructor]]: true` 가 사용됩니다.

2. 클래스에서 정의된 메서드는 열거할 수 없습니다.(non-enumerable). 클래스의 prototype 프로퍼티에 추가된 메서드의 enumerable 플래그는 false입니다.

`for .. in` 으로 객체를 순회할 때, 메서드는 순회 대상에서 제외하고자 하는 경우가 많으므로 이 특징은 꽤 유용합니다.

3. 클래스는 항상 엄격 모드로 실행됩니다(use strict). 클래스 생성자 안 코드 전체엔 자동으로 엄격 모드가 적용됩니다.

### 클래스 표현식

함수처럼 클래스도 다른 표현식 내부에서 정의, 전달, 반환, 할당할 수 있습니다.

먼저 클래스 표현식을 만들어보겠습니다.

```js
let User = class {
  sayHi() {
    alert("안녕하세요");
  }
};
```

기명 함수 표현식(Named Function Expression)과 유사하게 클래스 표현식에도 이름을 붙일 수 있습니다. 클래스 표현식에 이름을 붙이면, 이 이름은 오직 클래스 내부에서만 사용할 수 있습니다.

```js
let User = class MyClass {
  sayHi() {
    alert(MyClass); // MyClass라는 이름은 오직 클래스 안에서만 사용할 수 있습니다.
  }
};

new User().sayHi(); // MyClass의 정의를 보여줍니다.
/**
 * 
 * class MyClass {
  sayHi() {
    console.log(MyClass); // MyClass라는 이름은 오직 클래스 안에서만 사용할 수 있습니다.
  }
}
 */
```

### 클래스 필드

> 구형 브라우저에선 폴리필이 필요할 수 있습니다.

'클래스 필드(class field)' 라는 문법을 사용하면 어떤 종류의 프로퍼티도 클래스에 추가할 수 있습니다.

```js
class User {
  name = "보라";

  sayHi() {
    alert(`${this.name}님 안녕하세요!`);
  }
}

new User().sayHi(); // 보라님 안녕하세요!
```

클래스를 정의할 때 `<프로퍼티 이름> = <값>` 을 써주면 간단히 클래스 필드를 만들 수 있습니다.

클래스 필드의 중요한 특징 중 하나는 User.prototype 이 아닌 개별 객체에만 클래스 필드가 설정된다는 점입니다.

#### 클래스 필드로 바인딩 된 메서드 만들기

자바스크립트에서 `this`는 동적으로 결정됩니다.
따라서 객체 메서드를 여기저기 전달해 전혀 다른 컨텍스트에서 호출하게 되면 this는 메서드가 정의된 객체를 참조하지 않습니다.

```js
class Button {
  constructor(value) {
    this.value = value;
  }

  click() {
    alert(this.value);
  }
}

let button = new Button("안녕하세요.");

setTimeout(button.click, 1000); // undefined
```

이렇게 this의 컨텍스트를 알 수 없게 되는 문제를 `잃어버린 this(losing this)` 라고 합니다.
문제는 두 방법을 사용해 해결할 수 있는데

1. `setTimeout(() => button.click(), 1000)` 와 같이 래퍼 함수를 전달하기
2. 생성자 안 등에서 메서드를 객체에 바인딩하기

이 두 방법 말고 클래스 필드를 사용해도 우아하게 이 문제를 해결할 수 있습니다.

```js
class Button {
  constructor(value) {
    this.value = value;
  }
  click = () => {
    alert(this.value);
  };
}

let button = new Button("안녕하세요.");

setTimeout(button.click, 1000); // 안녕하세요.
```

클래스 필드 `click = () => {...}` 는 각 객체마다 독립적인 함수를 만들어주고 이 함수의 this를 해당 객체에 바인딩 시켜줍니다. `button.click`을 아무 곳에나 전달할 수 있고, this엔 항상 의도한 값이 들어가게 됩니다.

클래스 필드의 이런 기능은 브라우저 환경에서 메서드를 이벤트 리스너로 설정할 때 특히 유용합니다.

---

🙏 참고 자료

> [JAVASCRIPT.INFO 클래스와 기본 문법](https://ko.javascript.info/class)

---

✅ 더 공부해야 할 것들

- new 연산자와 생성자 함수
- 함수의 prototype property
- 엄격 모드 in JS
- 계산된 프로퍼티(computed property)
- 함수 바인딩
