// (window as any).global = window;
// (window as any).process = {
//     env: { DEBUG: undefined },
// };
if(typeof global === 'undefined') {
  window.global = window;
}
