const enableSound = document.getElementById("enableSound");
let soundEnabled = false;
const volumeSlider = document.getElementById('volume-slider');
const volumeSliderResult = document.getElementById('volume-slider-result');
const volumeIcon = document.getElementById('volume-icon');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ============ 音声管理 ============

function playTone(frequency, duration) {
    return new Promise(resolve => {
        // メインの音
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = "triangle";
        oscillator.frequency.value = frequency; // 周波数を設定

        const now = audioCtx.currentTime;
        const durationSec = duration / 1000;

        // メインの音
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.setValueAtTime(0.5, now + 0.02);
        gainNode.gain.setValueAtTime(0, now + durationSec);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // 再生
        oscillator.start(now);
        oscillator.stop(now + durationSec);

        oscillator.addEventListener("ended", () => {
            resolve();
        });
    });
}

// 休符
function rest(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

async function play() {
    await rest(200);

    await playTone(391.995, 200);
    await rest(50);
    await playTone(329.628, 500);
    await rest(250);

    await playTone(391.995, 200);
    await rest(50);
    await playTone(329.628, 500);
}

// ============ 画面管理 ============

function updateSoundUI() {
    const value = Number(volumeSlider.value);

    volumeSliderResult.textContent = value + "%";

    if (value === 0) {
        volumeIcon.textContent = "🔇";
    }

    else if (value <= 30) {
        volumeIcon.textContent = "🔈";
    }

    else if (value <= 70) {
        volumeIcon.textContent = "🔉"
    }

    else {
        volumeIcon.textContent = "🔊"
    }

    if (soundEnabled) {
        enableSound.textContent = "Sound:OFF";
    }
    else {
        enableSound.textContent = "Sound:ON";
    }

    updateSlider(volumeSlider);
}

enableSound.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        volumeSlider.value = '50';
    } else {
        volumeSlider.value = '0';
    }
    updateSoundUI();
});

volumeSlider.addEventListener("input", () => {   
    updateSoundUI();
});

// スライダーの装飾
document.addEventListener('DOMContentLoaded', () => {

    const rangeSliders = document.querySelectorAll('input[type="range"]');

    // 取得したスライダーの各要素に対して実行
    rangeSliders.forEach((slider) => {
        slider.addEventListener('input', (e) => {
            updateSlider(e.target);
        });

        updateSlider(slider);
    });
});

function updateSlider(slider) {
    if (!slider.max) {
        slider.max = 100;
    }
    const progress = (slider.value / slider.max) * 100;

    // Traceの元の色
    const baseColor = '#fff';
    // Traceの左側の色
    const activeColor = '#525252';

    slider.style.background = `linear-gradient(to right, ${activeColor} ${progress}%, ${baseColor} ${progress}%)`;
}

function playSound() {
    if (soundEnabled) {
        play();
    }
}

const clock = () => {
    // 現在の日時・時刻の情報を取得
    const d = new Date();

    // 年を取得
    let year = d.getFullYear();
    // 月を取得
    let month = d.getMonth() + 1;
    // 日を取得
    let date = d.getDate();
    // 曜日を取得
    let dayNum = d.getDay();
    const weekday = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    let day = weekday[dayNum];
    // 時を取得
    let hour = d.getHours();
    // 分を取得
    let min = d.getMinutes();
    // 秒を取得
    let sec = d.getSeconds();
    if ((min === 0 || min === 30) && sec === 0) {
        if (soundEnabled) {
            playSound();
        }
    }

    // 1桁の場合は0を足して2桁にする
    month = month < 10 ? "0" + month : month;
    date = date < 10 ? "0" + date : date;
    hour = hour < 10 ? "0" + hour : hour;
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    // 日付・時刻の文字列を作成
    let today = `${year}-${month}-${date}`;
    let time = `${hour}:${min}:${sec}`;

    // 文字列を出力
    document.querySelector(".clock-date").innerText = today;
    document.querySelector(".clock-time").innerText = time;
    document.querySelector(".clock-day").innerText = day;
};

// 1秒ごとにclock関数を呼び出す
clock();
setInterval(clock, 1000);