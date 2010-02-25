/*!
 * Resizegrid for jQuery 1.3.2
 * Version: 0.1.0
 * Author: Mikkel Wendt-Larsen(phylock@gmail.com)
 *
 * TODO:
 * - change duration to distance per sec, and make calculations
 * - toggle focus, at click keep div in focus even when mouse is moved out
 *
 * Versions:
 * 0.1.0 - Jan 2010 
 * - initial version
 * 0.2.0 - Jan 2010
 * - now uses an object array as settings
 * - added recalculation on window resize
 * - added possibility to define padding
 * - added possibility to define collapsed size of cells
 */

/**
 * Applies the styling to a specific cell.
 * 
 * @param cell       The JQuery object representing the cell to style
 * @param unit       The css unit values is given in ex. px, em ...
 * @param x          the left position of the cell
 * @param y          the top position of the cell 
 * @param width  the width of the cell
 * @param height the height of the cell
 */
function resizeCell(cell, unit, x, y, width, height, /*int*/duration) {
     cell.stop().animate({ 
            left: x + unit,
            top: y + unit,
            width: width + unit,
            height: height + unit
            }, duration );
}

/**
 * Initialize a object to be a resizegrid
 * There is no check to see if the cols rows fits number of elements in the grid
 *
 * @param grid      The JQuery object representing the grid
 * @param rows      The number of rows in the grid
 * @param cols      The number of cols in the grid
 */
function initializeGrid(settings, /*grid*/grid)
{
  grid.css("position", "relative");
  grid.children().css("position", "absolute");
  
  var org_speed = settings.speed;
  settings.speed = 0;
  
  resizeGrid(settings, grid, null);
  settings.speed = org_speed;
}

/**
 * Initialize a object to be a resizegrid
 * There is no check to see if the cols rows fits number of elements in the grid
 *
 * @param grid      The JQuery object representing the grid
 * @param rows      The number of rows in the grid
 * @param cols      The number of cols in the grid
 * @param focus     The JQuery object representing the focus, should be a child of the grid object
 * @param duratin   How long in ms should the animation take, its passed to the animation() function
 */
function resizeGrid(/*array*/settings,/*grid*/grid, /*cell class*/focus)
{
    /** calc width and height **/
   
    //total size
    var width = grid.width();
    var height = grid.height();
    
    //default size per cell
    var defaultWidth = width / settings.cols;
    var defaultHeight = height / settings.rows;

    if(focus != null)
    {
      //size not selected cell size
      var otherWidth = settings.collapse_size;
      var otherHeight = settings.collapse_size;
      
      //selected cell size
      var selectedWidth = width - ((settings.cols - 1) * (otherWidth + settings.padding));
      var selectedHeight = height - ((settings.rows - 1) * (otherHeight + settings.padding));
      
      var index = focus.prevAll().size();
      
      var selectedRow = Math.floor(index / settings.cols);
      var selectedCol = index - (selectedRow * settings.cols);
      
      //$(this).log("index: " + index + " selected row: " + selectedRow + " selected col: " + selectedCol);
      //$(this).log("width: " + width + " defaultWidth: " + defaultWidth + " selectedWidth: "+ selectedWidth + " otherWidth: " + (settings.cols -1) + " x " + (otherWidth * (settings.cols -1)));
      
    }
    
    /** loop vars **/
    var x = 0;
    var y = 0;
    var count = 1;
    
    var curCol = 0;
    var curRow = 0;
    
    /** for each child call resize **/
    var children = grid.children("div");
    
    for (var i = 0; i < children.length; i++) {
      var w = defaultWidth;
      var h = defaultHeight;
      
      if(!(focus === null))
      {
        w = ((curCol == selectedCol) ? selectedWidth : otherWidth);
        h = ((curRow == selectedRow) ? selectedHeight : otherHeight);
      }
    
      resizeCell(children.eq(i), settings.unit, x,y,w,h, settings.speed);
    
      if ((count % settings.cols) === 0) {
          /* 
           * This means it is time to bump down to the next row
           */
          curCol = 0;
          curRow++;
          x = 0;
          y += h + settings.padding;
      } else {
          x += w + settings.padding;
          curCol++;
      }
      
      count++;
    
    }
    
}
/**
 * set a Jquery object as resizegrid
 * @param rows      The number of rows in the grid
 * @param cols      The number of cols in the grid
 * @param speed     How long in ms should the animation take, its passed to the animation() function
 * @param padding   Distance between cells
 */
//jQuery.fn.enableResizeGrid = function (/*int*/rows , /*int*/cols, /*int*/duration)
jQuery.fn.enableResizeGrid = function (options) 
{
  this.each(function()
  {
    //default settings
  	var settings = {
			rows: 2,
			cols: 3,
			padding: 0,
			speed: 'normal',
			collapse_size: 20,
			unit: 'px'
		};
    
    //overwrite settings defined by the user
    if(options)
			$.extend(settings, options);
  
    initializeGrid(settings, $(this));
		
    $(this).children().hover(
      function () {
        resizeGrid(settings, $(this).parent(),$(this));
      },
      function() {
       resizeGrid(settings, $(this).parent(), null);
      }
    );

    $(window).resize(function() {
      resizeGrid(settings, $(this).parent(),null);
    });
  });

  return this;
};
