// Criar um jogo da forca usando OO;
// Pelo menos três classes para três entidades presentes no sistema do jogo (GameController, Player e Match);
// O usuário deve poder chutar a palavra de uma vez;
// O usuário deve poder jogar/tentar novamente (reiniciar);
// Deve haver uma dica ou tema visualmente indicados;
// O jogo deve possuir pontuação;

const prompt = require('prompt-sync')();

class GameController {
  constructor() {
    this.player = new Player();
    this.match = new Match();
    this.score = 0;
  }

  startGame() {
    this.match.chooseWord();
    this.match.guessedLetters.clear();
    this.match.matchWon = false;
    this.player.attemptsLeft = this.player.maxAttempts;
    this.score = 0;
    console.log("Bem vindo ao nosso jogo de forca de pokemón!");
    this.play();
  }

  play() {
    while(this.player.canGuess() && !this.match.finishedMatch()) {
      console.log(`Dica: ${this.match.currentHint}`);
      console.log(this.match.displayWord());
      console.log(`Tentativas: ${this.player.attemptsLeft}`);
      const guess = prompt("Escolha uma letra ou digite a palavra para chutar: ").toLowerCase();
      if (guess.length === 1) {
        if (guess.charCodeAt(0) < 97 || guess.charCodeAt(0) > 122) {
          console.log("Você não inseriu uma letra válida. Tente novamente.");
        }
        else if (this.match.guessedLetters.has(guess)) {
          console.log("Essa letra já foi palpitada! Tente novamente.");
        } else {
          this.match.guessedLetters.add(guess);
          if (!this.match.currentWord.includes(guess)) {
            this.player.reduceAttempts();
          } else {
            this.score += 10;
          }
        }
      } else {
        if (guess === this.match.currentWord) {
          this.score += 50*this.match.countRemainingLetters();
          this.match.matchWon = true;
          break;
        } else {
          this.player.reduceAttempts();
        }
      }
    }
    this.showResult();
    this.askPlayAgain();
  }
  showResult() {
    if (this.match.matchWon) { 
      console.log(`Parabens! Você ganhou! A palavra era ${this.match.currentWord}`);
      console.log(`Sua pontuação foi de ${this.score} pontos.`);
    } else {
      console.log(`Que pena! A palavra era ${this.match.currentWord}`);
    }
  }
  askPlayAgain() {
    const escolha = prompt("Gostaria de jogar novamente? (s/n): ").toLowerCase();
    if (escolha === 's') {
      this.startGame();
    } else {
      console.log("Obrigado por jogar o jogo da forca! Até logo!");
    }
  }
}

class Match {
  constructor() {
    this.words = [
      {word: "squirtle", hint: "água - azul - tartaruga"},
      {word: "pikachu", hint: "elétrico - amarelo - rato"},
      {word: "meowth", hint: "normal - rocket - gato"},
      {word: "charmander", hint: "fogo - laranja - salamandra"},
      {word: "butterfree", hint:"inseto - roxo - voador"},
      {word: "beedrill", hint:"inseto - amarelo - venenoso"},
      {word: "ninetales", hint:"fogo - amarelo - raposa"},
      {word: "jigglypuff", hint:"normal - rosa - fada"},
      {word: "zubat", hint:"voador - azul - morcego"},
      {word: "psyduck", hint:"água - amarelo - pato"},
      {word: "kadabra", hint:"psíquico - amarelo - colher"},
      {word: "machamp", hint:"lutador - azul - braços"}
    ]
    this.currentWord = "";
    this.currentHint = "";
    this.guessedLetters = new Set();
    this.matchWon = false;
  }

  chooseWord() {
    const randomIndex = Math.floor(Math.random() * this.words.length);
    this.currentWord = this.words[randomIndex].word;
    this.currentHint = this.words[randomIndex].hint;
  }

  displayWord() {
    let displayedWord = this.currentWord;
    for (let i = 0; i < displayedWord.length; i++) {
      if (!this.guessedLetters.has(displayedWord[i])) {
        displayedWord = displayedWord.replace(displayedWord[i], '_');
      }
    }
    return displayedWord;
  }

  finishedMatch() {
    for (let i = 0; i < this.currentWord.length; i++) {
      if (!this.guessedLetters.has(this.currentWord[i])){
        return false;
      }
    }
    this.matchWon = true;
    return true;
  }

  countRemainingLetters() {
    let number = 0;
    const displayedWord = this.displayWord();
    for (let i = 0; i < displayedWord.length; i++) {
      if (displayedWord[i] === '_') {
        number++;
      }
    }
    return number;
  }
}

class Player {
  constructor() {
    this.maxAttempts = 6;
    this.attemptsLeft = this.maxAttempts;
  }

  canGuess() {
    return this.attemptsLeft > 0;
  }

  reduceAttempts() {
    this.attemptsLeft--;
  }
}

const game = new GameController();
game.startGame();

