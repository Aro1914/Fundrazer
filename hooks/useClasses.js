export const useClasses = (_class = '', ...classes) => {
    if (_class && classes) return [_class, ...classes].reduce((a, b) => "" + a + " " + b);
    return String(_class);
};