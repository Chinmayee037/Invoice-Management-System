import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit, AfterViewInit {
  userData: any;
  selectedInvoiceId: any;
  invoiceForm!: FormGroup;
  toastMessage: string = '';
  TotalInvoice: [] = [];
  invoiceCounts = { total: 0, pending: 0, paid: 0 };
  searchText: string = '';
  filteredUserData: any[] = [];

  page:number = 1;
  count:number = 0;
  tableSize:number =10;

  constructor(private service: UserService, private fb: FormBuilder) {}

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      id: ['', [Validators.required, this.onlyNumbersValidator]],
      clientname: ['', [Validators.required, Validators.maxLength(20)]],
      date: ['', [Validators.required]],
      Amount: ['', [this.onlyNumbersValidator]],
      duedate: ['', [Validators.required]],
      status: [''],
    });
    this.getInvoiceData();
    localStorage.getItem('useremail');
    console.log('local storager', localStorage.getItem('useremail'));
  }

  // pagination
  onTableDataChange(event:any){
    this.page=event;
    this.getInvoiceData();
  }

// to show the toast message on delete edit and create
  ngAfterViewInit(): void {
    const editBtn = document.getElementById('editBtn');
    const createBtn = document.getElementById('createBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const toastLiveExample = document.getElementById('liveToast');

    editBtn?.addEventListener('click', () => {
      this.toastMessage = 'Invoice Updated Successfully.' ;
      this.showToast(toastLiveExample);
    });
    createBtn?.addEventListener('click', () => {
      this.toastMessage = `Invoice Created Successfully.`;
      this.showToast(toastLiveExample);
    });
    deleteBtn?.addEventListener('click', () => {
      this.toastMessage = 'Invoice Deleted Successfully.';
      this.showToast(toastLiveExample);
    });
  }
  showToast(toastElement: any): void {
    if (toastElement) {
      const toast = new (window as any).bootstrap.Toast(toastElement);
      toast.show();
    }
  }
  // to show dynamic TOTAL ,PAID & PENDING data on cards
  getInvoiceCounts() {
    const totalInvoiceCount = this.userData.length;
    const pendingInvoiceCount = this.userData.filter(
      (invoice: any) => invoice.status === 'due').length;
    const paidInvoiceCount = this.userData.filter(
      (invoice: any) => invoice.status === 'paid').length;
    return {
      total: totalInvoiceCount,
      pending: pendingInvoiceCount,
      paid: paidInvoiceCount,
    };
  }
  updateInvoiceCounts() {
    const counts = this.getInvoiceCounts();
    this.invoiceCounts = counts;
  }

  // get invoice data to table
  getInvoiceData() {
    this.service.getUsers().subscribe((res) => {
      console.log('Response', res);
      this.userData = res;
      this.updateInvoiceCounts();
    });
  }
  // create Invoice
  createInvoice() {
    const formData = this.invoiceForm.value;
    console.log(formData, 'formData');
    this.service.postUser(formData).subscribe(
      (res: any) => {
        console.log('Invoice Created Successfully', res);
        const newInvoice = {
          id: res.id,
          clientname: res.clientname,
          date: res.date,
          Amount: res.Amount,
          duedate: res.duedate,
          status: res.status,
        };
        this.userData.push(newInvoice);
        this.invoiceForm.reset();
        console.log('this.userData', this.userData);
        this.updateInvoiceCounts();
      },
      (error) => {
        console.error('Error creating invoice', error);
      }
    );
  }
  createButtonReset() {
    this.invoiceForm.reset();
    this.invoiceForm.get('id')?.enable();
    this.invoiceForm.get('clientname')?.enable();
  }
  // get the id from table
  setSelectedInvoice(invoiceId: string) {
    this.selectedInvoiceId = invoiceId;
    this.invoiceForm.get('id')?.disable();
    this.invoiceForm.get('clientname')?.disable();
    console.log('setSelectedInvoice', this.selectedInvoiceId);

    // fetch table data to edit modal---
    const invoiceArrIdselected = this.userData.find(
      (item: any) => item.id === invoiceId
    );
    console.log('invoiceArrIdselected', invoiceArrIdselected);

    if (invoiceArrIdselected) {
      this.invoiceForm.patchValue({
        id: invoiceArrIdselected.id,
        clientname: invoiceArrIdselected.clientname,
        date: invoiceArrIdselected.date,
        duedate: invoiceArrIdselected.duedate,
        Amount: invoiceArrIdselected.Amount,
        status: invoiceArrIdselected.status,
      });
    }
  }
  // delete each record
  deleteInvoice() {
    if (this.selectedInvoiceId) {
      this.service.deleteUser(this.selectedInvoiceId).subscribe(
        (res) => {
          console.log('Invoice deleted successfully:', res);
          this.getInvoiceData();
        },
        (error) => {
          console.error('Error deleting invoice:', error);
        }
      );
    }
  }

  // update Invoice data
  updateInvoice() {
    if (this.selectedInvoiceId) {
      const updateData = this.invoiceForm.getRawValue();
      this.service.putUser(this.selectedInvoiceId, updateData).subscribe(
        (res) => {
          console.log('Updated Data', res);
          this.getInvoiceData();
        },
        (error) => {
          console.error('Error updating invoice:', error);
        }
      );
    }
  }

  // onlyNumbersValidator(control: FormControl): { [key: string]: any } | null {
    onlyNumbersValidator(control: FormControl): any {
    if (!control.value) {
      return { required: true };
    }
    const valid = /^\d+$/.test(control.value);
    return valid ? null : { invalidNumber: true };
  }
  
}
