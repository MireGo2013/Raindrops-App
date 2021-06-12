const DEFAULT_DATA = {
	STYLE_DROP: ['drop_blue', 'drop_bonus'],
	OPERATORS: ['+', '-', '*', '/'],
	CALC_BUTTONS: ['Enter', 'Delete', 'Backspace', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	NUMBERS_FOR_EXPRESSION: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	SPEED_GENERATE_DROPS: 4000,
	SPEED_FALL: 20,
	UP_WAVE: 25,
	UP_SCORE: 10,
	DOWN_SCORE: 5,
	LEVEL_GAME: 1,
	QUANTITY_FALSE_ANSWERS: 3,
}

class Drop {
	constructor(uncorrectAnswer) {
		this.uncorrectAnswer = uncorrectAnswer
		this.operators = DEFAULT_DATA.OPERATORS
		this.$areaRainEl = document.querySelector('.area_rain')
		this.$wave = document.querySelector('.wave')
		this.createDrop()
		this.autoRemoveDrop()
	}

	createDrop() {
		let drop = document.createElement('div')
		let numberFirstElem = document.createElement('div')
		let operationElem = document.createElement('div')
		let numberSecondElem = document.createElement('div')
		let styleDrop = this.randomDropStyle(DEFAULT_DATA.STYLE_DROP)
		drop.classList.add(styleDrop, 'drop')
		numberFirstElem.classList.add('first_num')
		operationElem.classList.add('operator')
		numberSecondElem.classList.add('second_num')
		let randomNumberAndOperationObj = this.randomExpression()
		numberFirstElem.innerText = randomNumberAndOperationObj.firstNum
		operationElem.innerText = randomNumberAndOperationObj.operation
		numberSecondElem.innerText = randomNumberAndOperationObj.secondNum
		let result = this.getResultExpression(randomNumberAndOperationObj)
		drop.appendChild(numberFirstElem)
		drop.appendChild(operationElem)
		drop.appendChild(numberSecondElem)
		this.$areaRainEl.prepend(drop)
		this.animateDropFall(drop)
		this.element = drop
		this.type = styleDrop
		this.answer = result
	}

	randomDropStyle(arrStyle) {
		let index = this.randomNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		arrStyle = index <= 9 ? arrStyle[0] : arrStyle[1]
		return arrStyle
	}

	randomExpression() {
		let numbersArr = DEFAULT_DATA.NUMBERS_FOR_EXPRESSION
		let firstNum = this.randomNumber(numbersArr)
		let secondNum = this.randomNumber(numbersArr)
		let operation = this.randomNumber(DEFAULT_DATA.OPERATORS)
		if (firstNum < secondNum && ['-', '/'].includes(operation)) {
			[firstNum, secondNum] = [secondNum, firstNum]
		}
		if (operation === '/' && firstNum % secondNum != 0) {
			firstNum -= firstNum % secondNum
		}
		return { firstNum, operation, secondNum }
	}

	getResultExpression(expressionObj) {
		let { firstNum, operation, secondNum } = expressionObj
		let resultExpression = null;
		switch (operation) {
			case '+':
				resultExpression = firstNum + secondNum;
				break;
			case '-':
				resultExpression = firstNum - secondNum;
				break;
			case '/':
				resultExpression = firstNum / secondNum;
				break;
			case '*':
				resultExpression = firstNum * secondNum;
				break;
		}
		return resultExpression
	}

	animateDropFall(dropEl) {
		let maxLeftPosPercent = 100 - parseInt(dropEl.offsetWidth * 100 / this.$areaRainEl.offsetWidth)
		dropEl.style.left = this.randomLeftPosition(maxLeftPosPercent) + '%'
		dropEl.classList.add('animateFall')
		dropEl.style.transitionDuration = DEFAULT_DATA.SPEED_FALL + 's'
	}

	randomLeftPosition(maxLeft) {
		let pos = Math.floor(Math.random() * maxLeft + 1)
		return pos
	}

	removeDrop() {
		this.animateRemoveDrop()
	}

	animateRemoveDrop() {
		this.element.innerHTML = '<img src="../source/img/splash.png" alt="explosion" />'
		this.element.classList.add('animate')
		setTimeout(() => {
			this.element.remove()
		}, 150)
	}

	autoRemoveDrop() {
		if (!this.element) return
		let waveTop = this.$wave.offsetTop
		const dropPosition = this.element.offsetTop + this.element.offsetHeight;
		if (dropPosition >= waveTop + this.element.offsetHeight) {
			this.element.remove()
			this.upWave()
		}
		let idTimeDropFalse = setTimeout(() => {
			this.autoRemoveDrop()
		}, 100)
	}

	upWave() {
		let nextHightWave = this.$wave.offsetHeight + DEFAULT_DATA.UP_WAVE
		this.$wave.style.height = nextHightWave + 'px'
		this.uncorrectAnswer()
	}

	randomNumber(arrNumber) {
		return arrNumber[Math.floor(Math.random() * arrNumber.length)]
	}

}
class InputHandler {
	constructor(chechAnswerHandler) {
		this.chechAnswerHandler = chechAnswerHandler
		this.$calculatorEl = document.querySelector('.calculator_wrapper');
		this.$inputScreen = document.querySelector('.display_answer');
		this.answerInputScreen = null;
		this.addListeners()
	}

	addListeners() {
		this.$calculatorEl.addEventListener('click', this.handlerCalculator)
		window.addEventListener('keydown', this.handlerCalculator)
	}

	handlerCalculator = (e) => {
		e.preventDefault()
		if (DEFAULT_DATA.CALC_BUTTONS.includes(e.key)) {
			this.handlerCalcOnKeybourd(e)
		} else {
			this.handlerCalcOnMouse(e)
		}
	}

	handlerCalcOnMouse(e) {
		let numberBtn = e.target.getAttribute('data-num')
		let funcBtn = e.target.getAttribute('data-func')
		if (funcBtn || numberBtn) {
			this.checkEvent(funcBtn, numberBtn)
		}
	}

	handlerCalcOnKeybourd(e) {
		this.checkEvent(e.key, e.key)
	}

	checkEvent(params, params2) {
		switch (params) {
			case 'Enter':
				this.enterResult()
				break;
			case 'Delete':
				this.clearInputScreen()
				break;
			case 'Backspace':
				this.deleteEndNumInputScreen()
				break;
			default:
				this.printNumbers(params2)
		}
	}

	printNumbers(numberBtn) {
		if (this.$inputScreen.value.length < 4) {
			if (this.$inputScreen.value === '0') {
				this.$inputScreen.value = numberBtn
			} else {
				this.$inputScreen.value += numberBtn
			}
		}
	}

	clearInputScreen() {
		this.$inputScreen.value = '0';
	}

	deleteEndNumInputScreen() {
		if (this.$inputScreen.value.length === 1) {
			this.$inputScreen.value = '0'
		} else {
			this.$inputScreen.value = this.$inputScreen.value.slice(0, this.$inputScreen.value.length - 1)
		}
	}

	enterResult() {
		this.answerInputScreen = this.$inputScreen.value
		this.chechAnswerHandler(this.answerInputScreen)
		this.$inputScreen.value = '0';
	}

}

class AutoMode {
	constructor(gameController) {
		this.gameControllers = gameController
	}

	emuleteAnswer() {
		let arrAnswers = this.getSolveExpression()
		if (!arrAnswers.length) return
		let index = Math.floor(Math.random() * arrAnswers.length)
		let answer = arrAnswers[index]
		setTimeout(() => {
			this.gameControllers.handler.printNumbers(answer)
		}, 2000)
		setTimeout(() => {
			this.gameControllers.handler.enterResult(answer)
		}, 3000)
	}

	getSolveExpression() {
		let arrResult = []
		this.gameControllers.dropsEl.forEach(drop => {
			arrResult.push(drop.answer)
		})
		return arrResult
	}

	start() {
		if (!this.gameControllers.isRun) return
		setTimeout(() => {
			this.start()
			this.emuleteAnswer()
		}, 4000)
	}
}

class GameConrtoller {
	constructor() {
		this.handler = new InputHandler(this.checkAnswer.bind(this))
		this.$scoreEl = document.querySelector('.score')
		this.$levelSpanEl = document.querySelector('.lvl > span')
		this.$fieldBgSoundAndFullScreen = document.querySelector('.controlsBtn_wrapper')
		this.$deskScore = document.getElementById('deskScore')
		this.$resultScore = document.getElementById('score_desk')
		this.$restartButton = document.getElementById('desk_btn')
		this.SOUND = {
			SOUND_BACKGRAUND: document.getElementById('sound_back'),
			SOUND_TRUE: document.getElementById('sound_answerTrue'),
			SOUND_FALSE: document.getElementById('sound_answerFalse'),
		}
		this.isRun = false
		this.score = 0
		this.counterUncorrectAnswers = 0;
		this.counterCorrectAnswer = 0;
		this.dropsEl = []

		this.$fieldBgSoundAndFullScreen.addEventListener('click', this.handlerSoundAndFullScreen)
		this.$restartButton.addEventListener('click', this.restartGame)
	}

	handlerSoundAndFullScreen = (e) => {
		if (e.target.classList.contains('volume_btn')) {
			this.playSoundBackground()
			this.changeClassBtnSound(e.target)
		}
		if (e.target.classList.contains('fullscreen_btn')) {
			if (!document.fullscreenElement) {
				document.documentElement.requestFullscreen()
			} else {
				document.exitFullscreen()
			}
		}
		e.target.blur()
	}

	playSoundBackground() {
		if (this.SOUND.SOUND_BACKGRAUND.paused) {
			this.SOUND.SOUND_BACKGRAUND.play()
		} else {
			this.SOUND.SOUND_BACKGRAUND.pause()
		}
	}

	playTrueSound() {
		this.SOUND.SOUND_TRUE.play()
	}

	playFalseSound() {
		this.SOUND.SOUND_FALSE.play()
	}

	changeClassBtnSound(elem) {
		elem.classList.toggle('none')
	}

	checkAnswer(answer) {
		if (!this.dropsEl.length) return
		for (let i = 0; i < this.dropsEl.length; i++) {
			if (this.dropsEl[i].answer == answer) {
				if (this.dropsEl[i].type === 'drop_bonus') {
					this.dropsEl.forEach(drop => {
						drop.removeDrop()
					})
					this.correctAnswer()
					this.dropsEl = []
					return
				} else {
					this.correctAnswer()
					this.dropsEl[i].removeDrop()
					this.dropsEl.splice(i, 1)
					return
				}
			}
		}
		this.uncorrectAnswer()
	}

	correctAnswer() {
		this.score += DEFAULT_DATA.UP_SCORE
		this.$scoreEl.innerText = this.score
		DEFAULT_DATA.UP_SCORE += 1
		this.counterCorrectAnswer += 1
		this.playTrueSound()
		this.upLevelGame()
	}

	upLevelGame() {
		if (this.counterCorrectAnswer % 3 === 0 && this.counterCorrectAnswer > 0) {
			this.upSpeedDropsFall()
			let indexEndNum = DEFAULT_DATA.NUMBERS_FOR_EXPRESSION.length - 1
			let addNum = DEFAULT_DATA.NUMBERS_FOR_EXPRESSION[indexEndNum] + 1
			DEFAULT_DATA.NUMBERS_FOR_EXPRESSION.push(addNum)
			this.printLevelGame()
		}
	}

	printLevelGame() {
		DEFAULT_DATA.LEVEL_GAME += 1
		this.$levelSpanEl.innerText = DEFAULT_DATA.LEVEL_GAME
	}

	upSpeedDropsFall() {
		if (DEFAULT_DATA.SPEED_FALL <= 5 || DEFAULT_DATA.SPEED_GENERATE_DROPS <= 1500) return
		DEFAULT_DATA.SPEED_FALL -= 1
		DEFAULT_DATA.SPEED_GENERATE_DROPS -= 100
	}

	uncorrectAnswer() {
		this.score -= DEFAULT_DATA.DOWN_SCORE
		this.$scoreEl.innerText = this.score
		DEFAULT_DATA.DOWN_SCORE += 1
		this.counterUncorrectAnswers += 1
		this.playFalseSound()
		this.checkStopGame()
	}

	showFinalScore() {
		this.$deskScore.classList.add('active')
		this.$resultScore.textContent = this.score
	}

	checkStopGame() {
		if (this.counterUncorrectAnswers === DEFAULT_DATA.QUANTITY_FALSE_ANSWERS) {
			this.isRun = false;
			this.dropsEl.forEach(drop => {
				drop.removeDrop()
			})
			this.showFinalScore()
			this.dropsEl[0].$wave.style.height = 15 + '%'
			this.dropsEl = []
		}
	}

	restartGame = (e) => {
		this.$deskScore.classList.remove('active')
		DEFAULT_DATA.NUMBERS_FOR_EXPRESSION = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		DEFAULT_DATA.SPEED_GENERATE_DROPS = 4000
		DEFAULT_DATA.SPEED_FALL = 20
		DEFAULT_DATA.UP_SCORE = 10
		DEFAULT_DATA.DOWN_SCORE = 5
		DEFAULT_DATA.LEVEL_GAME = 1
		this.$levelSpanEl.innerText = 1
		DEFAULT_DATA.QUANTITY_FALSE_ANSWERS = 3
		DEFAULT_DATA.LEVEL_GAME += 1
		this.score = 0
		this.$scoreEl.textContent = 0;
		this.counterUncorrectAnswers = 0;
		this.counterCorrectAnswer = 0;
		this.isRun = true
		this.generateDrops()
	}

	addDrop() {
		let drop = new Drop(this.uncorrectAnswer.bind(this))
		this.dropsEl.push(drop)
	}

	generateDrops() {
		if (!this.isRun) return
		this.addDrop()
		setTimeout(() => {
			if (!this.isRun) return
			this.generateDrops()
		}, DEFAULT_DATA.SPEED_GENERATE_DROPS)
	}

	startAutoPlay() {
		let autoMode = new AutoMode(this)
		autoMode.start()
	}

	start() {
		this.isRun = true
		this.generateDrops()
	}
}




const up = new GameConrtoller()
up.start()

if (window.location.href.includes('tutorial')) {
	up.startAutoPlay()
}