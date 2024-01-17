import moment from "moment";

export default class Calendar {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.totalDays = [...Array(42)];
        this.cells = [];

        moment.updateLocale('en', { week: { dow: 1 } });
        this.startDay = moment().startOf('month').startOf('week');
        this.day = this.startDay.clone().subtract(1, 'day');
        this.current = moment();
        this.currentDay = moment();

        this.prevSelectDate;

        this.onCellClick = this.onCellClick.bind(this);
        this.onMouseover = this.onMouseover.bind(this);
        this.onMouseout = this.onMouseout.bind(this);

    }
    static get markupCalendar() {
        return `
        <div class="calendar_wrapper">
            <div class="calendar">
            </div>
        </div>
        `
    }
    markupCell(day, id) {
        const div = document.createElement('div');
        div.className = 'calendar_cell';
        div.id = id;
        div.innerText = day;
        return div;
    }

    bindToDOM() {
        const calendar = Calendar.markupCalendar;
        this.parentEl.insertAdjacentHTML('beforeend', calendar);
        this.calendar = this.parentEl.querySelector('.calendar');

        this.fillCells();

        this.cells.forEach(object => this.isWeekend(object));
        this.cells.forEach(object => this.isInvalidDay(object));

        this.currentObjectDay = this.cells.find(object => this.isCurrentDay(object));

        if (this.currentObjectDay) {
            this.addClass(this.currentObjectDay, 'current_day');
        }

        const dayElements = this.calendar.querySelectorAll('.calendar_cell');
        dayElements.forEach(day => day.addEventListener('click', this.onCellClick));
        dayElements.forEach(day => day.addEventListener('mouseover', this.onMouseover));
        dayElements.forEach(day => day.addEventListener('mouseout', this.onMouseout));

    }

    onMouseover(e) {
        e.preventDefault();

        const dayHtmlElement = e.target;

        const hoverObj = this.cells.find(object => object.id == dayHtmlElement.id);

        const hoverDay = hoverObj.date;

        this.addClass(hoverObj, 'hover_day');

        if (this.prevSelectDate) {
            this.cells.forEach(obj => {
                if(obj.date.isAfter(this.prevSelectDate, 'day') && obj.date.isBefore(hoverDay, 'day')){
                    this.addClass(obj, 'hover_day');
                }
            });
        }
    }
    onMouseout() {
        this.cells.forEach(obj => this.removeClass(obj, 'hover_day'));
    }

    onCellClick(e) {
        e.preventDefault();

        const dayHtmlElement = e.target;

        const selectObj = this.cells.find(object => object.id == dayHtmlElement.id);
        const selectDay = selectObj.date;

        if (this.prevSelectDate) {
            if (selectDay.isAfter(this.prevSelectDate, 'day') || selectDay.isSame(this.prevSelectDate, 'day')) {
                this.addClass(selectObj, 'select_day');

                this.cells.forEach(obj => {
                    if (obj.date.isAfter(this.prevSelectDate, 'day') && obj.date.isBefore(selectDay, 'day')) {
                        this.addClass(obj, 'mediate_day');
                    }
                });

                console.log('ok, выбрана вторая дата');
                this.prevSelectDate = undefined;
            } else {
                console.log('ошибка, нельзя выбрать дату раньше, чем туда');
                this.cells.forEach(obj => this.removeClass(obj, 'select_day'));
                this.cells.forEach(obj => this.removeClass(obj, 'mediate_day'));
                this.prevSelectDate = undefined;
            }
        } else {
            if (selectDay.isAfter(this.currentDay, 'day') || selectDay.isSame(this.currentDay, 'day')) {
                this.cells.forEach(obj => this.removeClass(obj, 'select_day'));
                this.cells.forEach(obj => this.removeClass(obj, 'mediate_day'));
                this.addClass(selectObj, 'select_day');
                console.log('ok, выбрана первая дата');
                this.prevSelectDate = selectDay;
            } else {
                console.log('ошибка, нельзя выбрать дату раньше сегодняшнего дня');
                this.cells.forEach(obj => this.removeClass(obj, 'select_day'));
                this.cells.forEach(obj => this.removeClass(obj, 'mediate_day'));
                this.prevSelectDate = undefined;
            }
        }

    }

    updateTotalDays() {
        this.totalDays = this.totalDays.map(() => this.day.add(1, 'day').clone());
    }

    fillCells() {
        this.updateTotalDays();

        this.totalDays.forEach(date => {
            const id = date.unix();

            this.calendar.appendChild(this.markupCell(date.format('D'), id))

            this.cells.push({
                id,
                cell: this.markupCell(date.format('D'), id),
                date: date
            });
        });
    }

    isWeekend(object) {
        if (object.date.day() === 0 || object.date.day() === 6) {
            this.addClass(object, 'weekend');
        }
    }
    isInvalidDay(object) {
        if (object.date.isBefore(this.currentDay, 'day')) {
            this.addClass(object, 'invalid_day');
        }
    }

    isCurrentDay(object) {
        return moment().isSame(object.date, 'day');
    }
    addClass(object, addClass) {
        const element = document.getElementById(object.id);
        element.classList.add(addClass);
    }
    removeClass(object, removeClass) {
        const element = document.getElementById(object.id);
        element.classList.remove(removeClass);
    }
    prevMonth() {
        this.current = this.current.clone().subtract(1, 'month');

        this.startDay = this.current.clone().startOf('month').startOf('week');
        this.day = this.startDay.clone().subtract(1, 'day');

        this.removeMonth();

        this.bindToDOM();

        return this.current.format('MMMM YYYY');
    }

    nextMonth() {
        this.current = this.current.clone().add(1, 'month');

        this.startDay = this.current.clone().startOf('month').startOf('week');
        this.day = this.startDay.clone().subtract(1, 'day');

        this.removeMonth();

        this.bindToDOM();

        return this.current.format('MMMM YYYY');
    }

    currentMonth() {
        this.current = moment();

        this.startDay = this.current.clone().startOf('month').startOf('week');
        this.day = this.startDay.clone().subtract(1, 'day');

        this.removeMonth();

        this.bindToDOM();

        return this.current.format('MMMM YYYY');
    }

    removeMonth() {
        const wrapper = document.querySelector('.calendar_wrapper');
        wrapper.remove();
        this.cells = [];
    }

}