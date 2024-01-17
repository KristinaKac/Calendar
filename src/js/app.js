import Calendar from "../components/calendar/calendar";
import Header from '../components/header/header';

const container = document.querySelector('.container');
const calendar = new Calendar(container);
const header = new Header(container, calendar);
header.bindToDOM();
calendar.bindToDOM();


