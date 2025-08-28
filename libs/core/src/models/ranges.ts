export interface RangeCategoryDto {
  id: number;
  name: string;
  order: number;
  level: number;
  children: RangeCategoryDto[];
}

export interface EditTableData{
  table: RangeTableData;
  path: string;
}

export interface RangeTableData {
  cells: RangeTableCell[];
  config: RangeTableCellConfiguration;
}

export interface RangeTableCell {
  key: string;
  colorEntityId: string | null;
}

export interface RangeTableCellData {
  color: string;
  text: string;
  percent: number;
}

export interface RangeTableCellConfiguration {
  cellColors: CellColor[];
  multiColors: CellMulticolorConfiguration[];
}

export interface CellMulticolorConfiguration {
  id: string;
  cellColors: CellColor[];
  percent: number[];
  order: number;
}

export interface CellColor {
  id: string;
  color: string;
  text: string;
  order: number;
}

export interface RangeTableDto {
  cells: RangeTableCellDto[];
  usedColors?: RangeTableColor[] | null;
  position: string;
  openPercent: number | null;
}

export interface RangeTableCellDto {
  key: string;
  colorData: RangeTableColor[] | null;
}

export interface RangeTableColor {
  color: string;
  text: string;
  percent: number | null;
}
