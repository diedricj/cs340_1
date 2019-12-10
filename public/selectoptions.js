function selectoptions(regional, shiny, special, trainer_name, pokemon_name) {
    let element = document.getElementById("regional");
    element.value = regional;
    element = document.getElementById("shiny");
    element.value = shiny;
    element = document.getElementById("special");
    element.value = special;
    element = document.getElementById("trainer_name");
    element.value = trainer_name;
    element = document.getElementById("pokemon_name");
    element.value = pokemon_name;
}
