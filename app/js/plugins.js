/*AnimatedCursor Plugin created by css4 ES6*/
;(function (window) {

  class AnimatedCursor {

      constructor(selector, config) {

        this.mainElement = selector;
        this._config = config || {};
        this._config.printTime = this._config.printTime || 200;
        this._config.deleteTime = this._config.deleteTime || 40;
        this.currentIndex = 0;
        this.words = selector.getAttribute('data-words').split("|");

        this.currTime = this._config.deleteTime;
        this.tempWord = this.words[this.currentIndex];
        this.printWord = '';
        this.status = 'delete';

        this.init();

      }

      init() {

          this.mainElement.innerHTML = this.tempWord;
          let self = this;
          setTimeout(function run() {
              if(self.status === 'print'){
                  self.printLetters(self.printWord)
              }
              else {
                  self.deleteLetters(self.tempWord);
              }

              setTimeout(run, self.currTime);
          }, 1000);

      }

      deleteLetters(word) {
          if(!word.length){
              this.changeStatus();
              this.changeIndex();
              this.currTime = this._config.printTime;
              return true;
          }

          this.currTime = this._config.deleteTime;

          this.tempWord = word.substr(0, word.length-1);
          this.mainElement.innerHTML = this.tempWord;
      }

      printLetters(currprint) {
          if(currprint.length == this.words[this.currentIndex].length) {
              this.changeStatus();
              this.tempWord = this.words[this.currentIndex];
              this.printWord = '';
              this.currTime = this._config.printTime*8;
              return true;
          }
          else {
              this.printWord = this.words[this.currentIndex].substr(0, currprint.length + 1);
              this.mainElement.innerHTML = this.printWord;
          }

      }

      changeIndex() {
        this.currentIndex = this.currentIndex + 1 > this.words.length - 1 ? 0: ++this.currentIndex;
      }

      changeStatus() {
        this.status = this.status === "delete" ? "print" : "delete";
      }

  }

    window.AnimatedCursor = AnimatedCursor;

})(window);