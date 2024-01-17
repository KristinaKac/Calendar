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

        this.currentObjectDay = this.cells.find(object => this.isCurrentDay(object));

        if (this.currentObjectDay) {
            this.addClass(this.currentObjectDay, 'current_day');
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

    isCurrentDay(object) {
        return moment().isSame(object.date, 'day');
    }
    addClass(object, addClass) {
        const element = document.getElementById(object.id);
        element.classList.add(addClass);
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