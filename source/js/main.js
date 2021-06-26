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
	constructor() {
		this.operators = DEFAULT_DATA.OPERATORS
		this.$areaRainEl = document.querySelector('.area_rain')
		this.createDrop()
	}

	createDrop() {
		let drop = this.createElement('div')
		let styleDrop = this.randomDropStyle(DEFAULT_DATA.STYLE_DROP)
		drop.classList.add(styleDrop, 'drop')
		let answer = this.createExpressionInnerDrop(drop)
		this.$areaRainEl.prepend(drop)
		this.animateDropFall(drop)
		this.element = drop
		this.type = styleDrop
		this.answer = answer
	}

	createExpressionInnerDrop(container) {
		let numberFirstElem = this.createElement('div')
		let operationElem = this.createElement('div')
		let numberSecondElem = this.createElement('div')
		numberFirstElem.classList.add('first_num')
		operationElem.classList.add('operator')
		numberSecondElem.classList.add('second_num')
		let randomNumberAndOperationObj = this.randomExpression()
		numberFirstElem.innerText = randomNumberAndOperationObj.firstNum
		operationElem.innerText = randomNumberAndOperationObj.operation
		numberSecondElem.innerText = randomNumberAndOperationObj.secondNum
		let answer = this.getResultExpression(randomNumberAndOperationObj)
		container.appendChild(numberFirstElem)
		container.appendChild(operationElem)
		container.appendChild(numberSecondElem)
		return answer
	}

	createElement(tagName) {
		return document.createElement(tagName)
	}

	randomDropStyle(arrStyle) {
		let index = Math.floor(Math.random() * 10)
		arrStyle = index <= 8 ? arrStyle[0] : arrStyle[1]
		return arrStyle
	}

	randomExpression() {
		let numbersArr = DEFAULT_DATA.NUMBERS_FOR_EXPRESSION
		let firstNum = this.randomNumber(numbersArr)
		let secondNum = this.randomNumber(numbersArr)
		let operation = this.randomNumber(DEFAULT_DATA.OPERATORS)
		let isValidParams = firstNum < secondNum && ['-', '/'].includes(operation)
		if (isValidParams) {
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
		return Math.floor(Math.random() * maxLeft + 1)

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

	randomNumber(arrNumber) {
		return arrNumber[Math.floor(Math.random() * arrNumber.length)]
	}

}

class Wave {
	constructor(dropEl, wrongAnswerHandler) {
		this.waveEl = document.querySelector('.wave')
		this.dropEl = dropEl
		this.wrongAnswerHandler = wrongAnswerHandler
		this.autoRemoveFailDrop()
	}

	upWave() {
		let nextHightWave = this.waveEl.offsetHeight + DEFAULT_DATA.UP_WAVE
		this.waveEl.style.height = nextHightWave + 'px'
		this.wrongAnswerHandler()
	}

	autoRemoveFailDrop() {
		if (!this.dropEl) return
		let waveTop = this.waveEl.offsetTop
		const dropPosition = this.dropEl.offsetTop + this.dropEl.offsetHeight;
		if (dropPosition >= waveTop + this.dropEl.offsetHeight) {
			this.dropEl.remove()
			this.upWave()
		}
		let idTimeDropFalse = setTimeout(() => {
			this.autoRemoveFailDrop()
		}, 100)
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
		this.$calculatorEl.addEventListener('click', this.handlerCalculatorBtn)
		window.addEventListener('keydown', this.handlerCalculatorBtn)
	}

	handlerCalculatorBtn = (e) => {
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
			this.clearInputScreen()
		} else {
			this.$inputScreen.value = this.$inputScreen.value.slice(0, this.$inputScreen.value.length - 1)
		}
	}

	enterResult() {
		this.answerInputScreen = this.$inputScreen.value
		this.chechAnswerHandler(this.answerInputScreen)
		this.clearInputScreen()
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
		this.waveEl.upWave()
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
		DEFAULT_DATA.SPEED_GENERATE_DROPS -= 150
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
			this.waveEl.waveEl.style.height = 15 + '%'
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
		this.drop = new Drop()
		this.dropsEl.push(this.drop)
		this.waveEl = new Wave(this.drop.element, this.uncorrectAnswer.bind(this))
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