import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import getStudents from "@salesforce/apex/StudentBrowser.getStudents";
import SELECTED_STUDENT_CHANNEL from "@salesforce/messageChannel/SelectedStudentChannel__c";

export default class StudentBrowser extends LightningElement {
	selectedInstructorId = "";
	selectedDeliveryId = "";
	@wire(getStudents, { instructorId: "$selectedInstructorId", courseDeliveryId: "$selectedDeliveryId" }) students;
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
}
