const isSingleView = window.location.search.includes('single_view');

const addLoadEvent = (func: any) => {
  if (typeof window.onload !== 'function') {
    window.onload = func;
  } else {
    window.onload = () => {
      func();
    };
  }
};

const init = () => {
  if (isSingleView) {
    mealTimesUpdate();
    addCalculateButton();
    showNotes();
  }
};

const mealTimesUpdate = () => {
  const mealTimeInput = <HTMLInputElement>document.querySelector('.meal_times_input > input');
  const mealTableitems = document.querySelector('.meal_items > tbody')?.children;
  chrome.storage.sync.get('amount', (items) => {
    const val = items.amount ?? 1;
    if (mealTimeInput) {
      mealTimeInput.value = val;
    }
    if (mealTableitems && mealTableitems.length > 0) {
      for (let i = 0; i < mealTableitems.length; i++) {
        const mealTime = <HTMLDivElement>mealTableitems[i].children[1];
        if (mealTime.innerText.endsWith('g')) {
          const mealTimeVal = Number(mealTime.innerText.split('g')[0]) * val;
          mealTime.innerText = `${mealTimeVal}g`;
        }
      }
    }
  });
};

const showNotes = () => {
  const noteBox = <HTMLTextAreaElement>document.getElementsByName('the_note')[0];
  if (noteBox.value !== '') {
    document.getElementById('stickynote')?.classList.add('show');
  }
};

const addCalculateButton = () => {
  const mealTableitems = document.querySelector('.meal_items > tbody')?.children;

  if (mealTableitems && mealTableitems.length > 0) {
    for (let i = 0; i < mealTableitems.length; i++) {
      const text = <HTMLDivElement>mealTableitems[i].children[0];
      const value = <HTMLDivElement>mealTableitems[i].children[1];
      if (text.innerText.includes('ca') && text.innerText.includes('per')) {
        const ca = Number(text.innerText.split('kcal')[0].split('ca')[1].trim());
        // get value from value that is before g
        if (value.innerText.endsWith('g')) {
          value.style.color = '#107ab0';
          value.style.cursor = 'pointer';
          const g = Number(value.innerText.split('g')[0]);
          // add onClick event to value
          value.addEventListener('click', () => {
            const calculatorPart = <HTMLDivElement>document.getElementById('calculator');
            calculatorPart.classList.add('show');
            const calculatorChildren = calculatorPart.children[0].children;
            const multiplier =
              Number((<HTMLInputElement>document.querySelector('.meal_times_input > input')).value) ?? 1;
            (<HTMLInputElement>calculatorChildren[0].children[0]).value = Number(ca).toString();
            (<HTMLInputElement>calculatorChildren[1].children[0]).value = Number(g * multiplier).toString();
            (<HTMLInputElement>calculatorChildren[2].children[0]).value = Number(0).toString();
          });
        }
      }
    }
  }
};

addLoadEvent(init);
