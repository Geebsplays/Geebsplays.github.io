const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array) {
  const random = Math.floor(Math.random() * array.length);
  return array[random];
}

const storytext = "It was 94 fahrenheit outside, so :insertx: went for a walk. When they got to :inserty:, they stared in horror for a few moments, then :insertz:. Bob saw the whole thing, but was not surprised — :insertx: weighs 300 pounds, and it was a hot day.";
const insertx = ["Willy the Goblin", "Big Daddy", "Father Christmas"];
const inserty = ["the soup kitchen", "Disneyland", "the White House"];
const insertz = ["spontaneously combusted", "melted into a puddle on the sidewalk", "turned into a slug and crawled away"];

randomize.addEventListener('click', result);

function result() {
  let newstory = storytext;

  let xItem = randomValueFromArray(insertx);
  let yItem = randomValueFromArray(inserty);
  let zItem = randomValueFromArray(insertz);

  newstory = newstory.replace(/:insertx:/g, xItem);
  newstory = newstory.replace(':inserty:', yItem);
  newstory = newstory.replace(':insertz:', zItem);

  if (customName.value !== '') {
    const name = customName.value;
    newstory = newstory.replace('Bob', name); 
  }

  if (document.getElementById("uk").checked) {
    const weight = Math.round(300 / 14) + ' stone'; 
    const temperature = Math.round((94 - 32) * (5 / 9)) + ' centigrade'; 

    newstory = newstory.replace('300 pounds', weight);
    newstory = newstory.replace('94 fahrenheit', temperature);
  }

  story.textContent = newstory;
  story.style.visibility = 'visible';
}