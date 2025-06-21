 let currentsong = new Audio();
async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

function convertSecondsToMinutes(seconds) {
  // Validate input
  if (typeof seconds !== 'number' || isNaN(seconds)) {
    return "Invalid input. Please provide a number.";
  }

  // Handle negative input gracefully (convert to positive for calculation, apply sign at the end)
  const isNegative = seconds < 0;
  seconds = Math.abs(seconds);

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Zero-pad minutes and seconds to ensure two digits (e.g., 5 becomes 05)
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  // Construct the final output string
  const sign = isNegative ? "-" : "";
  return `${sign}${formattedMinutes}:${formattedSeconds}`;
}

const playMusic=(song_name,song_by,pause=false)=>
{
    // let audio = new Audio("/songs/"+song_name);
    currentsong.src = "/songs/"+song_name+" - "+song_by+".mp3";
    if(!pause)
    {
        currentsong.play();
    }
    document.querySelector(".songinfo").firstElementChild.innerHTML = song_name;
    document.querySelector(".songinfo").lastElementChild.innerHTML=" - "+song_by;
    // document.querySelector(".songtime").innerHTML = "00:00";   
    currentsong.onloadedmetadata = () => {
        document.querySelector(".songtimetotal").innerHTML = convertSecondsToMinutes(currentsong.duration);
    };

}

async function main() {
    let songs =  await getSongs();
    // console.log(songs)
    playMusic(songs[0].replaceAll("%20"," ").split("-")[0].trim(),
    songs[0].replaceAll("%20"," ").split("-")[1].split(".")[0].trim(),true)
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML += `<li class="flex justify-between px-1 mb-2 cursor-pointer">
        <div class="flex">
            <img src="music.svg" alt="music logo" class="invert-100 pr-3"/>
            <div class="info">               
                <p calss="text-sm">${song.replaceAll("%20"," ").split("-")[0]}</p>
                <p class="text-xs">${song.replaceAll("%20"," ").split("-")[1].split(".")[0]}</p>
            </div>
        </div>
        <div class="flex items-center group">
            <p class="text-xs hidden group-hover:inline pr-1">Play Now</p>
            <img src="playNow.svg" alt="play logo">
        </div>
        </li>`; 
    }
   
    //attach a event listener
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e =>{
            console.log(e.currentTarget.querySelector(".info").firstElementChild.innerHTML)
            play.src="pause.svg"
            playMusic(e.currentTarget.querySelector(".info").firstElementChild.innerHTML.trim() ,e.currentTarget.querySelector(".info").lastElementChild.innerHTML.trim());
        })
    });

    //Attach an event listner to play, next and pervious
    play.addEventListener("click",()=>
    {
        if(currentsong.paused)
        {
            currentsong.play();
            play.src="pause.svg"
            
        }
        else
        {
            currentsong.pause();
            play.src="play.svg"
        }
    })

    // Time update
    currentsong.addEventListener("timeupdate",()=>{
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML= 
        `${convertSecondsToMinutes(currentsong.currentTime)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100+"%";
      })

      //Add an event listner to scrollbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>
    {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent)/100;
    })
}



main();