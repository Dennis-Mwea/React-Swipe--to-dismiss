import React from "react";

class SwipeList extends React.Component {
	constructor(props) {
		super(props);

		this.state ={
			counter: 1,
			item: 'http://lorempixel.com/350/65/',
			originalOffset: 0,
			velocity: 0,
			timeOfLastDragEvent: 0,
			touchStartX: 0,
			prevTouchX: 0,
			beingTouched: false,
			height: 0,
			intervalId: null,
			left: 0
		}
	}

	componentDidMount() {
		window.setTimeout(() => this.setState({display: 'block'}), 50)
	}

	render() {
		return (
			<div className={"swipeList"} style={{display: this.state.display, left: this.state.left + 'px', transition: 'display 250ms ease-in-out'}}
			    onTouchStart={touchStartEvent => this.handleTouchStart(touchStartEvent)}
			    onTouchMove={touchMoveEvent => this.handleTouchMove(touchMoveEvent)}
			    onTouchEnd={() => this.handleTouchEnd()}
			    onMouseDown={mouseDownEvent => this.handleMouseDown(mouseDownEvent)}
			    onMouseMove={mouseMoveEvent => this.handleMouseMove(mouseMoveEvent)}
			    onMouseUp={() => this.handleMouseUp()}
			    onMouseLeave={() => this.handleMouseLeave()}>
				<img src={this.state.item} alt="" height={'100vh'} width={'100vw'}/>
			</div>
		);
	}

	handleMove(clientX) {
		if (this.state.beingTouched) {
			const touchX = clientX;
			const currTime = Date.now();
			const elapsed = currTime - this.state.timeOfLastDragEvent;
			const velocity = 20 * (touchX - this.state.prevTouchX) / elapsed;
			let deltaX = touchX - this.state.touchStartX + this.state.originalOffset;
			if (deltaX < -350) {
				this.handleRemoveSelf();
			} else if (deltaX > 0) {
				deltaX = 0;
			}
			this.setState({
				left: deltaX,
				velocity,
				timeOfLastDragEvent: currTime,
				prevTouchX: touchX
			});
		}
	}

	handleRemoveSelf() {
		this.setState({width: 0});
		window.setTimeout(() => this.setState({display: 'none'}), 250);
	}

	handleEnd() {
		this.setState({
			velocity: this.state.velocity,
			touchStartX: 0,
			beingTouched: false,
			intervalId: window.setInterval(this.animateSlidingToZero.bind(this), 33)
		});
	}

	animateSlidingToZero() {
		let {left, velocity, beingTouched} = this.state;
		if (!beingTouched && left < -0.01) {
			velocity += 10 * 0.033;
			left += velocity;
			if (left < -350) {
				window.clearInterval(this.state.intervalId);
				this.handleRemoveSelf();
			}
			this.setState({left, velocity});
		} else if (!beingTouched) {
			left = 0;
			velocity = 0;
			window.clearInterval(this.state.intervalId);
			this.setState({left, velocity, intervalId: null, originalOffset: 0});
		}
	}

	handleStart(clientX) {
		if (this.state.intervalId !== null) {
			window.clearInterval(this.state.intervalId);
		}
		this.setState({
			originalOffset: this.state.left,
			velocity: 0,
			timeOfLastDragEvent: Date.now(),
			touchStartX: clientX,
			beingTouched: true,
			intervalId: null
		});
	}

	handleTouchStart(touchStartEvent) {
		touchStartEvent.preventDefault()
		this.handleStart(touchStartEvent.targetTouches[0].clientX)
	}

	handleTouchMove(touchMoveEvent) {
		this.handleMove(touchMoveEvent.targetTouches[0].clientX);
	}

	handleTouchEnd() {
		this.handleEnd();
	}

	handleMouseDown(mouseDownEvent) {
		mouseDownEvent.preventDefault();
		this.handleStart(mouseDownEvent.clientX);
	}

	handleMouseMove(mouseMoveEvent) {
		this.handleMove(mouseMoveEvent.clientX);
	}

	handleMouseUp() {
		this.handleEnd();
	}

	handleMouseLeave() {
		this.handleMouseUp();
	}
}

export default SwipeList;