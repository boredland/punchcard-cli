const getDoubleDigits = (number: number) =>
    number.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false });

export const getLocalISOTimezone = (): string => {
    const offset = new Date().getTimezoneOffset();
    const prefix = offset >= 0 ? '-' : '+';
    const hours = Math.abs(Math.trunc(offset / 60));
    const minutes = Math.abs(offset % 60);
    return `${prefix}${getDoubleDigits(hours)}${getDoubleDigits(minutes)}`;
};

export const setTimeOnDate = (date: Date, time: string): Date =>
    new Date(date.setHours(Number(time.split(':')[0]), Number(time.split(':')[1])));
