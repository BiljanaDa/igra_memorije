const clickTimes = 0;

class Card {
  element = undefined;
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.#init();
  }

  #init() {
    this.element = document.createElement("div");
    this.element.style.background = this.color;
    this.element.style.width = "150px";
    this.element.style.height = "200px";
    document.body.appendChild(this.element);
    const number = this.number;
    const element = this.element;
    this.element.addEventListener("click", function () {
      element.innerHTML = number;
    });
  }
}
const cardsAmount = 12;
const UniqueNumbers = cardsAmount / 2;

const numbers = [];
for (let i = 0; i < UniqueNumbers; i++) {
  let randomNumber = Math.floor(Math.random() * 100);
  while (numbers.includes(randomNumber)) {
    randomNumber = Math.floor(Math.random() * 100);
  }
  numbers.push(randomNumber);
}
const cards = [];
let z = 0;
for (let i = 0; i < cardsAmount; i++) {
  let number = numbers[0];
  z++;
  if (z === 2) {
    z = 0;
    numbers.splice(0, 1);
  }
  const card = new Card("green", number);
  cards.push(card);
}
