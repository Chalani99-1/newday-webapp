package lk.newdayproducts.controller;

import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/purchaseorders")
public class PurchaseorderController {

    @Autowired
    private RawmaterialDao rawmaterialdao;


    @GetMapping(produces = "application/json")
    public List<Rawmaterial> get() {

        List<Rawmaterial> rawmaterials = this.rawmaterialdao.findAll();

        rawmaterials = rawmaterials  .stream().map(
                rawmaterial -> {
                    Rawmaterial r = new Rawmaterial();
                    r.setId(rawmaterial.getId());
                    r.setMaterialtype(rawmaterial.getMaterialtype());
                    r.setMaterialcategory(rawmaterial.getMaterialcategory());
                    r.setCode(rawmaterial.getCode());
                    r.setName(rawmaterial.getName());
                    r.setPhoto(rawmaterial.getPhoto());
                    r.setUnitprice(rawmaterial.getUnitprice());
                    r.setQoh(rawmaterial.getQoh());
                    r.setResourcelimit(rawmaterial.getResourcelimit());
                    r.setRop(rawmaterial.getRop());
                    r.setMaterialstatus(rawmaterial.getMaterialstatus());
                    r.setEmployee(rawmaterial.getEmployee());
                    return r;
                }
        ).collect(Collectors.toList());
//        materialcategories.forEach(materialcategory -> {
//            System.out.println(materialcategory.toString());
//
//        });
        return rawmaterials;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Rawmaterial rawmaterial) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if (rawmaterialdao.findByCode(rawmaterial.getCode()) != null)
            errors = errors + "<br> Existing Raw Material";

        if (errors == "")
            rawmaterialdao.save(rawmaterial);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(rawmaterial.getId()));
        responce.put("url", "/rawmaterials/" + rawmaterial.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Rawmaterial rawmaterial) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Rawmaterial rm = rawmaterialdao.findByMyId(rawmaterial.getId());

        if (rm != null && !(rawmaterial.getId().equals(rm.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") rawmaterialdao.save(rawmaterial);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(rawmaterial.getId()));
        responce.put("url", "/rawmaterials/" + rawmaterial.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Rawmaterial rm = rawmaterialdao.findByMyId(id);

        if (rm == null) errors = errors + "<br> Raw Material Does Not Exist";

        if (errors.isEmpty()) rawmaterialdao.delete(rm);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/rawmaterials/" + id);
        responce.put("errors", errors);

        return responce;
    }

}