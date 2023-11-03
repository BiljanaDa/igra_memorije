class MemoryGame {
  constructor() {
    this.gameBoard = document.querySelector(".game-board");
    this.message = document.querySelector(".message");
    this.startButton = document.querySelector(".start-button");
    this.restartButton = document.getElementById("restart-button");
    this.restartButton.style.display = "none";
    this.timerElement = document.querySelector(".timer");

    this.flippedCards = [];
    this.canFlip = false;
    this.matchedCardsCount = 0;
    this.timer = null;
    this.timeLeft = 60;
    this.cardsAmount = 12;
    this.cards = [];

    this.startButton.addEventListener("click", () => this.startGame());
    this.restartButton.addEventListener("click", () => this.restartGame());
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  removeCards() {
    for (let card of this.flippedCards) {
      card.element.style.opacity = 0;
    }
    this.flippedCards = [];
  }

  startGame() {
    this.message.style.display = "none";
    this.startButton.style.display = "none";
    this.restartButton.style.display = "none";

    this.canFlip = true;
    clearInterval(this.timer);

    this.resetBoard();
    this.timeLeft = 60;
    this.timerElement.style.display = "block";

    this.updateTimer();
  }

  restartGame() {
    this.message.style.display = "none";
    this.startButton.style.display = "none";
    this.restartButton.style.display = "none";
    clearInterval(this.timer);
    this.canFlip = true;
    this.timeLeft = 60;
    this.timerElement.style.display = "block";
    this.resetBoard();
    this.updateTimer();
  }

  resetBoard() {
    for (let card of this.cards) {
      card.reset();
    }

    this.matchedCardsCount = 0;
    clearTimeout(this.timer);

    const shuffledNumbers = this.generateShuffledNumbers();
    for (let i = 0; i < this.cardsAmount; i++) {
      this.cards[i].setNumber(shuffledNumbers[i]);
    }
  }

  generateShuffledNumbers() {
    const allNumbers = [];

    while (allNumbers.length < this.cardsAmount / 2) {
      let randomNumber = Math.floor(Math.random() * 100) + 1;
      if (!allNumbers.includes(randomNumber)) {
        allNumbers.push(randomNumber);
      }
    }

    const shuffledNumbers = allNumbers.concat(allNumbers);
    this.shuffleArray(shuffledNumbers);
    return shuffledNumbers;
  }

  endGame(win) {
    clearTimeout(this.timer);
    this.canFlip = false;
    if (win) {
      this.message.textContent = "Congratulations, you won!";
      this.restartButton.style.display = "block";
    } else {
      this.message.textContent = "You lost. Try again.";
      this.restartButton.style.display = "block";
    }
    this.message.style.display = "block";
  }

  updateTimer() {
    this.timer = setInterval(() => {
      if (this.timeLeft === 0) {
        clearInterval(this.timer);
        this.endGame(false);
      } else {
        this.timerElement.textContent = this.timeLeft + " seconds";
        this.timeLeft--;
      }
    }, 1000);
  }

  initialize() {
    const shuffledNumbers = this.generateShuffledNumbers();
    for (let i = 0; i < this.cardsAmount; i++) {
      const card = new Card(0, this);
      this.cards.push(card);
      this.gameBoard.appendChild(card.element);
    }
  }
}

class Card {
  constructor(number, game) {
    this.number = number;
    this.game = game;
    this.element = document.createElement("div");
    this.element.className = "card";
    this.isFlipped = false;

    this.numberElement = document.createElement("div");
    this.numberElement.className = "number";
    this.numberElement.innerHTML = this.number.toString();

    this.element.appendChild(this.numberElement);

    this.element.addEventListener("click", () => this.handleCardClick());
  }

  handleCardClick() {
    if (!this.isFlipped && this.game.canFlip) {
      this.flip();
      this.game.flippedCards.push(this);

      if (this.game.flippedCards.length === 2) {
        this.game.canFlip = false;
        if (
          this.game.flippedCards[0].number === this.game.flippedCards[1].number
        ) {
          setTimeout(() => {
            this.game.removeCards();
            this.game.matchedCardsCount += 2;
            if (this.game.matchedCardsCount === this.game.cardsAmount) {
              this.game.endGame(true);
            } else {
              this.game.canFlip = true;
            }
          }, 1000);
        } else {
          setTimeout(() => {
            for (let card of this.game.flippedCards) {
              card.flip();
            }
            this.game.flippedCards = [];
            this.game.canFlip = true;
          }, 1000);
        }
      }
    }
  }

  flip() {
    if (!this.isFlipped) {
      this.element.classList.add("flipped");
    } else {
      this.element.classList.remove("flipped");
    }
    this.isFlipped = !this.isFlipped;
  }

  reset() {
    this.element.style.opacity = 1;
    this.element.classList.remove("flipped");
    this.isFlipped = false;
  }

  setNumber(number) {
    this.number = number;
    this.numberElement.innerHTML = this.number.toString();
  }
}

const game = new MemoryGame();
game.initialize();
