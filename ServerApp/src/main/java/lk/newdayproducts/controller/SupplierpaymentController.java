package lk.newdayproducts.controller;

import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.dao.SupplierpaymentDao;
import lk.newdayproducts.entity.Rawmaterial;
import lk.newdayproducts.entity.Supplierpayment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierpayments")
public class SupplierpaymentController {

    @Autowired
    private SupplierpaymentDao supplierpaymentdao;


    @GetMapping(produces = "application/json")
    public List<Supplierpayment> get() {

        List<Supplierpayment> supplierpayments = this.supplierpaymentdao.findAll();

        supplierpayments = supplierpayments  .stream().map(supplierpayment -> {
                    Supplierpayment s = new Supplierpayment();
                    s.setId(supplierpayment.getId());
                    s.setNumber(supplierpayment.getNumber());
                    s.setAmount(supplierpayment.getAmount());
                    s.setDate(supplierpayment.getDate());
                    s.setSupplierpaystatus(supplierpayment.getSupplierpaystatus());
                    s.setPaytype(supplierpayment.getPaytype());
                    s.setPaymentref(supplierpayment.getPaymentref());
                    s.setReceipt(supplierpayment.getReceipt());
                    s.setEmployee(supplierpayment.getEmployee());
                    s.setPurchaseorder(supplierpayment.getPurchaseorder());
                    return s;
                }
        ).collect(Collectors.toList());
//        materialcategories.forEach(materialcategory -> {
//            System.out.println(materialcategory.toString());
//
//        });
        return supplierpayments;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Supplierpayment supplierpayment) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

//        if (s.findByCode(rawmaterial.getCode()) != null)
//            errors = errors + "<br> Existing Raw Material";
//
//        if (errors == "")
//            rawmaterialdao.save(rawmaterial);
//        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(supplierpayment.getId()));
        responce.put("url", "/supplierpayments/" + supplierpayment.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Supplierpayment supplierpayment) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Supplierpayment s = supplierpaymentdao.findByMyId(supplierpayment.getId());

        if (s != null && !(supplierpayment.getId().equals(s.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") supplierpaymentdao.save(supplierpayment);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(supplierpayment.getId()));
        responce.put("url", "/supplierpayments/" + supplierpayment.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Supplierpayment s = supplierpaymentdao.findByMyId(id);

        if (s == null) errors = errors + "<br> Supplier Payment Does Not Exist";

        if (errors.isEmpty()) supplierpaymentdao.delete(s);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/supplierpayments/" + id);
        responce.put("errors", errors);

        return responce;
    }

}