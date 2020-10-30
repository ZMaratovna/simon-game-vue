Vue.config.productionTip = false;
Vue.config.devtools = true;

const myApp = new Vue({
	el: '#app',
	data: {
		active: true,
		sequence: [],
		sequenceCopy: [],
		round: 0,
		options: ['easy', 'medium', 'hard'],
		mode: 'easy',
		currentInterval: 1500,
		activeButton: 0,
		sounds: {
			1: 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
			2: 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
			3: 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
			4: 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3',
		},
		tiles: [
			{ color: 'red', number: 1 },
			{ color: 'blue', number: 2 },
			{ color: 'yellow', number: 3 },
			{ color: 'green', number: 4 },
		],
		isActivated: false,
	},
	methods: {
		changeMode: function (e) {
			this.mode = e.target.value;
			switch (this.mode) {
				case 'easy':
					this.currentInterval = 1500;
					break;
				case 'medium':
					this.currentInterval = 1000;
					break;
				case 'hard':
					this.currentInterval = 400;
					break;
				default:
					this.currentInterval = 1000;
			}
		},
		startGame: function () {
			this.sequence = [];
			this.sequenceCopy = [];
			this.round = 0;
			this.active = true;
			this.newRound();
		},
		newRound: function () {
			this.round++;
			this.sequence.push(this.randomNumber());
			this.sequenceCopy = [...this.sequence];
			this.animate(this.sequence);
		},
		animate: function (sequence) {
			let i = 0;
			const self = this;
			const interval = setInterval(function () {
				self.playSound(sequence[i]);
				self.lightUp(sequence[i]);
				i++;
				if (i >= sequence.length) {
					self.isActivated = true;
					clearInterval(interval);
				}
			}, this.currentInterval);
		},
		playSound: function (tile) {
			const pl = this.$refs['sound' + tile][0];
			pl.playbackRate = 2.0;
			pl.play();
		},
		lightUp: function (tile) {
			this.activeButton = tile;
			const that = this;
			window.setTimeout(function () {
				that.activeButton = 0;
			}, this.currentInterval / 2);
		},
		registerClick: function (e) {
			const desiredResponse = this.sequenceCopy.shift();
			const actualResponse = e.target.dataset.tile;
			this.active = desiredResponse == actualResponse;
			this.checkLose();
		},
		checkLose: function () {
			if (!this.sequenceCopy.length && this.active) {
				this.isActivated = false;
				this.newRound();
			} else if (!this.active) {
				this.isActivated = false;
				this.endGame();
			}
		},
		endGame: function () {
			this.active = false;
		},
		responseHandler: function (e) {
			e.target.classList.add('active');
			this.playSound(e.target.dataset.tile);
		},
		removeResponse: (e) => {
			e.target.classList.remove('active');
		},
		randomNumber: () => Math.floor(Math.random() * 4 + 1),
		emptyHandler: () => {},
	},
	watch: {},
});
