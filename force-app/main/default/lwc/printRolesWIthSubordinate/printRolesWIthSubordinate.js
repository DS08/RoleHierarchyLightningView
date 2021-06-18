import { LightningElement, api } from 'lwc';
import CommonStyleSheet from '@salesforce/resourceUrl/CommonStyleSheet';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import createUserRoleRecord from '@salesforce/apex/RoleHierarchyController.createUserRoleRecord';
import deleteUserRole from '@salesforce/apex/RoleHierarchyController.deleteUserRole';

export default class PrintRolesWIthSubordinate extends LightningElement {
    @api role;
    @api rootRole;
    isModalOpen = false;
    isDeleteModalOpen = false;
    selectedRoleToDelete;
    selectedRole;
    constructor() {
        super();
        // If the static resource is a file structure, then concatenate the 
        // file path with the imported reference.
        // @example myCommonStyles + '/file/path/styles.css'
        loadStyle(this, CommonStyleSheet)
            .then(result => {
                // Possibly do something when load is complete.
            })
            .catch(reason => {
                // Checkout why it went wrong.
            });
    }

    openNewRoleModal(event){
        const btn = event.target;
        this.selectedRole = btn.dataset.currentRole === this.role.roleId ? this.role : this.role.childRoles.find(child => child.roleId === btn.dataset.currentRole);
        this.isModalOpen = true;
    }

    openDeleteModal(event){
        const btn = event.target;
        this.selectedRoleToDelete = btn.dataset.currentRole === this.role.roleId ? this.role : this.role.childRoles.find(child => child.roleId === btn.dataset.currentRole);
        this.isDeleteModalOpen = true;
    }

    closeModal(){
        this.isModalOpen = false;
    }

    closeDeleteModal(){
        this.isDeleteModalOpen = false;
    }

    deleteSelectedRole(event){
        const roleId = this.selectedRoleToDelete.roleId;

        // method to delete record.
        deleteUserRole({'roleId' : roleId}).then(async(response) => {
            this.showNotification('Success', 'User Role Successfully Deleted.', 'success');
            this.isDeleteModalOpen = false;
            await this.dispatchEvent(new CustomEvent('refresh', { bubbles: true , composed : true }));
            this.handleLoading(false);
        }).catch(error => {
            this.showNotification('Error', 'User Role Deletion Errored Out. Message : '+error.body.message, 'error');
            this.handleLoading(false);
        });
    }

    createNewRole(){
        
        let allValid = true;

        this.template.querySelectorAll('.newRoleFields').forEach(element => {
            if(!element.validity.valid){
                allValid = false;
            }
            element.reportValidity();
        });
        
        if(!allValid){
            return;
        }

        this.handleLoading(true);
        const parentRoleId = this.selectedRole.roleId;
        const devName = this.template.querySelector('lightning-input[data-name="devNameField"]').value || '';
        //TODO : check for not having 2 consecutive underscore and underscore at the last
        // TODO : unique devName
        const name = this.template.querySelector('lightning-input[data-name="nameField"]').value || '';



        // Creating mapping of fields of Account with values
        var fieldValues = {'Name' : name, 'DeveloperName' : devName, 'ParentRoleId' : parentRoleId};

        //method to create record.
        createUserRoleRecord({'userRoleRecord' : fieldValues}).then(async(response) => {
            this.showNotification('Success', 'User Role Successfully Created.', 'success');
            this.isModalOpen = false;
            await this.dispatchEvent(new CustomEvent('refresh', { bubbles: true , composed : true }));
            this.handleLoading(false);
        }).catch(error => {
            this.showNotification('Error', 'User Role Creation Errored Out. Message : '+error.body.message, 'error');
            this.handleLoading(false);
        });
    }

    handleLoading(value){
        this.dispatchEvent(new CustomEvent('createrole', {detail : value, bubbles: true , composed : true }));
    }

    showNotification(title, msg, variant) {
        this.dispatchEvent(new CustomEvent('shownotification', {detail : {title : title, msg : msg, variant : variant}, bubbles: true , composed : true}));
    }

    get isFirst(){
        return this.role.roleId === this.rootRole.roleId;
    }
}