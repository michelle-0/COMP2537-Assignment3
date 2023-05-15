
var pokemon = [];
var pokeType = [];
var checkedTypes = [];
var filtered = [];

let currentPage = 1;
const numPerPage = 10;
var numPages = 0;
const numPageBtn = 5;

const setup = async () => {
    $('#pokemon').empty();
    // test out poke api using axios here

    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    console.log(response.data.results);


    pokemon = response.data.results;
    numPages = Math.ceil(pokemon.length / numPerPage);

    
    // pop up modal
    
    $('body').on('click', '.pokeCard', async function (e) {
        console.log("this:"+this);
        const pokemonName = $(this).attr('pokeName')
        console.log("pokemonName: ", pokemonName);
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        const types = res.data.types.map((type) => type.type.name)
        console.log("type"+types);

        $('.modal-body').html(`
            <div style="width:200px">
                <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
                <div>
                    <h3>Abilities</h3>
                    <ul>${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}</ul>
                </div>
                <div>
                    <h3>Stats</h3>
                    <ul>${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}</ul>
                </div>
            </div>
            <h3>Types</h3>
            <ul>${types.map((type) => `<li>${type}</li>`).join('')}</ul>
            `)
        $('.modal-title').html(`<h2>${res.data.name}</h2>`)
        
    })
    
    $('body').on('click', '.pageBtn', async function (e) {
        const pageNum = parseInt($(this).attr('pageNum'))
        showPage(pageNum);
    });

    showPage(1);
    
      
    $('body').on('click', '.type-checkbox', async function (e) {
        const number = $(this).attr('typeNum')
        let typeresponse = await axios.get(`https://pokeapi.co/api/v2/type/${number}`);
        filtered = typeresponse.data;  // so that we don't have to do pokemon.pokemon.name
    });
};

async function showPage(currentPage) {
    if (currentPage < 1) {
        currentPage = 1;
    }
    if (currentPage > numPages) {
        currentPage = numPages;
    }
     // add filter types
    $('#types').empty();
    let typeresponse = await axios.get('https://pokeapi.co/api/v2/type');
   
    // Get all unique types from the pokemon array, and place checkbox for each one
    const allTypes = typeresponse.data.results;
    console.log(allTypes);
    for (i = 0; i < allTypes.length; i++){
        var thistype = allTypes[i];
        let typeres = await axios.get(`${thistype.url}`);
        let typeData = typeres.data;
        const number = $(this).attr('pokeName')
        $('#types').append(`
        <input type="checkbox" class="type-checkbox" name="type" typeNum="${typeData.id}">
        <label for="checkbox"> ${thistype.name}</label>
        `);
        console.log(typeData.name);
    }

    // Get the checked types
    // Array.from($('.type-checkbox:checked')).map(checkbox => checkbox.value);

    $('.type-checkbox:checked').each(function() {
        checkedTypes.push($(this).val());
    });

    console.log("checked:"+checkedTypes);

    $('#pokemon').empty();
    for (let i = ((currentPage - 1) * numPerPage); i < ((currentPage - 1) * numPerPage) + numPerPage && i < pokemon.length; i++) {
        const thisPokemon = pokemon[i];
        let innerResponse = await axios.get(`${thisPokemon.url}`);
        let pokemonData = innerResponse.data;
        $('#pokemon').append(`
            <div class="pokeCard card" pokeName="${pokemonData.name}">
                <h3>${pokemonData.name}</h3>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}"/>
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#pokeModal">More</button>
            </div>
        `);
    }
    
    // add pagination buttons
    $('#pagination').empty();
    var startI = Math.max(1, currentPage - Math.floor(numPageBtn / 2));
    var endI = Math.min(numPages, currentPage + Math.floor(numPageBtn / 2));

    if (currentPage > 1) {
        $('#pagination').append(`
                <button type="button" class="btn btn-primary pageBtn" id="pagefirst" pageNum="1">First</button>`
        );
        $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn" id="pageprev" pageNum="${currentPage - 1}">Prev</button>
            `)
    }

    for (let i = startI; i <= endI; i++) {
        var active = "";
        if (i == currentPage) {
            active = "active";
        }
        $('#pagination').append(`
                <button type="button" class="btn btn-primary pageBtn ${active}" id="page${i}" pageNum="${i}">${i}</button>
                `);
    }
    if (currentPage < numPages) {
        $('#pagination').append(`
                <button type="button" class="btn btn-primary pageBtn" id="pageprev" pageNum="${currentPage + 1}">Next</button>`
        );
        $('#pagination').append(`
            <button type="button" class="btn btn-primary pageBtn" id="pagelast" pageNum="${numPages}">Last</button>
            `)
    }

}

$(document).ready(setup)

// <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
// <label for="vehicle1"> I have a bike</label><br></br>