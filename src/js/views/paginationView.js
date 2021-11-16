import View from "./View";
import icons from 'url:../../img/icons.svg';
import {RES_PER_PAGE} from "../config";

class paginationView extends View {
    _parentElement = document.querySelector('.pagination');
    pageSize;
    page = 1;

    _generateMarkup(newPage){
        return `
        ${newPage > 1 ? `<button data-page="${newPage - 1}" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${newPage - 1}</span>
            </button>` : ''}
            ${newPage < this.pageSize ? `<button data-page="${newPage + 1}" class="btn--inline pagination__btn--next">
              <span>Page ${newPage + 1}</span>
              <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
              </svg>
            </button>` : ''}
        `
    }

    addPagination(size,newPage = this.page){
        this.pageSize = Math.round(size.length / RES_PER_PAGE);
        this._clear();
        const markup = this._generateMarkup(newPage);
        this._parentElement.insertAdjacentHTML('afterbegin',markup)
    }

    clickEventListener(handler){
        this._parentElement.addEventListener("click",function (e){
            // this.innerHTML = '';
            const element = e.target.closest(".btn--inline");
            if (!element) return;
            const page = +element.dataset.page;
            handler(page);
        })
    }

}
export default new paginationView();