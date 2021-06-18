@isTest
public class RoleHierarchyControllerTest {
    @isTest
    static void test_userRoleHierarchy(){
        List<UserRole> rootRoles = [Select Id, Name From UserRole Where ParentRoleId = null];
        UserRole rootRole;
        if(rootRoles.size() <= 0){
            rootRole = new UserRole(DeveloperName = 'CEO1', Name = 'CEO', ParentRoleId = null);
            insert rootRole;
        }else{
            rootRole = rootRoles[0];
        }
        

        UserRole firstChild = new UserRole(DeveloperName = 'CTO1', Name = 'CTO', ParentRoleId = rootRole.Id);
        insert firstChild;

        UserRole secondChild = new UserRole(DeveloperName = 'CFO1', Name = 'CFO', ParentRoleId = rootRole.Id);
        insert secondChild;

        UserRole grandChild = new UserRole(DeveloperName = 'Architect1', Name = 'Techincal Architect', ParentRoleId = firstChild.Id);
        insert grandChild;

        RoleHierarchyController.RoleWrapper wrapper = RoleHierarchyController.getRoleHierarchy();

        System.assertEquals(wrapper.roleId, rootRole.Id);
        System.assertEquals(wrapper.name, rootRole.Name);
    }
    
    @isTest
    static void test_createUserRoleHierarchy(){
        List<UserRole> rootRoles = [Select Id, Name From UserRole Where ParentRoleId = null];
        UserRole rootRole;
        if(rootRoles.size() <= 0){
            rootRole = new UserRole(DeveloperName = 'CEO1', Name = 'CEO', ParentRoleId = null);
            insert rootRole;
        }else{
            rootRole = rootRoles[0];
        }
        
        Map<String, Object> userRoleInfor = new Map<String, Object>{
            'Name' => 'childTestROle',
           	'DeveloperName' => 'childTestROle',
            'ParentRoleId' => rootRole.Id
        };
        
      	RoleHierarchyController.createUserRoleRecord(userRoleInfor);
    }
    
    @isTest
    static void test_deleteUserRoleHierarchy(){
        List<UserRole> rootRoles = [Select Id, Name From UserRole Where ParentRoleId = null];
        UserRole rootRole;
        if(rootRoles.size() <= 0){
            rootRole = new UserRole(DeveloperName = 'CEO1', Name = 'CEO', ParentRoleId = null);
            insert rootRole;
        }else{
            rootRole = rootRoles[0];
        }
        UserRole firstChild = new UserRole(DeveloperName = 'CTO1', Name = 'CTO', ParentRoleId = rootRole.Id);
        insert firstChild;
      	RoleHierarchyController.deleteUserRole(firstChild.Id);
        
		System.assertEquals(0, [Select Id From UserRole Where Id =:firstChild.Id].size());        
    }
}