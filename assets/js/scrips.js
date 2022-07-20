$(function(){
    const immutableToday = moment();
    let today = moment();

    function generateView() {
        // Header date display
        $("#time-display").text(immutableToday.format("dddd, MMMM Do YYYY"));
        $("#day-picked").text(today.format('LL'));
        // Date var for local storage
        let date = moment($('#dayPicked').text()).format('L');

       // let loose the blocks of time:

        for(let i = 0; i < 24; i++){
            $("#time-blocks").append(
                `<div class='col-md-12 pb-2 mb-2 timeBlock' data-block='${i}'>
                    <form class='form-inline m-2 p-2'>

                        <div class='col-xs-12 col-md-2'>
                            <label for='inlineFormInputName2'>
                                <h3 class='mt-2 p-1'>Hour: ${i < 10 ? '0' + i : i}</h3>
                            </label>
                        </div>

                        <div class='col-xs-12 col-md-8'>
                            <input type='text' class='form-control' data-hour='${i}' style='width:100%;'placeholder='Eat, sleep, code' minlength='2' maxlength='50'></input>
                        </div>

                        <div class='col-xs-12 col-md-2 pt-1'>
                            <button type='button' class='btn btn-primary create' data-hour='${i}'>Create</button>
                        </div>
                    </form>

                    <div class='row p-1 todos' data-hour='${i}'></div>
                </div>`
            );   
        }
    
        if(localStorage.getItem(date)){
            refreshItems()
        }else{
            colorBlocks()
        }
    }

    function addActivity() {
        let date = moment($('#day-picked').text()).locale('fr').format('L');
        let saved = localStorage.getItem(date) ? JSON.parse(localStorage.getItem(date)) : [];
        let buttonVal = $(this).attr("data-hour");
        let inputVal = $(`input[data-hour=${buttonVal}]`);

        let savedElement = saved.filter(hour => hour.time == buttonVal);
        if(!saved.length || !saved.includes(savedElement[0])){
            saved.push({"time": inputVal.attr("data-hour"), "activity" : [inputVal.val()]});
            displayItem(buttonVal, inputVal.val())
        }

        localStorage.setItem(date, JSON.stringify(saved));
        inputVal.val('')
    }

    function colorBlocks(){
        let date = moment($('#day-picked').text()).locale('fr').format('L');
        let currentHour = moment().hour();
        let colorCode = 'rgba(255, 0, 0, 0.8);';
        
        $('.time-blocks').each(function(){
            if(moment(date).isBefore(moment(immutableToday).locale('fr').format('L'))){
            }else if(moment(date).isAfter(moment(immutableToday).locale('fr').format('L'))){
                colorCode = 'rgba(0,128,0, 0.8);';
            }else{
                if($(this).attr('data-block') == currentHour){
                    colorCode = 'rgba(255,255,0, 0.8);';
                }
                if($(this).attr('data-block') > currentHour){
                    colorCode = 'rgba(0,128,0, 0.8);';
                }
            }
            $(this).attr('style', `background-color:${colorCode};`)
        })
    }
    
    function displayItem(btn, val){
        $(`div[data-hour=${btn}]`).append(

            `<div class='col-xs-12 col-md-2 mt-2'>
                <div class='card'> 
                    <div class='card-body'>
                        <p>${val}</p>
                        <button type='button' class='btn btn-danger delete' data-hour='${btn}' data-value='${val}'>Delete</button>
                    </div>
                </div>
            </div>`
        );
        $(`button[data-value='${val}']`).on("click", removeActivity);
    }

    function refreshItems(){
        let date = moment($('#day-picked').text()).locale('fr').format('L');
        let saved = JSON.parse(localStorage.getItem(date));
        $(".todos").html('')
        // NO TYPEERRORS PLEASE AND THANK YOU
        if(saved){
            saved.forEach(hour => {
                hour.activity.forEach(activity => {
                    displayItem(hour.time, activity)
                })  
            })
        }
        colorBlocks()  
    }

    function removeActivity(){
        let date = moment($('#day-picked').text()).locale('fr').format('L');
        let saved = JSON.parse(localStorage.getItem(date));
        let buttonHour = $(this).attr("data-hour");
        let buttonValue = $(this).attr("data-value");

        saved.forEach((hour, i) => {
            if(hour.time == buttonHour) { 
                let index = hour.activity.findIndex(el => el === buttonValue);
                hour.activity.splice(index, 1);
                if(hour.activity.length === 0){
                    saved.splice(i, 1)
                }
            }
        });
       
        localStorage.setItem(date, JSON.stringify(saved));
        refreshItems()
    }

    // Begins running through it:

    generateView()

    $(".create").on("click", addActivity)
})

/*
    WHEN I view the timeblocks for that day, then each timeblock is color coded to indicate whether it is in the past, present, or future.

    WHEN I click into a timeblock, then I can enter an event.

    WHEN I click the save button for that timeblock, then the text for that event is saved in local storage.

    WHEN I refresh the page, then the saved events persist
*/

// Make a JS function that creates 24 List Groups with Bootstrap functionalities.
// Passed hours are greyed out.
// the current hour is colored differently than others.
// The user is able to update their schedule by clicking on an hour and typing.
