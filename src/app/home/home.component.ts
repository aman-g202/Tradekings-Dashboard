import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import data from '../../assets/captured-data';
import { AppService } from '../../providers/app.service';
import { NgbCalendar, NgbDateParserFormatter, NgbDate } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  data = [];
  fetchedCapturedData: Array<any>;
  isFetchedData = false;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;


  constructor(
    private appService: AppService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit() {
    this.fetchCapturedData();
  }


  // Date Selection Begins
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    console.log('From date:' + JSON.stringify(this.fromDate));
    console.log('End date:' + JSON.stringify(this.toDate));
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
  // Date Selection Ends

  fetchCapturedData() {
    this.appService.fetchCapturedData().subscribe((result: Array<any>) => {
      if (result.length > 0) {
        this.fetchedCapturedData = result;
        this.prepareData();
      } else {
        this.isFetchedData = true;
        alert('No captured data found on server!');
      }
    }, error => {
      this.isFetchedData = true;
      console.error('Error on feching captured data--', error);
    });
  }

  prepareData() {
    this.fetchedCapturedData.forEach(item => {
      item.unitSizeDetails.forEach(unitSize => {
        unitSize.products.forEach(product => {
          /* Pushed Tk Product Row */
          this.data.push({
            'Employee Name': item.capturedBy ? item.capturedBy.name : 'Mayank Shah',
            Province: item.customerDetail.province,
            'Town/City': item.customerDetail.city,
            'Compound/Area': item.customerDetail.area,
            'Shop Name': item.customerDetail.shopName,
            'TK Product Code': product.productCode,
            'TK Product Name': product.masterName,
            Category: item.parentCategory,
            'Sub Catagory': item.childCategoryName,
            'Brand Type': 'TK',
            Brand: product.brand ? product.brand : product.BRAND,
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
              'Employee Name': item.capturedBy ? item.capturedBy.name : 'Not Found',
              Province: item.customerDetail.province,
              'Town/City': item.customerDetail.city,
              'Compound/Area': item.customerDetail.area,
              'Shop Name': item.customerDetail.shopName,
              'TK Product Code': compProduct.productCode,
              'TK Product Name': product.productName,
              Category: item.parentCategory,
              'Sub Catagory': item.childCategoryName,
              'Brand Type': 'Comp',
              Brand: compProduct.brand ? compProduct.brand : compProduct.BRAND,
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
    this.isFetchedData = true;
  }

  onDownloadSheet() {
    if (data.length === 0) {
      alert('No captured data found on server!');
      return;
    }
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
