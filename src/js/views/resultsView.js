import View from "./View";
import icons from 'url:../../img/icons.svg';
import previewView from "./previewView";
class ResultsView extends View{

    _parentElement = document.querySelector('.results');
    _searchFields = document.querySelector('.search__field');
    _errorMessage = 'We could not find that recipe. Please try another one!';
    _message;

    //Submit Handler Method
    submitHandler(handler){
        document.querySelector(".search").addEventListener("submit",function (e){
            e.preventDefault()
            handler();
        })
    }

    getSearchValue(){
        return this._searchFields.value;
    }

    _generateMarkup() {
        return this._data.map(curr => previewView.render(curr,false)).join('');
    }


}

export default new ResultsView();