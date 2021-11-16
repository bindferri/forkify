import {API_URL} from './config';
import {API_SEARCH_URL} from "./config";
import {RES_PER_PAGE} from "./config";
import {AJAX} from "./helpers";
import {API_KEY} from "./config";


export const state = {
    recipe: {},
    search: {},
    page: 1,
    bookmarks: []
}

const createRecipeObjectData = function (data){
    const {recipe} = data.data;
    return  {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceURL: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key})
    }
}

//Single Recipe Data
export const loadRecipe = async function(id){
    try {
        const apiJson = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
        state.recipe = createRecipeObjectData(apiJson)
        state.bookmarks.some(curr => curr.id === state.recipe.id) ? state.recipe.bookmark = true : ''
    }catch (e){
        console.error(e.message)
        throw e;
    }
}

//All Searched Data
export const loadSearchRecipe = async function(search){
    try{
        const searchJson = await AJAX(`${API_SEARCH_URL}?search=${search}&key=${API_KEY}`)
        const {recipes} = searchJson.data
        state.search = recipes.map(curr => {
        return {
            id: curr.id,
            title: curr.title,
            publisher: curr.publisher,
            sourceURL: curr.source_url,
            image: curr.image_url,
            servings: curr.servings,
            cookingTime: curr.cooking_time,
            ingredients: curr.ingredients,
            ...(curr.key && {key: curr.key})
        }
        })
    }catch (e){
        console.error(e.message)
        throw e;
    }
}

export const getSearchResultsPage = function (page = state.page){
    state.page = page;

    const start = (page - 1) * RES_PER_PAGE;
    const end = page * RES_PER_PAGE;

    return state.search.slice(start,end)
}

export const updateServings = function (newServings){
    const servings = state.recipe.servings
    state.recipe.ingredients.forEach(curr => {
        const singleServe = curr.quantity / servings;

        curr.quantity = singleServe * newServings;
    })
    state.recipe.servings = newServings
}

export const addBookmark = function (recipe){
    // const values = {...localStorage}
    // console.log(values)
    if (state.recipe.bookmark){
        state.recipe.bookmark = false;
        console.log(2)
        state.bookmarks.splice(state.bookmarks.findIndex(curr => curr.id === state.recipe.id),1)
        localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
    }else {
        state.bookmarks.push(recipe)
        console.log(1)
        localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks))
        if (recipe.id === state.recipe.id) state.recipe.bookmark = true;
    }
}

export const getLocalStorage = function (){
    const storage = localStorage.getItem('bookmarks')
    if (storage) state.bookmarks = JSON.parse(storage)
}
getLocalStorage();

export const uploadRecipe = async function(newRecipe){
    try{
        const ingredients = Object.entries(newRecipe).filter(curr => curr[0].includes("ingredient") && curr[1] !== '').map(curr => {
            const arrLength = curr[1].trim().split(',');
            if (arrLength.length !== 3) throw new Error("Please use the correct Format")
            const [quantity,unit,description] = arrLength;
            return {quantity: quantity ? +quantity : null,unit,description}
        });
        const recipe = {
            title: newRecipe.title,
            publisher: newRecipe.publisher,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            servings: +newRecipe.servings,
            cooking_time: +newRecipe.cookingTime,
            ingredients: ingredients
        }
        console.log(recipe)
        const data = await AJAX(`${API_URL}?key=${API_KEY}`,recipe)
        state.recipe = createRecipeObjectData(data)
        addBookmark(state.recipe)
    }catch (e){
        throw e;
    }
}