import { LightningElement, api, wire } from 'lwc';
import getLocations from '@salesforce/apex/CourseDeliveryLocations.getLocations';

export default class DeliveryListMap extends LightningElement {
	mapMarkers;
	@api markersTitle = 'Deliveries Worldwide';
	@api listView='visible';

	@wire(getLocations)
	wired_getLocations({ error, data }) {
		this.mapMarkers = [];
		if (data) {
			this.mapMarkers = data.map(loc => ({
				location:
					{
						City: loc.Location__c.split(',')[0].trim(),
						Country: loc.Location__c.split(',')[1].trim(),
					},
					title: `${loc.numDeliveries} sessions`,
					description: loc.Location__c,
			}));

		} else if (error) {
			this.error = error;
		}
	}
}
