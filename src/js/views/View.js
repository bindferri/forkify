import icons from 'url:../../img/icons.svg';
export default class View{
    _data;



    /**
     * Rendering Single Recipe View
     * @param {Object | Object[]} data  The data to be rendered
     * @param {boolean} [render=true]  If false create markup string instead to the DOM
     * @returns {undefined | string} A Markup String is returned if render=false
     * @this {Object} View instance
     * */
    render(data,render = true){
        if (!data || (Array.isArray(data) && !data.length)) return this.renderError()
        this._data = data;
        const markup = this._generateMarkup();
        if (!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    _clear(){
        this._parentElement.innerHTML = '';
    }

    //Spinner
    renderSpinner(){
        const markup = `
         <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div> 
    `
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    clearAndBlurInputField(){
        this._searchFields.value = '';
        this._searchFields.blur();
    }

    //Custom Error Handling View
    renderError(message = this._errorMessage){
        const markup = `
        <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    //Custom Successful Message
    renderMessage(message = this._message){
        const markup = `
        <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
        `

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    update(data){
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll('*'));
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach(function (curr,i){
            const curEl = curElements[i];
            // console.log(curEl,curr.isEqualNode(curEl))

            //Update Text
            if (!curr.isEqualNode(curEl) && curr.firstChild?.nodeValue.trim() !== ''){
                curEl.textContent = curr.textContent;
                // console.log(curEl,curr.isEqualNode(curEl))
            }

            //Update Attributes
            if (!curr.isEqualNode(curEl)){
               Array.from(curr.attributes).forEach(curr => curEl.setAttribute(curr.name,curr.value))
            }
        })
    }

}