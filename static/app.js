const confettiColors = ['#f6a7b7', '#ffd1ab', '#d9c9ff', '#bad9bf', '#ffe58f'];
const celebrationShapes = ['♡', '✦', '★', '♥'];

const giftWords = [
    'Semoga semua doa baik untuk Dila dikabulkan satu per satu, dengan cara yang paling indah.',
    'Semoga hari-hari Dila penuh warna, tenang, dan selalu punya alasan kecil untuk tersenyum.',
    'Semoga Dila selalu dikelilingi orang yang tulus, yang menjaga bahagia dan menghargai hatinya.',
    'Semoga tahun ini membawa hal-hal baik yang selama ini Dila perjuangkan pelan-pelan.',
];

function burstConfetti(amount = 32) {
    for (let index = 0; index < amount; index += 1) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.background = confettiColors[index % confettiColors.length];
        piece.style.animationDelay = `${Math.random() * 0.45}s`;
        piece.style.rotate = `${Math.random() * 180}deg`;
        document.body.appendChild(piece);
        piece.addEventListener('animationend', () => piece.remove());
    }
}

function riseCelebration(amount = 28) {
    for (let index = 0; index < amount; index += 1) {
        const spark = document.createElement('span');
        spark.className = 'celebration-spark';
        spark.textContent = celebrationShapes[index % celebrationShapes.length];
        spark.style.left = `${8 + Math.random() * 84}vw`;
        spark.style.setProperty('--rise-x', `${(Math.random() - 0.5) * 9}rem`);
        spark.style.setProperty('--rise-rotate', `${Math.random() * 220 - 110}deg`);
        spark.style.color = confettiColors[index % confettiColors.length];
        spark.style.animationDelay = `${Math.random() * 0.35}s`;
        spark.style.fontSize = `${1.15 + Math.random() * 1.25}rem`;
        document.body.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove());
    }
}

function initBook() {
    const book = document.querySelector('[data-book]');
    const pages = [...document.querySelectorAll('[data-page]')];
    const openBook = document.querySelector('[data-open-book]');
    const inlineButtons = [...document.querySelectorAll('[data-next-inline]')];

    if (!book || !pages.length || !openBook) {
        return;
    }

    let current = 0;
    let turning = false;
    let opened = false;
    const typeTimers = new WeakMap();

    const startTypewriter = (page) => {
        const target = page.querySelector('[data-typewriter]');
        const inlineButton = page.querySelector('[data-next-inline]');

        if (!target || target.dataset.typed === 'true') {
            return;
        }

        const text = target.dataset.typewriterText || '';
        let index = 0;
        target.textContent = '';
        target.classList.remove('is-complete');

        if (inlineButton) {
            inlineButton.hidden = true;
        }

        const type = () => {
            target.textContent += text.charAt(index);
            index += 1;

            if (index < text.length) {
                typeTimers.set(target, window.setTimeout(type, 34));
                return;
            }

            target.dataset.typed = 'true';
            target.classList.add('is-complete');

            if (inlineButton) {
                inlineButton.hidden = false;
                syncControls();
            }
        };

        type();
    };

    const syncControls = () => {
        inlineButtons.forEach((button) => {
            const page = button.closest('[data-page]');
            const isActivePage = page?.classList.contains('is-active') || false;
            button.disabled = turning || !opened || !isActivePage || current === pages.length - 1;
        });
    };

    const activatePage = (index) => {
        pages.forEach((page, pageIndex) => {
            page.classList.toggle('is-active', pageIndex === index);
            page.classList.remove('is-leaving-left', 'is-leaving-right');
            page.setAttribute('aria-hidden', pageIndex === index ? 'false' : 'true');
        });

        current = index;
        syncControls();
        startTypewriter(pages[current]);
    };

    const render = (nextIndex, direction = 1) => {
        const previousPage = pages[current];
        const nextPage = pages[nextIndex];

        if (!nextPage || nextIndex === current || turning) {
            return;
        }

        if (!opened) {
            opened = true;
            book.classList.remove('is-closed');
            book.classList.add('is-open');
        }

        turning = true;
        syncControls();
        previousPage.classList.add(direction > 0 ? 'is-leaving-left' : 'is-leaving-right');
        previousPage.classList.remove('is-active');
        previousPage.setAttribute('aria-hidden', 'true');
        nextPage.setAttribute('aria-hidden', 'false');

        window.setTimeout(() => {
            previousPage.classList.remove('is-leaving-left', 'is-leaving-right');
            turning = false;
            syncControls();
        }, 430);

        nextPage.classList.add('is-active');
        nextPage.scrollTop = 0;
        current = nextIndex;

        syncControls();
        startTypewriter(nextPage);

        if (current === pages.length - 1) {
            burstConfetti(30);
        }
    };

    const goNext = () => {
        render(Math.min(current + 1, pages.length - 1), 1);
    };

    activatePage(0);
    syncControls();

    openBook.addEventListener('click', () => {
        if (opened || turning) {
            return;
        }

        opened = true;
        book.classList.remove('is-closed');
        book.classList.add('is-open');
        const musicButton = document.querySelector('[data-music-toggle]');
        if (musicButton?.getAttribute('aria-pressed') === 'false') {
            musicButton.click();
        }
        render(1, 1);
    });

    inlineButtons.forEach((button) => {
        button.addEventListener('click', goNext);
    });

    document.addEventListener('scrapbook:next', goNext);

    document.addEventListener('keydown', (event) => {
        if (!opened) {
            return;
        }

        if (event.key === 'ArrowRight') {
            goNext();
        }

    });
}

function initLetter() {
    const letter = document.querySelector('[data-letter]');
    const button = document.querySelector('[data-open-letter]');
    const textTarget = document.querySelector('[data-letter-text]');
    const nextButton = document.querySelector('.letter-page [data-next-inline]');
    let typingTimer = null;
    let typedOnce = false;

    if (!letter || !button || !textTarget) {
        return;
    }

    const originalText = textTarget.dataset.letterText || textTarget.textContent;

    const typeLetter = () => {
        if (typedOnce) {
            return;
        }

        typedOnce = true;
        textTarget.textContent = '';

        let index = 0;
        const type = () => {
            textTarget.textContent += originalText.charAt(index);
            index += 1;

            if (index < originalText.length) {
                typingTimer = window.setTimeout(type, 22);
            }
        };

        type();
    };

    button.addEventListener('click', () => {
        const open = letter.classList.toggle('is-open');
        button.textContent = open ? 'Tutup Surat' : 'Buka Surat';
        if (nextButton) {
            nextButton.hidden = !open;
            nextButton.disabled = !open;
        }

        if (open) {
            typeLetter();
        } else if (typingTimer) {
            window.clearTimeout(typingTimer);
            typingTimer = null;
        }
    });
}

function initGifts() {
    const message = document.querySelector('[data-gift-message]');
    const gifts = [...document.querySelectorAll('[data-gift-option]')];

    if (!message || !gifts.length) {
        return;
    }

    const popup = document.createElement('div');
    popup.className = 'gift-popup';
    popup.hidden = true;
    popup.innerHTML = `
        <div class="gift-popup-card" role="dialog" aria-modal="true" aria-labelledby="giftPopupTitle">
            <h3 id="giftPopupTitle">Kado Terpilih</h3>
            <p data-gift-popup-text></p>
            <button class="soft-button" type="button" data-gift-popup-close>Lanjut yuk</button>
        </div>
    `;
    document.body.appendChild(popup);

    const popupText = popup.querySelector('[data-gift-popup-text]');
    const popupClose = popup.querySelector('[data-gift-popup-close]');

    popupClose.addEventListener('click', () => {
        popup.hidden = true;
        document.dispatchEvent(new CustomEvent('scrapbook:next'));
    });

    gifts.forEach((gift) => {
        gift.addEventListener('click', () => {
            const index = Number(gift.dataset.giftOption || 0);
            gifts.forEach((item) => item.classList.remove('is-selected'));
            gift.classList.add('is-selected');
            message.textContent = giftWords[index] || giftWords[0];
            message.classList.remove('is-picked');
            void message.offsetWidth;
            message.classList.add('is-picked');
            popupText.textContent = message.textContent;
            popup.hidden = false;
            burstConfetti(18);
        });
    });
}

function createSoftSynth() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
        return null;
    }

    const context = new AudioContext();
    const master = context.createGain();
    const delay = context.createDelay();
    const feedback = context.createGain();
    const notes = [392, 440, 523.25, 587.33, 523.25, 440, 392, 329.63];
    let timer = null;
    let step = 0;

    master.gain.value = 0.035;
    delay.delayTime.value = 0.32;
    feedback.gain.value = 0.16;

    delay.connect(feedback);
    feedback.connect(delay);
    master.connect(delay);
    master.connect(context.destination);
    delay.connect(context.destination);

    const playNote = () => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = notes[step % notes.length];
        gain.gain.setValueAtTime(0.001, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.55, context.currentTime + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1.15);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start();
        oscillator.stop(context.currentTime + 1.2);
        step += 1;
    };

    return {
        async start() {
            await context.resume();
            playNote();
            timer = window.setInterval(playNote, 950);
        },
        stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        },
    };
}

function initMusic() {
    const button = document.querySelector('[data-music-toggle]');
    const label = document.querySelector('[data-music-label]');
    const audio = document.querySelector('[data-background-audio]');
    const synth = audio ? null : createSoftSynth();
    let active = false;

    if (!button || !label) {
        return;
    }

    button.addEventListener('click', async () => {
        active = !active;
        button.setAttribute('aria-pressed', String(active));
        label.textContent = active ? 'Nyala' : 'Musik';

        if (audio) {
            if (active) {
                await audio.play();
            } else {
                audio.pause();
            }

            return;
        }

        if (!synth) {
            active = false;
            button.setAttribute('aria-pressed', 'false');
            label.textContent = 'Tidak tersedia';
            return;
        }

        if (active) {
            await synth.start();
        } else {
            synth.stop();
        }
    });
}

function initCelebrate() {
    const button = document.querySelector('[data-celebrate]');

    if (!button) {
        return;
    }

    button.addEventListener('click', () => {
        burstConfetti(46);
        riseCelebration(34);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initBook();
    initLetter();
    initGifts();
    initMusic();
    initCelebrate();
});

