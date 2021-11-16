import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model';
import recipeView from "./views/recipeView";
import resultsView from "./views/resultsView"
import paginationView from "./views/paginationView";
import {state} from "./model";
import bookmarkView from "./views/bookmarkView";
import addRecipeView from "./views/addRecipeView";



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


//Rendering Single Recipe Logic
const showRecipe = async function (){
    try{
        const id = window.location.hash.slice(1);

        if (!id) return

        //Fetching Recipe
        recipeView.renderSpinner()

        //Updating bookmarks(Adding Active Class)
        bookmarkView.update(model.state.bookmarks)

        //Fetching Recipe
        await model.loadRecipe(id);
        //Rendering Recipe
        recipeView.render(model.state.recipe)

        //Updating Results (Adding Active Class)
        if (model.state.search.length) resultsView.update(model.getSearchResultsPage());
    }catch (e){
        recipeView.renderError()
    }

};

//Bookmark Render
const controlBookmarks = function (){
    bookmarkView.render(model.state.bookmarks)
}

bookmarkView.addHandler(controlBookmarks)


//Rendering All Searched Recipes
const showSearchedRecipe = async function(){
    try{
        const search = resultsView.getSearchValue();
        if (!search) return;
        resultsView.renderSpinner();
        await model.loadSearchRecipe(search)
        resultsView.render(model.getSearchResultsPage(paginationView.page))
        paginationView.addPagination(model.state.search);
    }catch (e){
        resultsView.renderError()
    }
}

//Rendering Page Results and Pagination
const updatePagination = function (page){
    resultsView.render(model.getSearchResultsPage(page));
    paginationView.addPagination(model.state.search,page);
}

//Update Servings
const updateServings = function (newServings){
    model.updateServings(newServings);
    recipeView.update(model.state.recipe)
}

//Bookmark Function For Rendering
const updateBookmark = function (){
    model.addBookmark(model.state.recipe)
    recipeView.update(model.state.recipe)
    bookmarkView.render(model.state.bookmarks)
}

const updateRecipe = async function (newRecipe){
    try {
        await model.uploadRecipe(newRecipe)
        console.log(model.state.recipe)
        recipeView.render(model.state.recipe)
        addRecipeView.renderMessage()
        bookmarkView.render(model.state.bookmarks)
        window.history.pushState(null,'',`#${model.state.recipe.id}`)
        setTimeout(function (){
            addRecipeView.toggleWindow();
        },2500)
    }catch (e){
        addRecipeView.renderError(e.message)
    }
}

addRecipeView.addHandlerUpload(updateRecipe)

//Updating Bookmark SVG (Filling)
recipeView.bookMark(updateBookmark)

//Rendering All Searched Recipes When Submit Event Handler Is Triggered
resultsView.submitHandler(showSearchedRecipe)

//Listening For Load And Hash Events To Render Recipe
recipeView.listenToLoadAndHash(showRecipe)

//Updating Pagination UI When Changing The Page
paginationView.clickEventListener(updatePagination);

//Update Servings When Buttons Clicked
recipeView.clickServingsListener(updateServings);
