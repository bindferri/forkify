import View from "./View";
import icons from 'url:../../img/icons.svg';
import previewView from "./previewView";

class bookmarkView extends View{
    _parentElement = document.querySelector('.bookmarks__list');
    _errorMessage = "No bookmarks yet. Find a nice recipe and bookmark it :)"

    _generateMarkup() {
    return this._data.map(curr => previewView.render(curr,false)).join('');
    }

    addHandler(handler){
        window.addEventListener('load',handler)
    }
}

export default new bookmarkView();