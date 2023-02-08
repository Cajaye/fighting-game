const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') //context is for drawing out shapes and more

//set canvas width and height
canvas.width = 1024
canvas.height = 576


const gravity = 0.7

c.fillRect(0, 0, canvas.width, canvas.height) //draw rectangle

class Sprite {
	constructor({ position, velocity, color = 'red', offset }) {
		this.position = position
		this.velocity = velocity
		this.height = 150
		this.width = 50
		this.lastKey;
		//create attack box
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			width: 100,
			height: 50,
			offset
		}
		this.color = color
		this.isAttacking;
		this.health = 100
	}

	draw() {
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height)

		//draw attach box 
		if (this.isAttacking) {
			c.fillStyle = 'green'
			c.fillRect(
				this.attackBox.position.x,
				this.attackBox.position.y,
				this.attackBox.width,
				this.attackBox.height,
			)
		}
	}

	update() {
		this.draw()
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if (this.position.y + this.height + this.velocity.y >= canvas.height) { //stops play when they reach the bottom of the canvas
			this.velocity.y = 0 //stop player from moving
		} else {
			this.velocity.y += gravity //add gravity when we're not at the end of the canvas
		}
	}

	attack() {
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 100)
	}
}

const player = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: 0,
		y: 0,
	}
})


const enemy = new Sprite({
	position: {
		x: 400,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	color: 'blue',
	offset: {
		x: -50,
		y: 0,
	}
})

let keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	w: {
		pressed: false
	},

	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowDown: {
		pressed: false
	},
}

function animate() {
	window.requestAnimationFrame(animate)

	//clear canvas for each frame
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)

	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	//player movement
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -5
	} else if (keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = 5
	}

	//enemy
	if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
		enemy.velocity.x = 5
	} else if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
		enemy.velocity.x = -5
	}

	//detect for collision
	if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
		player.isAttacking = false
		enemy.health -= 20
		document.querySelector('#enemyHealth').style.width = `${enemy.health}%`
	}

	if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
		enemy.isAttacking = false
		player.health -= 20
		document.querySelector('#playerHealth').style.width = `${player.health}%`
	}
}

animate()

function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && //if the right side of the attack box's pos >= left side of enemy
		rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && //if the left side of the attack box <= right side of the player
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.attackBox.position.y //if the bottom of the attack box >= top of the enemy attack box
		&& rectangle1.attackBox.position.y <= rectangle2.attackBox.position.y + rectangle2.height
	)
}

window.addEventListener('keydown', (event) => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = true
			player.lastKey = 'd'
			break
		case 'a':
			keys.a.pressed = true
			player.lastKey = 'a'
			break
		case 'w':
			player.velocity.y = -20
			break
		case ' ':
			player.attack()
			break

		//enemy
		case 'ArrowRight':
			keys.ArrowRight.pressed = true
			enemy.lastKey = 'ArrowRight'
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = true
			enemy.lastKey = 'ArrowLeft'
			break
		case 'ArrowUp':
			enemy.velocity.y = -20
			break
		case 'ArrowDown':
			enemy.attack()
			break
	}
})

window.addEventListener('keyup', (event) => {
	switch (event.key) {
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break

		//enemy
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
	}
})