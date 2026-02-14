package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ModuleDao;
import lk.newdayproducts.dao.UserDao;
import lk.newdayproducts.entity.Module;
import lk.newdayproducts.entity.Privilege;
import lk.newdayproducts.entity.User;
import lk.newdayproducts.entity.Userrole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/authorities")
public class UserAuthorityController {

    @Autowired
    private UserDao userdao;

    @Autowired
    private ModuleDao moduleDao;

    @GetMapping("/{username}")
    @ResponseStatus(HttpStatus.CREATED)
    public List<String> getUserAuthoritiesByUsername(@PathVariable String username) {
        User user = userdao.findByUsername(username);
        List<String> authorities = new ArrayList<>();

        if (user != null){
            List<Userrole> userroles = (List<Userrole>) user.getUserroles();

            for (Userrole u : userroles) {
                List<Privilege> Privileges = (List<Privilege>) u.getRole().getPrivileges();
                for (Privilege p : Privileges) {
                    String authority = p.getAuthority();
                    authorities.add(authority);
                }
            }
        }else{

            List<Module> modules = moduleDao.findAll();

            String opertaions[] = {"select", "insert", "delete", "update"};

            for (Module module : modules){
                for (String op : opertaions){
                    String authority = module.getName().toLowerCase() + "-" + op;
                    authorities.add(authority);
                }
            }

//            authorities = Arrays.asList(
//                    "rawmaterial-select","rawmaterial-delete","rawmaterial-update","rawmaterial-insert",
//                    "supplier-select","supplier-delete","supplier-update","supplier-insert",
//                    "purchaseorder-select","purchaseorder-delete","purchaseorder-update","purchaseorder-insert",
//                    "clientorder-select","clientorder-delete","clientorder-update","clientorder-insert",
//                    "grn-select","grn-delete","grn-update","grn-insert",
//                    "supplierpayment-select","supplierpayment-delete","supplierpayment-update","supplierpayment-insert",
//                    "client-select","client-delete","client-update","client-insert",
//                    "product-select","product-delete","product-update","product-insert",
//                    "productionorder-select","productionorder-delete","productionorder-update","productionorder-insert",
//                    "production-select","production-delete","production-update","production-insert",
//
//                    "user-select","user-delete","user-update","user-insert",
//                    "privilege-select","privilege-delete","privilege-update","privilege-insert",
//                    "employee-select","employee-delete","employee-update","employee-insert",
//                    "operation-select","operation-delete","operation-update","operation-insert"
//
//            );
        }
        return authorities;
    }
}
