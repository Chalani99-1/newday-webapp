package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ProductionorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Productionorder;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/productionorders")
public class ProductionorderController {

    @Autowired
    private ProductionorderDao productionorderdao;


    @GetMapping(produces = "application/json")
    public List<Productionorder> get() {

        List<Productionorder> productionorders = this.productionorderdao.findAll();

        productionorders = productionorders  .stream().map(productionorder -> {
                    Productionorder p = new Productionorder();
                    p.setId(productionorder.getId());
                    p.setOrdernumber(productionorder.getOrdernumber());
                    p.setDorequired(productionorder.getDorequired());
                    p.setCompletepercentage(productionorder.getCompletepercentage());
                    p.setDescription(productionorder.getDescription());
                    p.setProductionorderstatus(productionorder.getProductionorderstatus());
                    p.setDoplaced(productionorder.getDoplaced());
                    p.setEmployee(productionorder.getEmployee());
                    p.setClientorder(productionorder.getClientorder());
                    return p;
                }
        ).collect(Collectors.toList());
//        materialcategories.forEach(materialcategory -> {
//            System.out.println(materialcategory.toString());
//
//        });
        return productionorders;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Productionorder productionorder) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

//        if (rawmaterialdao.findByCode(rawmaterial.getCode()) != null)
//            errors = errors + "<br> Existing Raw Material";
//
//        if (errors == "")
//            rawmaterialdao.save(rawmaterial);
//        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(productionorder.getId()));
        responce.put("url", "/productionorders/" + productionorder.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Productionorder productionorder) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Productionorder p = productionorderdao.findByMyId(productionorder.getId());

        if (p != null && !(productionorder.getId().equals(p.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") productionorderdao.save(productionorder);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(productionorder.getId()));
        responce.put("url", "/productionorders/" + productionorder.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Productionorder p = productionorderdao.findByMyId(id);

        if (p == null) errors = errors + "<br> Production Order Does Not Exist";

        if (errors.isEmpty()) productionorderdao.delete(p);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/productionorders/" + id);
        responce.put("errors", errors);

        return responce;
    }

}