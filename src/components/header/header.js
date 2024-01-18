export default class Header {
    constructor(parentEl, calendar) {
        this.parentEl = parentEl;
        this.calendar = calendar;

        this.onPrevClick = this.onPrevClick.bind(this);
        this.onCurrentClick = this.onCurrentClick.bind(this);
        this.onNextClick = this.onNextClick.bind(this);
    }

    static get markup() {
        return `
        <div class="header">
            <span class="header_title">January 2024</span>
            <div class="header_btns">
                <button class="btn prev" type="button"> &lt; </button>
                <button class="btn current" type="button">Today</button>
                <button class="btn next" type="button"> &gt; </button>
            </div>
        </div>
        `
    }
    bindToDOM() {
        const header = Header.markup;
        this.parentEl.insertAdjacentHTML('beforeend', header);
        this.header = this.parentEl.querySelector('.header');

        this.addListeners();
    }
    addListeners() {
        const prevBtn = this.parentEl.querySelector('.prev');
        prevBtn.addEventListener('click', this.onPrevClick);

        const currentBtn = this.parentEl.querySelector('.current');
        currentBtn.addEventListener('click', this.onCurrentClick);

        const nextBtn = this.parentEl.querySelector('.next');
        nextBtn.addEventListener('click', this.onNextClick);
    }
    onPrevClick() {
        const title = this.calendar.prevMonth();
        if (!title) return;
        this.setTitle(title);
    }
    onCurrentClick() {
        const title = this.calendar.currentMonth();
        if (!title) return;
        this.setTitle(title);
    }
    onNextClick() {
        const title = this.calendar.nextMonth();
        if (!title) return;
        this.setTitle(title);
    }
    setTitle(title) {
        const element = this.header.querySelector('.header_title');
        element.innerText = title;
    }
}