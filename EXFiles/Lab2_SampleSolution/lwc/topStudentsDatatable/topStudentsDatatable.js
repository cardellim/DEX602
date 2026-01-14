import { LightningElement, wire, track } from "lwc";
import getTopStudentsByCertCount from "@salesforce/apex/TopStudentsByCertifications.getTopStudentsByCertCount";

export default class TopStudentsDatatable extends LightningElement {
	@track rows = [];
	@track loading = true;
	error;

	columns = [
		{ label: "Name", fieldName: "name", type: "text" },
		{ label: "Email", fieldName: "email", type: "email" },
		{ label: "Phone", fieldName: "phone", type: "phone" },
		{ label: "Certifications", fieldName: "certCount", type: "number", cellAttributes: { alignment: "left" } }
	];

	@wire(getTopStudentsByCertCount)
	wiredAgg({ data, error }) {
		if (data) {
			// Direct access to AggregateResult properties; COUNT(Id) is 'expr0'
			this.rows = data.map((row) => ({
				id: row.Certified_Professional__c,
				name: row.Name,
				email: row.Email,
				phone: row.Phone,
				certCount: row.expr0
			}));
			this.error = undefined;
			this.loading = false;
		} else if (error) {
			this.error = error;
			this.rows = [];
			this.loading = false;
		}
	}
}
