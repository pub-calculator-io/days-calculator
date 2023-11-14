class addFields {
	constructor(type = 'count') {
		this.type = type;
		this.letters = 'abcdefghijklmnopqrstuvwxyz';
		this.key = 0;
		this.holidays = [];
		this.appendTo = $(`#option_${this.type}_holidays > .calculator-content-body`);
		this.days = Array.from({length: 31}, (_, i) => i + 1);
		this.months = Array.from({length: 12}, (_, i) => i + 1);
		this.monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
			'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		this.addField();
	}

	addField() {
		const letter = this.letters[this.key];
		this.holidays.push(letter);
		const disabled = _(`${this.type}_holidays`).checked ? '' : 'disabled';
		const holiday = `
		<div class="related-to-${this.type}_holidays input-wrapper input-wrapper--holidays row ${this.type}_holiday_row ${disabled}"  
				id="${this.type}_field_${letter}">
			<label class="input col">
				<div class="input-field row">
					<input type="text" class="input-field__input" placeholder="" id="${this.type}_holiday_${letter}">
				</div>
			</label>
			<label class="input col month-col">
				<div class="input-field row ">
					<select id="${this.type}_month_${letter}" class="input-field__input input-field__select" data-letter="${letter}">
						<option>--</option>
						${this.months.map(month => `<option value="${month}">${this.monthLabels[month - 1]}</option>`)}
					</select>
				</div>
			</label>
			<label class="input col day-col">
				<div class="input-field row">
					<select id="${this.type}_day_${letter}" class="input-field__input input-field__select" data-letter="${letter}">
						<option>--</option>
						${this.days.map(day => `<option value="${day}">${day}</option>`)}
					</select>
				</div>
			</label>
			<label class="input col">
				<button class="input-field input-field--clear row" data-letter="${letter}">
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L10 8.58579L14.2929 4.29289C14.6834 3.90237 15.3166 3.90237 15.7071 4.29289C16.0976 4.68342 16.0976 5.31658 15.7071 5.70711L11.4142 10L15.7071 14.2929C16.0976 14.6834 16.0976 15.3166 15.7071 15.7071C15.3166 16.0976 14.6834 16.0976 14.2929 15.7071L10 11.4142L5.70711 15.7071C5.31658 16.0976 4.68342 16.0976 4.29289 15.7071C3.90237 15.3166 3.90237 14.6834 4.29289 14.2929L8.58579 10L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z" fill="#9CA3AF"></path>
					</svg>
				</button>
			</label>
		</div>`;

		this.appendTo.insertAdjacentHTML('beforeend', holiday);

		/*KeyListeners*/
		this.removeField();
		this.addNewField();
	}

	removeField() {
		let _this = this;
		$$('.input-field--clear').forEach(btn => {
			btn.addEventListener("click", function (event) {
				const letter = event.target.getAttribute('data-letter');
				const row = _(`${_this.type}_field_${letter}`);
				if(row !== null) row.remove();
				_this.resetFields();
			});
		});
	}

	addNewField() {
		const _this = this;

		const selects = $$('.input-field__select');
		let added = false;
		selects.forEach(select => {
			select.addEventListener("change", function (event, target) {
				const letter = event.target.getAttribute('data-letter');
				/*Get month and date values*/
				const month = _(`${_this.type}_month_${letter}`).value;
				const day = _(`${_this.type}_day_${letter}`).value;
				if (parseInt(month) && parseInt(day) && !added) {
					_this.key++;
					_this.addField();
					added = true;
				}
			});
		})
	}

	resetFields() {
		const rows = $$(`.${this.type}_holiday_row`);
		if(rows.length) return false;

		this.key = 0;
		this.addField();
	}
}

new addFields();