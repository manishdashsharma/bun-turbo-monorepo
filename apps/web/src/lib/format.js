const dateFormatter = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' });

export const formatShortDate = (value) => dateFormatter.format(new Date(value));
