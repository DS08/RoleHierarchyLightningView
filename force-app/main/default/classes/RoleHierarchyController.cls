public with sharing class RoleHierarchyController {

    @AuraEnabled
    public static void createUserRoleRecord(Map<String, Object> userRoleRecord){
        try {
            UserRole userRole = new UserRole(Name = (String)userRoleRecord.get('Name'), DeveloperName = (String)userRoleRecord.get('DeveloperName'), ParentRoleId = (String)userRoleRecord.get('ParentRoleId'));
            insert userRole;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static RoleWrapper getRoleHierarchy(){
        List<UserRole> rootNode = [Select Id, Name From UserRole Where ParentRoleId = null];
        if(rootNode.size() <= 0)
            return null;

        RoleWrapper wrapper = new RoleWrapper(rootNode[0]);
        appendChildRoleWrappers(wrapper);
        return wrapper;
    }

    @AuraEnabled
    public static void deleteUserRole(String roleId){
        try {
            delete([Select Id From UserRole Where Id =: roleId]);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static void appendChildRoleWrappers(RoleWrapper wrapper){
        
        List<UserRole> childs = [Select Id, Name From UserRole Where ParentRoleId =: wrapper.roleId];

        if(childs.isEmpty()){
            return;
        }

        for(UserRole child : childs){
            RoleWrapper childWrapper = new RoleWrapper(child);

            if(wrapper.childRoles == null){
                wrapper.childRoles = new List<RoleWrapper>{childWrapper};
            }else{
                wrapper.childRoles.add(childWrapper);
            }
            appendChildRoleWrappers(childWrapper);
        }
    }

    public class RoleWrapper{
        @AuraEnabled
        public Id roleId{get;set;}

        @AuraEnabled
        public String name{get;set;}

        @AuraEnabled
        public List<RoleWrapper> childRoles{get;set;}

        @AuraEnabled
        public String url{get;set;}

        public RoleWrapper(UserRole role){
            this.roleId = role.Id;
            this.name = role.Name;
            this.url = '/' + role.Id;
        }
    }

}