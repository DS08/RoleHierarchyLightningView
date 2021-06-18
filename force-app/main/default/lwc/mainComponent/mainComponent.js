import { LightningElement } from 'lwc';
import getRoleHierarchy from '@salesforce/apex/RoleHierarchyController.getRoleHierarchy';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class MainComponent extends LightningElement {
    role = {};
    isLoading = false;
    async connectedCallback(){
        this.role = await getRoleHierarchy();
        console.log(this.role);
    }

    async refreshLwcComponent(){
        this.isLoading = true;
        this.role = {...await getRoleHierarchy()};
        this.isLoading = false;
    }

    handleLoading(event){
        if(event.detail === true){
            this.isLoading = event.detail;
        }
        
        setTimeout(function(){
            if(event.detail === false){
                this.isLoading = event.detail;
            }
        }.bind(this), 5000);
    }

    showNotification(event) {
        const evt = new ShowToastEvent({
            title: event.detail.title,
            message: event.detail.msg,
            variant: event.detail.variant,
        });
        this.dispatchEvent(evt);
    }
}