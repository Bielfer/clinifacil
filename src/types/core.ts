export type IconType = React.ComponentType<React.ComponentProps<'svg'>>;

export type ObjectEntries<T> = [keyof T, T[keyof T]][];
