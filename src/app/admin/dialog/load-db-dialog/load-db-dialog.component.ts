import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatColumnDef, MatTable, MatTableModule} from '@angular/material/table';
import {AddDescriptionDialogComponent} from '../add-description-dialog/add-description-dialog.component';
import {ApplyDialogComponent} from '../apply-dialog/apply-dialog.component';
import {MatIcon} from '@angular/material/icon';
import {MatCheckbox} from '@angular/material/checkbox';

@Component({
  selector: 'app-load-db-dialog',
  imports: [CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatColumnDef,
    MatTableModule,
    MatIcon,
    MatCheckbox],
  templateUrl: './load-db-dialog.component.html',
  styleUrl: './load-db-dialog.component.css'
})
export class LoadDBDialogComponent {
  ignoredColumns = ['группа рек', 'foto', 'доступность'];
  columnHeaders: string[] = [];
  displayedColumns: string[] = [];
  invalidPhotoIndexes = new Set<number>();
  selectedRows = new Set<number>();
  columnFilters: { [key: string]: string } = {};
  get filteredRows() {
    return this.rows.filter(row => {
      return Object.entries(this.columnFilters).every(([key, filter]) => {
        const value = row.rowData[key]?.toString().toLowerCase() || '';
        return value.includes(filter.toLowerCase());
      });
    });
  }

  rows: {
    rowData: Record<string, any>;
    imageBase64: string | null;
  }[] = [];

  constructor(
    public dialogRef: MatDialogRef<LoadDBDialogComponent>,
    private dialog: MatDialog
  ) {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const raw = data as any[][];
      const headers = raw[0];

      // Игнорируем лишние колонки (регистр insensitive)
      this.columnHeaders = headers.filter(
        h =>
          !this.ignoredColumns.includes(
            String(h).toLowerCase().trim()
          )
      );

      this.displayedColumns = ['select','actions', ...this.columnHeaders, 'photo', 'preview'];

      this.rows = raw.slice(1).map(row => {
        const rowData: Record<string, any> = {};
        headers.forEach((header, i) => {
          if (!this.ignoredColumns.includes(String(header).toLowerCase().trim())) {
            rowData[header] = row[i];
          }
        });
        return {
          rowData,
          imageBase64: null,
        };
      });
    };

    reader.readAsBinaryString(file);
  }

  toggleRowSelection(index: number): void {
    if (this.selectedRows.has(index)) {
      this.selectedRows.delete(index);
    } else {
      this.selectedRows.add(index);
    }
  }

  isRowSelected(index: number): boolean {
    return this.selectedRows.has(index);
  }

  toggleSelectAll(): void {
    if (this.selectedRows.size === this.rows.length) {
      this.selectedRows.clear();
    } else {
      this.rows.forEach((_, i) => this.selectedRows.add(i));
    }
  }

  deleteSelectedRows(): void {
    this.rows = this.rows.filter((_, i) => !this.selectedRows.has(i));
    this.selectedRows.clear();
  }


  onImageSelect(event: any, index: number): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.rows[index].imageBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  openAddDescriptionDialog(index: number, column: string): void {
    const old = this.rows[index].rowData[column] || '';
    const dialogRef = this.dialog.open(AddDescriptionDialogComponent, {
      width: '50lvw',
      data: { oldDescription: old },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.data) {
        this.rows[index].rowData[column] = result.data;
      }
    });
  }

  isDescriptionColumn(col: string): boolean {
    const normalized = col.toLowerCase().trim();
    return ['описание', 'description'].includes(normalized);
  }

  deleteRow(index: number): void {
    this.rows.splice(index, 1);
    this.rows = [...this.rows]; // триггерим обновление таблицы
  }


  submit(): void {
    this.invalidPhotoIndexes.clear();

    this.rows.forEach((row, index) => {
      if (!row.imageBase64) {
        this.invalidPhotoIndexes.add(index);
      }
    });

    // Есть невалидные строки → спрашиваем у пользователя
    if (this.invalidPhotoIndexes.size > 0) {
      const dialogRef = this.dialog.open(ApplyDialogComponent, {
        width: '400px',
        data: { message: 'Некоторые строки не содержат фото. Сохранить только валидные строки?' },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.data === true) {
          // Фильтруем только валидные строки
          const validRows = this.rows
            .filter(row => !!row.imageBase64)
            .map(row => {
              const rowData: Record<string, any> = { ...row.rowData };
              rowData['Фото'] = row.imageBase64;
              return rowData;
            });

          this.dialogRef.close(validRows);
        }

        // Если false — ничего не делаем, остаёмся в диалоге
      });

      return; // Выходим из submit до завершения диалога
    }

    // Все валидны → сохраняем всё
    const finalData = this.rows.map(row => {
      const rowData: Record<string, any> = { ...row.rowData };
      rowData['Фото'] = row.imageBase64;
      return rowData;
    });

    this.dialogRef.close(finalData);
  }

  submitSelected(): void {
    const selectedRowsArray = this.rows.filter((_, i) => this.selectedRows.has(i));

    if (selectedRowsArray.length === 0) return;

    const invalidIndexes = selectedRowsArray
      .map((row, i) => (!row.imageBase64 ? i : null))
      .filter(i => i !== null) as number[];

    this.invalidPhotoIndexes.clear();
    invalidIndexes.forEach(i => {
      const originalIndex = Array.from(this.selectedRows)[i];
      this.invalidPhotoIndexes.add(originalIndex);
    });

    // Если есть невалидные — показываем диалог
    if (invalidIndexes.length > 0) {
      const dialogRef = this.dialog.open(ApplyDialogComponent, {
        width: '400px',
        data: { message: 'Некоторые выбранные строки не содержат фото. Сохранить только валидные?' },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.data === true) {
          const validRows = selectedRowsArray
            .filter(row => !!row.imageBase64)
            .map(row => {
              const rowData: Record<string, any> = { ...row.rowData };
              rowData['Фото'] = row.imageBase64;
              return rowData;
            });

          this.dialogRef.close(validRows);
        }
      });

      return;
    }

    // Все строки валидны
    const finalData = selectedRowsArray.map(row => {
      const rowData: Record<string, any> = { ...row.rowData };
      rowData['Фото'] = row.imageBase64;
      return rowData;
    });

    this.dialogRef.close(finalData);
  }


  cancel(): void {
    this.dialogRef.close();
  }
}
