let container = document.querySelector(".container"),

    mainVideo = container.querySelector("video"),

    videoTimeline = container.querySelector(".video-timeline"),

    progressBar = container.querySelector(".progress-bar"),

    volumeButton = container.querySelector(".volume i"),

    volumeSlider = container.querySelector(".left input"),

    currentVideoTime = container.querySelector(".current-time"),

    videoDuration = container.querySelector(".video-duration"),

    skipBackward = container.querySelector(".skip-backward i"),

    skipForward = container.querySelector(".skip-forward i"),

    playPauseButton = container.querySelector(".play-pause i"),

    speedButton = container.querySelector(".playback-speed span"),

    speedOptions = container.querySelector(".speed-options"),

    picInPicButton = container.querySelector(".pic-in-pic span"),

    fullScreenButton = container.querySelector(".fullscreen i");

let timer;

let hideControls = () => {

    //If Video Is Paused return

    if (mainVideo.paused) return;

    timer = setTimeout(() => {

        container.classList.remove("show-controls");

    }, 3000);

};

hideControls();

container.addEventListener("mousemove", () => {

    //Add show-controls class On mousemove

    container.classList.add("show-controls");

    //Clear Timer

    clearTimeout(timer);

    //Calling hideControls() function

    hideControls();

});

let formatTime = time => {

    //Getting Seconds, Minutes And Hours

    let seconds = Math.floor(time % 60),

        minutes = Math.floor(time / 60) % 60,

        hours = Math.floor(time / 3600);

    //Adding 0 At The Beginning If The Particular Value Is Less Than 10

    seconds = seconds < 10 ? `0${seconds}` : seconds;

    minutes = minutes < 10 ? `0${minutes}` : minutes;

    hours = hours < 10 ? `0${hours}` : hours;

    //If Hours Is Equal To 0 Return Minutes And Seconds Only Else Return All

    if (hours == 0) {

        return `${minutes}: ${seconds}`;

    };

    return `${hours}:${minutes}: ${seconds}`;

};

mainVideo.addEventListener("timeupdate", e => {

    //Geting The Current Time And Duration Of The Video

    let { currentTime, duration } = e.target;

    //Getting The Percent

    let percent = (currentTime / duration) * 100;

    //Passing percent As progressBar width

    progressBar.style.width = `${percent}%`;

    currentVideoTime.innerText = formatTime(currentTime);

});

mainVideo.addEventListener("loadeddata", e => {

    //Passing Video Duration As videoDuration innerText

    videoDuration.innerText = formatTime(e.target.duration);

});

videoTimeline.addEventListener("click", e => {

    //Getting The Video Timeline Width

    let timelineWidth = videoTimeline.clientWidth;

    //Updating The Video Current Time

    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;

});

let draggableProgressBar = e => {

    //Getting The Video Timeline Width

    let timelineWidth = videoTimeline.clientWidth;

    //Passing offsetX Value As progressBar Width

    progressBar.style.width = `${e.offsetX}px`;

    //Updating The Video Current Time

    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;

    //Passing Video Current Time As currentVideoTime innerText

    currentVideoTime.innerText = formatTime(mainVideo.currentTime);

};

videoTimeline.addEventListener("mousedown", () => {

    //Calling draggableProgressBar Function On mousemove Event

    videoTimeline.addEventListener("mousemove", draggableProgressBar);

});

//Removing mousemove EventListener On mouseup Event

container.addEventListener("mouseup", () => {

    videoTimeline.removeEventListener("mousemove", draggableProgressBar);

});

videoTimeline.addEventListener("mousemove", e => {

    let progressTime = videoTimeline.querySelector("span");

    //Getting The MouseX Position

    let offsetX = e.offsetX;

    //Passing offset Value As progressTime left Value

    progressTime.style.left = `${offsetX}px`;

    //Getting The Video Timeline Width

    let timelineWidth = videoTimeline.clientWidth;

    //Getting percent

    let percent = (e.offsetX / timelineWidth) * mainVideo.duration;

    //Passing percent As progressTime innerText

    progressTime.innerText = formatTime(percent);

});

volumeButton.addEventListener("click", () => {

    //If Volume Icon Isn't Volume High Icon

    if (!volumeButton.classList.contains("fa-volume-high")) {

        //Passing 0.5 Value As Video Volume

        mainVideo.volume = 0.5;

        volumeButton.classList.replace("fa-volume-xmark", "fa-volume-high");

    } else {

        //Passing 0.0 Value As Video Volume, So That The Video Will Be Mute

        mainVideo.volume = 0.0;

        volumeButton.classList.replace("fa-volume-high", "fa-volume-xmark");

    };

    //Update Slider Value According To The Video Volume

    volumeSlider.value = mainVideo.volume;

});

volumeSlider.addEventListener("input", e => {

    //Passing The Slider Value As Video Volume

    mainVideo.volume = e.target.value;

    //If Slider Value is 0, Change The Icon To Mute Icon

    if (e.target.value == 0) {

        volumeButton.classList.replace("fa-volume-high", "fa-volume-xmark");

    } else {

        volumeButton.classList.replace("fa-volume-xmark", "fa-volume-high");

    };

});

skipBackward.addEventListener("click", () => {

    //Subtracting 5 Seconds From The Current Video Time

    mainVideo.currentTime -= 5;

});

skipForward.addEventListener("click", () => {

    //Adding 5 Seconds To The Current Video Time

    mainVideo.currentTime += 5;

});

playPauseButton.addEventListener("click", () => {

    //If Video Is Paused, Play The Video Else Pause The Video

    mainVideo.paused ? mainVideo.play() : mainVideo.pause();

});

speedButton.addEventListener("click", () => {

    //Toggle Show Class

    speedOptions.classList.toggle("show");

});

speedOptions.querySelectorAll("li").forEach(option => {

    //Adding The Click Event On All Speed Options

    option.addEventListener("click", () => {

        //Passing option dataset Value As Video PLayback Value

        mainVideo.playbackRate = option.dataset.speed;

        //Removing The active Class

        speedOptions.querySelector(".active").classList.remove("active");

        //Adding The active Class On The Selected Option

        option.classList.add("active");

    });

});

picInPicButton.addEventListener("click", () => {

    //Changing The Video Mode In Picture In Picture

    mainVideo.requestPictureInPicture();

});

fullScreenButton.addEventListener("click", () => {

    container.classList.toggle("fullscreen");

    //If Video Is Already In Full Screen Mode

    if (document.fullscreenElement) {

        fullScreenButton.classList.replace("fa-compress", "fa-expand");

        //Exit From Full Screen Mode And Return

        return document.exitFullscreen();

    };

    fullScreenButton.classList.replace("fa-expand", "fa-compress");

    //Go To Full Screen Mode

    container.requestFullscreen();

});

//Hide Speed Options On Document Link

document.addEventListener("click", e => {

    if (e.target.tagName !== "SPAN" || e.target.className !== "material-symbols-rounded") {

        speedOptions.classList.remove("show");

    };

});

mainVideo.addEventListener("play", () => {

    //If Video Is Play, Change The Icon To Pause

    playPauseButton.classList.replace("fa-play", "fa-pause");

});

mainVideo.addEventListener("pause", () => {

    //If Video Is Pause, Change The Icon To Play

    playPauseButton.classList.replace("fa-pause", "fa-play");

});
