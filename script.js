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
async function main() {
    let songs =  await getSongs();
    console.log(songs)

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songul.innerHTML += `<li class="flex justify-between px-1 mb-2 cursor-pointer">
        <div class="flex">
            <img src="music.svg" alt="music logo" class="invert-100 pr-3"/>
            <div>               
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

    // //play the audio
    // var audio = new Audio(songs[0]);
    // // audio.play();

    // audio.addEventListener("",()=>
    // {
    //     let duration = audio.duration;
    //     console.log(duration);
    // })
}

main();