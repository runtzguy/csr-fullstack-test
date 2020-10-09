# Server Side Render Application with React, NodeJS (Express) and MySQL

## Purpose and How it works
This project servers as a introduction of how SSR works with React, NodeJS (Express) and MySQL. The Express server serves static React files to the user when first requesting the application domain. 
The React app will make request to the server on the same domain using different url paths.

## Client - Questions
### 1. In package.json, "proxy": "http://localhost:5000"

This command is needed for development. Why? Because the React app when run, runs on a different port than the Express server. This command serves as a proxy for the React app to reach the Express server during development phase.

### 2. In client/public/index.html for <'meta charset="utf-8" /'>

The characters you are reading on your screen now each have a numerical value. In the ASCII format, for example, the letter 'A' is 65, 'B' is 66, and so on. If you look at a table of characters available in ASCII you will see that it isn't much use for someone who wishes to write something in Mandarin, Arabic, or Japanese. For characters / words from those languages to be displayed we needed another system of encoding them to and from numbers stored in computer memory.


UTF-8 is just one of the encoding methods that were invented to implement this requirement. It lets you write text in all kinds of languages, so French accents will appear perfectly fine, as will text like this

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Бзиа збаша (Bzia zbaşa), Фэсапщы, Ç'kemi, ሰላም, and even right-to-left writing such as this السلام عليكم

If you copy and paste the above text into notepad and then try to save the file as ANSI (another format) you will receive a warning that saving in this format will lose some of the formatting. Accept it, then re-load the text file and you'll see something like this

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;???? ????? (Bzia zbasa), ???????, Ç'kemi, ???, and even right-to-left writing such as this ?????? ?????

### 3. In client/public/index.html for <'meta name="viewport" content="width=device-width, initial-scale=1.0"'>

This gives the browser instructions on how to control the page's dimensions and scaling.

The width=device-width part sets the width of the page to follow the screen-width of the device (which will vary depending on the device).

The initial-scale=1.0 part sets the initial zoom level when the page is first loaded by the browser.

Go here for further explanation: https://www.w3schools.com/tags/tag_meta.asp

### 4. On front end, there was an issue with the background color doesn't cover the whole page where there would be a white background.

The reason is because html element needed to have overflow:hidden so to remove the white background that overflows out because the content causes the overflow but the element that contains the background color does not overflow set and that is the cause.

To fix, set overflow-y:scroll for the element with the background color and the html element to overflow: hidden.

### 5. In components/Login.js

The code history.push('/vehicles') is used to redirect the user to a new page. The history variable acts like an array where you can push new routes into it and retrieve old routes from it.

## Server - Questions

### 1. In server/model/user.js, the 'return' after reject(err)

The return after reject(err) is needed because the process doesnt terminate after reject(err) execution.