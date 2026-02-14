package lk.newdayproducts.controller;

import lk.newdayproducts.dao.GrnDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Grn;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/grns")
public class GrnController {

    @Autowired
    private GrnDao grndao;


    @GetMapping(produces = "application/json")
    public List<Grn> get() {

        List<Grn> grns = this.grndao.findAll();

        grns = grns  .stream().map(grn -> {
                    Grn g = new Grn();
                    g.setId(grn.getId());
                    g.setPurchaseorder(grn.getPurchaseorder());
                    g.setNumber(grn.getNumber());
                    g.setDoreceived(grn.getDoreceived());
                    g.setGrandtotal(grn.getGrandtotal());
                    g.setGrnstatus(grn.getGrnstatus());
                    g.setEmployee(grn.getEmployee());
                    return g;
                }
        ).collect(Collectors.toList());
//        materialcategories.forEach(materialcategory -> {
//            System.out.println(materialcategory.toString());
//
//        });
        return grns;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Grn grn) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

//        if (rawmaterialdao.findByCode(rawmaterial.getCode()) != null)
//            errors = errors + "<br> Existing Raw Material";
//
//        if (errors == "")
//            rawmaterialdao.save(rawmaterial);
//        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(grn.getId()));
        responce.put("url", "/grns/" + grn.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Grn grn) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Grn g = grndao.findByMyId(grn.getId());

        if (g != null && !(grn.getId().equals(g.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") grndao.save(grn);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(grn.getId()));
        responce.put("url", "/grns/" + grn.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Grn g = grndao.findByMyId(id);

        if (g == null) errors = errors + "<br> Grn Does Not Exist";

        if (errors.isEmpty()) grndao.delete(g);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/grns/" + id);
        responce.put("errors", errors);

        return responce;
    }

}