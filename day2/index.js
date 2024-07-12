class HashMap {
  constructor(size) {
    this.map = Array.from({ length: size }, null);
    this.size = size;
  }

  #addCharCodeAt(value) {
    return value.split("").reduce((acc, cur) => (acc += cur.charCodeAt()), 0);
  }

  #hashCode(key) {
    if (typeof key === "function") {
      return key.name
        ? this.#addCharCodeAt(key.name)
        : Math.floor(Math.random() * 10000); // 익명 함수인 경우
    }

    if (typeof key === "undefined") {
      return this.#addCharCodeAt(`${key}`);
    }

    if (typeof key === "boolean") {
      return key ? 1 : 0;
    }

    if (typeof key === "number") return key;

    if (typeof key === "string") {
      return this.#addCharCodeAt(key);
    }

    if (typeof key === "symbol") {
      return this.#addCharCodeAt(key.toString());
    }

    if (typeof key === "object") {
      return this.#addCharCodeAt(JSON.stringify(key));
    }
  }

  #getHash(key) {
    // 제 1 규칙 : 같은 key를 넣으면 같은 hash 값이 나와야 한다.
    return this.#hashCode(key) % this.size;
  }

  #checkDuplicateKey(hash) {
    return this.map[hash].key === key;
  }

  #findSlot(hash, fn) {
    if (!fn) throw Error("slot을 찾는 함수가 필요합니다.");
    let newHash = hash + 1;

    while (newHash < this.size) {
      if (hash === newHash) return null;

      if (fn(newHash)) return newHash;

      newHash = newHash === this.size - 1 ? 0 : newHash + 1;
    }
  }

  put(key, value) {
    const hash = this.#getHash(key);

    if (this.#checkDuplicateKey(hash) || !this.map[hash]) {
      this.map[hash] = { key, value };
      return;
    }

    const slot = this.#findSlot(key, (h) => !this.map[h]);
    if (!slot) throw Error("메모리 할당 공간을 넘어갔습니다.");
    this.map[slot] = { key, value };
  }

  get(key) {
    const hash = this.#getHash(key);

    if (!this.map[hash]) return undefined;
    if (this.map[hash].key === key) return this.map[hash].value;

    const slot = this.#findSlot(hash, (h) => this.map[h].key === key);
    if (!slot) return undefined;
    return this.map[slot].value;
  }

  remove(key) {
    // return type : void;
    const hash = this.#getHash(key);

    if (!this.map[hash]) return;

    if (this.map[hash].key === key) {
      this.map[hash] = null;
      return;
    }

    const slot = this.#findSlot(hash, (h) => this.map[h].key === key);
    if (!slot) return;
    this.map[slot] = null;
  }

  size() {
    return this.size;
  }

  containsKey(key) {
    // return type : Boolean;
    const hash = this.#getHash(key);
    if (!this.map[hash]) return false;
    if (this.map[hash].key === key) return true;
    const slot = this.#findSlot(hash, (h) => this.map[h].key === key);
    return !!slot;
  }
}

const map = new HashMap(1024);
console.log(map);
