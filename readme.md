### Refactored code
The following code refactor revolves around the following 

1. Naming conventions 
2. Modularity 
3. Comments
4. Code smells
5. Readability 

When reviewing or writing code, these are the initial items on my checklist. I ensure that these are properly addressed before moving on to other aspects of the code.

> These are things I did not like about the codebase. 

- Javascript is directly written in the HTML.

- Global Variables and Functions: Example: The function random() and the variable seed are globally defined. This could lead to conflicts if other scripts on the same page use the same names. Consider wrapping your code in an IIFE (Immediately Invoked Function Expression) or using a module to encapsulate your variables and functions.

- Variable nameing: Some variable names are not descriptive enough. example random() function and more.

- Hardcoded values: There are hardcoded values like `maxHeight = parseInt(graphElement.getAttribute('height'), 10)`. This could lead to issues if the SVG element's height is changed elsewhere. It's better to compute these values dynamically or pass them as parameters.

- Magic Numbers: The code contains "magic numbers" (like 80, 36, 30, 9, etc.) whose meaning isn't immediately clear. Define these as named constants at the top of your script to make the code more readable and maintainable.

- Use of long function: the drawLine() function in particular is quite long
Commented code blocks in both CSS and JS code.
Therefore I refactored the JS file for better readability and modularity. and minor changes in the HTML and CSS files.

### A Few things I was not able to fix or improve:

- Make the SVG graph responsive. 
- Event title not showing on the newly added marker.
- Adding test.
