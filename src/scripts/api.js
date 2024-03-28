const routes = {
  champions: "http://sdw24.us-east-1.elasticbeanstalk.com/lol-api/champions",
  ask: "http://sdw24.us-east-1.elasticbeanstalk.com/lol-api/champions/{id}/ask",
};

const apiService = {
  async getChampions() {
    const route = routes.champions;
    const response = await fetch(route);
    return await response.json();
  },
  async postAskChampion(id, message) {
    const route = routes.ask.replace("{id}", id);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message }),
    };

    const response = await fetch(route, options);
    return await response.json();
  },
};

const state = {
  values: {
    characters: [],
  },
  view: {
    response: document.querySelector(".text-reponse"),
    question: document.querySelector("#text-request"),
    avatar: document.getElementById("avatar"),
    carousel: document.getElementById("carousel-cards-content"),
  },
};

async function main() {
  await loadCharacters();
  await resetForm();
  await loadCarrousel();
}

// code
async function loadCharacters() {
  const data = await apiService.getChampions();
  state.values.characters = data;
  await renderCharacters();
}

async function fetchAskChampion() {
  document.body.style.cursor = "wait";
  const id = state.view.avatar.dataset.id;
  const message = state.view.question.value;
  const response = await apiService.postAskChampion(id, message);
  state.view.response.textContent = response.answer;
  document.body.style.cursor = "default";
}

async function renderCharacters() {
  const charactersData = state.values.characters;
  const characterElements = charactersData.map(
    (character) => `
    <div class="timeline-carousel__item" onclick="onChangeCharacterSelected(${character.id},'${character.imageUrl}')">
      <div class="timeline-carousel__image">
        <div class="media-wrapper media-wrapper--overlay" style="background: url('${character.imageUrl}') center center; background-size:cover;"></div>
      </div>
      <div class="timeline-carousel__item-inner">
        <span class="name">${character.name}</span>
        <span class="role">${character.role}</span>
        <p>${character.lore}</p>
      </div>
    </div>`
  );
  state.view.carousel.innerHTML = characterElements.join("");
}

async function onChangeCharacterSelected(id, imageUrl) {
  state.view.avatar.style.backgroundImage = `url('${imageUrl}')`;
  state.view.avatar.dataset.id = id;
  await resetForm();
}

async function resetForm() {
  state.view.question.value = "";
  state.view.response.textContent = await getRandomQuote();
}

async function getRandomQuote() {
  const quotes = [
    "Manda Ver meu nobre",
    "Pode vir quente que eu to fervendo",
    "Aguardo sua pergunta",
    "Espero anciosamente pela sua pergunta",
    "Estou começando a ficar com tédio...",
    "Tenha vidas a salvar, vá depressa com isso",
    "Não vai ficar ai o dia todo vai ?",
    "Talvez seja melhor ir jogar Dota...",
    "Ainda to tentando entender como essa giringonça funciona",
    "Vamo que vamo meu chapa",
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);

  return quotes[randomIndex];
}

async function loadCarrousel() {
  const caroujs = (el) => {
    return $("[data-js=" + el + "]");
  };

  caroujs("timeline-carousel").slick({
    infinite: false,
    arrows: true,
    arrows: true,
    prevArrow:
      '<div class="slick-prev"> <div class="btn mr-3 btn-warning d-flex justify-content-center align-items-center"> <div>Anterior</div><svg class="ml-1" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <path d="M10.1,19.1l1.5-1.5L7,13h14.1v-2H7l4.6-4.6l-1.5-1.5L3,12L10.1,19.1z"/> </svg></div></div>',
    nextArrow:
      '<div class="slick-next"> <div class="btn btn-warning d-flex justify-content-center align-items-center"> <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M 14 4.9296875 L 12.5 6.4296875 L 17.070312 11 L 3 11 L 3 13 L 17.070312 13 L 12.5 17.570312 L 14 19.070312 L 21.070312 12 L 14 4.9296875 z"/> </svg> <div>Próximo</div></div></div>',
    dots: true,
    autoplay: false,
    speed: 1100,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

main();
