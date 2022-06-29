//   onMouseDown = () => {
//     this.el.addEventListener("mousedown", (event) => {
//       if (event.target.matches(".taskName")) {
//         const spanLi = document.getElementById(event.target.id);
//         const li = spanLi.closest(".list");

//         const liClone = li.cloneNode();
//         liClone.innerHTML = li.innerHTML;
//         this.el.appendChild(liClone);

//         //get the index of the <li> to move from
//         const firstTopPoint =
//           this.el.getBoundingClientRect().top + window.scrollY;
//         const mouseDownPoint = event.pageY;
//         const liIndexMoveFrom = Math.floor(
//           (mouseDownPoint - firstTopPoint) / 52
//         );

//         //get coordinates of <li>
//         const rect = li.getBoundingClientRect();

//         //create a clone <li> based on the coordinates retrieved
//         // liClone.style.left = rect.left;
//         // liClone.style.top = rect.top;
//         let liCloneBottom = rect.top + 40;
//         const liCloneBottomBeforeMove = liCloneBottom;

//         //styling the clone as absolute so the relativity of <ul> does not affect its movement
//         //hide the original <li> when onmousedown is detected, leaving only the clone visible
//         liClone.style.position = "absolute";
//         liClone.style.width = "800px";
//         liClone.style.zIndex = 1000;
//         liClone.style.backgroundColor = "whitesmoke";
//         li.style.visibility = "hidden";

//         //get the correlative distance between the mouseclick point and the xy-axis
//         //when the mouse moves, the <li> moves accordingly
//         let distX = event.clientX - rect.left;
//         let distY = event.clientY - rect.top;

//         //initial move
//         move(event.pageX, event.pageY);

//         //move
//         function move(pageX, pageY) {
//           liClone.style.left = pageX - distX + "px";
//           liClone.style.top = pageY - distY + "px";
//           liCloneBottom = pageY - distY + 40;
//           console.log(event.pageY);
//         }

//         //mousemove
//         const onMouseMove = (event) => {
//           move(event.pageX, event.pageY);
//         };

//         //mouseup
//         const onMouseUp = async () => {
//           console.log(event.pageY);
//           //calculate the index to move <li> to
//           //case 1: if the <li> index is initially higher than the index to move to, determine if its bottom crosses the half-line
//           //if it does, move the <li> to that index, else, move to index-1
//           //case 2: if the <li> index is initially lower than the index to move to, determine if its top crosses the half-line
//           //i0f it does, move the <li> to that index, else, move to index+1
//           //case 3: if the <li> move upward or downward outside of the page zone, move to first/last index accordingly

//           let liIndexMoveTo;
//           const dist = liCloneBottom - firstTopPoint;
//           if (liCloneBottom > liCloneBottomBeforeMove) {
//             liIndexMoveTo = Math.floor(dist / 52);
//             if (dist % 52 < 40) {
//               liIndexMoveTo--;
//             }
//           } else {
//             liIndexMoveTo = Math.floor((dist - 40) / 52);
//             if ((dist - 40) % 52 > 0) {
//               liIndexMoveTo++;
//             }
//             if (dist - 40 < 0) liIndexMoveTo = 0;
//           }

//           console.log(liIndexMoveFrom);
//           console.log(liIndexMoveTo);

//           await this.reorder(liIndexMoveFrom, liIndexMoveTo);

//           //make the <li> visible again and remove the clone from <ul>'s children
//           li.style.visibility = "visible";

//           document.removeEventListener("mousemove", onMouseMove);
//           document.removeEventListener("mouseup", onMouseUp);
//         };

//         //add mousemove - mouseup
//         document.addEventListener("mousemove", onMouseMove);
//         document.addEventListener("mouseup", onMouseUp);
//       }
//     });
//   };s
