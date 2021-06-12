const startGameBtn = document.querySelector('.play_game')
const autoPlayModeBtn = document.querySelector('.info_game')

startGameBtn.addEventListener('click', () => {
	document.location.href = 'source/game.html'
})

autoPlayModeBtn.addEventListener("click", () => {
	document.location.href = 'source/game.html?tutorial';
});
