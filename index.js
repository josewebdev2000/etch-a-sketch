// GLOBAL SCOPE

let gridColoredColor = "rgb(15,15,15)";
let gridBgColor = "rgb(255,255,255)";
let gridBorderColor = convertHexaColorToRGBColor("#CFD6E1");
let showBorders = true;
let colorMode = "classic";
let gridSquares = null;
let isDrawing = true;
const validGridSizes = [2, 4, 8, 16, 32, 64, 128];

// Class name of each square of the grid
const gridSquareClassName = "grid-square";
const gridColoredClass = "grid-colored";

function main()
{
    // DOM Elements that need to have a single reference

    // Reference the grid container
    const gridContainer = document.querySelector("section.grid-container");

    // Reference DOM elements related to grid options
    const rainbowModeBtnElement = document.querySelector("button#rainbow");
    const classicModeBtnElement = document.querySelector("button#classic");
    const darkenModeBtnElement = document.querySelector("button#darken");
    const borderColorInputElement = document.querySelector("input#border-color");
    const canvasColorInputElement = document.querySelector("input#canvas-color");
    const showBordersInputElement = document.querySelector("input#show-borders");
    const numOfSquaresInputElement = document.querySelector("input#number-of-squares");
    const numOfSquaresPElement = document.querySelector("p#number-of-squares-shower");

    // Reference DOM elements related to tools
    const colorPalleteBtnElement = document.querySelector("button#color-selector");
    const colorPalleteInputElement = document.querySelector("input#color-pallete");
    const pencilBtnElement = document.querySelector("button#pencil");
    const pencilImgElement = document.querySelector("img#pencil-icon");
    const eraserBtnElement = document.querySelector("button#eraser");
    const clearCanvasBtnElement = document.querySelector("button#clear-canvas");

    // Create the first grid of squares
    createGrid(16, gridContainer);

    // Grab the first version of the grid squares
    gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);

    // Let the user color the grids of the canvas
    colorGridsOfCanvas();

    // Place White as the default background color of every grid
    changeColorOfEveryGrid();

    // Place borders of every grid square as light gray
    configureBorderOfEveryGrid();

    // Let the user change drawing modes
    rainbowModeBtnElement.addEventListener("click", triggerRainbowMode);
    classicModeBtnElement.addEventListener("click", triggerClassicMode);
    darkenModeBtnElement.addEventListener("click", triggerDarkenMode);

    // Always show the number of squares the user shows us
    numOfSquaresInputElement.addEventListener("change", (e) => changeGridSize(e, gridContainer, numOfSquaresPElement));

    // Let the user toggle between showing the grid borders or not
    showBordersInputElement.addEventListener("change", toggleShowGridBorders);

    // Let the user change the border color of each grid square
    borderColorInputElement.addEventListener("change", changeBorderGridColor);

    // Let the user change the color of the canvas
    canvasColorInputElement.addEventListener("change", changeGridBgColor);

    // Let the user chose the drawing color of the canvas
    colorPalleteBtnElement.addEventListener("click", () => fireUpColorPalletePopup(colorPalleteInputElement));
    colorPalleteInputElement.addEventListener("change", changeDrawingColor);

    // Let the user change between drawing or not
    pencilBtnElement.addEventListener("click", () => toggleDrawingMode(pencilImgElement));

    // Let the user delete what he/she drew
    eraserBtnElement.addEventListener("click", triggerEraseMode);

    // Let the user clear the whole canvas
    clearCanvasBtnElement.addEventListener("click", clearTheWholeCanvas);

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

    // Grab the first version of the grid squares
    gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);

    colorGridsOfCanvas();

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
    // Add an event handler to each grid square to color it when the mouse is pressed on it
    gridSquares.forEach(gridSquare => {
        gridSquare.addEventListener("mouseover", colorGrid);
    });

    // Update the referece to the grid square to the most recent
    gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);
}

function colorGrid(e)
{
    const gridToColor = e.target;

    // Consider drawing modes
    switch (colorMode)
    {
        case "classic":
            {
                // If drawing is not allowed apply an early return
                if (!isDrawing)
                {
                    return;
                }

                // Add the class of coloured grids to this grid
                addOrRemoveClassToElement(gridToColor, gridColoredClass, "add");

                // Change the background color of this grid to that of the color of the colored grid
                gridToColor.style.backgroundColor = gridColoredColor;
                break;
            }
        
        case "rainbow":
            {
                // If drawing is not allowed apply an early return
                if (!isDrawing)
                {
                    return;
                }

                // Add the class of coloured grids to this grid
                addOrRemoveClassToElement(gridToColor, gridColoredClass, "add");

                // Change the background color of this grid to that of a random RGB color
                gridToColor.style.backgroundColor = generateRandomRGBColor();
                break;
            }
        
        case "darken":
            {
                // If drawing is not allowed apply an early return
                if (!isDrawing)
                {
                    return;
                }

                // Add the class of coloured grids to this grid
                addOrRemoveClassToElement(gridToColor, gridColoredClass, "add");

                if (gridToColor.style.backgroundColor === gridBgColor)
                {
                    // Apply the initial RGB Color to this grid
                    gridToColor.style.backgroundColor = "rgb(15, 51, 97)";
                }

                else
                {
                    // Otherwise darken the RGB Colors
                    gridToColor.style.backgroundColor = darkenRGBColor(gridToColor.style.backgroundColor);
                }

                break;
            }
        
        case "erase":
            {
                // Remove the color grid class if it's been added
                addOrRemoveClassToElement(gridToColor, gridColoredClass, "remove");

                // Change the background color of this grid to that of the color of the canvas
                gridToColor.style.backgroundColor = gridBgColor;
                break;
            }
        
        default:
            {

            }

    }
}

function fireUpColorPalletePopup(inputColorPallete)
{
    /* Trigger a click event for the given input color element */
    inputColorPallete.click();
}

function changeDrawingColor(e)
{
    /* Change the drawing color of the canvas */
    gridColoredColor = convertHexaColorToRGBColor(e.target.value);
}

function toggleDrawingMode(imgToChange)
{
    if (isDrawing)
    {
        imgToChange.src = "assets/pics/no-pencil.png";
        isDrawing = false;
    }

    else
    {
        imgToChange.src = "assets/pics/pencil.png";
        isDrawing = true;
    }
}

function triggerEraseMode()
{
    changeDrawingMode("erase");
}

function triggerRainbowMode()
{
    changeDrawingMode("rainbow");
}

function triggerClassicMode()
{
    changeDrawingMode("classic");
}

function triggerDarkenMode()
{
    changeDrawingMode("darken");
}

function clearTheWholeCanvas()
{
    // Remove the colored class from all squares that have them
    changeColorOfEveryGrid();
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
        addOrRemoveClassToElement(gridSquare, gridSquareClassName, "add");
        gridContainer.appendChild(gridSquare);
    }
}

function changeColorOfEveryGrid(considerColoredGridSquares=false)
{
    /* Change the color of each grid */

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
            addOrRemoveClassToElement(gridSquare, gridColoredClass, "remove");
            gridSquare.style.backgroundColor = gridBgColor;
        });
    }

    gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);
}

function configureBorderOfEveryGrid(showBorder=true)
{
    /* Configure the border of every grid square as 1px solid of whichever border color is available */
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

    gridSquares = document.querySelectorAll(`div.${gridSquareClassName}`);
}

function addOrRemoveClassToElement(DOMElement, className, action)
{
    if (action === "add")
    {
        if (!DOMElement.classList.contains(className))
        {
            DOMElement.classList.add(className);
        }
    }

    else if (action === "remove")
    {
        if (DOMElement.classList.contains(className))
        {
            DOMElement.classList.remove(className);
        }
    }

    else
    {
        return;
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

function changeDrawingMode(newDrawingMode)
{
    if (colorMode !== newDrawingMode)
    {
        colorMode = newDrawingMode;
    }
}

function generateRandomRGBColor()
{
    /* Generate a random RGB Color */
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    return `rgb(${red}, ${green}, ${blue})`;
}

function findClosestValue(value, arr)
{
    /* Return the closest number of a given number found in an array of numbers */
    return arr.reduce((prev, curr) => {
        return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
      });
}

function darkenRGBColor(rgbColor)
{
    /* Return a 10% darker version of the given RGB color */

    // Extract RGB values from the RGB color
    const matches = rgbColor.match(/\d+/g);
    const red = parseInt(matches[0]);
    const green = parseInt(matches[1]);
    const blue = parseInt(matches[2]);

    // Calculate new rgb values decreasing each of them by 10%
    const newRed = Math.max(red - red * 0.1, 0);
    const newGreen = Math.max(green - green * 0.1, 0);
    const newBlue = Math.max(blue - blue * 0.1, 0);

    return `rgb(${newRed}, ${newGreen}, ${newBlue})`;
}

document.addEventListener("DOMContentLoaded", main);