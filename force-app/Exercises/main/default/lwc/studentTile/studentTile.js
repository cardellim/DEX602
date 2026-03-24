import { LightningElement, api } from "lwc";

export default class StudentTile extends LightningElement {
	@api student = {
		Name: "Mark Cardelli",
		PhotoUrl: "/services/images/photo/003B0FakePictId"
	};
	@api selectedStudentId = "";
	get tileSelected() {
		return this.selectedStudentId === this.student.Id ? "tile selected" : "tile";
	}

	handleStudentClick() {
		const evt = new CustomEvent("studentselected", {
			bubbles: true,
			composed: true,
			detail: { studentId: this.student.Id }
		});
		this.dispatchEvent(evt);
	}
}
