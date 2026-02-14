package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.ProductcategoryDao;
import lk.newdayproducts.dao.ProductionorderstatusDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Materialcategory;
import lk.newdayproducts.entity.Productcategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/productcategories")
public class ProductcategoryController {

    @Autowired
    private ProductcategoryDao productcategorydao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Productcategory> get() {

        List<Productcategory> productcategories = this.productcategorydao.findAll();

        productcategories = productcategories.stream().map(
                productcategory -> { Productcategory p = new Productcategory();
                    p.setId(productcategory.getId());
                    p.setName(productcategory.getName());
                    return p; }
        ).collect(Collectors.toList());

        return productcategories;

    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Productcategory productcategory) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if (productcategorydao.findByMyId(productcategory.getId()) != null)
            errors = errors + "<br> Existing Product Category";

        if (errors == "")
            productcategorydao.save(productcategory);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(productcategory.getId()));
        responce.put("url", "/productcategories/" + productcategory.getId());
        responce.put("errors", errors);

        return responce;
    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Productcategory productcategory) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Productcategory pc = productcategorydao.findByMyId(productcategory.getId());

        if (pc != null && !(productcategory.getId().equals(pc.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") productcategorydao.save(productcategory);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(productcategory.getId()));
        responce.put("url", "/productcategories/" + productcategory.getId());
        responce.put("errors", errors);

        return responce;
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Productcategory pc = productcategorydao.findByMyId(id);

        if (pc == null) errors = errors + "<br> Product Category Does Not Exist";

        if (errors.isEmpty()) productcategorydao.delete(pc);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/productcategories/" + id);
        responce.put("errors", errors);

        return responce;
    }
}


