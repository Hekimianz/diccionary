const searchInput = document.querySelector("input");
const form = document.querySelector("form");
const main = document.querySelector("main");
const apiUrl =
  "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";
const apiKey = "?key=33abd802-6261-4cd5-9ad6-50b5ec89ffef";
let wordsReturned = [];

function searchWord() {
  let searchValue = searchInput.value;
  fetch(`${apiUrl}${searchValue}${apiKey}`)
    .then((res) => res.json())
    .then((data) => {
      wordsReturned = data.map((word) => {
        let subdirectory = "";
        if (word.hwi.prs) {
          if (word.hwi.prs[0].sound.audio.slice(0, 3) === "bix") {
            subdirectory = "bix";
          } else if (word.hwi.prs[0].sound.audio.slice(0, 2) == "gg") {
            subdirectory = "gg";
          } else if (
            /\d/.test(word.hwi.prs[0].sound.audio[0]) ||
            /[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(
              word.hwi.prs[0].sound.audio[0]
            )
          ) {
            subdirectory = "number";
          } else {
            subdirectory = word.hwi.prs[0].sound.audio[0];
          }
        }

        return {
          id: word.meta.id,
          uuid: word.meta.uuid,
          date: word.date,
          definition:
            word.shortdef.length > 0
              ? word.shortdef[0]
              : `${word.cxs[0].cxl} ${word.cxs[0].cxtis[0].cxt}`,
          fLabel: word.fl,
          isOffensive: word.meta.offensive,
          pronunciation: word.hwi?.prs?.[0].mw,
          soundUrl: subdirectory
            ? `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${word.hwi?.prs?.[0].sound.audio}.mp3`
            : null,
          similar: word.meta.stems,
        };
      });

      listWords();
    });
}

function listWords() {
  main.innerHTML = "";
  wordsReturned.forEach((word) => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("wordListed");
    const title = document.createElement("h2");
    title.classList.add("wordTitle");
    const audioBtn = document.createElement("span");
    audioBtn.classList.add("material-symbols-outlined", "wordAudioBtn");
    audioBtn.innerText = "play_circle";

    title.innerHTML = ` ${word.id}
          <span class="wordPronounciation">${
            word.pronunciation ? `/${word.pronunciation}/` : ""
          }</span>`;
    const wordInfo = document.createElement("p");
    wordInfo.classList.add("wordInfo");
    wordInfo.innerHTML = ` ${
      word.fLabel ? `<span class="wordLabel">${word.fLabel}</span> -` : ""
    }
          <span class="wordDef"
            >${word.definition}</span
          >`;
    const audio = document.createElement("audio");
    word.soundUrl ? audio.setAttribute("src", word.soundUrl) : null;
    const offensive = document.createElement("span");
    offensive.innerText = "Offensive";
    offensive.classList.add("wordOffensive");
    main.appendChild(newDiv);
    newDiv.appendChild(title);
    newDiv.appendChild(wordInfo);
    word.soundUrl ? title.appendChild(audioBtn) : null;
    word.isOffensive ? newDiv.appendChild(offensive) : null;
    audioBtn.addEventListener("click", () => {
      audio.play();
    });
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchWord();
  searchInput.value = "";
});
