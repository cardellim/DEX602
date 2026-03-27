import { LightningElement, api, wire } from "lwc";
import { createRecord, getFieldValue, getRecord, updateRecord } from "lightning/uiRecordApi";
import Utils from "c/utils";
import getInstructors from "@salesforce/apex/StudentBrowserForm.getInstructors";
import { getObjectInfo, getPicklistValues } from "lightning/uiObjectInfoApi";
import { reduceErrors } from "c/ldsUtils";

import OBJECT_TRIP_REPORT from "@salesforce/schema/TripReport__c";
import FIELD_ID from "@salesforce/schema/TripReport__c.Id";
import FIELD_DATE from "@salesforce/schema/TripReport__c.Date__c";
import FIELD_INSTRUCTOR from "@salesforce/schema/TripReport__c.Instructor__c";
import FIELD_NAME from "@salesforce/schema/TripReport__c.Name";
import FIELD_RATING from "@salesforce/schema/TripReport__c.Rating__c";
import FIELD_REVIEWTYPE from "@salesforce/schema/TripReport__c.ReviewType__c";
import FIELD_REVIEW from "@salesforce/schema/TripReport__c.Review__c";

const fieldsToLoad = [FIELD_DATE, FIELD_INSTRUCTOR, FIELD_NAME, FIELD_RATING, FIELD_REVIEWTYPE, FIELD_REVIEW];

export default class TripReportFormAdvanced extends LightningElement {
	error;
	saveButtonDisabled = true;
	_editorInitialized;

	@api recordId;

	//arrays to populate form options
	instructors;
	reviewTypes;

	//properties to store form values
	instructorId;
	locationName;
	dateVisited;
	reviewType;
	rating = 3;
	review;

	//TODO #3: following the examples of and dateVisited and instructorId, store the value of the name, rating, review type, and review fields in JavaScript properties
	@wire(getRecord, { recordId: "$recordId", fields: fieldsToLoad })
	wiredTripReport({ error, data }) {
		if (data) {
			this.dateVisited = getFieldValue(data, FIELD_DATE);
			this.instructorId = getFieldValue(data, FIELD_INSTRUCTOR);
			this.locationName = getFieldValue(data, FIELD_NAME);
			this.rating = getFieldValue(data, FIELD_RATING);
			this.reviewType = getFieldValue(data, FIELD_REVIEWTYPE);
			this.review = getFieldValue(data, FIELD_REVIEW);
			this.error = undefined;
		} else if (error) {
			this.error = error;
		}
	}

	@wire(getInstructors)
	wired_getInstructors({ error, data }) {
		this.instructors = [];
		if (data) {
			this.instructors = data.map((instructor) => ({
				value: instructor.Id,
				label: instructor.Name
			}));
		} else if (error) {
			this.error = error;
		}
	}

	//Get Object Info
	@wire(getObjectInfo, { objectApiName: OBJECT_TRIP_REPORT })
	objectInfo;

	//Get ReviewType picklist values
	@wire(getPicklistValues, { recordTypeId: "$objectInfo.data.defaultRecordTypeId", fieldApiName: FIELD_REVIEWTYPE })
	wired_getPicklistValues({ error, data }) {
		this.reviewTypes = [];
		if (data) {
			this.reviewTypes = data.values.map((reviewType) => ({
				value: reviewType.value,
				label: reviewType.label
			}));
		}
	}

	get formTitle() {
		return typeof this.recordId === "undefined" || this.recordId === 0 ? "Add Trip Report" : "Edit Trip Report";
	}

	//TODO #4: set the value of the private properties when they're changed in the form
	validateFields() {
		const fields = Array.from(this.template.querySelectorAll(".validateMe"));
		return fields.every((currentField) => currentField.checkValidity());
	}

	handleBlur() {
		this.saveButtonDisabled = !this.validateFields();
	}

	handleInstructorChange(event) {
		this.instructorId = event.target.value;
	}
	handleLocationNameChange(event) {
		this.locationName = event.target.value;
	}
	handleDateVisitedChange(event) {
		this.dateVisited = event.target.value;
	}
	handleReviewTypeChange(event) {
		this.reviewType = event.target.value;
	}
	handleRatingChange(event) {
		this.rating = event.target.value;
	}
	handleReviewChange(event) {
		this.review = event.target.value;
	}

	handleSave() {
		this.saveTripReport();
	}

	returnToBrowseMode() {
		const evt = new CustomEvent("tripreportmodechange", {
			detail: {
				mode: "browse"
			}
		});
		this.dispatchEvent(evt);
	}

	saveTripReport() {
		const fieldsToSave = {};
		fieldsToSave[FIELD_DATE.fieldApiName] = this.dateVisited;
		fieldsToSave[FIELD_INSTRUCTOR.fieldApiName] = this.instructorId;
		fieldsToSave[FIELD_RATING.fieldApiName] = this.rating;
		fieldsToSave[FIELD_REVIEWTYPE.fieldApiName] = this.reviewType;
		fieldsToSave[FIELD_REVIEW.fieldApiName] = this.review;
		fieldsToSave[FIELD_NAME.fieldApiName] = this.locationName;
		//in our request

		if (!this.recordId) {
			const recordInput = { fields: fieldsToSave, apiName: OBJECT_TRIP_REPORT.objectApiName };

			createRecord(recordInput)
				.then((tripReport) => {
					this.recordId = tripReport.id;
					Utils.showToast(this, "Success", "Trip Report Created", "success");
					this.returnToBrowseMode();
				})
				.catch((error) => {
					let errors = reduceErrors(error);
					let errorBody = errors.length ? errors[0] : "There was a problem creating your record.";
					Utils.showToast(this, "Error creating record", errorBody, "error");
				});
		} else {
			fieldsToSave[FIELD_ID.fieldApiName] = this.recordId;
			const recordInput = { fields: fieldsToSave };
			updateRecord(recordInput)
				.then(() => {
					Utils.showToast(this, "Success", "Trip report updated", "success");
					this.returnToBrowseMode();
				})
				.catch((error) => {
					let errors = reduceErrors(error);
					let errorBody = errors.length ? errors[0] : "There was a problem updating your record.";
					Utils.showToast(this, "Error updating record", errorBody, "error");
				});
		}
	}
}
