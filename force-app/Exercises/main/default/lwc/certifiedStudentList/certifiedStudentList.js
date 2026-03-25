import { LightningElement, api, wire } from "lwc";
import { refreshApex } from '@salesforce/apex';
import getCertifiedStudents from "@salesforce/apex/CertifiedStudentList.getCertifiedStudents";
import deleteStudentCertification from '@salesforce/apex/CertifiedStudentList.deleteStudentCertification';

export default class CertifiedStudentList extends LightningElement {
	@api certificationId = 0;
	@api certificationName = "";
	certifiedStudents;
	btnGroupDisabled = true;
	error;
    _wiredStudentResult;

	columnConfig = [
		{
			label: "Name",
			fieldName: "name",
			type: "text"
		},
		{
			label: "Date",
			fieldName: "date",
			type: "text"
		},
		{
			label: "Email",
			fieldName: "email",
			type: "email"
		},
		{
			label: "Phone",
			fieldName: "phone",
			type: "phone"
		}
	];

	@wire(getCertifiedStudents, { certificationId: "$certificationId" })
	wired_getCertifiedStudents(result) {
        this._wiredStudentResult = result;
		this.certifiedStudents = [];
		if (result.data) {
			this.certifiedStudents = result.data.map((certHeld) => ({
				certificationHeldId: certHeld.Id,
				contactId: certHeld.Certified_Professional__r.Id,
				name: certHeld.Certified_Professional__r.Name,
				date: certHeld.Date_Achieved__c,
				email: certHeld.Certified_Professional__r.Email,
				phone: certHeld.Certified_Professional__r.Phone
			}));
		} else if (result.error) {
			this.error = result.error;
		}
	}

	handleRowSelection(event) {
		const numSelected = event.detail.selectedRows.length;
		this.btnGroupDisabled = numSelected === 0;
	}

    getSelectedIDs() {
        const datatable = this.template.querySelector('lightning-datatable');
        const ids = datatable.getSelectedRows().map( (r) => (
            r.certificationHeldId
        ));
        return ids;
    }

    handleCertActions(event) {
        const btnClicked = event.target.getAttribute('data-btn-id');
        switch (btnClicked) {
            case 'btnEmail':
                break;
            case 'btnSendCert':
                break;
            case 'btnDelete':
                this.handleDelete();
                break;
            default: 
                break;
        }
    }

    handleDelete() {
        const certificationHeldIds = this.getSelectedIDs();
        deleteStudentCertification({ certificationHeldIds })
          .then( () => {
            refreshApex(this._wiredStudentResult);
          })
          .catch( error => {
            this.error = error;
          });
    }
}
