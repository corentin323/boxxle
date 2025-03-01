import { Levels } from './level.js';

let currentLevel = 0;  
let grid = []; 
let playerPosition = { x: 0, y: 0 };  

function Grid(level) {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';  

    grid = [];  

    for (let row = 0; row < level.length; row++) {
        const gridRow = [];
        for (let col = 0; col < level[row].length; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            switch (level[row][col]) {
                case 0:
                    cell.classList.add('empty');
                    break;
                case 1:
                    cell.classList.add('wall');
                    break;
                case 2:
                    cell.classList.add('box');
                    cell.style.backgroundColor = 'brown'; 
                    break;
                case 3:
                    cell.classList.add('player');
                    playerPosition = { x: col, y: row };
                    break;
                case 4:
                    cell.classList.add('target');
                    cell.style.backgroundColor = 'red'; 
                    break;
            }

            gridRow.push(cell);
            gridContainer.appendChild(cell);
        }
        grid.push(gridRow);
    }

    const gridWidth = level[0].length;
    const gridHeight = level.length;
    gridContainer.style.gridTemplateColumns = `repeat(${gridWidth}, 40px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridHeight}, 40px)`;
}

function movePlayer(dx, dy) {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (ValidMove(newX, newY)) {
        grid[playerPosition.y][playerPosition.x].classList.remove('player');
        playerPosition = { x: newX, y: newY };
        grid[playerPosition.y][playerPosition.x].classList.add('player');
    }

    updateColors();
}

function ValidMove(x, y) {
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
        return false; 
    }
    if (grid[y][x].classList.contains('wall')) {
        return false; 
    }
    if (grid[y][x].classList.contains('box')) {
        const nextX = x + (x - playerPosition.x); 
        const nextY = y + (y - playerPosition.y); 
        if (ValidBoxMove(nextX, nextY)) {
           
            grid[nextY][nextX].classList.add('box');
            grid[nextY][nextX].style.backgroundColor = 'brown';
            grid[nextY][nextX].classList.remove('empty');
            grid[y][x].classList.remove('box');
            grid[y][x].style.backgroundColor = '';
            grid[y][x].classList.add('empty');
            return true;
        }
        return false;
    }
    return true; 
}

function ValidBoxMove(x, y) {
    if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
        return false; 
    }
    if (grid[y][x].classList.contains('wall')) {
        return false; 
    }
    if (grid[y][x].classList.contains('box')) {
        return false; 
    }
    return true;
}

function updateColors() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cell = grid[row][col];
            if (cell.classList.contains('target')) {
                const box = BoxPosition(col, row);
                if (box) {
                    cell.style.backgroundColor = 'green';
                } else {
                    cell.style.backgroundColor = 'red';
                }
            }
        }
    }
}

function BoxPosition(x, y) {
    const cell = grid[y][x];
    return cell.classList.contains('box') ? cell : null;
}

function checkWin() {
    let win = true;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const cell = grid[row][col];
            if (cell.classList.contains('box') && !cell.classList.contains('target')) {
                win = false; 
            }
        }
    }

    if (win) {
        alert('Bravo ! Niveau terminé !');
        nextLevel();
    }
}

function nextLevel() {
    currentLevel++; 

    if (currentLevel >= Levels.length) {
        alert("Félicitations ! Vous avez terminé tous les niveaux !");
    } else {
        resetLevel();
    }
}

function resetLevel() {
    Grid(Levels[currentLevel]); 
}

function KeyPress(event) {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1); 
            break;
        case 'ArrowDown':
            movePlayer(0, 1); 
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0); 
            break;
        case 'ArrowRight':
            movePlayer(1, 0); 
            break;
    }
    checkWin(); 
}

function init() {
    Grid(Levels[currentLevel]);

    window.addEventListener('keydown', KeyPress);

    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', resetLevel);
}

document.addEventListener('DOMContentLoaded', init);