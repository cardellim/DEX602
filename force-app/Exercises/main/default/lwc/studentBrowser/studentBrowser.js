import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import { NavigationMixin } from "lightning/navigation";
import getStudents from "@salesforce/apex/StudentBrowser.getStudents";
import SELECTED_STUDENT_CHANNEL from "@salesforce/messageChannel/SelectedStudentChannel__c";

export default class StudentBrowser extends NavigationMixin(LightningElement) {
	selectedInstructorId = "";
	selectedDeliveryId = "";
	@wire(getStudents, { instructorId: "$selectedInstructorId", courseDeliveryId: "$selectedDeliveryId" }) students;
	cols = [
		{
			fieldName: "Name",
			label: "Name"
		},
		{
			fieldName: "Title",
			label: "Title",
			hiddenOnMobile: true
		},
		{
			fieldName: "Phone",
			label: "Phone",
			type: "phone"
		},
		{
			fieldName: "Email",
			label: "E-Mail",
			type: "email"
		}
	];
	@wire(MessageContext) messageContext;

	handleFilterChange(event) {
		this.selectedInstructorId = event.detail.instructorId;
		this.selectedDeliveryId = event.detail.deliveryId;
	}

	handleStudentSelected(event) {
		const studentId = event.detail.studentId;
		this.updateSelectedStudent(studentId);
	}

	updateSelectedStudent(studentId) {
		publish(this.messageContext, SELECTED_STUDENT_CHANNEL, {
			studentId: studentId
		});
	}

	handleRowDblClick(event) {
		const studentId = event.detail.pk;
		this[NavigationMixin.Navigate]({
			type: "standard__recordPage",
			attributes: {
				recordId: studentId,
				objectApiName: "Contact",
				actionName: "edit"
			}
		});
	}

	handleRowClick(event) {
		const studentId = event.detail.pk;
		this.updateSelectedStudent(studentId);
	}
}
