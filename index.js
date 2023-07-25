// GLOBAL SCOPE

let gridColoredColor = "rgb(15,15,15)";
let gridBgColor = "rgb(255,255,255)";
let gridBorderColor = convertHexaColorToRGBColor("#CFD6E1");
let showBorders = true;
let colorMode = "classic";
const validGridSizes = [2, 4, 8, 16, 32, 64, 128];

// Class name of each square of the grid
const gridSquareClassName = "grid-square";
const gridColoredClass = "grid-colored";

function main()
{
    // DOM Elements that need to have a single reference
    const gridContainer = document.querySelector("section.grid-container");
    const borderColorInputElement = document.querySelector("input#border-color");
    const canvasColorInputElement = document.querySelector("input#canvas-color");
    const showBordersInputElement = document.querySelector("input#show-borders");
    const numOfSquaresInputElement = document.querySelector("input#number-of-squares");
    const numOfSquaresPElement = document.querySelector("p#number-of-squares-shower");

    // Create the first grid of squares
    createGrid(16, gridContainer);

    // Place White as the default background color of every grid
    changeColorOfEveryGrid();

    // Place borders of every grid square as light gray
    configureBorderOfEveryGrid();

    // Always show the number of squares the user shows us
    numOfSquaresInputElement.addEventListener("change", (e) => changeGridSize(e, gridContainer, numOfSquaresPElement));

    // Let the user toggle between showing the grid borders or not
    showBordersInputElement.addEventListener("change", toggleShowGridBorders);

    // Let the user change the border color of each grid square
    borderColorInputElement.addEventListener("change", changeBorderGridColor);

    // Let the user change the color of the canvas
    canvasColorInputElement.addEventListener("change", changeGridBgColor);

    // Let the user color the grids of the canvas
    //gridContainer.addEventListener("onmouseover", colorGridsOfCanvas);
}

/* Event Handlers Here */
function changeGridSize(e, gridContainer, pElement)
{
    /* Change the size of the grid here */

    // Set up the value of the input element to change the grid size
    const validValue = findClosestValue(parseInt(e.target.value), validGridSizes);
    e.target.value = validValue;
    pElement.textContent = e.target.value;

    // Clear out the actual grid
    clearGrid(gridContainer);

    // Create a new grid with the specified number of squares
    createGrid(validValue, gridContainer);

    // Make sure to modify background color of each grid
    changeColorOfEveryGrid();

    // Show or not the border of each grid square
    configureBorderOfEveryGrid(showBorders);

}

function toggleShowGridBorders(e)
{
    /* Toggle between showing grid borders or not */
    showBorders = e.target.checked
    configureBorderOfEveryGrid(showBorders);
}

function changeGridBgColor(e)
{
    const grabbedColor = convertHexaColorToRGBColor(e.target.value);
    gridBgColor = grabbedColor;
    changeColorOfEveryGrid(true);
}

function changeBorderGridColor(e)
{
    const grabbedColor = convertHexaColorToRGBColor(e.target.value);
    gridBorderColor = grabbedColor;
    configureBorderOfEveryGrid(showBorders);
}

function colorGridsOfCanvas()
{
    console.log("I work");
    // Grab a reference to the grid squares
    //const gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);

    // Add an event handler to each grid square to color it when the mouse is pressed on it
    //gridSquares.forEach(gridSquare => {
        //gridSquare.addEventListener("onmousedown", colorGrid);
    //});
}

function colorGrid(e)
{
    const gridToColor = e.target;
    
    // Add the class of coloured grids to this grid
    if (!gridToColor.classList.contains(gridColoredClass))
    {
        gridToColor.classList.add(gridColoredClass);
    }

    // Change the background color of this grid to that of the color of the colored grid
    gridToColor.style.backgroundColor = gridColoredColor;
}

/* Common Functions Here */
function clearGrid(gridContainer)
{
    /* Clear the grid of squares */
    gridContainer.innerHTML = "";
}

function createGrid(numOfSquares, gridContainer)
{
    /* Function to generate the grid of initial squares */
    const squareWidth = 100 / numOfSquares;

    gridContainer.style.gridTemplateRows = `repeat(${numOfSquares}, ${squareWidth}%)`;
    gridContainer.style.gridTemplateColumns = `repeat(${numOfSquares}, ${squareWidth}%)`;

    for (let i = 0; i < numOfSquares ** 2; i++)
    {
        const gridSquare = document.createElement("div");
        gridSquare.classList.add(gridSquareClassName);
        gridContainer.appendChild(gridSquare);
    }
}

function changeColorOfEveryGrid(considerColoredGridSquares=false)
{
    /* Change the color of each grid */

    // Grab a reference to each grid square
    const gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);

    if (considerColoredGridSquares)
    {
        gridSquares.forEach(gridSquare => {
            if (!gridSquare.classList.contains(gridColoredClass))
            {
                gridSquare.style.backgroundColor = gridBgColor;
            }
        });
    }

    else
    {
        gridSquares.forEach(gridSquare => {
            gridSquare.style.backgroundColor = gridBgColor;
        });
    }
}

function configureBorderOfEveryGrid(showBorder=true)
{
    /* Configure the border of every grid square as 1px solid of whichever border color is available */

    // Grab a reference to each grid square
    const gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);

    if (showBorder)
    {
        gridSquares.forEach(gridSquare => {
            gridSquare.style.border = `1px solid ${gridBorderColor}`;
        });
    }

    else
    {
        gridSquares.forEach(gridSquare => {
            gridSquare.style.border = "none";
        });
    }
}

function convertHexaColorToRGBColor(hexaColor)
{
    /* Convert hexadecimal colors to RGB colors */
    
    // Get RGB components of the given hexa color
    const red = parseInt(hexaColor.substr(1, 2), 16);
    const green = parseInt(hexaColor.substr(3, 2), 16);
    const blue = parseInt(hexaColor.substr(5, 2), 16);

    return `rgb(${red}, ${green}, ${blue})`;
}

function findClosestValue(value, arr)
{
    /* Return the closest number of a given number found in an array of numbers */
    return arr.reduce((prev, curr) => {
        return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
      });
}

document.addEventListener("DOMContentLoaded", main);