export const generateMonths = (): string[] => {
    return [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
};

export const generateYears = (): number[] => {
    const years = [];

    for (let i = new Date().getFullYear(); i >= 1920; i--) {
        years.push(i);
    }

    return years;
};
