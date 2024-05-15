function calculate() {

	let dateFrom = input.get('start_date').date().raw();
	let dateTo = input.get('end_date').date().gt('start_date').raw();

	if (!input.valid()) return;

	const seconds = (dateTo.getTime() - dateFrom.getTime()) / 1000;

	let results = [];

	const minutes = seconds / 60;
	const hours = minutes / 60;
	const days = Math.trunc(hours / 24);

	results.unshift(plural(days, 'days:day:days:days:days:days'));

	const holidays = getUserHolidays();

	const {weekdays, weekends, holidayCount} = countBusinessAndweekends(dateFrom, dateTo, holidays);
	results.push(plural(weekdays, 'work days:work day:work days:work days:work days:work days'));
	results.push(plural(weekends, 'weekend days:weekend day:weekend days:weekend days:weekend days:weekend days'));
	if(holidayCount) results.push(plural(holidayCount, 'holiday days:holiday day:holiday days:holiday days:holiday days:holiday days'));

	$('.result-age__text').innerHTML = '<div class="result-text">' + results.join('</div><div class="result-text"> ') + '</div>';

	generateCalendar(dateFrom);
	generateCalendar(dateTo, 'result-age--to');
}

function generateCalendar(date, calendar = 'result-age--from') {
	const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	const daysInMonthPrev = new Date(date.getFullYear(), date.getMonth(), 0).getDate();

	const isStartCalendar = calendar === 'result-age--from' || calendar === 'result-age--from-two';
	const isEndCalendar = calendar === 'result-age--to' || calendar === 'result-age--to-two';

	if (!firstDay) firstDay = 7;

	let activeClass = 'current';

	const $days = $$(`.${calendar} .result-age--days p`);

	let i = 0;
	while (i <= $days.length) {
		if ($days[i]) {
			$days[i].innerHTML = '';
			$days[i].classList.remove('current', 'current-between', 'active', 'after-date', 'before-date');
		}
		let day = i - firstDay + 1;
		const $current_month_day = $days[i - 1];

		/*Current month*/
		if (i >= firstDay && i < daysInMonth + firstDay) {
			$current_month_day.innerHTML = day;
			$current_month_day.classList.add('active');
			if (day === date.getDate()) $current_month_day.classList.add(activeClass);

			if (day < date.getDate() && isEndCalendar ||
				day > date.getDate() && isStartCalendar) {
				$current_month_day.classList.add('current-between');
			}
		} else if (i < firstDay - 1) {
			/*Prev month*/
			if ($days[i]) $days[i].innerHTML = daysInMonthPrev - firstDay + i + 2;
			if (calendar === 'result-age--to') {
				$days[i].classList.add('current-between');
			}
		} else if (i >= firstDay) {
			/*Next month*/
			$current_month_day.innerHTML = i - daysInMonth - firstDay + 1;
			if (calendar === 'result-age--from') {
				$current_month_day.classList.add('current-between');
			}
		}
		i++;
	}

	$(`.${calendar} .date-title--date`).innerHTML = convertDateToDMY(date);
}

function convertDateToDMY(date) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	const day = date.getDate();
	const monthIndex = date.getMonth();
	const year = date.getFullYear();

	return `${day} ${months[monthIndex]} ${year}`;
}

function setCommas(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getUserHolidays() {
	const count_holidays = input.get('count_holidays').checked().raw();
	if (!count_holidays) return [];
	const holidayKeys = 'abcdefghijklmnopqrstuvwxyz';
	const holidays = [];

	/*We need to validate only if month and day are filled*/
	holidayKeys.split('').map(key => {
		if (_('count_month_' + key) !== null) {
			let month = input.get('count_month_' + key).raw();
			let day = input.get('count_day_' + key).raw();
			if (parseInt(month) && parseInt(day)) holidays.push(month + '.' + day)
		}
	});

	const default_holidays = {
		'new_years_day': '1.1',
		'juneteenth_day': '6.19',
		'independence_day': '7.4',
		'veterans_day': '11.11',
		'christmas_day': '12.25',
	}

	for (const [key, value] of Object.entries(default_holidays)) {
		if (input.get(key).checked().raw()) {
			holidays.push(value);
		}
	}

	return holidays;
}

function countBusinessAndweekends(startDate, endDate, holidays) {
	// Convert the start and end dates to Date objects
	startDate = new Date(startDate);
	endDate = new Date(endDate);

	// Initialize counters for business days and weekend days
	let weekdays = 0;
	let weekends = 0;
	let holidayCount = 0;

	// Iterate through each day from the start date to the end date
	while (startDate < endDate) {
		// Check if the current day is a weekend day (0 for Sunday, 6 for Saturday)
		const dayOfWeek = startDate.getDay();
		const dateString = (startDate.getMonth() + 1) + '.' + startDate.getDate();
		if (dayOfWeek === 0 || dayOfWeek === 6) {
			weekends++;
		} else {
			weekdays++;
		}

		// Check if the current day is a holiday
		if (holidays.includes(dateString)) {
			weekdays--; // Subtract a business day if it's a holiday
			holidayCount++;
		}

		// Move to the next day
		startDate.setDate(startDate.getDate() + 1);
	}

	// If the end date is a weekend day, decrement the respective count
	if (endDate.getDay() === 0 || endDate.getDay() === 6) {
		weekends--;
	} else {
		weekdays--;
	}

	// Return the counts
	return {weekdays, weekends, holidayCount};
}

function convert() {
	let startDate = input.get('start_date_two').date().raw();
	let years = input.get('years').optional().positive().val();
	let months = input.get('months').optional().positive().val();
	let weeks = input.get('weeks').optional().positive().val();
	let days = input.get('days').optional().positive().val();
	let action = input.get('add_subtract').raw();

	if (!input.valid()) return;

	const isAdd = action === 'add';

	let endDate = new Date(startDate);

	if(isAdd) {
		if (years) endDate.setFullYear(endDate.getFullYear() + years);
		if (months) endDate.setMonth(endDate.getMonth() + months);
		if (weeks) endDate.setDate(endDate.getDate() + weeks * 7);
		if (days) endDate.setDate(endDate.getDate() + days);
	} else {
		if (years) endDate.setFullYear(endDate.getFullYear() - years);
		if (months) endDate.setMonth(endDate.getMonth() - months);
		if (weeks) endDate.setDate(endDate.getDate() - weeks * 7);
		if (days) endDate.setDate(endDate.getDate() - days);
	}

	generateCalendar(startDate, 'result-age--from-two');
	generateCalendar(endDate, 'result-age--to-two');
}