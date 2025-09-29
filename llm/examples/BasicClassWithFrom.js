/**
 * @note .md
 * # Нотація до написання класів.
 * ## Типізація
 * 1. Кожен клас має бути типізовановим по всіх функціях і полях.
 * 2. Типи можуть бути typedef або іншими класами, краще за все мати окремі класи
 *    для кожного окремого контракту (взаємодії) моделей.
 * ## Порядок
 * 1. Спочатку static поля. jsdoc не обовʼязково, якщо за назвою зрозуміло суть.
 * 2. Звичайні поля з jsdoc.
 * 3. Конструктор, якщо потрібен із описом вхідного параметру.
 * 4. Методи get, set.
 * 5. Звичайні методи.
 * 6. Асинхроні методи.
 * 7. Статичні методи.
 * 8. Статично асинхроні методи.
 */
class Person {
	static WOMAN = 0
	static MAN = 1
	/** @type {string} **/
	name
	/** @type {number} **/
	height
	/**
	 * @param {string | object} input
	 * @param {string} [input.name=""]
	 * @param {number} [input.height=-1]
	 */
	constructor(input = {}) {
		if ("string" === typeof input) {
			input = { name: input }
		}
		const { name = "", height = -1 } = input
		this.name = String(name)
		this.height = Number(height)
	}
	get amITall() {
		return this.height > 1.50
	}
	/**
	 * @param {string | object} input
	 * @return {Person}
	 */
	static from(input) {
		if (input instanceof Person) return input
		return new Person(input)
	}
}

export default Person
