'use strict';


let Storage = (() => { // localStorage helper

  return {
    get: (a)    => localStorage.getItem(a),
    set: (a,b)  => localStorage.setItem(a,b)
  }
})();


let Recipes = (() => {

  const _jsonPath         = './data/recipes.json';
  let _$recipesTable      = $('#recipes-table');
  let _$ingredientsList   = $('ul#selected-ingredients');
  let _dataTable          = null;

  let selectedRecipes     = [];
  let selectedIngredients = [];

  let _displaySelected    = () => {

    _$ingredientsList.html('');

    for(var ingr of selectedIngredients) {
      _$ingredientsList.append('<li class="selected-ingredient col-xs-6 col-sm-4 col-md-3 col-lg-2">'+ingr+'</li>');
    }

    if(selectedIngredients.length)
      $('#ingredients-wrapper').removeClass('empty');
    else
      $('#ingredients-wrapper').addClass('empty');

  };

  let _updateSelected     = () => {

    // Array reset
    selectedRecipes = [];
    selectedIngredients = [];

    let allSelected = _dataTable.rows('.selected').data();

    /**
    * allSelected now contains an object with the selected rows and other DataTable methods.
    * We need to get only the selected rows,
    * but can't use for...in or for...of for this purpose,
    * because selected rows are indexed by ordinal numbers like in an array.
    */
    for(var i = 0; i<allSelected.length; i++){
      selectedRecipes.push( allSelected[i] );
      _collectIngredients( allSelected[i].ingredients, selectedIngredients );
    };

    _displaySelected();

    Storage.set('selectedRecipes', JSON.stringify(selectedRecipes));
  };

  let _collectIngredients = (recipeIngredients, target = []) => {

    // For each ingredient of this recipe
    for(let ingredient of recipeIngredients) {

      if ( target.indexOf(ingredient) < 0 )
        // Ingredient not in collection yet
        target.push(ingredient);
    }

    return target.sort();
  };

  let _checkStorage       = () => {

    let _stored = Storage.get('selectedRecipes')? JSON.parse(Storage.get('selectedRecipes')) : [];
    let rows = _dataTable.rows().data();

    for(let recipe of _stored){

      for(let r = 0; r < rows.length; r++){

        if ( JSON.stringify(rows[r]) == JSON.stringify(recipe) ) {
          _dataTable.rows(':eq('+r+')').select();
        }

      };

      selectedRecipes.push( recipe );
      _collectIngredients( recipe.ingredients, selectedIngredients );

    };

    _displaySelected();

  };

  let _getRecipes         = () => {

    $.getJSON( _jsonPath, recipesData => {

      // preparing dataset
      for(let d of recipesData) {

        // setup 'select' column data
        d['_select'] = '';

        // minor change for friendly display
        d['_ingredients'] = d['ingredients'].sort().join(', ');
      };

      // set DataTable with parameters
      _dataTable = _$recipesTable.DataTable({
        data: recipesData,
        columns: [
          {
            title: 'Select',
            data: '_select',
            orderable: false,
            className: 'select-checkbox'
          },
          { title: 'Name', data: 'name' },
          { title: 'Type', data: 'type' },
          { title: 'Cook time', data: 'cook_time' },
          { title: 'Ingredients', data: '_ingredients' },
          { title: 'Ingredients', data: 'ingredients', className:'hidden' }
        ],
        paging: false,
        select: {
          style:    'multi',
          selector: '.select-checkbox'
        },
        order: [[ 1, 'asc' ]]
      });

      // check storage, look for selected recipes
      _checkStorage();

      // update selection on checkbox click
      _$recipesTable.click('.select-checkbox', _updateSelected);

    });
  };


  return {
    selectedRecipes,
    selectedIngredients,
    init() {

      _getRecipes();
    }
  }
})();


$(function () {

  Recipes.init();

});
