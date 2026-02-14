package lk.newdayproducts.controller;

import lk.newdayproducts.dao.MaterialcategoryDao;
import lk.newdayproducts.entity.Materialcategory;
import lk.newdayproducts.entity.Rawmaterial;
import lk.newdayproducts.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialcategories")
public class MaterialcategoryController {

    @Autowired
    private MaterialcategoryDao materialcategorydao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Materialcategory> get() {

        List<Materialcategory> materialcategories = this.materialcategorydao.findAll();

        materialcategories = materialcategories.stream().map(
                materialcategory -> { Materialcategory m = new Materialcategory();
                    m.setId(materialcategory.getId());
                    m.setName(materialcategory.getName());
                    m.setMcsize(materialcategory.getMcsize());
                    m.setMaterialtype(materialcategory.getMaterialtype());
                    return m; }
        ).collect(Collectors.toList());

        return materialcategories;

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Materialcategory materialcategory) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if (materialcategorydao.findByName(materialcategory.getName()) != null)
            errors = errors + "<br> Existing Material Category";

        if (errors == "")
            materialcategorydao.save(materialcategory);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(materialcategory.getId()));
        responce.put("url", "/materialcategories/" + materialcategory.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Materialcategory materialcategory) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Materialcategory mc = materialcategorydao.findByMyId(materialcategory.getId());

        if (mc != null && !(materialcategory.getId().equals(mc.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") materialcategorydao.save(materialcategory);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(materialcategory.getId()));
        responce.put("url", "/materialcategories/" + materialcategory.getId());
        responce.put("errors", errors);

        return responce;
    }

//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String, String> delete(@PathVariable Integer id) {
//
//        // System.out.println(id);
//
//        HashMap<String, String> responce = new HashMap<>();
//        String errors = "";
//
//        Materialcategory mc = materialcategorydao.findByMyId(id);
//
//        if (mc == null) errors = errors + "<br> Material Category Does Not Exist";
//
//        if (errors.isEmpty()) materialcategorydao.delete(mc);
//        else errors = "Server Validation Errors : <br> " + errors;
//
//        responce.put("id", String.valueOf(id));
//        responce.put("url", "/materialcategories/" + id);
//        responce.put("errors", errors);
//
//        return responce;
//    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Materialcategory mc = materialcategorydao.findByMyId(id);

        if (mc == null) errors = errors + "<br> Materialcategory Does Not Exist";

        if (errors.isEmpty()) materialcategorydao.delete(mc);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/materialcategories/" + id);
        responce.put("errors", errors);

        return responce;
    }

}


