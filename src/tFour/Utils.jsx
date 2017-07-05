class Utils {

	static getNextCoord(x, y, overX, overY, direction) {
		if (direction == "right") {
			if (x + 1 >= overX) {
				return null
			} else {
				return { x: x + 1, y: y}
			}
		}
		if (direction == "down") {
			if (y + 1 >= overY) {
				return null
			} else {
				return { x: x, y: y + 1}
			}
		}
		if (direction == "diag-right") {
			if (x + 1 >= overX || y + 1 >= overY) {
				return null
			} else {
				return { x: x + 1, y: y + 1}
			}
		}
		if (direction == "diag-left") {
			if (x - 1 < 0 || y + 1 >= overY) {
				return null
			} else {
				return { x: x - 1, y: y + 1}
			}			
		}
	}
	
}

export default Utils