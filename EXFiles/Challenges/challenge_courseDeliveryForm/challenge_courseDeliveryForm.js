import { LightningElement, api } from 'lwc';

import LOCATION_FIELD from '@salesforce/schema/Course_Delivery__c.Location__c';
import REGION_FIELD	 from '@salesforce/schema/Course_Delivery__c.Region__c';

export default class challenge_CourseDeliveryForm extends LightningElement {
	@api recordId;
	@api objectApiName;
	fields = [LOCATION_FIELD, REGION_FIELD];
	
} 