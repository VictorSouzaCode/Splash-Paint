// Put a limit how many things i store in the undo redo array because with many storages it starts to affect performance in a negative way
// Why My App Gets Slower
// Redrawing everything on every frame i clear the canvas and replay the entire history array on every small change
// Too many strokes stored in Redux Keeping all strokes in Redux means every new stroke might cause re-renders or expensive redraws.
// No use of bitmap caching Even for strokes that aren’t changing, they’re being redrawn repeatedly instead of “flattened” into a base image.

// SOLUTION FOR PERFORMANCE ISSUES
// Make a pure TypeScript drawing module with snapshots + delta layers
// As soon as the user finishes a stroke (mouse/touch up), “commit” it to a base canvas snapshot.
// Future draws happen on top of that snapshot.
// This way you’re not replaying old strokes every frame.
// Draw the current in-progress stroke on a temporary overlay layer (like a second canvas or offscreen buffer).
// When the stroke is complete, merge it into the base canvas.
// This prevents the need to re-render history during active drawing.
// Snapshots + Delta Layers:
// Every completed stroke gets flattened into a base snapshot.
//  Avoid Storing History in Redux
// Redux is not designed for rapidly mutating, high-frequency drawing data.
// All drawing logic lives outside React/Redux
// No Redux state updates for each stroke (Redux is great for tool state but terrible for high-frequency pixel data).
// Use Redux only for tool state (color, size, mode) and high-level app state.

// How undo redo fits into this
// The hybrid undo/redo system:
// Makes undo/redo instant
// Pairs perfectly with flattening completed strokes into snapshots.
// So as my drawing grows:
// i don’t replay every single stroke anymore (flattening avoids this).
// Undo/redo is fast because i restore snapshots.
// Memory stays under control by pruning old snapshots/deltas.
// Together, this fully solves slowness from both drawing and undo/redo.