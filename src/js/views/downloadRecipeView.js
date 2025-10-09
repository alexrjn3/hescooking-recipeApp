import View from './View.js';

import icons from '../../img/icons.svg'; //pt video si image trb url: la inceput la parcel v2
import domtoimage from 'dom-to-image';

class DownloadRecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `No history found `;
  _message = '';



  addHandlerDownloadRecipe(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.downloadrec__btn'); //event lookup pt a vedea care buton este apasat
      if (!btn) return;
      handler(btn);
    });
  }

  async captureAndDownload() {
    // Wait for all images/SVGs to be rendered (if necessary)
 
    this.hideDownloadDirections();
    await this.waitForDynamicContent();

    

    // Capture the element as a PNG
    domtoimage
      .toPng(this._parentElement)
      .then(function (dataUrl) {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'recipe-image.png';
        link.click();

      })
      .catch(function (error) {
        console.error('Error capturing image:', error);
      });

  }

  async waitForDynamicContent() {
    // You can implement a MutationObserver or setTimeout based approach here
    // to make sure that all dynamic content (like images/SVGs) has been added before capturing
    return new Promise(resolve => {
      setTimeout(resolve, 1000); // Adjust based on your app's content load time
    });
  }

  hideDownloadDirections(){
    if(!document.querySelector('.dir_down_btns'))return;
    document.querySelector('.dir_down_btns').classList.toggle('hidden');

    if(!document.querySelector('.btn--bookmark'))return;
    document.querySelector('.btn--bookmark').classList.toggle('hidden');
    

  }

  _triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
}
export default new DownloadRecipeView();
