import { LightningElement } from "lwc";
import Utils from "c/utils";

export default class TripReportForm extends LightningElement {
	handleSuccess() {
		Utils.showToast(this, "Transaction Complete", "Your Trip Report was Saved");
	}
}
