import { LightningElement, api } from 'lwc';

export default class StudentTile extends LightningElement {
    @api student = {
        Name: 'Mark Cardelli',
        PhotoUrl: '/services/images/photo/003B0FakePictId',
    };
    @api isSelected = false;
    get tileSelected() {
        return this.isSelected ? "tile selected" : "tile";
    }
}