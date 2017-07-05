import React from 'react';
import Utils from './Utils.jsx';

function Square(props) {

	let sstyle = {}
	let innerHilight = null
	let cls = "square"
	let inCls = ""
	if (props.winrow) {
		cls = cls + " winrow"
	}
	// if (props.hl) {
	//   cls += " hilight"
	// }
	let cMap = {
		"X": "red",
		"O": "orange",
		"H": "green",
	}
	if (props.hl) {
		inCls = "hilight"
		let innerStyle = {}
		innerStyle.backgroundColor = cMap[props.curPlayer]
		innerHilight = <div style={ innerStyle }></div>
	} else {
		sstyle.backgroundColor = cMap[props.value]
	}
	return (
		<div className={cls} 
			onClick={props.onClick} 
			onMouseOver={props.onMouseOver}>
			<div className={ inCls } style={ sstyle }>
				{innerHilight}
			</div>
		</div>
	)
}

class Board extends React.Component {
	
	constructor() {
		super()
		this.state = this.getResetState()
	}
	
	renderSquare(x, y) {
		let sc = this.state.selectedColumn
		let sq =  this.state.squares
		return <Square
						 key={x + '-' + y}
						 winrow={this.isInsideWinSet(this.state.winSet, x, y)}
						 hl={this.mustBeHilighted(sc, x, y, sq)}
						 value={this.state.squares[x][y]}
						 onClick={() => this.handleClick(x, y)}
						 onMouseOver={() => this.handleMouseOver(x, y)}
						 curPlayer= { this.state.turn }
					 />;
	}

	mustBeHilighted(selCol, x, y, squares) {
		if (selCol == x && squares[x][y] == null) {
			if (y == squares[0].length - 1) {
				return true
			}
			if (squares[x][y+1] != null) {
				return true
			}
		}
		return false
	}
	
	isInsideWinSet(wSet, x, y) {
		for (let i = 0; i < wSet.length; i++) {
			 let wx = wSet[i][0]
			 let wy = wSet[i][1]
			 if (wx == x && wy == y) {
				 return true
			 }
		}
		return false
	}
	
	handleClick(x, y) {
		if (this.state.winner) {
			return
		}
		const sq = this.state.squares.slice()
		
		let freePosY = this.findFirstFreePos(sq, x)
		if (freePosY == null) {
			return
		}

		sq[x][freePosY] = this.state.turn   
		let cw = this.checkWin(sq)
		let w = cw[0]
		let wSet = cw[1]
		let selCol = this.state.selectedColumn

		this.setState({
			squares: sq,
			turn: this.setNextTurn(),
			winner: w,
			winSet: wSet,
			moves: this.state.moves+1,
			selectedColumn: w ? null: selCol,
		})

		
	}

	handleMouseOver(x , y) {
		if (this.state.winner) {
			return
		}
		// console.log("x: " + x)
		this.setState({selectedColumn: x})
	}
	
	findFirstFreePos(sq, x) {
		for(let i = sq[0].length - 1; i >= 0; i--) {
			if (sq[x][i] == null) {
				return i
			}
		}
		return null
	}
	
	setNextTurn() {
		let t = this.state.turn
		if (t == 'X') return 'O'
		if (t == 'O') return 'H'
		if (t == 'H') return 'X'
		
	}

	checkWin(sq) {
		// da rifare per la mappa a 4
		//return [null, []]
		
		let dx = sq.length
		let dy = sq[0].length
		
		let wSet = []
		let winner = null

		// verifica sulle righe
		for (let y = 0; y < dy; y++) {
			let last = null
			let checkNumber = 0
			for (let x = 0; x < dx; x++) {
					let cur = sq[x][y]
					let isContinuing = (last != null && last == cur)
					let isInterrupting = ( cur == null || last != cur)
					if (isContinuing) {
						wSet.push([x, y]); checkNumber++; last = cur; // ADD
						if (checkNumber == 4) {
							break
						}
					} else if (isInterrupting) {
							if (cur != null) {
								wSet = []; wSet.push([x, y]); checkNumber = 1; last = cur; //NEW
							} else {
								wSet = []; checkNumber = 0; last = null;  // CLEAR
							}
					}
			}
			if (wSet.length == 4) {
				break
			}
		}
		
		if (wSet.length < 4) {
			 wSet = []
			// verifica sulle colonne
			for (let x = 0; x < dx; x++) {
				let last = null
				let checkNumber = 0
				for (let y = 0; y < dy; y++) {
						let cur = sq[x][y]
						let isContinuing = (last != null && last == cur)
						let isInterrupting = ( cur == null || last != cur)
						if (isContinuing) {
							wSet.push([x, y]); checkNumber++; last = cur; // ADD
							if (checkNumber == 4) {
								break
							}
						} else if (isInterrupting) {
								if (cur != null) {
									wSet = []; wSet.push([x, y]); checkNumber = 1; last = cur; //NEW
								} else {
									wSet = []; checkNumber = 0; last = null;  // CLEAR
								}
						}
				}
				if (wSet.length == 4) {
					break
				}
			}
		}
		
		// verifica sulle diagonali verso destra
		/*
		if (wSet.length < 4) {
			 wSet = []
			let direction = "diag-right"
			for (let x = 0; x < dx-4; x++) {
				let y = 0
				let cur = sq[x][y]
				let last = null
				let checkNumber = 0
				while (cur != null || checkNumber != 4) {
					let isContinuing = (last != null && last == cur)
					let isInterrupting = ( cur == null || last != cur)
					if (isContinuing) {
							wSet.push([x, y]); checkNumber++; last = cur; // ADD
							if (checkNumber == 4) {
								break
							}
					} else if (isInterrupting) {
							if (cur != null) {
								wSet = []; wSet.push([x, y]); checkNumber = 1; last = cur; //NEW
							} else {
								wSet = []; checkNumber = 0; last = null;  // CLEAR
							}
					}
					cur = Utils.getNextCoord(x, y, dx, dy, direction)
				}
				if (wSet.length == 4) {
					break
				}
			}
		}
		// verifica sulle diagonali verso sinistra
		if (wSet.length < 4) {
			 wSet = []
			let direction = "diag-left"
			for (let x = 3; x < dx; x++) {
				let y = 0
				let cur = sq[x][y]
				let last = null
				let checkNumber = 0
				while (cur != null || checkNumber != 4) {
					let isContinuing = (last != null && last == cur)
					let isInterrupting = ( cur == null || last != cur)
					if (isContinuing) {
							wSet.push([x, y]); checkNumber++; last = cur; // ADD
							if (checkNumber == 4) {
								break
							}
					} else if (isInterrupting) {
							if (cur != null) {
								wSet = []; wSet.push([x, y]); checkNumber = 1; last = cur; //NEW
							} else {
								wSet = []; checkNumber = 0; last = null;  // CLEAR
							}
					}
					cur = Utils.getNextCoord(x, y, dx, dy, direction)
				}
				if (wSet.length == 4) {
					break
				}
			}
		}
		*/
	 
		if (wSet.length == 4) {
			winner = sq[wSet[0][0]][wSet[0][1]]
		}
		
		return [winner, wSet]
	}
 
	getStatus() {
		 if (! this.state.winner) {
				if (this.state.moves == 100) {
					return 'No Winners :('
				} else {
					return 'Next player: ' + (this.state.turn);  
				}
		 } else {
			 return 'Winner is ' + this.state.winner
		 }
	}
	
	getResetState() {
		let dimX = 15
		let dimY = 7
		let squares = Array(dimX)
		for (let x = 0; x < dimX; x++) {
			squares[x] = Array(dimY).fill(null)
		}
		return {
			squares: squares,
			turn: 'X',
			winner: null,
			winSet: [],
			moves: 0,
			selectedColumn: null,
		}
		
	}
	
	restart() {
		this.setState(this.getResetState())
	}
	

	render() {
		// Hello
		let sq = this.state.squares
		let dimX = sq ? sq.length : 0
		let dimY = sq ? sq[0].length : 0
		let rows = []
		for(let r = 0; r < dimY; r++) {
			let cols = []
			for(let c = 0; c < dimX; c++) {
				cols.push(this.renderSquare(c, r))
			}
			rows.push(<div key={r} className="board-row">{cols}</div>)
		}
		
	 
		return (
			<div>
				<div className="status">{this.getStatus()}</div>
				<div>
					<div>   
						{rows}
				 </div>
				</div>
				<div className="tools">
					<button className="button" name="RESTART" value="RESTART"
							onClick={() => this.restart()}
						>
						 RESTART
					</button>
				</div>
			</div>
		);
	}
}

export default Board;