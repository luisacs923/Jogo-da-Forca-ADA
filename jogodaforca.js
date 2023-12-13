// Criar um jogo da forca usando OO;
// Pelo menos três classes para três entidades presentes no sistema do jogo (GameController, Player e Match);
// O usuário deve poder chutar a palavra de uma vez;
// O usuário deve poder jogar/tentar novamente (reiniciar);
// Deve haver uma dica ou tema visualmente indicados;
// O jogo deve possuir pontuação;

const prompt = require('prompt-sync')();

class GameController { // classe principal do jogo
  constructor() {
    this.player = new Player(); 
    this.match = new Match();
    this.score = 0;
  }

  startGame() { // após instanciar a classe GameController, o método startGame inicia o jogo
    this.match.chooseWord(); //o método escolhe a palavra e dica aleatoriamente
    this.match.guessedLetters.clear(); //limpa o objeto para uma nova partida
    this.match.matchWon = false;
    this.player.attemptsLeft = this.player.maxAttempts; //reinicia para o valor de tentativas inicial (6 tentativas) 
    this.score = 0; //limpa o score
    console.log("Bem vindo ao nosso jogo de forca de pokemón!");
    this.play(); //o método play inicia a partida
  }

  play() {
    while(this.player.canGuess() && !this.match.finishedMatch()) {
      console.log(`Dica: ${this.match.currentHint}`);
      console.log(this.match.displayWord());
      console.log(`Tentativas: ${this.player.attemptsLeft}`);
      const guess = prompt("Escolha uma letra ou digite a palavra para chutar: ").toLowerCase();
      if (guess.length === 1) {
        if (guess.charCodeAt(0) < 97 || guess.charCodeAt(0) > 122) { // para não permitir numeros, e outros caracteres especiais
          console.log("Você não inseriu uma letra válida. Tente novamente.");
        }
        else if (this.match.guessedLetters.has(guess)) { // para não permitir repetição de palpite
          console.log("Essa letra já foi palpitada! Tente novamente.");
        } else {
          this.match.guessedLetters.add(guess); 
          if (!this.match.currentWord.includes(guess)) {
            this.player.reduceAttempts(); //o usuário errou a tentativa de letra: o caractere guess não está na palavra escolhida, diminuir o valor de tentativas
          } else {
            this.score += 10; //pontuação simples, caractere registrado no objeto guessedLetters
          }
        }
      } else {
        if (guess === this.match.currentWord) { //pontuação especial para o acerto de palavra completa
          this.score += 50*this.match.countRemainingLetters();
          this.match.matchWon = true;
          break;
        } else {
          this.player.reduceAttempts(); //o usuário errou a tentativa de palavra, diminuir o valor de tentativas
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

  chooseWord() { // o método chooseWord escolhe um objeto (com a palavra e dica) aleatoriamente
    const randomIndex = Math.floor(Math.random() * this.words.length); // escolhe um numero de 0 até o tamanho do array words
    this.currentWord = this.words[randomIndex].word;
    this.currentHint = this.words[randomIndex].hint;
  }

  displayWord() { // o método itera em cada caractere da string, e enquanto o caractere não foi adivinhado, imprime um '_'
    let displayedWord = this.currentWord;
    for (let i = 0; i < displayedWord.length; i++) {
      if (!this.guessedLetters.has(displayedWord[i])) {
        displayedWord = displayedWord.replace(displayedWord[i], '_');
      }
    }
    return displayedWord;
  }

  finishedMatch() { //se as letras da palavra escolhida estao contidas no objeto guessedLetters, então a partida acabou 
    for (let i = 0; i < this.currentWord.length; i++) {
      if (!this.guessedLetters.has(this.currentWord[i])){
        return false;
      }
    }
    this.matchWon = true;
    return true;
  }

  countRemainingLetters() { //método para a pontuação especial, se o palpite de palavra foi certo, o jogador ganha 50 ptos para cada letra que restava a ser adivinhada, ou seja, as letras que estão representadas pelo '_' 
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
    this.maxAttempts = 6; //número de tentativas inicia com 6
    this.attemptsLeft = this.maxAttempts;
  }

  canGuess() { //verifica se o jogador ainda tem tentativas
    return this.attemptsLeft > 0;
  }

  reduceAttempts() { // ao errar um palpite, o método reduz a quantidade de tentativas
    this.attemptsLeft--;
  }
}

const game = new GameController();
game.startGame();

