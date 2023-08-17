export const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events available';

  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach((eventElem) => {
      createEventCard(eventElem); //if it works dont touch it
    });
  }
}
export function createEventCard(eventElem){
    const image = addImage(eventElem.eventName);
    const selectorID = eventElem.eventID+'s';
    const numberID = eventElem.eventID+'n';
    const ibtn = eventElem.eventID+'i';
    const dbtn = eventElem.eventID+'d';
  
    const ticketCategoryList = eventElem.ticketCategory;
    const categoriesOptions = ticketCategoryList.map(tk =>
      ` <option>${tk.description} - ${tk.price}</option>`
      );
    const eventStartDate = new Date(Date.parse(eventElem.startDate));
    const eventEndDate = new Date(Date.parse(eventElem.endDate));

    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card'); 
    const contentMarkup = `
      <header></header>
      <div class="event-card-content tb">
        <div class="event-card-image tb">
          <img class="event-image" src="${image}">
        </div>
      <div class="event-card-data tb">
        <h2 class="event-title font-bold tb">${eventElem.eventName}</h2>
        <p class="description text-white tb">${eventElem.eventDescription}</p>
        <p class="description text-white tb">Starts @ ${eventStartDate.getDate() + ' / ' + eventStartDate.getMonth() + ' / ' + eventStartDate.getFullYear()}</p>
        <p class="description text-white tb">Ends @ ${eventEndDate.getDate() + ' / ' + eventEndDate.getMonth() + ' / ' + eventEndDate.getFullYear()}</p>
      </div>
  
      <div class="action-container tb">
      <div class="row tb">
        <p class="description text-white tb">Ticket category:</p>
        <select name="Select Category" class="ticket-selector" id="${selectorID}"> ${categoriesOptions.join('\n')} </select>
      </div>
      <div class="row tb">
        <p class="description text-white">Number of tickets:</p>
        <div class="row tb" id="ticket-number-hover">
          <input class="ticket-number" placeholder="0" type="number" id="${numberID}">
          <button class="increase-btn" id="${ibtn}"><i class="fa-solid fa-plus" style="background-color:#ffffff00"></i></button>
          <button class="decrease-btn" id="${dbtn}"><i class="fa-solid fa-minus" style="background-color:#ffffff00"></i></button>
        </div>
        
        
      </div>
      
      <div class="row tb">
        <button class="text-white buy" id="${eventElem.eventID}" >Buy now!</button> 
      </div>
      </div>
      </div>
    `;
  
    eventCard.innerHTML = contentMarkup;
    const eventsContainer = document.querySelector('.events');
    eventsContainer.appendChild(eventCard);
    
    const buy_btn = document.getElementById(eventElem.eventID);
    const numberInput = document.getElementById(numberID);
    numberInput.min = 0;
    buy_btn.disabled = true;  
  
    increaseTicketNumber(numberInput, ibtn, buy_btn);
    decreaseTicketNumber(numberInput, dbtn, buy_btn);
  
    numberInput.addEventListener('input', ()=>{
      const quantity = parseInt(numberInput.value);
      if(quantity > 0)
        buy_btn.disabled = false;
      else
        buy_btn.disabled = true;  
    });
    
    buy_btn.addEventListener("click",function(){
        fetch('http://localhost:8080/api/placeOrder', 
        {
          mode:'cors',
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body:JSON.stringify({
            customerID: sessionStorage.getItem('customerID'),
            eventID: eventElem.eventID,
            ticketCategoryDescription: document.getElementById(selectorID).value.replace(/[^a-zA-Z]/g, ''),
            numberOfTickets: document.getElementById(numberID).value
          })
        });
        numberInput.value=0;
        buy_btn.disabled = true;
        toastr.success("Order placed!");
        
    }, false);
  }
  function increaseTicketNumber(numberInput, ibtn, buy_btn){
    const increaseButton = document.getElementById(ibtn);
      increaseButton.addEventListener('click', () =>{
        numberInput.value++;
        buy_btn.disabled = false;
      });
  }
  function decreaseTicketNumber(numberInput, dbtn, buy_btn){
    const decreaseButton = document.getElementById(dbtn);
      decreaseButton.addEventListener('click', () =>{
        if(numberInput.value > 0)
          numberInput.value --;
        if(numberInput.value == 0)
        buy_btn.disabled = true;
      });
  }
  
  //coding monkey style
  function addImage(eventName){
    if(eventName == "Electric Castle")
      var imageUrl = "https://happ.ro/wp-content/uploads/2023/07/electric-castle-2023-1.jpg";
    if(eventName == "Untold")
      var imageUrl = "https://weraveyou.com/wp-content/uploads/2023/03/UNTOLD.jpeg";
    if(eventName == "Meci de fotbal")
      var imageUrl = "https://www.basic-fit.com/dw/image/v2/BDFP_PRD/on/demandware.static/-/Library-Sites-basic-fit-shared-library/default/dw5927c613/Roots/Blog/Blog-Header/528x352/19-03-Blog-Fitness-Training-Football-Soccer.jpg?sw=600";
    if(eventName == "Wine Festival")
      var imageUrl = "https://www.northeastchartertour.com/wp-content/uploads/2017/11/Wine-Festival.jpg";
    if(eventName == "SYF")
      var imageUrl = "https://timponline.ro/wp-content/uploads/2018/08/festival-singeorz.jpg";
    if(eventName == "Neversea")
      var imageUrl = "https://www.ego.ro/wp-content/uploads/2022/07/6274e5f3db0be_neversea.jpg";
    if(eventName == "Horizon Festival")
      var imageUrl = "https://hellosunshinemag.com.au/wp-content/uploads/2022/08/da-website-hero-2000x1100-2.jpeg";
    if(eventName == "Beach, please!")
      var imageUrl = "https://www.fanatik.ro/wp-content/uploads/2023/04/beach.jpg";
    if(eventName == "SAGA Festival")
      var imageUrl = "https://weraveyou.com/wp-content/uploads/2021/09/3gKJ3JHg-e1631855109995.jpeg";
    if(eventName == "Summerwell")
      var imageUrl = "https://mediaflux.ro/wp-content/uploads/2023/02/summerwell-2023.jpg";
    if(eventName == "Hustle")
      var imageUrl = "https://i.ytimg.com/vi/WpMQVZUvD4M/hqdefault.jpg";
    return imageUrl;
  }

export function filterButtonEvents(){
    const filterButton = document.getElementById('fbtn');
    const filterApplyButton = document.getElementById('fabtn');
    const filterClearButton = document.getElementById('faabtn');
    const filterOptionsLocation = document.getElementById('filter-select-location');
    const filterOptionsType = document.getElementById('filter-select-type');
    const inputType = document.getElementById('filter-select-type')
    const inputLocation = document.getElementById('filter-select-location')
    const slider = document.getElementById('noUiSlider');

    inputType.disabled = true;
    inputLocation.disabled = true;
    slider.disabled = true;

    filterButton.addEventListener('click', () =>{
      filterApplyButton.disabled = false;
      filterClearButton.disabled = false;
      inputType.disabled = false;
      inputLocation.disabled = false;
      slider.disabled = false;

      filterApplyButton.classList.toggle('visible');
      filterOptionsLocation.classList.toggle('visible');
      filterOptionsType.classList.toggle('visible');
      filterClearButton.classList.toggle('visible');
      slider.classList.toggle('visible');
    });
}

function liverSearch(eventList){
  const searchInput = document.getElementById('sbar');
  if(searchInput){
    const searchValue = searchInput.value;
    if(searchValue != undefined){
      const filteredEvents = eventList.filter((eventElem) => eventElem.eventName.toLowerCase().includes(searchValue.toLowerCase()));
      addEvents(filteredEvents);
    }
  }
}
export function setUpFilterEvent(eventList){
  const searchBarInput = document.getElementById('sbar');
  if(searchBarInput){
    searchBarInput.addEventListener('keyup', () =>{
      setTimeout(liverSearch(eventList), 300);
    });
  }
}

export function noUiSliderHandler(eventList){
  const slider = document.getElementById('noUiSlider');
  noUiSlider.create(slider, {
    start: [500, 1500],
    tooltips: [true, true],
    padding: [4, 7],
    margin: 200,
    connect: true,
    range: {
      'min': -4,
      'max': 2007
    }
  });
  
  slider.noUiSlider.on('change', (values, handle)=>{
    setTimeout(()=>{
      let minVal = values[0];
      let maxVal = values[1];
      let newEventList = [];
      eventList.forEach(eventElem =>{
        let isAdded = false;
        eventElem.ticketCategory.forEach(ticket =>{
          if((ticket.price >= minVal && ticket.price <= maxVal) || (ticket.price >= minVal && ticket.price <= maxVal))
            if(!isAdded){
              newEventList.push(eventElem);
              isAdded = true;
            }
        })  
      })
      addEvents(newEventList);
    }, 300);
  });

  const handles = slider.querySelectorAll('.noUi-handle');
  const tooltips = slider.querySelectorAll('.noUi-tooltip');

  slider.addEventListener('mouseenter', () => {
    tooltips.forEach(tooltip => {
        tooltip.style.opacity = '1';
      });
  });

  slider.addEventListener('mouseleave', () => {
      tooltips.forEach(tooltip => {
          tooltip.style.opacity = '';
      });
  });

  handles.forEach((handle, index) => {
    handle.addEventListener('mouseenter', () => {
        tooltips[index].style.opacity = '1';
    });

    handle.addEventListener('mouseleave', () => {
        tooltips[index].style.opacity = '0';
    });
});
}

export async function changePage(pageNumber){
  const response = await fetch('http://localhost:8080/api/getEventBatch/' + pageNumber, {mode:'cors'});
  const responseData = await response.json();
  const eventContent = responseData.events;
  const totalPages = responseData.totalPages;
  const currentPage = responseData.currentPage;
  createPageButtons(totalPages, currentPage);
  addEvents(eventContent);
}

export async function pagination(){
  const response = await fetch('http://localhost:8080/api/getEventBatch/' + 0, {mode:'cors'});
  const responseData = await response.json();
  const eventContent = responseData.events;
  const totalPages = responseData.totalPages;
  const currentPage = responseData.currentPage;

  createPageButtons(totalPages, currentPage);
  // console.log(eventContent);
  console.log(responseData);

  addEvents(eventContent);

}

//mokey style da macar ii in functie separata
function createPageButtons(totalPages, currentPage){
  const pageButtons = document.querySelector('.footer');
  pageButtons.innerHTML=``;
  if(totalPages > 5){
    if(currentPage < 1){
      pageButtons.innerHTML = `
        <button class="page-button" >${currentPage+1}</button>
        <button class="page-button" id="n-page">${currentPage+2}</button>
        <button class="page-button" id="next-page"><i class="fa-solid fa-angle-right"></i></button>
      `;
      const nPageButton = document.getElementById('n-page');
      const nextPageButton = document.getElementById('next-page');
      nPageButton.addEventListener('click', ()=>{
        changePage(currentPage+1);
      });
      nextPageButton.addEventListener('click', ()=>{
        changePage(currentPage+1);
      });
    }
    if(currentPage >= 1 && currentPage <= totalPages){
      pageButtons.innerHTML = `
        <button class="page-button" id="prev-page"><i class="fa-solid fa-angle-left"></i></button>
        <button class="page-button" id="p-page">${currentPage}</button>
        <button class="page-button" >${currentPage+1}</button>
        <button class="page-button" id="n-page">${currentPage+2}</button>
        <button class="page-button" id="next-page"><i class="fa-solid fa-angle-right"></i></button>
      `;
      const PrevPageButton = document.getElementById('prev-page');
      const PPageButton = document.getElementById('p-page');
      const NPageButton = document.getElementById('n-page');
      const NextPageButton = document.getElementById('next-page');
      PrevPageButton.addEventListener('click', ()=>{changePage(currentPage-1)});
      PPageButton.addEventListener('click', ()=>{changePage(currentPage-1)});
      NPageButton.addEventListener('click', ()=>{changePage(currentPage+1)});
      NextPageButton.addEventListener('click', ()=>{changePage(currentPage+1)});
    }
  }else
    for(let i=0;i<totalPages; i++){
      const butonID = i+'b';
      const buton = document.createElement('button');
      buton.classList.add('page-button'); 
      buton.id = butonID;
      buton.innerHTML = `${i+1}`;
      pageButtons.appendChild(buton);
      buton.addEventListener('click', ()=>{
      changePage(i);
      });
    }
}