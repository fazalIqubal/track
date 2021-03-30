/**
 * Enables Hot Module Reloading (HMR) when available.
 */
export function enableHotModuleReloading() {
  // Hot or not?
  if (module && module.hot) {
    module.hot.accept();
  }
}
