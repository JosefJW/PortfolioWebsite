const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

// Grid size
let squareSize = 5;

let rows, cols;

// Drawing variables
let isDrawing = false;
let paused = false;

// Color variables
let minHue = 1;
let maxHue = 360;
let hueChange = 0.05;
let curHue = 1;
let rockColor = 30;

// Mouse variables
let downX = 0;
let downY = 0;

// Element radius variables
let radius = 2;

// Type picker variables
let type = "Sand";

// Color picker variables
changeColor("Sand");

/*
 * Changes the color based on the string value that is passed in
 * Will change the global variables minHue, maxHue, hueChange, and curHue to match the color palette chosen
 * Inputs:
 *    value: A string representing the color palette to switch to
 */
function changeColor(value) {
  if (value == "Rainbow") {
    minHue = 1;
    maxHue = 360;
    hueChange = 0.05;
  } else if (value == "Sand") {
    minHue = 30;
    maxHue = 60;
    hueChange = 0.005;
  } else if (value == "Red") {
    minHue = 0;
    maxHue = 0;
    hueChange = 0;
  } else if (value == "Orange") {
    minHue = 30;
    maxHue = 30;
    hueChange = 0;
  } else if (value == "Yellow") {
    minHue = 60;
    maxHue = 60;
    hueChange = 0;
  } else if (value == "Green") {
    minHue = 120;
    maxHue = 120;
    hueChange = 0;
  } else if (value == "Blue") {
    minHue = 240;
    maxHue = 240;
    hueChange = 0;
  } else if (value == "Indigo") {
    minHue = 275;
    maxHue = 275;
    hueChange = 0;
  } else if (value == "Violet") {
    minHue = 300;
    maxHue = 300;
    hueChange = 0;
  }
  curHue = minHue;
}

/*
 * The Cell class represents one cell in the grid for the simulation.
 * Class Variables:
 *    this.x: x position of the cell
 *    this.y: y position of the cell
 *    this.type: Type of element this cell is simulating
 *    this.active: Whether the cell is actively simulating an element or not
 *    this.hue: Color that the cell should be
 *    this.gravity: Gravitational force being applied to the cell
 *    this.moved: Tracks if this cell was moved in one simulation frame or not
 */
class Cell {
  /*
   * Creates a Cell object
   * Inputs:
   *    x: x position of the cell
   *    y: y position of the cell
   *    type: Type of element this cell is simulating
   */
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.active = false;
    this.hue = 0;
    this.gravity = 0;
    this.moved = false;
  }

  /*
   * Activates the cell to a certain type
   * Inputs:
   *    type: Type of element to activate the cell to
   */
  toggle(type) {
    this.active = true;
    this.gravity = 1;
    this.type = type;
    if (this.type == "Rock") {
      this.hue = rockColor + Math.random() * 10;
      rockColor += 0.01;
      if (rockColor > 70) rockColor = 30;
    } else {
      this.hue = curHue + Math.random() * 10;
      curHue += hueChange;
      if (curHue > maxHue) curHue = minHue;
    }
  }

  /*
   * Draws the cell in the grid
   * Inputs:
   *    ctx: Context to draw the cell in
   */
  draw(ctx) {
    if (this.type == "Rock") {
      ctx.fillStyle = this.active ? `hsl(0, 0%, ${this.hue}%)` : "#000";
    } else {
      ctx.fillStyle = this.active ? `hsl(${this.hue}, 100%, 50%)` : "#000";
    }
    ctx.fillRect(this.x * squareSize, this.y * squareSize, squareSize, squareSize);
  }
}

let grid = createGrid(rows, cols); // Current grid being shown on screen
let nextGrid = createGrid(rows, cols); // Next frame in the simulation

/*
 * Creates a new 2d array that has dimensions r by c.
 * Inputs:
 *    r: The number of rows in the new grid
 *    c: The number of columns in the new grid
 * Returns:
 *    The new grid
 */
function createGrid(r, c) {
  const g = [];
  for (let i = 0; i < r; i++) {
    g.push([]);
    for (let j = 0; j < c; j++) {
      g[i].push(new Cell(j, i, null));
    }
  }
  return g;
}

/*
 * Loops through an r by c 2d array and draws each of its elements to context
 * Inputs:
 *    r: Number of rows in grid to draw
 *    c: Number of columns in grid to draw
 *    grid: The grid to be drawn
 *    context: The context to draw the grid on
 */
function drawGrid(r, c, grid, context) {
  for (let i = 0; i < r; i++) {
    let row = grid[i];
    for (let j = 0; j < c; j++) {
      if (row && row[j]) {
        row[j].draw(context);
      }
    }
  }
}

/*
 * Toggles an element to active in a grid
 * Inputs:
 *    r: Number of rows in the grid
 *    c: Number of cols in the grid
 *    grid: The grid to toggle the element in
 *    radius: The radius of cells that should be toggled along with the specific one specified
 *    offsetX: The x offset of the cell to be toggled
 *    offsetY: The y offset of the cell to be toggled
 *    ss: The square size for the grid
 *    type: The element type to toggle the cell to
 */
function drawElement(r, c, grid, radius, offsetX, offsetY, ss, type) {
  const x = Math.floor(offsetX / ss); // x value of the cell in the grid
  const y = Math.floor(offsetY / ss); // y value of the cell in the grid
  for (let i = -radius; i <= radius; i++) {
    for (let j = -radius; j <= radius; j++) {
      if (i * i + j * j <= radius * radius) { // Only toggle cells within a circular radius from the start cell
        // Make sure the cell is valid
        if (grid[y+i] && grid[y+i][x+j] && y + i < r && y + i >= 0 && x + j < c && x + j >= 0 && !grid[y + i][x + j].active) {
          grid[y + i][x + j].toggle(type);
        }
      }
    }
  }
}

/*
 * Creates a copy of the 2d array filled with cells that is passed to it
 * Inputs:
 *    originalGrid: Grid to be copied
 * Returns:
 *    A deep copy of the originalGrid
 */
function copyGrid(originalGrid) {
  return originalGrid.map(row => row.map(cell => {
    let newCell = new Cell(cell.x, cell.y, null);
    newCell.active = cell.active;
    newCell.hue = cell.hue;
    newCell.gravity = cell.gravity;
    newCell.moved = false;
    return newCell;
  }));
}

// Start the simulation loop here or call the update functions to start drawing on the canvas


/*
 * Simulates the next frame of a sand element identified by grid[i][j]
 * Behavior:
 *    Sand particles will first try to fall straight down
 *    If that is not possible, they will try to fall diagonally
 * Inputs:
 *    r: The number of rows in grid
 *    c: The number of cols in grid
 *    grid: The grid to create the next simulation frame based on
 *    nextGrid: Temp grid to store the next simulation frame
 *    i: The row offset of the sand element to be simulated
 *    j: The col offset of the sand element to be simulated
 */
function updateSand(r, c, grid, nextGrid, i, j) {
  // Make sure this cell can move
  if (grid[i][j].active && !grid[i][j].moved) {

    // First, try falling straight down with gravity
    if (grid[i+1] && grid[i+1][j] && i < r - 1 && !grid[i + 1][j].active) {

      // Used to change the amount of cells it should fall based on gravity
      // and if the cells below it are active or not
      let fallTo = i;
      for (let g = 1; g <= grid[i][j].gravity; g++) {
        if (nextGrid[i+g] && nextGrid[i+g][j] && i+g < r && !nextGrid[i+g][j].active) {
          fallTo++;
        }
        else {
          break;
        }
      }

      // Fall straight down
      nextGrid[i][j].active = false;
      nextGrid[fallTo][j].active = true;
      nextGrid[fallTo][j].type = grid[i][j].type;
      nextGrid[fallTo][j].hue = grid[i][j].hue;
      nextGrid[fallTo][j].gravity = grid[i][j].gravity + 1;
      grid[i][j].moved = true;
    } 
    
    // If it can't fall straight down, sand will try to fall diagonally
    else {
      let dir = Math.random() < 0.5 ? -1 : 1; // Used to randomize diagonal direction
      if (grid[i+1] && grid[i+1][j+dir] && nextGrid[i+1] && nextGrid[i+1][j+dir] && i < r - 1 && j + dir >= 0 && j + dir < c && !grid[i + 1][j + dir].active) {
        nextGrid[i][j].active = false;
        nextGrid[i + 1][j + dir].active = true;
        nextGrid[i + 1][j + dir].type = "Sand";
        nextGrid[i + 1][j + dir].hue = grid[i][j].hue;
        grid[i][j].moved = true;
      } else if (grid[i+1] && grid[i+1][j-dir] && nextGrid[i+1] && nextGrid[i+1][j-dir] && i < r - 1 && j - dir >= 0 && j - dir < c && !grid[i + 1][j - dir].active) {
        nextGrid[i][j].active = false;
        nextGrid[i + 1][j - dir].active = true;
        nextGrid[i + 1][j - dir].type = "Sand";
        nextGrid[i + 1][j - dir].hue = grid[i][j].hue;
        grid[i][j].moved = true;
      }
    }
  }
}

/*
 * Simulates the next frame of a rock element identified by grid[i][j]
 * Behavior:
 *    Rock elements will fall straight down
 *    Regardless of the current state of the grid, if there is an open spot directly below
 *    a rock element in nextGrid, the rock element will fall into it
 * Inputs:
 *    r: The number of rows in grid
 *    c: The number of cols in grid
 *    grid: The grid to create the next simulation frame based on
 *    nextGrid: Temp grid to store the next simulation frame
 *    i: The row offset of the sand element to be simulated
 *    j: The col offset of the sand element to be simulated
 */
function updateRock(r, c, grid, nextGrid, i, j) {
  // Make sure this cell can move
  if (grid[i][j].active && !grid[i][j].moved) {

    // First try falling straight down with gravity
    if (i < r - 1 && !nextGrid[i+1][j].active) {
      
      // Used to change the amount of cells it should fall based on gravity
      // and if the cells below it are active or not
      let fallTo = i;
      for (let g = 1; g <= grid[i][j].gravity; g++) {
        if (i+g < r && !nextGrid[i+g][j].active) {
          fallTo++;
        }
        else {
          break;
        }
      }

      // Fall straight down
      nextGrid[i][j].active = false;
      nextGrid[fallTo][j].active = true;
      nextGrid[fallTo][j].type = grid[i][j].type;
      nextGrid[fallTo][j].hue = grid[i][j].hue;
      nextGrid[fallTo][j].gravity = grid[i][j].gravity + 1;
      grid[i][j].moved = true;
    }
  }
}

/*
 * Simulates the next frame of a gravel element identified by grid[i][j]
 * Behavior:
 *    Gravel falls straight down like sand, but cannot fall diagonally, similar to rock.
 * Inputs:
 *    r: The number of rows in grid
 *    c: The number of cols in grid
 *    grid: The grid to create the next simulation frame based on
 *    nextGrid: Temp grid to store the next simulation frame
 *    i: The row offset of the sand element to be simulated
 *    j: The col offset of the sand element to be simulated
 */
function updateGravel(r, c, grid, nextGrid, i, j) {
  if (grid[i][j].active && !grid[i][j].moved) {
    // Try falling straight down.
    if (i < rows - 1 && !grid[i + 1][j].active) {
      let fallTo = i;
      for (let g = 1; g <= grid[i][j].gravity; g++) {
        if (i+g < rows && !nextGrid[i+g][j].active) {
          fallTo++;
        }
        else {
          break;
        }
      }
      // Update nextGrid for the falling cell.
      nextGrid[i][j].active = false;
      nextGrid[fallTo][j].active = true;
      nextGrid[fallTo][j].type = grid[i][j].type;
      nextGrid[fallTo][j].hue = grid[i][j].hue;
      nextGrid[fallTo][j].gravity = grid[i][j].gravity + 1;
      grid[i][j].moved = true;
    }
  }
}

/*
 * Simulates the next frame of a water element identified by grid[i][j]
 * Behavior:
 *
 * Inputs:
 *    r: The number of rows in grid
 *    c: The number of cols in grid
 *    grid: The grid to create the next simulation frame based on
 *    nextGrid: Temp grid to store the next simulation frame
 *    i: The row offset of the sand element to be simulated
 *    j: The col offset of the sand element to be simulated
 */
// Revised updateWater: processes one water cell
function updateWater(r, c, grid, nextGrid, i, j) {
  // Only update active water cells that haven't moved
  if (!grid[i][j].active || grid[i][j].moved) return;
  
  // Collect possible moves.
  // We check both grid (not yet updated) and nextGrid (already claimed moves)
  function isFree(ni, nj) {
    return ni >= 0 && ni < r && nj >= 0 && nj < c &&
           !grid[ni][nj].active && !nextGrid[ni][nj].active;
  }

  // List candidate moves: down, diagonals, then sides.
  let candidates = [];
  if (i < r - 1 && isFree(i + 1, j)) candidates.push([i + 1, j]);         // down
  if (i < r - 1 && j > 0 && isFree(i + 1, j - 1)) candidates.push([i + 1, j - 1]); // down-left
  if (i < r - 1 && j < c - 1 && isFree(i + 1, j + 1)) candidates.push([i + 1, j + 1]); // down-right
  if (j > 0 && isFree(i, j - 1)) candidates.push([i, j - 1]);               // left
  if (j < c - 1 && isFree(i, j + 1)) candidates.push([i, j + 1]);             // right

  // If no candidate moves, explicitly copy the water cell over.
  if (candidates.length === 0) {
    nextGrid[i][j].active = grid[i][j].active;
    nextGrid[i][j].type = grid[i][j].type;
    nextGrid[i][j].hue = grid[i][j].hue;
    // (gravity could be left as is or reset)
    return;
  }

  // Shuffle the candidate moves to remove directional bias.
  for (let k = candidates.length - 1; k > 0; k--) {
    const l = Math.floor(Math.random() * (k + 1));
    [candidates[k], candidates[l]] = [candidates[l], candidates[k]];
  }

  // Now, if any move goes downward, prioritize one of them.
  let downward = candidates.filter(([ni, nj]) => ni > i);
  let chosen;
  if (downward.length > 0) {
    chosen = downward[Math.floor(Math.random() * downward.length)];
  } else {
    chosen = candidates[0];
  }
  const [newI, newJ] = chosen;

  // Move the water cell.
  nextGrid[i][j].active = false;
  nextGrid[newI][newJ].active = true;
  nextGrid[newI][newJ].type = grid[i][j].type;
  nextGrid[newI][newJ].hue = grid[i][j].hue;
  nextGrid[newI][newJ].moved = true;
  grid[i][j].moved = true;
}





/*
 * Simulates the next frame for a 2d array grid of Cell objects
 * Inputs:
 *    r: Number of rows in grid
 *    c: Number of cols in grid
 *    grid: The grid to be updated
 *    nextGrid: Temporary storage for the updated grid
 * Returns:
 *    A 2-element array containing [the updated grid, the old grid]
 */
function updateGrid(r, c, grid, nextGrid) {
  // Reset moved flags in grid.
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      if (grid[i] && grid[i][j]) {
        grid[i][j].moved = false;
      }
    }
  }

  for (let i = r - 1; i >= 0; i--) {
    for (let j = 0; j < c; j++) {
      if (grid[i] && grid[i][j] && nextGrid[i] && nextGrid[i][j]) {
        // Start by copying the current cell's state.
        nextGrid[i][j].active = grid[i][j].active;
        nextGrid[i][j].type = grid[i][j].type;
        nextGrid[i][j].hue = grid[i][j].hue;
        nextGrid[i][j].gravity = grid[i][j].gravity;
        nextGrid[i][j].moved = grid[i][j].moved;
        
        if (grid[i][j].type == "Sand") {
          updateSand(r, c, grid, nextGrid, i, j);
        } else if (grid[i][j].type == "Rock") {
          updateRock(r, c, grid, nextGrid, i, j);
        } else if (grid[i][j].type == "Gravel") {
          updateGravel(r, c, grid, nextGrid, i, j);
        } else if (grid[i][j].type == "Water") {
          updateWater(r, c, grid, nextGrid, i, j);
        }
      }
    }
  }
  
  return [nextGrid, grid];
}

function animate() {
  if (isDrawing) {
    drawElement(rows, cols, grid, radius, downX, downY, squareSize, type);
  }
  if (!paused) {
    let simulationSteps = 1;
    for (let i = 0; i < simulationSteps; i++) {
      [grid, nextGrid] = updateGrid(rows, cols, grid, nextGrid);
    }
  }
  drawGrid(rows, cols, grid, ctx);
  requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (event) => {
  const mouseX = event.offsetX;
  const mouseY = event.offsetY;

  downX = event.offsetX;
  downY = event.offsetY;

  // Check if the mouse is inside the canvas
  if (mouseX >= 0 && mouseX <= canvas.width && mouseY >= 0 && mouseY <= canvas.height) {
      isDrawing = true;
  } else {
      isDrawing = false;
  }
});

// Function to update the rows and cols based on the window size
function resizeCanvas() {
  // Set canvas size to window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  console.log(canvas.width);
  console.log(window.innerWidth);

  squareSize = Math.max(2, Math.sqrt(window.innerWidth * window.innerHeight / 50000))

  // Calculate the number of rows and columns based on the window size and square size
  rows = Math.floor(canvas.height / squareSize);
  cols = Math.floor(canvas.width / squareSize);

  grid = createGrid(rows, cols);
  nextGrid = createGrid(rows, cols);
  drawGrid(rows, cols, grid, ctx);
}

// Initial setup
resizeCanvas();

// Update rows and cols when the window is resized
window.addEventListener('resize', resizeCanvas);

animate();