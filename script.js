let currentsong = new Audio();
let currfolder;
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`${currfolder}/info.json`);
    let response = await a.json();
    let as = response.songs;
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        songs.push(as[index].split(".mp3")[0])
    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML += `<li class="flex justify-between px-1 mb-2 cursor-pointer">
        <div class="flex">
            <img src="svgs/music.svg" alt="music logo" class="invert-100 pr-3"/>
            <div class="info">               
                <p calss="text-sm">${song.replaceAll("%20", " ").split("-")[0]}</p>
                <p class="text-xs">${song.replaceAll("%20", " ").split("-")[1]}</p>
            </div>
        </div>
        <div class="flex items-center group">
            <p class="text-xs hidden group-hover:inline pr-1">Play Now</p>
            <img src="svgs/playNow.svg" alt="play logo">
        </div>
        </li>`;
    }


    //attach a event listener
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            play.src = "svgs/pause.svg"
            playMusic(currfolder, e.currentTarget.querySelector(".info").firstElementChild.innerHTML.trim(), e.currentTarget.querySelector(".info").lastElementChild.innerHTML.trim());
        })
    });
    return songs;

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

const playMusic = (folder, song_name, song_by, pause = false) => {
    // let audio = new Audio("/songs/"+song_name);
    currentsong.src = `${folder}/${song_name} - ${song_by}.mp3`;
    if (!pause) {
        currentsong.play();
    }
    document.querySelector(".songinfo").firstElementChild.innerHTML = `${song_name}`;
    document.querySelector(".songinfo").lastElementChild.innerHTML = `- ${song_by}`;
    // document.querySelector(".songtime").innerHTML = "00:00";   
    currentsong.onloadedmetadata = () => {
        document.querySelector(".songtimetotal").innerHTML = convertSecondsToMinutes(currentsong.duration);
    };

}

async function displayAlbums() {
    let a = await fetch(`songs/albums.json`);
    let response = await a.json();
    let array =Array.from(response);
    for(let index=0; index < array.length;index++)
    {
        const e = array[index];
        let folder = e.folders;
        let a = await fetch(`songs/${folder}/info.json`);
        let response = await a.json();
        let cardContainer= document.querySelector(".cardcontainer")
        cardContainer.innerHTML += `
                <div data-folder=${folder}
                    class="card md:w-52 w-32 md:px-5 px-3 py-3 bg-gray-900 mt-5 mr-2 rounded-lg relative group">
                    <div
                        class="absolute w-min top-3 opacity-0 right-7 transform transition-all duration-300 delay-100 group-hover:opacity-100 group-hover:translate-y-32">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                            <circle cx="12" cy="12" r="12" fill="#58D68D" />
                            <path
                                d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                fill="#000000" transform="translate(12, 12) scale(0.7) translate(-12, -12)" />
                        </svg>
                    </div>
                    <img src="songs/${folder}/${e.cover}" alt="photo"
                        class="w-full h-40 object-contain object-center rounded-lg">
                    <h2 class="font-semibold md:text-lg pt-2 pb-1 text-sm">${response.title}</h2>
                    <p class="text-xs">${response.description}</p>
                </div>`
    }
}

async function main() {
    currfolder = "songs/cs/";
    let songs = await getSongs(currfolder);
    // console.log(songs)
    playMusic(currfolder, songs[0].replaceAll("%20", " ").split("-")[0].trim(),
        songs[0].replaceAll("%20", " ").split("-")[1].trim(), true)

    //Display all the albums on the page
    await displayAlbums();

    //Attach an event listner to play, next and pervious
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "svgs/pause.svg"

        }
        else {
            currentsong.pause();
            play.src = "svgs/play.svg"
        }
    })

    // Time update
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML =
            `${convertSecondsToMinutes(currentsong.currentTime)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    //Add an event listner to scrollbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    //Add an event listner to pervious
    previous.addEventListener("click", () => {
        let playingsong =decodeURIComponent(currentsong.src.split("/").pop().split(".")[0])
        let index = songs.indexOf(playingsong);
        let newIndex = index == 0 ? songs.length - 1 : index - 1;
        playMusic(currfolder,songs[newIndex].split("-")[0].trim(),songs[newIndex].split("-")[1].trim());
        play.src = "svgs/pause.svg"
    })

    //add an event listner to next
    next.addEventListener("click", () => {
        let playingsong =  decodeURIComponent(currentsong.src.split("/").pop().split(".")[0])
        let index = songs.indexOf(playingsong);
        let newIndex = index == songs.length-1? index=0 : index+1;
        playMusic(currfolder,songs[newIndex].split("-")[0].trim(),songs[newIndex].split("-")[1].trim());
        play.src = "svgs/pause.svg"
    })


    //volume slider
    document.querySelector(".volicon").addEventListener("click", () => {
        document.querySelector(".vol").classList.toggle("hidden")
    })

    document.querySelector(".volicon").addEventListener("dblclick",()=>
    {
        if(document.querySelector(".volicon").src.includes("volume.svg"))
        {
            document.querySelector(".volicon").src="svgs/mute.svg"
            currentsong.volume=0;
            document.querySelector(".volume-slider").value = currentsong.volume * 100;
        }
        else
        {
            document.querySelector(".volicon").src="svgs/volume.svg"
            currentsong.volume=0.50;
            document.querySelector(".volume-slider").value = currentsong.volume * 100;
        }
    })

    //vol slider
    document.querySelector(".volume-slider").addEventListener("input", (e) => {
        const volume = parseInt(e.target.value) / 100;
        currentsong.volume = volume;
        document.querySelector(".volume-slider").value = currentsong.volume * 100;
    })

    //pull the folder
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            currfolder = `songs/${item.currentTarget.dataset.folder}/`
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(currfolder, songs[0].replaceAll("%20", " ").split("-")[0].trim(),
                songs[0].replaceAll("%20", " ").split("-")[1].split(".")[0].trim(), true);
            play.src = "svgs/play.svg";
        })
    })
}


hamburger.addEventListener("click", () => {
    let leftPannel = document.querySelector(".left");
    leftPannel.classList.toggle("-left-[100%]");
    leftPannel.classList.toggle("left-0");
    leftPannel.classList.toggle("z-10");
    leftPannel.classList.toggle("bg-black")

})
hamburgeraftershow.addEventListener("click", () => {
    let leftPannel = document.querySelector(".left");
    leftPannel.classList.toggle("-left-[100%]");
    leftPannel.classList.toggle("left-0");
    leftPannel.classList.toggle("z-10");
    leftPannel.classList.toggle("bg-black")
})
main();