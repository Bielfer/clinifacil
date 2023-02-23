export type IconType = React.ComponentType<React.ComponentProps<'svg'>>;

export type ObjectEntries<T> = [keyof T, T[keyof T]][];

export type ChangeTypeOfKeys<
  T extends Object,
  Keys extends keyof T,
  NewType
> = {
  [key in keyof T]: key extends Keys ? NewType : T[key];
};
