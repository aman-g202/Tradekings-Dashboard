import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import data from '../../assets/captured-data';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  data = [];

  constructor() { }

  ngOnInit() {
    this.prepareData();
  }

  prepareData() {
    data.forEach(item => {
      item.unitSizeDetails.forEach(unitSize => {
        unitSize.products.forEach(product => {
          /* Pushed Tk Product Row */
          this.data.push({
            'Employee Name': item.capturedBy.name,
            Province: item.customerDetail.province,
            'Town/City': item.customerDetail.city,
            'Compound/Area': item.customerDetail.area,
            'Shop Name': item.customerDetail.shopName,
            'TK Product Code': product.productCode,
            'TK Product Name': product.masterName,
            Category: item.parentCategory,
            'Sub Catagory': item.childCategoryName,
            'Brand Type': 'TK',
            Brand: product.brand,
            'Product Name': product.productName,
            'Unit Type': 'Case',
            'Unit Size': unitSize.unitSize,
            'Case Size': +product.caseSize,
            'Price Capturing Date': item.date,
            RRP: +product.RRP,
            'Monthly Sales In Qty': +product.MSQ
          });
          product.competitiveProduct.forEach(compProduct => {
            /* Pushed Comp Product Row */
            this.data.push({
              'Employee Name': item.capturedBy.name,
              Province: item.customerDetail.province,
              'Town/City': item.customerDetail.city,
              'Compound/Area': item.customerDetail.area,
              'Shop Name': item.customerDetail.shopName,
              'TK Product Code': compProduct.productCode,
              'TK Product Name': product.productName,
              Category: item.parentCategory,
              'Sub Catagory': item.childCategoryName,
              'Brand Type': 'Comp',
              Brand: compProduct.brand,
              'Product Name': compProduct.productName,
              'Unit Type': 'Case',
              'Unit Size': unitSize.unitSize,
              'Case Size': +compProduct.caseSize,
              'Price Capturing Date': item.date,
              RRP: +compProduct.RRP,
              'Monthly Sales In Qty': +compProduct.MSQ
            });
          });
        });
      });
    });
  }

  onDownloadSheet() {
    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    // const range = XLSX.utils.decode_range(ws['!ref']);

    // tslint:disable-next-line: prefer-for-of
    // let cell: any;
    // let address: string;
    // for (let i = 0; i < range.e.c; i++) {
    //   address = XLSX.utils.encode_cell({ c: i, r: 0 });
    //   cell = ws[address];
    // -----For Styling----
    //   cell.s = {
    //     patternType: 'solid',
    //     fgColor: { theme: 7, tint: 0.7999816888943144, rgb: 'FFF2CC' },
    //     bgColor: { indexed: 64 }
    //   };
    //   ws[address] = cell;
    // }

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'exported_price_survey_format.xlsx');
    // XLSX.writeFile(wb, 'exported_price_survey_format.xlsx', { cellStyles: true });
  }

}
