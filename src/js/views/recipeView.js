import icons from 'url:../../img/icons.svg';
import {Fraction} from 'fractional';
import View from "./View";

class RecipeView extends View{
    _parentElement = document.querySelector('.recipe');
    _errorMessage = 'We could not find that recipe. Please try another one!';
    _message;



    //Render View Of Single Recipe
    _generateMarkup(){
        return `
          <figure class="recipe__fig">
          <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
            <span class="recipe__info-text">servings</span>
            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-servings="${this._data.servings - 1}">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-servings="${this._data.servings + 1}">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark" data-id="${this._data.id}">
            <svg class="">
              <use href="${icons}#icon-bookmark${this._data.bookmark ? '-fill' : ''}"></use>
            </svg>
          </button>
        </div>
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(curr => this._generateMarkupIngredient(curr)).join('')}
          </ul>
        </div>
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${this._data.publisher}</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceURL}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`
    }

    //Fraction Library (Convert ex 0.5 = 1/2)
    _generateMarkupIngredient(curr){
        return  `<li class="recipe__ingredient">
                  <svg class="recipe__icon">
                      <use href="${icons}#icon-check"></use>
                  </svg>
                  <div class="recipe__quantity">${curr.quantity ? new Fraction(curr.quantity).toString() : ''}</div>
                  <div class="recipe__description">
                      <span class="recipe__unit">${curr.unit}</span>
                      ${curr.description}
                  </div>
              </li>`
    }

    //Load And Hash Listener Method
    listenToLoadAndHash(handler){
        return ['hashchange','load'].forEach(ev => window.addEventListener(ev,handler))
    }

    clickServingsListener(handler){
        this._parentElement.addEventListener("click",function (e){
            const element = e.target.closest(".btn--update-servings");
            if (!element) return;
            const newServings = +element.dataset.servings
            if (newServings > 0) handler(newServings);
        })
    }

    bookMark(handler){
        this._parentElement.addEventListener("click",function (e){
            const element = e.target.closest(".btn--bookmark");
            if (!element) return;
            // const id = element.dataset.id;
            handler()
        })
    }


}
export default new RecipeView();