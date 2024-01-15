export interface SchoolboyItem {
  Id: number,
  FirstName: string,
  SecondName: string,
  LastName: string,

}

export interface SchoolBoy {
  Quantity: number;
  Items: SchoolboyItem[];
}

export interface ColumnItem {
  Id: number,
  Title: string,
}

export interface Columns {
  Quantity: number;
  Items: ColumnItem[];
}

export interface RateItem {
  Id?: number,
  SchoolboyId: number,
  ColumnId: number,
  Title?: string,

}

export interface Rate {
  Quantity: number;
  Items: RateItem[];
}

export interface TableItem {
  schoolboyId: string,
  schoolboyName: string,
  [key: string]: string | undefined;
}