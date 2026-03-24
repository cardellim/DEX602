import { LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { subscribe, unsubscribe, MessageContext } from "lightning/messageService";
import { getRecord, getFieldValue, getFieldDisplayValue } from "lightning/uiRecordApi";
import FIELD_NAME from "@salesforce/schema/Contact.Name";
import FIELD_DESCRIPTION from "@salesforce/schema/Contact.Description";
import FIELD_EMAIL from "@salesforce/schema/Contact.Email";
import FIELD_PHONE from "@salesforce/schema/Contact.Phone";
import SELECTED_STUDENT_CHANNEL from "@salesforce/messageChannel/SelectedStudentChannel__c";
const fields = [FIELD_NAME, FIELD_DESCRIPTION, FIELD_EMAIL, FIELD_PHONE];

export default class StudentDetail extends NavigationMixin(LightningElement) {
	studentId; // = "003C200000KXhQrIAL";
	subscription;

	//TODO #4: use wire service to call getRecord, passing in our studentId and array of fields.
	//		   Store the result in a property named wiredStudent.
	@wire(getRecord, { recordId: "$studentId", fields })
	wiredStudent;
	@wire(MessageContext) messageContext;

	//TODO #5: We provided a getter for the name field.
	// 		   To prepare for Lab 1, create getters for the description, phone, and email fields.
	get name() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_NAME);
	}
	get description() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_DESCRIPTION);
	}
	get phone() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_PHONE);
	}
	get email() {
		return this._getDisplayValue(this.wiredStudent.data, FIELD_EMAIL);
	}
	//TODO #6: Review the cardTitle getter, and the _getDisplayValue function below.
	get cardTitle() {
		let title = "Please select a student";
		if (this.wiredStudent.data) {
			title = this.name;
		} else if (this.wiredStudent.error) {
			title = "Something went wrong...";
		}
		return title;
	}

	_getDisplayValue(data, field) {
		return getFieldDisplayValue(data, field) ? getFieldDisplayValue(data, field) : getFieldValue(data, field);
	}

	connectedCallback() {
		if (this.subscription) {
			return;
		}
		this.subscription = subscribe(this.messageContext, SELECTED_STUDENT_CHANNEL, (message) => {
			this.handleStudentChange(message);
		});
	}

	handleStudentChange(message) {
		this.studentId = message.studentId;
	}

	disconnectedCallback() {
		unsubscribe(this.subscription);
		this.subscription = null;
	}

	navigateToRecord() {
		this[NavigationMixin.Navigate]({
			type: "standard__recordPage",
			attributes: {
				recordId: this.studentId,
				actionName: "view"
			}
		});
	}
}
