let pokemonHistory = [];
document.getElementById('search').addEventListener('click', (e) => {
    displayPokemon();
    document.getElementById('pokemon').value = '';
    e.preventDefault();
});

document.getElementById('show-history').addEventListener('click', () => {
    displayPokemonHistory();
});

document.getElementById('new-team').addEventListener('click', () => {
    disableElements(false);
    document.getElementById('pokemon-container').innerHTML = '';
    document.getElementById('pokemon-alert').innerHTML = '';
    document.getElementById('new-team').disabled = true;
});

async function displayPokemon() {
    const pokemonName = document.getElementById('pokemon').value;
    if (!pokemonName) {
        showAlert('Empty field, please write something!');
        return;
    }
    const pokemon = await getPokemon(pokemonName);
    addPokemon(pokemon);
}

async function getPokemon(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        if (response.status === 404) {
            showAlert('Pokemon not found');
            return;
        }
        return await response.json();
    } catch (err) {
        showAlert("Bad connection? Try again");
    }
}

function addPokemon(pokemon) {
    pokemonHistory.push(pokemon);
    const pokemonList = document.getElementById('pokemon-container');
    const element = document.createElement('div');
    element.classList.add('col-4');
    element.innerHTML = `
    <div class="card" style="width: 18rem;">
    <img src="${pokemon.sprites.front_default}" class="card-img-top">
    <div class="card-body">
      <h5 class="card-title">${pokemon.name}</h5>
      <strong class="card-text">Ability:</strong><p class="card-text">${pokemon.abilities[0].ability.name}</p>
    </div>
  </div>
    `;
    pokemonList.appendChild(element);
    if (pokemonList.childElementCount >= 3) {
        document.getElementById('new-team').disabled = false;
        disableElements(true);
        showAlert("You already completed your team! Go and fight");
    }
    pokemonHistory.sort((a, b) => {
        return a.base_experience - b.base_experience;
    });
}

function disableElements(status) {
    document.getElementById('pokemon').disabled = status;
    document.getElementById('search').disabled = status;
}

function showAlert(message) {
    document.getElementById('pokemon-alert').innerHTML = '';
    const pokemonAlert = document.getElementById('pokemon-alert');
    const element = document.createElement('div');
    element.innerHTML = `
        <h2>${message}</h2>
    `;
    pokemonAlert.appendChild(element);
}

function displayPokemonHistory() {
    const pokemonHistoryContainer = document.getElementById('history-container');
    pokemonHistory.innerHTML = "";
    pokemonHistory.forEach((pokemon, index) => {
        const element = document.createElement('div');
        console.log(pokemon);
        element.innerHTML = `
        
        <div class="accordion accordion-flush" id="accordionFlushExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${index}" aria-expanded="false" aria-controls="flush-collapseOne">
        Accordion Item #1
        Pokemon Name: ${pokemon.name}
      </button>
    </h2>
    <div id="flush-collapse${index}" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body"></div>
      <label>Experience: ${pokemon.base_experience}</label>
      <label>Abilities: ${pokemon.abilities[0].ability.name}</label>
    </div>

    `;
        pokemonHistoryContainer.appendChild(element);
    });
}