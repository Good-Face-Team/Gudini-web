// Fix for CSSStyleDeclaration issue in production
if (typeof CSSStyleDeclaration !== 'undefined') {
  const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
  CSSStyleDeclaration.prototype.setProperty = function(property: string, value: string, priority?: string) {
    // Ignore setting property '0' which causes the error
    if (property === '0') return '';
    return originalSetProperty.call(this, property, value, priority);
  };
}
