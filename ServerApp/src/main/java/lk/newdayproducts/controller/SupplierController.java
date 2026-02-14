package lk.newdayproducts.controller;

import lk.newdayproducts.dao.SupplierDao;
import lk.newdayproducts.entity.Supplier;
import lk.newdayproducts.entity.Suppliermaterialcategory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/suppliers")
public class SupplierController {

    @Autowired
    private SupplierDao supplierdao;


    @GetMapping(produces = "application/json")
    public List<Supplier> get(@RequestParam HashMap<String, String> params) {

        List<Supplier> suppliers = this.supplierdao.findAll();

        if (params.isEmpty()) return suppliers;

        String materialcategory = params.get("materialcategoryname");
        String materialcategoryid = params.get("materialcategoryid");
        String name = params.get("name");
        String statusid = params.get("statusid");
        String stateid = params.get("stateid");

        Stream<Supplier> estream = suppliers.stream();


        if (materialcategory != null)
            estream = estream.filter(e -> e.getSuppliermaterialcategories().iterator().next().getMaterialcategory().getName().equals(materialcategory));
        if (name != null) estream = estream.filter(e -> e.getName().contains(name));
        if (statusid != null)
            estream = estream.filter(e -> e.getSupplierstatus().getId() == Integer.parseInt(statusid));
//        if (materialcategoryid != null)
//            estream = estream.filter(e -> e.getSuppliermaterialcategories().iterator().next().getMaterialcategory().getId() == Integer.parseInt(materialcategoryid));
        if (stateid != null)
            estream = estream.filter(e -> e.getState().getId() == Integer.parseInt(stateid));
        if (materialcategoryid != null) {
            int categoryId = Integer.parseInt(materialcategoryid);
            estream = estream.filter(e -> e.getSuppliermaterialcategories()
                    .stream()
                    .anyMatch(smc -> smc.getMaterialcategory().getId() == categoryId));
        }
        return estream.collect(Collectors.toList());

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Supplier supplier) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if (supplierdao.findByName(supplier.getName()) != null)
            errors = errors + "<br> Existing Supplier";

        if (errors == "") {
            for (Suppliermaterialcategory s : supplier.getSuppliermaterialcategories()) {
                s.setSupplier(supplier);
            }
//            for (Suppliermaterialcategory smc : supplier.getSuppliermaterialcategories()) {
//                System.out.println(smc.getMaterialcategory().getName());
//            }
            supplierdao.save(supplier);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        responce.put("id", String.valueOf(supplier.getId()));
        responce.put("url", "/suppliers/" + supplier.getId());
        responce.put("errors", errors);

        return responce;
    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
//    @PreAuthorize("hasAuthority('Employee-Update')")
    public HashMap<String, String> update(@RequestBody Supplier supplier) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";
//        System.out.println(supplier.getName());
        Supplier sup = supplierdao.findByMyId(supplier.getId());

        if (sup != null) {
            try {
                sup.getSuppliermaterialcategories().clear();
                supplier.getSuppliermaterialcategories().forEach(newSupMatCategory -> {
                    newSupMatCategory.setSupplier(sup);
                    sup.getSuppliermaterialcategories().add(newSupMatCategory);
                    newSupMatCategory.setSupplier(sup);
                });
                // Update basic user properties
                BeanUtils.copyProperties(supplier, sup, "id", "suppliermaterialcategories");

                supplierdao.save(sup); // Save the updated extUser object

                responce.put("id", String.valueOf(supplier.getId()));
                responce.put("url", "/suppliers/" + supplier.getId());
                responce.put("errors", errors);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }


        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Supplier s = supplierdao.findByMyId(id);

        if (s == null) errors = errors + "<br> Supplier Does Not Exist";

        if (errors.isEmpty()) supplierdao.delete(s);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/suppliers/" + id);
        responce.put("errors", errors);

        return responce;
    }

}