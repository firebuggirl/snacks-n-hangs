import axios from 'axios'; //library for fetching AJAX
import { $ } from './bling';//JS shorthand

function ajaxHeart(e) {
  e.preventDefault();//prevent form from submitting itself
  console.log('HEART ITTT!!!!!!!!!!!!!!!!');
  console.log(this);
  axios
    .post(this.action) //'this' is the form tag..ie., heart..'action' is url we're psoting to
    .then(res => {
      console.log(res.data);
      const isHearted = this.heart.classList.toggle('heart__button--hearted');//because 'this' form element has "heart" as a name attribute in storeCard.pug file, can access it as subproperty of 'this'
      console.log(isHearted);
      $('.heart-count').textContent = res.data.hearts.length;//res.data gives entire user, .hearts gives hearts array, and .length tells how many hearts in array
      if (isHearted) {
        this.heart.classList.add('heart__button--float');//add CSS animation/keyframe when heart i clicked
        setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);//remove after 2.5 secs
      }
    })
    .catch(console.error);
}

export default ajaxHeart;
